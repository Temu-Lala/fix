import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardTypeOptions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Camera, MapPin } from 'lucide-react-native';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import Theme from '@/constants/theme';

interface InputField {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  renderExtra?: () => React.ReactNode;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36';

const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? DEFAULT_AVATAR);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleUseCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to fetch your address.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (place) {
        const formattedAddress = `${place.name ?? ''}, ${place.street ?? ''}, ${place.city ?? ''}, ${place.region ?? ''}, ${place.country ?? ''}`;
        setAddress(formattedAddress);
      } else {
        Alert.alert('Error', 'Could not retrieve address from location.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location.');
    }
  };

  const validateInputs = () => {
    if (!fullName.trim() || !username.trim() || !email.trim() || !phoneNumber.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      Alert.alert('Invalid Username', 'Username must be 3–20 characters and contain only letters, numbers, or underscores.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await updateUser({ fullName, username, email, phoneNumber, address, avatar });
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields: InputField[] = [
    { label: 'Full Name', value: fullName, onChange: setFullName, placeholder: 'Enter full name' },
    { label: 'Username', value: username, onChange: setUsername, placeholder: 'Enter username', autoCapitalize: 'none' },
    { label: 'Email', value: email, onChange: setEmail, placeholder: 'Enter email', keyboardType: 'email-address', autoCapitalize: 'none' },
    { label: 'Phone Number', value: phoneNumber, onChange: setPhoneNumber, placeholder: 'Enter phone number', keyboardType: 'phone-pad' },
    {
      label: 'Address',
      value: address,
      onChange: setAddress,
      placeholder: 'Enter address',
      renderExtra: () => (
        <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.locationButton}>
          <MapPin size={18} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.primary }]}>Use current location</Text>
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        </View>

        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} onError={() => setAvatar(DEFAULT_AVATAR)} />
            <View style={[styles.cameraIconContainer, { backgroundColor: colors.primary }]}>
              <Camera size={20} color={colors.white} />
            </View>
          </TouchableOpacity>

          {inputFields.map((field, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={field.placeholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType={field.keyboardType}
                autoCapitalize={field.autoCapitalize || 'sentences'}
              />
              {field.renderExtra && field.renderExtra()}
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <Button
              title="Save"
              onPress={handleSave}
              disabled={isLoading}
              style={styles.saveButton}
              icon={isLoading ? <ActivityIndicator color={colors.white} /> : null}
            />
            <Button title="Cancel" onPress={() => router.back()} variant="outline" style={styles.cancelButton} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.l,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '700',
  },
  content: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.l,
    elevation: 2,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: Theme.spacing.xl,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 20,
    padding: Theme.spacing.s,
  },
  inputContainer: {
    marginBottom: Theme.spacing.l,
  },
  label: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500',
    marginBottom: Theme.spacing.s,
  },
  input: {
    borderWidth: 1,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    fontSize: Theme.fontSize.m,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.s,
  },
  locationText: {
    fontSize: Theme.fontSize.s,
    marginLeft: Theme.spacing.xs,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.l,
  },
  saveButton: {
    flex: 1,
    marginRight: Theme.spacing.s,
  },
  cancelButton: {
    flex: 1,
    marginLeft: Theme.spacing.s,
  },
});

export default EditProfileScreen;
