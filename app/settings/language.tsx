import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useSettingsStore, Language } from '@/store/settingsStore';
import Theme from '@/constants/theme';

export default function LanguageScreen() {
  const { colors } = useTheme();
  const { t, language } = useTranslation();
  const { setLanguage } = useSettingsStore();

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'am' as Language, name: 'Amharic', nativeName: 'አማርኛ' },
  ];

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('language'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={styles.content}>
        {languages.map((lang) => (
          <TouchableOpacity 
            key={lang.code}
            style={[styles.languageItem, { backgroundColor: colors.card }]}
            onPress={() => handleLanguageSelect(lang.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: colors.text }]}>
                {lang.name}
              </Text>
              <Text style={[styles.languageNative, { color: colors.textSecondary }]}>
                {lang.nativeName}
              </Text>
            </View>
            {language === lang.code && (
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
  languageItem: {
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
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
  },
  languageNative: {
    fontSize: Theme.fontSize.s,
    marginTop: Theme.spacing.xs,
  },
});