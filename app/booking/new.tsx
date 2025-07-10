import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  ChevronRight,
  CreditCard
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { fixers } from '@/mocks/fixers';
import { useBookingStore } from '@/store/bookingStore';

export default function NewBookingScreen() {
  const { fixerId } = useLocalSearchParams<{ fixerId?: string }>();
  const router = useRouter();
  const { createBooking, isLoading } = useBookingStore();
  
  const [selectedFixer, setSelectedFixer] = useState(fixerId ? fixers.find(f => f.id === fixerId) : null);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleSelectFixer = () => {
    // Navigate to fixer selection screen
    console.log('Select fixer');
  };
  
  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
  };
  
  const handleSelectDate = () => {
    // Open date picker
    setSelectedDate('2025-07-15');
  };
  
  const handleSelectTime = () => {
    // Open time picker
    setSelectedTime('10:00 AM');
  };
  
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
  
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedFixer) return;
    
    const service = selectedFixer.services.find(s => s.id === selectedService);
    
    await createBooking({
      fixerId: selectedFixer.id,
      fixerName: selectedFixer.name,
      fixerAvatar: selectedFixer.avatar,
      service: service?.name || 'Service',
      status: 'pending',
      date: selectedDate,
      time: selectedTime,
      address,
      price: service?.price || '$0',
    });
    
    router.replace('/booking/confirmation');
  };
  
  const renderStepOne = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Fixer & Service</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Fixer</Text>
        {selectedFixer ? (
          <TouchableOpacity 
            style={styles.selectedFixerContainer}
            onPress={handleSelectFixer}
          >
            <Image 
              source={{ uri: selectedFixer.avatar }} 
              style={styles.fixerAvatar}
            />
            <View style={styles.fixerInfo}>
              <Text style={styles.fixerName}>{selectedFixer.name}</Text>
              <Text style={styles.fixerRating}>★ {selectedFixer.rating}</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={handleSelectFixer}
          >
            <Text style={styles.selectButtonText}>Select a Fixer</Text>
            <ChevronRight size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      {selectedFixer && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Service</Text>
          {selectedFixer.services.map(service => (
            <TouchableOpacity 
              key={service.id}
              style={[
                styles.serviceItem,
                selectedService === service.id && styles.selectedServiceItem
              ]}
              onPress={() => handleSelectService(service.id)}
            >
              <Text 
                style={[
                  styles.serviceName,
                  selectedService === service.id && styles.selectedServiceText
                ]}
              >
                {service.name}
              </Text>
              <Text 
                style={[
                  styles.servicePrice,
                  selectedService === service.id && styles.selectedServiceText
                ]}
              >
                {service.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
  
  const renderStepTwo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Schedule & Location</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Date & Time</Text>
        <TouchableOpacity 
          style={styles.inputButton}
          onPress={handleSelectDate}
        >
          <Calendar size={20} color={Colors.light.textSecondary} />
          <Text style={styles.inputButtonText}>
            {selectedDate || 'Select Date'}
          </Text>
          <ChevronRight size={20} color={Colors.light.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.inputButton}
          onPress={handleSelectTime}
        >
          <Clock size={20} color={Colors.light.textSecondary} />
          <Text style={styles.inputButtonText}>
            {selectedTime || 'Select Time'}
          </Text>
          <ChevronRight size={20} color={Colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Location</Text>
        <TouchableOpacity style={styles.useCurrentLocation}>
          <MapPin size={20} color={Colors.light.primary} />
          <Text style={styles.useCurrentLocationText}>Use Current Location</Text>
        </TouchableOpacity>
        
        <Input
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
      </View>
    </View>
  );
  
  const renderStepThree = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Issue Details & Payment</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Describe the Issue</Text>
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
            <Camera size={24} color={Colors.light.primary} />
            <Text style={styles.addImageText}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Payment Method</Text>
        <TouchableOpacity style={styles.paymentMethod}>
          <CreditCard size={20} color={Colors.light.text} />
          <Text style={styles.paymentMethodText}>Credit Card</Text>
          <ChevronRight size={20} color={Colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Price Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service Fee</Text>
          <Text style={styles.summaryValue}>$45.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Travel Fee</Text>
          <Text style={styles.summaryValue}>$5.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>$5.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>$55.00</Text>
        </View>
      </View>
    </View>
  );
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Book a Service',
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepsIndicator}>
          {[1, 2, 3].map(step => (
            <View 
              key={step}
              style={[
                styles.stepIndicator,
                currentStep >= step && styles.activeStepIndicator
              ]}
            >
              <Text 
                style={[
                  styles.stepIndicatorText,
                  currentStep >= step && styles.activeStepIndicatorText
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
          <View style={styles.stepConnector} />
        </View>
        
        {renderCurrentStep()}
      </ScrollView>
      
      <View style={styles.footer}>
        {currentStep > 1 && (
          <Button
            title="Back"
            onPress={handlePrevStep}
            variant="outline"
            style={styles.backButton}
          />
        )}
        <Button
          title={currentStep === 3 ? "Confirm Booking" : "Next"}
          onPress={handleNextStep}
          loading={isLoading}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.xl,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    position: 'relative',
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.spacing.xl,
    zIndex: 1,
  },
  activeStepIndicator: {
    backgroundColor: Colors.light.primary,
  },
  stepIndicatorText: {
    fontSize: Theme.fontSize.s,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.light.textSecondary,
  },
  activeStepIndicatorText: {
    color: Colors.common.white,
  },
  stepConnector: {
    position: 'absolute',
    top: 15,
    left: 45,
    right: 45,
    height: 2,
    backgroundColor: Colors.light.border,
    zIndex: 0,
  },
  stepContainer: {
    marginBottom: Theme.spacing.xl,
  },
  stepTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.l,
  },
  sectionContainer: {
    marginBottom: Theme.spacing.l,
  },
  sectionLabel: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.s,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.m,
    backgroundColor: Colors.common.white,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectButtonText: {
    fontSize: Theme.fontSize.m,
    color: Colors.light.primary,
  },
  selectedFixerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.m,
    backgroundColor: Colors.common.white,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  fixerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Theme.spacing.m,
  },
  fixerInfo: {
    flex: 1,
  },
  fixerName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
    color: Colors.light.text,
  },
  fixerRating: {
    fontSize: Theme.fontSize.s,
    color: Colors.light.textSecondary,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.m,
    backgroundColor: Colors.common.white,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Theme.spacing.s,
  },
  selectedServiceItem: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  serviceName: {
    fontSize: Theme.fontSize.m,
    color: Colors.light.text,
  },
  servicePrice: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
    color: Colors.light.text,
  },
  selectedServiceText: {
    color: Colors.common.white,
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.m,
    backgroundColor: Colors.common.white,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Theme.spacing.s,
  },
  inputButtonText: {
    flex: 1,
    fontSize: Theme.fontSize.m,
    color: Colors.light.text,
    marginLeft: Theme.spacing.m,
  },
  useCurrentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.s,
  },
  useCurrentLocationText: {
    fontSize: Theme.fontSize.s,
    color: Colors.light.primary,
    marginLeft: Theme.spacing.s,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Theme.spacing.m,
  },
  imageContainer: {
    position: 'relative',
    marginRight: Theme.spacing.s,
    marginBottom: Theme.spacing.s,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.s,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.common.white,
    fontWeight: Theme.fontWeight.bold,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.s,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: Theme.fontSize.xs,
    color: Colors.light.primary,
    marginTop: Theme.spacing.xs,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.m,
    backgroundColor: Colors.common.white,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: Theme.fontSize.m,
    color: Colors.light.text,
    marginLeft: Theme.spacing.m,
  },
  summaryContainer: {
    backgroundColor: Colors.common.white,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    marginTop: Theme.spacing.m,
  },
  summaryTitle: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.m,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.s,
  },
  summaryLabel: {
    fontSize: Theme.fontSize.m,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: Theme.fontSize.m,
    color: Colors.light.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Theme.spacing.m,
    marginTop: Theme.spacing.s,
  },
  totalLabel: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.light.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: Theme.spacing.m,
    backgroundColor: Colors.common.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  backButton: {
    flex: 1,
    marginRight: Theme.spacing.s,
  },
  nextButton: {
    flex: 2,
  },
});
