import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar as CalendarIcon, Clock, Locate, Camera, ChevronRight, CreditCard } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Theme from '@/constants/theme';
import { fixers } from '@/mocks/fixers';

export default function NewBookingScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Fixer & Service
  const [selectedFixer, setSelectedFixer] = useState(fixers[0]);
  const [selectedService, setSelectedService] = useState(selectedFixer?.services[0]?.id || '');

  // Step 2: Schedule & Location
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [address, setAddress] = useState('');
  const [mapRegion, setMapRegion] = useState({
    latitude: 9.03,
    longitude: 38.74,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState({
    latitude: 9.03,
    longitude: 38.74,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Step 3: Details & Payment
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Error
  const [error, setError] = useState<string | null>(null);

  // Location
  const handleCurrentLocation = async () => {
    setLoadingLocation(true);
    setError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoadingLocation(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      // Reverse geocode to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (geocode && geocode.length > 0) {
        const g = geocode[0];
        const addr = [g.name, g.street, g.city, g.region, g.postalCode, g.country].filter(Boolean).join(', ');
        setAddress(addr);
      } else {
        setAddress('');
      }
    } catch (e) {
      setError('Failed to get current location');
    }
    setLoadingLocation(false);
  };

  // Date/time pickers
  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date && date > new Date()) setSelectedDate(date);
  };
  const handleTimeChange = (_: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) setSelectedTime(time);
  };

  // Image picker
  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Step navigation
  const handleNextStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (!selectedFixer || !selectedService) {
        setError('Please select a fixer and service');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDate) {
        setError('Please select a date');
        return;
      }
      if (!selectedTime) {
        setError('Please select a time');
        return;
      }
      if (!address.trim()) {
        setError('Please enter an address');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handleSubmit();
    }
  };
  const handlePrevStep = () => {
    setError(null);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Submit
  const handleSubmit = () => {
    setError(null);
    // Pass all booking data to confirmation
    router.replace({
      pathname: '/booking/confirmation',
      params: {
        fixerName: selectedFixer.name,
        service: selectedFixer.services.find(s => s.id === selectedService)?.name || '',
        date: selectedDate?.toISOString() || '',
        time: selectedTime?.toISOString() || '',
        address,
        latitude: marker.latitude,
        longitude: marker.longitude,
        description,
        images: JSON.stringify(images),
      },
    });
  };

  // Step renderers
  const renderStepOne = () => (
    <View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Select Fixer & Service</Text>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Fixer</Text>
        <TouchableOpacity style={styles.selectedFixerContainer} disabled>
          <Image source={{ uri: selectedFixer.avatar }} style={styles.fixerAvatar} />
          <View style={styles.fixerInfo}>
            <Text style={[styles.fixerName, { color: colors.text }]}>{selectedFixer.name}</Text>
            <Text style={[styles.fixerRating, { color: colors.textSecondary }]}>{`★ ${selectedFixer.rating}`}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Service</Text>
        {selectedFixer.services.map(service => (
          <TouchableOpacity
            key={service.id}
            style={selectedService === service.id
              ? [styles.serviceItem, { backgroundColor: colors.primary, borderColor: colors.primary }]
              : [styles.serviceItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setSelectedService(service.id)}
          >
            <Text
              style={selectedService === service.id
                ? [styles.serviceName, { color: colors.background }]
                : [styles.serviceName, { color: colors.text }]}
            >
              {service.name}
            </Text>
            <Text
              style={selectedService === service.id
                ? [styles.servicePrice, { color: colors.background }]
                : [styles.servicePrice, { color: colors.text }]}
            >
              {service.price}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStepTwo = () => (
    <View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Schedule & Location</Text>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Date & Time</Text>
        <TouchableOpacity
          style={[styles.inputButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowDatePicker(true)}
        >
          <CalendarIcon size={20} color={colors.primary} />
          <Text style={[styles.inputButtonText, { color: colors.text }]}>
            {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
          </Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.inputButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Clock size={20} color={colors.primary} />
          <Text style={[styles.inputButtonText, { color: colors.text }]}>
            {selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
          </Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Location</Text>
        <TouchableOpacity style={styles.useCurrentLocation} onPress={handleCurrentLocation} disabled={loadingLocation}>
          <MapPin size={20} color={colors.primary} />
          <Text style={[styles.useCurrentLocationText, { color: colors.primary }]}>Use Current Location</Text>
          {loadingLocation && <ActivityIndicator color={colors.primary} size={16} style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
        <Input
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
        <View style={[styles.mapContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            onPress={e => setMarker(e.nativeEvent.coordinate)}
            customMapStyle={colors.background === '#fff' ? [] : darkMapStyle}
          >
            <Marker
              coordinate={marker}
              draggable
              onDragEnd={e => setMarker(e.nativeEvent.coordinate)}
            />
          </MapView>
          <Text style={[styles.coordsText, { color: colors.textSecondary }]}>
            Lat: {marker.latitude.toFixed(5)}, Lng: {marker.longitude.toFixed(5)}
          </Text>
        </View>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date(Date.now() + 60 * 60 * 1000)}
          mode="date"
          minimumDate={new Date(Date.now() + 60 * 60 * 1000)}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          themeVariant={colors.background === '#fff' ? 'light' : 'dark'}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          themeVariant={colors.background === '#fff' ? 'light' : 'dark'}
        />
      )}
    </View>
  );

  const renderStepThree = () => (
    <View>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Issue Details & Payment</Text>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Describe the Issue</Text>
        <Input
          placeholder="Describe what needs to be fixed..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <View style={styles.imagesContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handleAddImage}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={[styles.addImageText, { color: colors.primary }]}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Payment Method</Text>
        <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <CreditCard size={20} color={colors.text} />
          <Text style={[styles.paymentMethodText, { color: colors.text }]}>Credit Card</Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      {/* You can add a price summary here if needed */}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Book a Service',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stepsIndicator}>
          {[1, 2, 3].map(step => (
            <View
              key={step}
              style={[
                styles.stepIndicator,
                { backgroundColor: currentStep >= step ? colors.primary : colors.card, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.stepIndicatorText,
                  { color: currentStep >= step ? colors.background : colors.textSecondary },
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
          <View style={[styles.stepConnector, { backgroundColor: colors.border }]} />
        </View>
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}
        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        {currentStep > 1 && (
          <Button
            title="Back"
            onPress={handlePrevStep}
            variant="outline"
            style={styles.backButton}
          />
        )}
        <Button
          title={currentStep === 3 ? "Book Now" : "Next"}
          onPress={handleNextStep}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1 } as ViewStyle,
  scrollView: { flex: 1 } as ViewStyle,
  scrollContent: { padding: Theme.spacing.xl } as ViewStyle,
  stepsIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.xl, position: 'relative' } as ViewStyle,
  stepIndicator: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginHorizontal: Theme.spacing.xl, zIndex: 1, borderWidth: 1 } as ViewStyle,
  stepIndicatorText: { fontSize: Theme.fontSize.s, fontWeight: Theme.fontWeight.bold as 'bold' } as TextStyle,
  stepConnector: { position: 'absolute', top: 15, left: 45, right: 45, height: 2, zIndex: 0 } as ViewStyle,
  stepTitle: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.bold as 'bold', marginBottom: Theme.spacing.l } as TextStyle,
  sectionContainer: { marginBottom: Theme.spacing.l } as ViewStyle,
  sectionLabel: { fontSize: Theme.fontSize.m, fontWeight: Theme.fontWeight.semiBold as '600', marginBottom: Theme.spacing.s } as TextStyle,
  selectedFixerContainer: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.m, borderRadius: Theme.borderRadius.m, borderWidth: 1 } as ViewStyle,
  fixerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: Theme.spacing.m } as ImageStyle,
  fixerInfo: { flex: 1 } as ViewStyle,
  fixerName: { fontSize: Theme.fontSize.m, fontWeight: Theme.fontWeight.semiBold as '600' } as TextStyle,
  fixerRating: { fontSize: Theme.fontSize.s } as TextStyle,
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Theme.spacing.m, borderRadius: Theme.borderRadius.m, borderWidth: 1, marginBottom: Theme.spacing.s } as ViewStyle,
  serviceName: { fontSize: Theme.fontSize.m } as TextStyle,
  servicePrice: { fontSize: Theme.fontSize.m, fontWeight: Theme.fontWeight.semiBold as '600' } as TextStyle,
  inputButton: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.m, borderRadius: Theme.borderRadius.m, borderWidth: 1, marginBottom: Theme.spacing.s } as ViewStyle,
  inputButtonText: { flex: 1, fontSize: Theme.fontSize.m, marginLeft: Theme.spacing.m } as TextStyle,
  useCurrentLocation: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.s } as ViewStyle,
  useCurrentLocationText: { fontSize: Theme.fontSize.s, marginLeft: Theme.spacing.s } as TextStyle,
  mapContainer: { height: 180, borderRadius: Theme.borderRadius.m, overflow: 'hidden', marginBottom: Theme.spacing.l, marginTop: Theme.spacing.s, position: 'relative', borderWidth: 1 } as ViewStyle,
  map: { flex: 1 } as ViewStyle,
  coordsText: { marginTop: 4, fontSize: 13, textAlign: 'right' } as TextStyle,
  imagesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Theme.spacing.m } as ViewStyle,
  imageContainer: { position: 'relative', marginRight: Theme.spacing.s, marginBottom: Theme.spacing.s } as ViewStyle,
  image: { width: 80, height: 80, borderRadius: Theme.borderRadius.s } as ImageStyle,
  removeImageButton: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#e74c3c', alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  removeImageText: { fontSize: Theme.fontSize.xs, color: '#fff', fontWeight: Theme.fontWeight.bold as 'bold' } as TextStyle,
  addImageButton: { width: 80, height: 80, borderRadius: Theme.borderRadius.s, borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  addImageText: { fontSize: Theme.fontSize.xs, marginTop: Theme.spacing.xs } as TextStyle,
  paymentMethod: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.m, borderRadius: Theme.borderRadius.m, borderWidth: 1 } as ViewStyle,
  paymentMethodText: { flex: 1, fontSize: Theme.fontSize.m, marginLeft: Theme.spacing.m } as TextStyle,
  errorText: { fontSize: 15, fontWeight: '500' as '500', marginTop: 8, marginBottom: 8, textAlign: 'center' } as TextStyle,
  footer: { flexDirection: 'row', padding: Theme.spacing.m, borderTopWidth: 1 } as ViewStyle,
  backButton: { flex: 1, marginRight: Theme.spacing.s } as ViewStyle,
  nextButton: { flex: 2 } as ViewStyle,
});
