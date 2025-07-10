import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard, Smartphone, Building } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Button from '@/components/Button';
import Theme from '@/constants/theme';

interface PaymentMethod {
  id: string;
  type: 'mobile' | 'bank' | 'card';
  name: string;
  details: string;
  logo?: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'mobile',
      name: t('telebirr'),
      details: '+251 9** *** 123',
      isDefault: true,
    },
    {
      id: '2',
      type: 'bank',
      name: t('cbe'),
      details: '**** **** **** 1234',
      isDefault: false,
    },
  ]);

  const availablePaymentMethods = [
    { type: 'mobile', name: t('telebirr'), icon: <Smartphone size={24} color={colors.primary} /> },
    { type: 'mobile', name: t('chapa'), icon: <Smartphone size={24} color={colors.primary} /> },
    { type: 'mobile', name: t('kacha'), icon: <Smartphone size={24} color={colors.primary} /> },
    { type: 'mobile', name: t('santimPay'), icon: <Smartphone size={24} color={colors.primary} /> },
    { type: 'bank', name: t('dashenBank'), icon: <Building size={24} color={colors.primary} /> },
    { type: 'bank', name: t('cbe'), icon: <Building size={24} color={colors.primary} /> },
    { type: 'bank', name: t('abyssiniaBank'), icon: <Building size={24} color={colors.primary} /> },
    { type: 'card', name: t('creditCard'), icon: <CreditCard size={24} color={colors.primary} /> },
  ];

  const handleAddPaymentMethod = () => {
    router.push('/payment-methods/add');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('paymentMethods'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Button
            title="Add Payment Method"
            onPress={handleAddPaymentMethod}
            icon={<Plus size={20} color="white" />}
            style={styles.addButton}
          />
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Payment Methods
          </Text>
          
          {paymentMethods.map((method) => (
            <View 
              key={method.id}
              style={[styles.paymentMethodCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.paymentMethodInfo}>
                <View style={styles.paymentMethodHeader}>
                  <Text style={[styles.paymentMethodName, { color: colors.text }]}>
                    {method.name}
                  </Text>
                  {method.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.paymentMethodDetails, { color: colors.textSecondary }]}>
                  {method.details}
                </Text>
              </View>
              
              <View style={styles.paymentMethodActions}>
                {!method.isDefault && (
                  <TouchableOpacity 
                    onPress={() => handleSetDefault(method.id)}
                    style={styles.actionButton}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                      Set Default
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => handleRemovePaymentMethod(method.id)}
                  style={styles.actionButton}
                >
                  <Text style={[styles.actionButtonText, { color: colors.error }]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Payment Methods
          </Text>
          
          {availablePaymentMethods.map((method, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.availableMethodCard, { backgroundColor: colors.card }]}
              onPress={() => console.log(`Add ${method.name}`)}
            >
              {method.icon}
              <Text style={[styles.availableMethodName, { color: colors.text }]}>
                {method.name}
              </Text>
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
  addButton: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.semiBold,
    marginBottom: Theme.spacing.m,
    marginTop: Theme.spacing.l,
  },
  paymentMethodCard: {
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  paymentMethodInfo: {
    marginBottom: Theme.spacing.m,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xs,
  },
  paymentMethodName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
  },
  defaultBadge: {
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.s,
  },
  defaultText: {
    fontSize: Theme.fontSize.xs,
    color: 'white',
    fontWeight: Theme.fontWeight.medium,
  },
  paymentMethodDetails: {
    fontSize: Theme.fontSize.s,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: Theme.spacing.m,
  },
  actionButtonText: {
    fontSize: Theme.fontSize.s,
    fontWeight: Theme.fontWeight.medium,
  },
  availableMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  availableMethodName: {
    fontSize: Theme.fontSize.m,
    marginLeft: Theme.spacing.m,
  },
});