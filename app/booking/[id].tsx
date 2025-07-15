import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { Stack, useRouter } from 'expo-router';
import { MapPin, Calendar as CalendarIcon, Clock, Locate } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Theme from '@/constants/theme';

export default function BookingNewScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  // Form state
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Map state
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

  // Get current location
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

  // Submit handler (mock)
  const handleSubmit = () => {
    setError(null);
    if (!address.trim()) {
      setError('Address is required');
      return;
    }
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }
    if (!selectedTime) {
      setError('Please select a time');
      return;
    }
    if (!marker.latitude || !marker.longitude) {
      setError('Please select a location on the map');
      return;
    }
    setShowConfirm(true);
  };

  const isFormValid = address.trim() && selectedDate && selectedTime && marker.latitude && marker.longitude;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'New Booking',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Address Input */}
        <View style={[styles.inputSection, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Input
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            leftIcon={<MapPin size={20} color={colors.textSecondary} />}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {/* Map Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
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
          <TouchableOpacity
            style={[styles.currentLocationBtn, { backgroundColor: colors.primary }]}
            onPress={async () => {
              await handleCurrentLocation();
              // Optionally, reverse geocode and set address here
            }}
            activeOpacity={0.8}
            accessibilityLabel="Use current location"
          >
            {loadingLocation ? (
              <ActivityIndicator color="#fff" size={18} />
            ) : (
              <Locate size={18} color="#fff" />
            )}
            <Text style={styles.currentLocationText}>Current Location</Text>
          </TouchableOpacity>
          <Text style={[styles.coordsText, { color: colors.textSecondary }]}>Lat: {marker.latitude.toFixed(5)}, Lng: {marker.longitude.toFixed(5)}</Text>
        </View>
        {/* Date & Time Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Date & Time</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateTimeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
            accessibilityLabel="Select date"
          >
            <CalendarIcon size={20} color={colors.primary} />
            <Text style={[styles.dateTimeText, { color: colors.text }]}> {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateTimeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowTimePicker(true)}
            accessibilityLabel="Select time"
          >
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.dateTimeText, { color: colors.text }]}> {selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'} </Text>
          </TouchableOpacity>
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
        {/* Note Input */}
        <View style={[styles.inputSection, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Input
            label="Note"
            placeholder="Add a note (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>
        {/* Error Message */}
        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
        {/* Submit Button */}
        <Button
          title="Book Now"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={!isFormValid}
        />
      </ScrollView>
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: colors.card }]}> 
            <Text style={[styles.confirmTitle, { color: colors.text }]}>Booking Confirmed!</Text>
            <Text style={[styles.confirmMsg, { color: colors.textSecondary }]}>Your booking has been submitted successfully.</Text>
            <Button title="OK" onPress={() => { setShowConfirm(false); router.push('/booking/confirmation'); }} style={{ marginTop: 16 }} />
          </View>
        </View>
      </Modal>
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600',
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.l,
  },
  mapContainer: {
    height: 200,
    borderRadius: Theme.borderRadius.m,
    overflow: 'hidden',
    marginBottom: Theme.spacing.l,
    marginTop: Theme.spacing.s,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  currentLocationBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  currentLocationText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
    gap: Theme.spacing.m,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Theme.borderRadius.s,
    paddingVertical: Theme.spacing.s,
    paddingHorizontal: Theme.spacing.m,
    marginRight: Theme.spacing.m,
  },
  dateTimeText: {
    fontSize: Theme.fontSize.m,
    marginLeft: Theme.spacing.s,
  },
  submitButton: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    width: '80%',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmMsg: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  inputSection: {
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    marginBottom: Theme.spacing.l,
    padding: Theme.spacing.m,
  },
  coordsText: {
    marginTop: 4,
    fontSize: 13,
    textAlign: 'right',
  },
}); 