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
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  HelpCircle,
  ChevronRight
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';

export default function HelpSupportScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const supportOptions = [
    {
      icon: <MessageCircle size={24} color={colors.primary} />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      onPress: () => console.log('Live chat'),
    },
    {
      icon: <Phone size={24} color={colors.primary} />,
      title: 'Call Support',
      description: '+251 911 123 456',
      onPress: () => Linking.openURL('tel:+251911123456'),
    },
    {
      icon: <Mail size={24} color={colors.primary} />,
      title: 'Email Support',
      description: 'support@tabfix.com',
      onPress: () => Linking.openURL('mailto:support@tabfix.com'),
    },
    {
      icon: <HelpCircle size={24} color={colors.primary} />,
      title: 'FAQ',
      description: 'Frequently asked questions',
      onPress: () => console.log('FAQ'),
    },
    {
      icon: <FileText size={24} color={colors.primary} />,
      title: 'User Guide',
      description: 'Learn how to use the app',
      onPress: () => console.log('User guide'),
    },
  ];

  const faqItems = [
    {
      question: 'How do I book a fixer?',
      answer: 'You can book a fixer by browsing our categories, selecting a service provider, and choosing your preferred date and time.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept Telebirr, Chapa, bank transfers, and credit cards.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the scheduled time.',
    },
    {
      question: 'How do I rate a fixer?',
      answer: 'After your service is completed, you will receive a prompt to rate and review your fixer.',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('helpSupport'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contact Support
          </Text>
          
          {supportOptions.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.supportOption, { backgroundColor: colors.card }]}
              onPress={option.onPress}
            >
              <View style={styles.supportOptionLeft}>
                {option.icon}
                <View style={styles.supportOptionText}>
                  <Text style={[styles.supportOptionTitle, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.supportOptionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Frequently Asked Questions
          </Text>
          
          {faqItems.map((item, index) => (
            <View 
              key={index}
              style={[styles.faqItem, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.faqQuestion, { color: colors.text }]}>
                {item.question}
              </Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                {item.answer}
              </Text>
            </View>
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
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.semiBold,
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.l,
  },
  supportOption: {
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
  supportOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  supportOptionText: {
    marginLeft: Theme.spacing.m,
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
  },
  supportOptionDescription: {
    fontSize: Theme.fontSize.s,
    marginTop: Theme.spacing.xs,
  },
  faqItem: {
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  faqQuestion: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
    marginBottom: Theme.spacing.s,
  },
  faqAnswer: {
    fontSize: Theme.fontSize.s,
    lineHeight: 20,
  },
});