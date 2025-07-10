import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';

export default function LegalScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const legalItems = [
    {
      title: t('termsOfService'),
      subtitle: 'Last updated: January 2024',
      onPress: () => openDocument('terms'),
    },
    {
      title: t('privacyPolicy'),
      subtitle: 'Last updated: January 2024',
      onPress: () => openDocument('privacy'),
    },
    {
      title: t('cookiePolicy'),
      subtitle: 'How we use cookies and similar technologies',
      onPress: () => openDocument('cookies'),
    },
    {
      title: t('communityGuidelines'),
      subtitle: 'Rules and guidelines for using TAB Fix',
      onPress: () => openDocument('guidelines'),
    },
    {
      title: t('intellectualProperty'),
      subtitle: 'Copyright and trademark information',
      onPress: () => openDocument('ip'),
    },
    {
      title: t('disputeResolution'),
      subtitle: 'How we handle disputes and complaints',
      onPress: () => openDocument('disputes'),
    }
  ];

  const openDocument = (type: string) => {
    // In a real app, these would be actual URLs to your legal documents
    const urls = {
      terms: 'https://tabfix.com/terms',
      privacy: 'https://tabfix.com/privacy',
      cookies: 'https://tabfix.com/cookies',
      guidelines: 'https://tabfix.com/guidelines',
      ip: 'https://tabfix.com/intellectual-property',
      disputes: 'https://tabfix.com/disputes'
    };
    
    const url = urls[type as keyof typeof urls];
    if (url) {
      Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('legal'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('legalDescription')}
          </Text>
          
          {legalItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.legalItem, { backgroundColor: colors.card }]}
              onPress={item.onPress}
            >
              <View style={styles.legalContent}>
                <Text style={[styles.legalTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.legalSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <ExternalLink size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
          
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('contact')}
            </Text>
            
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              {t('legalContactDescription')}
            </Text>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => Linking.openURL('mailto:legal@tabfix.com')}
            >
              <Text style={[styles.contactButtonText, { color: colors.primary }]}>
                legal@tabfix.com
              </Text>
              <ExternalLink size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              TAB Fix © 2024. All rights reserved.
            </Text>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
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
  legalItem: {
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
  legalContent: {
    flex: 1,
    marginRight: Theme.spacing.m,
  },
  legalTitle: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
    marginBottom: Theme.spacing.xs,
  },
  legalSubtitle: {
    fontSize: Theme.fontSize.s,
    lineHeight: 18,
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
  contactText: {
    fontSize: Theme.fontSize.m,
    lineHeight: 22,
    marginBottom: Theme.spacing.m,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
    marginRight: Theme.spacing.xs,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: Theme.spacing.l,
    marginTop: Theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Theme.fontSize.s,
    marginBottom: Theme.spacing.xs,
  },
});