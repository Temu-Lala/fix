import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Camera, 
  MapPin,
  DollarSign,
  CheckSquare,
  Square
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { categories } from '@/mocks/categories';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Theme from '@/constants/theme';

// Dummy store for demonstration; replace with actual seller application store
const useSellerApplicationStore = () => ({
  submitApplication: async (data: any) => Promise.resolve(),
  isLoading: false,
  applicationStatus: null,
});

export default function SellerApplicationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { submitApplication, isLoading, applicationStatus } = useSellerApplicationStore();

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    businessDescription: '',
    businessLicense: '',
    profilePhoto: '',
    categories: [] as string[],
    address: '',
    serviceArea: 10,
    hourlyRate: 50,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleImagePicker = async (type: 'license' | 'profile') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      if (type === 'license') {
        handleInputChange('businessLicense', base64Image);
      } else {
        handleInputChange('profilePhoto', base64Image);
      }
    }
  };

  const validateForm = () => {
    if (!formData.shopName.trim()) {
      Alert.alert(t('error'), 'Please enter your shop name');
      return false;
    }
    if (!formData.ownerName.trim()) {
      Alert.alert(t('error'), 'Please enter the owner name');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert(t('error'), 'Please enter your phone number');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert(t('error'), 'Please enter your email');
      return false;
    }
    if (!formData.businessDescription.trim()) {
      Alert.alert(t('error'), 'Please enter your business description');
      return false;
    }
    if (!formData.businessLicense) {
      Alert.alert(t('error'), 'Please upload your business license');
      return false;
    }
    if (formData.categories.length === 0) {
      Alert.alert(t('error'), 'Please select at least one product category');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert(t('error'), 'Please enter your shop address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await submitApplication(formData);
      Alert.alert(
        t('success'),
        'Your seller application has been submitted successfully. We will review it and get back to you soon.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t('error'), 'Failed to submit application. Please try again.');
    }
  };

  if (applicationStatus === 'pending') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <Stack.Screen 
          options={{
            title: t('sellerApplication'),
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }} 
        />
        <View style={styles.statusContainer}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>
            {t('applicationSubmitted')}
          </Text>
          <Text style={[styles.statusMessage, { color: colors.textSecondary }]}>
            {t('applicationPendingMessage')}
          </Text>
          <Button
            title={t('back')}
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('sellerApplication'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Shop Information</Text>
        <Input
          label="Shop Name"
          placeholder="Enter your shop name"
          value={formData.shopName}
          onChangeText={(value) => handleInputChange('shopName', value)}
          leftIcon={<User size={20} color={colors.textSecondary} />}
        />
        <Input
          label="Owner Name"
          placeholder="Enter the owner's name"
          value={formData.ownerName}
          onChangeText={(value) => handleInputChange('ownerName', value)}
          leftIcon={<User size={20} color={colors.textSecondary} />}
        />
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
          keyboardType="phone-pad"
          leftIcon={<Phone size={20} color={colors.textSecondary} />}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          leftIcon={<Mail size={20} color={colors.textSecondary} />}
        />
        <Input
          label="Business Description"
          placeholder="Describe your business"
          value={formData.businessDescription}
          onChangeText={(value) => handleInputChange('businessDescription', value)}
          multiline
          numberOfLines={4}
          leftIcon={<FileText size={20} color={colors.textSecondary} />}
        />
        <View style={styles.uploadSection}>
          <Text style={[styles.label, { color: colors.text }]}>Business License</Text>
          <TouchableOpacity 
            style={[styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleImagePicker('license')}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={[styles.uploadButtonText, { color: colors.primary }]}>
              {formData.businessLicense ? 'Document Uploaded' : 'Upload Document'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadSection}>
          <Text style={[styles.label, { color: colors.text }]}>Profile Photo (optional)</Text>
          <TouchableOpacity 
            style={[styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleImagePicker('profile')}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={[styles.uploadButtonText, { color: colors.primary }]}>
              {formData.profilePhoto ? 'Photo Uploaded' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Product Categories</Text>
        <View style={styles.categoriesSection}>
          <Text style={[styles.label, { color: colors.text }]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  formData.categories.includes(category.id) && { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary 
                  }
                ]}
                onPress={() => handleCategoryToggle(category.id)}
              >
                {formData.categories.includes(category.id) ? (
                  <CheckSquare size={16} color="white" />
                ) : (
                  <Square size={16} color={colors.textSecondary} />
                )}
                <Text style={[
                  styles.categoryText,
                  { color: colors.text },
                  formData.categories.includes(category.id) && { color: 'white' }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Input
          label="Shop Address"
          placeholder="Enter your shop address"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
          leftIcon={<MapPin size={20} color={colors.textSecondary} />}
        />
        <View style={styles.rateSection}>
          <Text style={[styles.label, { color: colors.text }]}>Hourly Rate (ETB)</Text>
          <View style={styles.rateContainer}>
            <DollarSign size={20} color={colors.textSecondary} />
            <Input
              placeholder="50"
              value={formData.hourlyRate.toString()}
              onChangeText={(value) => handleInputChange('hourlyRate', parseInt(value) || 0)}
              keyboardType="numeric"
              containerStyle={styles.rateInput}
            />
          </View>
        </View>
        <Button
          title="Submit Application"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
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
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  statusTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '700',
    marginBottom: Theme.spacing.m,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: Theme.fontSize.m,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Theme.spacing.xl,
  },
  backButton: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600',
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.l,
  },
  label: {
    fontSize: Theme.fontSize.s,
    fontWeight: '500',
    marginBottom: Theme.spacing.s,
  },
  uploadSection: {
    marginBottom: Theme.spacing.m,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: Theme.fontSize.m,
    marginLeft: Theme.spacing.s,
    fontWeight: '500',
  },
  categoriesSection: {
    marginBottom: Theme.spacing.m,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.s,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.s,
    borderRadius: Theme.borderRadius.s,
    borderWidth: 1,
    marginBottom: Theme.spacing.s,
  },
  categoryText: {
    fontSize: Theme.fontSize.s,
    marginLeft: Theme.spacing.xs,
  },
  rateSection: {
    marginBottom: Theme.spacing.m,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateInput: {
    flex: 1,
    marginLeft: Theme.spacing.s,
    marginBottom: 0,
  },
  submitButton: {
    marginBottom: Theme.spacing.xl,
  },
}); 