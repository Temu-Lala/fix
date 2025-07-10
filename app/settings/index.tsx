import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  FileText,
  ChevronRight
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const settingsItems = [
    {
      icon: <Globe size={24} color={colors.text} />,
      title: t('language'),
      onPress: () => router.push('/settings/language'),
      showChevron: true,
    },
    {
      icon: <Palette size={24} color={colors.text} />,
      title: t('theme'),
      onPress: () => router.push('/settings/theme'),
      showChevron: true,
    },
    {
      icon: <Bell size={24} color={colors.text} />,
      title: t('notifications'),
      onPress: () => router.push('/settings/notifications'),
      showChevron: true,
    },
    {
      icon: <Shield size={24} color={colors.text} />,
      title: t('privacy'),
      onPress: () => router.push('/settings/privacy'),
      showChevron: true,
    },
    {
      icon: <FileText size={24} color={colors.text} />,
      title: t('legal'),
      onPress: () => router.push('/settings/legal'),
      showChevron: true,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('settings'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.settingItem, { backgroundColor: colors.card }]}
              onPress={item.onPress}
            >
              <View style={styles.settingItemLeft}>
                {item.icon}
                <Text style={[styles.settingItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              {item.showChevron && (
                <ChevronRight size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
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
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: Theme.fontSize.m,
    marginLeft: Theme.spacing.m,
  },
});