import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [profileVisibility, setProfileVisibility] = useState('everyone');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowLocationTracking, setAllowLocationTracking] = useState(true);
  const [shareUsageData, setShareUsageData] = useState(false);
  const [allowPersonalizedAds, setAllowPersonalizedAds] = useState(false);

  const privacySettings = [
    {
      title: t('profileVisibility'),
      subtitle: 'Who can view your profile',
      type: 'select',
      value: profileVisibility,
      options: [
        { label: 'Everyone', value: 'everyone' },
        { label: 'Verified users only', value: 'verified' },
        { label: 'Nobody', value: 'nobody' }
      ]
    },
    {
      title: t('showOnlineStatus'),
      subtitle: 'Let others see when you are online',
      type: 'switch',
      value: showOnlineStatus,
      onValueChange: setShowOnlineStatus
    },
    {
      title: t('locationTracking'),
      subtitle: 'Allow app to track your location for better service',
      type: 'switch',
      value: allowLocationTracking,
      onValueChange: setAllowLocationTracking
    },
    {
      title: t('shareUsageData'),
      subtitle: 'Help improve the app by sharing anonymous usage data',
      type: 'switch',
      value: shareUsageData,
      onValueChange: setShareUsageData
    },
    {
      title: t('personalizedAds'),
      subtitle: 'Show ads based on your interests',
      type: 'switch',
      value: allowPersonalizedAds,
      onValueChange: setAllowPersonalizedAds
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('privacy'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('privacyDescription')}
          </Text>
          
          {privacySettings.map((setting, index) => (
            <View key={index} style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  {setting.title}
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  {setting.subtitle}
                </Text>
              </View>
              
              {setting.type === 'switch' ? (
                <Switch
                  value={setting.value as boolean}
                  onValueChange={setting.onValueChange}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              ) : (
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={[styles.selectValue, { color: colors.primary }]}>
                    {setting.options?.find(opt => opt.value === setting.value)?.label}
                  </Text>
                  <ChevronRight size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('dataManagement')}
            </Text>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                {t('downloadMyData')}
              </Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={[styles.actionButtonText, { color: colors.error }]}>
                {t('deleteMyAccount')}
              </Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Theme.spacing.xl,
  },
  description: {
    fontSize: Theme.fontSize.m,
    lineHeight: 22,
    marginBottom: Theme.spacing.xl,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingContent: {
    flex: 1,
    marginRight: Theme.spacing.m,
  },
  settingTitle: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
    marginBottom: Theme.spacing.xs,
  },
  settingSubtitle: {
    fontSize: Theme.fontSize.s,
    lineHeight: 18,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValue: {
    fontSize: Theme.fontSize.s,
    marginRight: Theme.spacing.xs,
  },
  section: {
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.l,
    marginTop: Theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600' as any,
    marginBottom: Theme.spacing.m,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionButtonText: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
  },
});