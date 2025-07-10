import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Calendar, MapPin, User } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Button from '@/components/Button';
import Theme from '@/constants/theme';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleViewBookings = () => {
    router.replace('/(tabs)/bookings');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Booking Confirmed',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => null,
          gestureEnabled: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={colors.success} />
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Booking Confirmed!
          </Text>
          <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
            Your booking has been successfully confirmed. The fixer will contact you shortly.
          </Text>
        </View>
        
        <View style={[styles.bookingDetails, { backgroundColor: colors.card }]}>
          <Text style={[styles.detailsTitle, { color: colors.text }]}>
            Booking Details
          </Text>
          
          <View style={styles.detailRow}>
            <User size={20} color={colors.primary} />
            <View style={styles.detailText}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Fixer
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                John Smith
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Calendar size={20} color={colors.primary} />
            <View style={styles.detailText}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Date & Time
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                July 15, 2025 at 10:00 AM
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={20} color={colors.primary} />
            <View style={styles.detailText}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Location
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                123 Main Street, Addis Ababa
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <Button
            title="View My Bookings"
            onPress={handleViewBookings}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Go to Home"
            onPress={handleGoHome}
            style={styles.actionButton}
          />
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
    flexGrow: 1,
    padding: Theme.spacing.xl,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  successTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    marginTop: Theme.spacing.l,
    marginBottom: Theme.spacing.m,
  },
  successMessage: {
    fontSize: Theme.fontSize.m,
    textAlign: 'center',
    lineHeight: 24,
  },
  bookingDetails: {
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    marginVertical: Theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.semiBold,
    marginBottom: Theme.spacing.l,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  detailText: {
    marginLeft: Theme.spacing.m,
    flex: 1,
  },
  detailLabel: {
    fontSize: Theme.fontSize.s,
    marginBottom: Theme.spacing.xs,
  },
  detailValue: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
  },
  actions: {
    marginTop: 'auto',
  },
  actionButton: {
    marginBottom: Theme.spacing.m,
  },
});