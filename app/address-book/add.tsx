import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useAddressStore } from '@/store/addressStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Theme from '@/constants/theme';

export default function AddAddressScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { addAddress } = useAddressStore();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get your current location.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      
      // Reverse geocoding to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (reverseGeocode.length > 0) {
        const result = reverseGeocode[0];
        const fullAddress = `${result.street || ''} ${result.city || ''} ${result.region || ''} ${result.country || ''}`.trim();
        setAddress(fullAddress);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (latitude === null || longitude === null) {
      Alert.alert('Error', 'Please set a location for this address.');
      return;
    }

    addAddress({
      name: name.trim(),
      address: address.trim(),
      latitude,
      longitude,
      isDefault: false,
    });

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Add Address',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Address Name"
          placeholder="e.g., Home, Office, etc."
          value={name}
          onChangeText={setName}
          leftIcon={<MapPin size={20} color={colors.textSecondary} />}
        />
        
        <Input
          label="Full Address"
          placeholder="Enter complete address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity 
          style={[styles.locationButton, { backgroundColor: colors.card }]}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          <Navigation size={20} color={colors.primary} />
          <Text style={[styles.locationButtonText, { color: colors.primary }]}>
            {loading ? 'Getting location...' : t('useCurrentLocation')}
          </Text>
        </TouchableOpacity>
        
        {latitude && longitude && (
          <View style={[styles.coordinatesContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.coordinatesTitle, { color: colors.text }]}>
              Location Coordinates:
            </Text>
            <Text style={[styles.coordinatesText, { color: colors.textSecondary }]}>
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </Text>
          </View>
        )}
        
        <Button
          title={t('save')}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.xl,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.l,
  },
  locationButtonText: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
    marginLeft: Theme.spacing.s,
  },
  coordinatesContainer: {
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.l,
  },
  coordinatesTitle: {
    fontSize: Theme.fontSize.s,
    fontWeight: Theme.fontWeight.medium,
    marginBottom: Theme.spacing.xs,
  },
  coordinatesText: {
    fontSize: Theme.fontSize.s,
  },
  saveButton: {
    marginTop: Theme.spacing.l,
  },
});