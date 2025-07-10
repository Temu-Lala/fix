import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Star, 
  CheckCircle, 
  MessageSquare, 
  Phone, 
  Heart, 
  Calendar,
  ChevronRight,
  Edit3
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';
import Button from '@/components/Button';
import ReviewCard from '@/components/ReviewCard';
import OptimizedImage from '@/components/OptimizedImage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fixers } from '@/mocks/fixers';
import { reviews } from '@/mocks/reviews';

export default function FixerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Find fixer by id
  const fixer = fixers.find(f => f.id === id);
  
  if (!fixer) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            Fixer not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBookPress = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/booking/new',
        params: { fixerId: fixer.id }
      });
    }, 500);
  }, [router, fixer.id]);

  const handleChatPress = useCallback(() => {
    router.push(`/chat/${fixer.id}`);
  }, [router, fixer.id]);

  const handleCallPress = useCallback(() => {
    console.log('Call pressed');
  }, []);

  const handleWriteReviewPress = useCallback(() => {
    router.push(`/fixer/${fixer.id}/review`);
  }, [router, fixer.id]);

  const toggleSaved = useCallback(() => {
    setIsSaved(!isSaved);
  }, [isSaved]);

  const renderReview = useCallback(({ item }: { item: typeof reviews[0] }) => (
    <ReviewCard review={item} />
  ), []);

  const keyExtractor = useCallback((item: typeof reviews[0]) => item.id, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: fixer.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={toggleSaved}
              activeOpacity={0.7}
            >
              <Heart 
                size={24} 
                color={colors.primary} 
                fill={isSaved ? colors.primary : 'none'} 
              />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        scrollEventThrottle={16}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <OptimizedImage 
            source={{ uri: fixer.avatar }} 
            style={styles.avatar}
          />
          
          <View style={styles.fixerInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: colors.text }]}>{fixer.name}</Text>
              {fixer.verified && (
                <CheckCircle size={16} color={colors.primary} style={styles.verifiedIcon} />
              )}
            </View>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={[styles.rating, { color: colors.text }]}>{fixer.rating}</Text>
              <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                ({fixer.reviewCount} reviews)
              </Text>
            </View>
            
            <View style={styles.detailsContainer}>
              <Text style={[styles.priceRange, { color: colors.textSecondary }]}>
                {fixer.priceRange}
              </Text>
              <Text style={[styles.dot, { color: colors.textSecondary }]}>•</Text>
              <Text style={[styles.distance, { color: colors.textSecondary }]}>
                {fixer.distance}km away
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.actionButtons, { backgroundColor: colors.card, borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={handleChatPress}
            activeOpacity={0.7}
          >
            <MessageSquare size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={handleCallPress}
            activeOpacity={0.7}
          >
            <Phone size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <Button 
            title="Book Now" 
            onPress={handleBookPress} 
            loading={loading}
            style={styles.bookButton}
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Services</Text>
          {fixer.services && fixer.services.map((service, index) => (
            <View 
              key={service.id} 
              style={[
                styles.serviceItem,
                { borderBottomColor: colors.border },
                index === fixer.services!.length - 1 && styles.lastServiceItem
              ]}
            >
              <Text style={[styles.serviceName, { color: colors.text }]}>
                {service.name}
              </Text>
              <Text style={[styles.servicePrice, { color: colors.text }]}>
                {service.price}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Availability</Text>
          <View style={styles.availabilityContainer}>
            {fixer.availability?.map((day, index) => (
              <View key={index} style={[styles.dayBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.dayText, { color: colors.text }]}>{day}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.calendarButton, { borderColor: colors.primary }]}
            activeOpacity={0.7}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.calendarText, { color: colors.primary }]}>
              View Full Schedule
            </Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
            <View style={styles.reviewsActions}>
              <TouchableOpacity 
                style={[styles.writeReviewButton, { backgroundColor: colors.primary }]}
                onPress={handleWriteReviewPress}
                activeOpacity={0.7}
              >
                <Edit3 size={16} color="white" />
                <Text style={styles.writeReviewText}>Write Review</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            removeClippedSubviews={Platform.OS === 'android'}
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: Theme.fontSize.l,
  },
  saveButton: {
    padding: Theme.spacing.s,
  },
  header: {
    flexDirection: 'row',
    padding: Theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Theme.spacing.l,
  },
  fixerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  name: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700' as any,
    marginRight: Theme.spacing.xs,
  },
  verifiedIcon: {
    marginLeft: Theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  rating: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
    marginLeft: Theme.spacing.xs,
  },
  reviewCount: {
    fontSize: Theme.fontSize.s,
    marginLeft: Theme.spacing.xs,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRange: {
    fontSize: Theme.fontSize.m,
  },
  dot: {
    fontSize: Theme.fontSize.m,
    marginHorizontal: Theme.spacing.xs,
  },
  distance: {
    fontSize: Theme.fontSize.m,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.m,
  },
  bookButton: {
    flex: 1,
  },
  section: {
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.m,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600' as any,
    marginBottom: Theme.spacing.m,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.m,
    borderBottomWidth: 1,
  },
  lastServiceItem: {
    borderBottomWidth: 0,
  },
  serviceName: {
    fontSize: Theme.fontSize.m,
  },
  servicePrice: {
    fontSize: Theme.fontSize.m,
    fontWeight: '600' as any,
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.m,
  },
  dayBadge: {
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderRadius: Theme.borderRadius.m,
    marginRight: Theme.spacing.s,
    marginBottom: Theme.spacing.s,
  },
  dayText: {
    fontSize: Theme.fontSize.s,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.m,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.m,
    marginTop: Theme.spacing.s,
  },
  calendarText: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
    marginHorizontal: Theme.spacing.s,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  reviewsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.m,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderRadius: Theme.borderRadius.m,
    gap: Theme.spacing.xs,
  },
  writeReviewText: {
    color: 'white',
    fontSize: Theme.fontSize.s,
    fontWeight: '500' as any,
  },
  seeAllText: {
    fontSize: Theme.fontSize.s,
    fontWeight: '500' as any,
  },
});