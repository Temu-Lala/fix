import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';
import BookingCard from '@/components/BookingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useBookingStore } from '@/store/bookingStore';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { bookings, isLoading, fetchBookings, cancelBooking } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    booking => booking.status === 'pending' || booking.status === 'confirmed'
  );
  
  const pastBookings = bookings.filter(
    booking => booking.status === 'completed' || booking.status === 'cancelled'
  );

  const handleBookingPress = useCallback((bookingId: string) => {
    router.push(`/booking/${bookingId}`);
  }, [router]);

  const handleRebook = useCallback((bookingId: string) => {
    console.log(`Rebooking: ${bookingId}`);
  }, []);

  const handleCancel = useCallback(async (bookingId: string) => {
    await cancelBooking(bookingId);
  }, [cancelBooking]);

  const renderBooking = useCallback(({ item }: { item: typeof bookings[0] }) => (
    <BookingCard
      booking={item}
      onPress={() => handleBookingPress(item.id)}
      onRebook={() => handleRebook(item.id)}
      onCancel={() => handleCancel(item.id)}
    />
  ), [handleBookingPress, handleRebook, handleCancel]);

  const keyExtractor = useCallback((item: typeof bookings[0]) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 200, // Approximate height of booking card
    offset: 200 * index,
    index,
  }), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Bookings</Text>
      </View>
      
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && [styles.activeTab, { backgroundColor: colors.background }]
          ]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textSecondary },
              activeTab === 'upcoming' && [styles.activeTabText, { color: colors.text }]
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && [styles.activeTab, { backgroundColor: colors.background }]
          ]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textSecondary },
              activeTab === 'past' && [styles.activeTabText, { color: colors.text }]
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={activeTab === 'upcoming' ? upcomingBookings : pastBookings}
          renderItem={renderBooking}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          windowSize={10}
          getItemLayout={getItemLayout}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming bookings"
                  : "You don't have any past bookings"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.l,
    paddingBottom: Theme.spacing.m,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '700' as any,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.s,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.s,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
  },
  activeTabText: {
    fontWeight: '600' as any,
  },
  listContainer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xl,
  },
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Theme.fontSize.m,
    textAlign: 'center',
  },
});