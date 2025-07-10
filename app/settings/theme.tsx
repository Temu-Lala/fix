import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useSettingsStore, Theme as ThemeType } from '@/store/settingsStore';
import Theme from '@/constants/theme';

export default function ThemeScreen() {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const { setTheme } = useSettingsStore();

  const themes = [
    { 
      code: 'light' as ThemeType, 
      name: t('lightMode'), 
      icon: <Sun size={24} color={colors.text} /> 
    },
    { 
      code: 'dark' as ThemeType, 
      name: t('darkMode'), 
      icon: <Moon size={24} color={colors.text} /> 
    },
  ];

  const handleThemeSelect = (themeCode: ThemeType) => {
    setTheme(themeCode);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('theme'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={styles.content}>
        {themes.map((themeOption) => (
          <TouchableOpacity 
            key={themeOption.code}
            style={[styles.themeItem, { backgroundColor: colors.card }]}
            onPress={() => handleThemeSelect(themeOption.code)}
          >
            <View style={styles.themeInfo}>
              {themeOption.icon}
              <Text style={[styles.themeName, { color: colors.text }]}>
                {themeOption.name}
              </Text>
            </View>
            {theme === themeOption.code && (
              <Check size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
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
  themeItem: {
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
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
    marginLeft: Theme.spacing.m,
  },
});