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
  Clock,
  DollarSign,
  CheckSquare,
  Square
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useFixerApplicationStore } from '@/store/fixerApplicationStore';
import { useAuthStore } from '@/store/authStore';
import { categories } from '@/mocks/categories';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Theme from '@/constants/theme';

export default function FixerApplicationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { submitApplication, isLoading, applicationStatus } = useFixerApplicationStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: user?.phone || '',
    email: user?.email || '',
    bio: '',
    idType: 'nationalId' as 'passport' | 'nationalId',
    idNumber: '',
    idDocument: '',
    profilePhoto: '',
    categories: [] as string[],
    experience: '',
    certifications: [] as string[],
    serviceArea: 10,
    hourlyRate: 50,
    availability: [] as string[],
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const handleImagePicker = async (type: 'id' | 'profile') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      if (type === 'id') {
        handleInputChange('idDocument', base64Image);
      } else {
        handleInputChange('profilePhoto', base64Image);
      }
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert(t('error'), 'Please enter your full name');
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
    if (!formData.bio.trim()) {
      Alert.alert(t('error'), 'Please enter your bio');
      return false;
    }
    if (!formData.idNumber.trim()) {
      Alert.alert(t('error'), 'Please enter your ID number');
      return false;
    }
    if (!formData.idDocument) {
      Alert.alert(t('error'), 'Please upload your ID document');
      return false;
    }
    if (formData.categories.length === 0) {
      Alert.alert(t('error'), 'Please select at least one service category');
      return false;
    }
    if (formData.availability.length === 0) {
      Alert.alert(t('error'), 'Please select your availability');
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
        'Your application has been submitted successfully. We will review it and get back to you soon.',
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
            title: t('fixerApplication'),
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
          title: t('fixerApplication'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('personalInformation')}
        </Text>
        
        <Input
          label={t('fullName')}
          placeholder="Enter your full name"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
          leftIcon={<User size={20} color={colors.textSecondary} />}
        />
        
        <Input
          label={t('phoneNumber')}
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
          keyboardType="phone-pad"
          leftIcon={<Phone size={20} color={colors.textSecondary} />}
        />
        
        <Input
          label={t('email')}
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          leftIcon={<Mail size={20} color={colors.textSecondary} />}
        />
        
        <Input
          label={t('bio')}
          placeholder="Tell us about yourself and your experience"
          value={formData.bio}
          onChangeText={(value) => handleInputChange('bio', value)}
          multiline
          numberOfLines={4}
          leftIcon={<FileText size={20} color={colors.textSecondary} />}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('identification')}
        </Text>

        <View style={styles.idTypeContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('idType')}
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => handleInputChange('idType', 'nationalId')}
            >
              <View style={[
                styles.radioButton,
                { borderColor: colors.border },
                formData.idType === 'nationalId' && { backgroundColor: colors.primary }
              ]} />
              <Text style={[styles.radioLabel, { color: colors.text }]}>
                {t('nationalId')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => handleInputChange('idType', 'passport')}
            >
              <View style={[
                styles.radioButton,
                { borderColor: colors.border },
                formData.idType === 'passport' && { backgroundColor: colors.primary }
              ]} />
              <Text style={[styles.radioLabel, { color: colors.text }]}>
                {t('passport')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Input
          label={t('idNumber')}
          placeholder="Enter your ID number"
          value={formData.idNumber}
          onChangeText={(value) => handleInputChange('idNumber', value)}
        />

        <View style={styles.uploadSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('uploadIdDocument')}
          </Text>
          <TouchableOpacity 
            style={[styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleImagePicker('id')}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={[styles.uploadButtonText, { color: colors.primary }]}>
              {formData.idDocument ? t('documentUploaded') : t('uploadDocument')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.uploadSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('profilePhoto')} ({t('optional')})
          </Text>
          <TouchableOpacity 
            style={[styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleImagePicker('profile')}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={[styles.uploadButtonText, { color: colors.primary }]}>
              {formData.profilePhoto ? t('photoUploaded') : t('uploadPhoto')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('serviceInformation')}
        </Text>

        <View style={styles.categoriesSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('serviceCategories')}
          </Text>
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
          label={t('experience')}
          placeholder="Describe your relevant experience"
          value={formData.experience}
          onChangeText={(value) => handleInputChange('experience', value)}
          multiline
          numberOfLines={3}
        />

        <View style={styles.rateSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('hourlyRate')} (ETB)
          </Text>
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

        <View style={styles.availabilitySection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('availability')}
          </Text>
          <View style={styles.daysGrid}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  formData.availability.includes(day) && { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary 
                  }
                ]}
                onPress={() => handleAvailabilityToggle(day)}
              >
                <Text style={[
                  styles.dayText,
                  { color: colors.text },
                  formData.availability.includes(day) && { color: 'white' }
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title={t('submitApplication')}
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
    fontWeight: '700' as any,
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
    fontWeight: '600' as any,
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.l,
  },
  label: {
    fontSize: Theme.fontSize.s,
    fontWeight: '500' as any,
    marginBottom: Theme.spacing.s,
  },
  idTypeContainer: {
    marginBottom: Theme.spacing.m,
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.xl,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: Theme.spacing.s,
  },
  radioLabel: {
    fontSize: Theme.fontSize.m,
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
    fontWeight: '500' as any,
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
  availabilitySection: {
    marginBottom: Theme.spacing.xl,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.s,
  },
  dayItem: {
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.s,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  dayText: {
    fontSize: Theme.fontSize.s,
    fontWeight: '500' as any,
  },
  submitButton: {
    marginBottom: Theme.spacing.xl,
  },
});