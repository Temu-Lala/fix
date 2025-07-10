import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch 
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useSettingsStore } from '@/store/settingsStore';
import Theme from '@/constants/theme';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { notifications, updateNotificationSettings } = useSettingsStore();

  const notificationSettings = [
    {
      key: 'bookingUpdates' as const,
      title: t('bookingUpdates'),
      description: 'Get notified about booking confirmations and updates',
    },
    {
      key: 'chatMessages' as const,
      title: t('chatMessages'),
      description: 'Receive notifications for new chat messages',
    },
    {
      key: 'promotions' as const,
      title: t('promotions'),
      description: 'Get notified about special offers and promotions',
    },
    {
      key: 'reminders' as const,
      title: t('reminders'),
      description: 'Receive reminders about upcoming bookings',
    },
  ];

  const handleToggle = (key: keyof typeof notifications) => {
    updateNotificationSettings({ [key]: !notifications[key] });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('notifications'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={styles.content}>
        {notificationSettings.map((setting) => (
          <View 
            key={setting.key}
            style={[styles.settingItem, { backgroundColor: colors.card }]}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                {setting.title}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {setting.description}
              </Text>
            </View>
            <Switch
              value={notifications[setting.key]}
              onValueChange={() => handleToggle(setting.key)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        ))}
      </View>
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
  settingInfo: {
    flex: 1,
    marginRight: Theme.spacing.m,
  },
  settingTitle: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
  },
  settingDescription: {
    fontSize: Theme.fontSize.s,
    marginTop: Theme.spacing.xs,
  },
});