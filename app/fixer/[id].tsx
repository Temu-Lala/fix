import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
  TextInput,
  Image
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  
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
    setShowReviewModal(true);
  }, []);

  const handleViewFullSchedule = useCallback(() => {
    setShowScheduleModal(true);
  }, []);

  const handleSeeAllReviews = useCallback(() => {
    setShowAllReviewsModal(true);
  }, []);

  const handleSubmitReview = () => {
    // Here you would submit the review to backend or state
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewComment('');
  };

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
        {/* Facebook-style profile header */}
        <View style={styles.fbProfileHeader}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={[styles.avatarWrapper, { backgroundColor: colors.background }]}> 
            <OptimizedImage 
              source={{ uri: fixer.avatar }} 
              style={styles.fbAvatar}
            />
          </View>
          <View style={styles.fbProfileInfo}>
            <View style={styles.fbNameRow}>
              <Text style={[styles.fbName, { color: colors.text }]}>{fixer.name}</Text>
              {fixer.verified && (
                <CheckCircle size={18} color={colors.primary} style={styles.verifiedIcon} />
              )}
            </View>
            <View style={styles.fbStatsRow}>
              <Text style={[styles.fbStat, { color: colors.textSecondary }]}>1.2k Followers</Text>
              <Text style={[styles.fbDot, { color: colors.textSecondary }]}>•</Text>
              <Text style={[styles.fbStat, { color: colors.textSecondary }]}>{fixer.reviewCount} Reviews</Text>
              <Text style={[styles.fbDot, { color: colors.textSecondary }]}>•</Text>
              <Text style={[styles.fbStat, { color: colors.textSecondary }]}>⭐ {fixer.rating}</Text>
            </View>
            <View style={styles.fbActionsRow}>
              <Button
                title={isSaved ? 'Following' : 'Follow'}
                onPress={toggleSaved}
                style={[styles.fbActionBtn, isSaved && { backgroundColor: colors.primary }]} 
                variant={isSaved ? 'solid' : 'outline'}
              />
              <Button
                title="Message"
                onPress={handleChatPress}
                style={styles.fbActionBtn}
                variant="outline"
              />
              <Button
                title="Call"
                onPress={handleCallPress}
                style={styles.fbActionBtn}
                variant="outline"
              />
              <Button
                title="Report"
                onPress={() => alert('Reported!')}
                style={styles.fbActionBtn}
                variant="outline"
              />
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
            onPress={handleViewFullSchedule}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.calendarText, { color: colors.primary }]}>View Full Schedule</Text>
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
              <TouchableOpacity activeOpacity={0.7} onPress={handleSeeAllReviews}>
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
      {/* Write Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: '#0009' }]}> 
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>Write a Review</Text>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(i => (
                <TouchableOpacity key={i} onPress={() => setReviewRating(i)}>
                  <Star
                    size={32}
                    color={i <= reviewRating ? (colors.warning || '#FFA500') : colors.textSecondary}
                    fill={i <= reviewRating ? (colors.warning || '#FFA500') : 'none'}
                    style={{ marginHorizontal: 2 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.commentInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
              placeholder="Write your review..."
              placeholderTextColor={colors.textSecondary}
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setShowReviewModal(false)} variant="outline" style={{ flex: 1, marginRight: Theme.spacing.s }} />
              <Button title="Submit" onPress={handleSubmitReview} style={{ flex: 1 }} disabled={reviewRating === 0 || !reviewComment.trim()} />
            </View>
          </View>
        </View>
      </Modal>
      {/* See All Reviews Modal */}
      <Modal
        visible={showAllReviewsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAllReviewsModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: '#0009' }]}> 
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '80%' }]}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>All Reviews</Text>
            <Text style={[styles.reviewStats, { color: colors.textSecondary }]}>Average: {fixer.rating} ({fixer.reviewCount} reviews)</Text>
            <ScrollView style={{ marginTop: Theme.spacing.m }}>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setShowAllReviewsModal(false)} style={{ marginTop: Theme.spacing.m }} />
          </View>
        </View>
      </Modal>
      {/* Full Schedule Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: '#0009' }]}> 
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '80%' }]}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>Full Schedule</Text>
            <Text style={[styles.scheduleSub, { color: colors.textSecondary }]}>Available slots for the week</Text>
            <ScrollView style={{ marginTop: Theme.spacing.m }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => (
                <View key={day} style={{ marginBottom: Theme.spacing.m }}>
                  <Text style={[styles.dayText, { color: colors.primary, fontWeight: '700' }]}>{day}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: Theme.spacing.s }}>
                    {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"].map((slot, idx) => (
                      <TouchableOpacity
                        key={slot}
                        style={{
                          backgroundColor: idx % 2 === 0 ? colors.success : colors.background,
                          borderColor: colors.primary,
                          borderWidth: 1,
                          borderRadius: Theme.borderRadius.s,
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          marginRight: Theme.spacing.s,
                          marginBottom: Theme.spacing.s,
                        }}
                        onPress={() => alert(`Book slot: ${day} ${slot}`)}
                      >
                        <Text style={{ color: idx % 2 === 0 ? 'white' : colors.text }}>{slot}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setShowScheduleModal(false)} style={{ marginTop: Theme.spacing.m }} />
          </View>
        </View>
      </Modal>
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
    borderWidth: 1,
    borderRadius: Theme.borderRadius.s,
    paddingVertical: Theme.spacing.s,
    paddingHorizontal: Theme.spacing.m,
    alignSelf: 'flex-start',
    marginTop: Theme.spacing.m,
  },
  calendarText: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500',
    marginHorizontal: Theme.spacing.s,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.m,
  },
  reviewsActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.s,
    paddingVertical: Theme.spacing.s,
    paddingHorizontal: Theme.spacing.m,
    marginRight: Theme.spacing.s,
  },
  writeReviewText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: Theme.spacing.xs,
  },
  seeAllText: {
    fontSize: Theme.fontSize.m,
    fontWeight: '600',
  },
  reviewStats: {
    fontSize: Theme.fontSize.m,
    textAlign: 'center',
    marginBottom: Theme.spacing.s,
  },
  scheduleSub: {
    fontSize: Theme.fontSize.m,
    textAlign: 'center',
    marginBottom: Theme.spacing.s,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: '700',
    marginBottom: Theme.spacing.m,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.spacing.m,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: Theme.borderRadius.s,
    padding: Theme.spacing.m,
    fontSize: Theme.fontSize.m,
    marginBottom: Theme.spacing.m,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fbProfileHeader: {
    marginBottom: Theme.spacing.xl,
    backgroundColor: 'transparent',
  },
  coverImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: Theme.borderRadius.l,
    borderTopRightRadius: Theme.borderRadius.l,
  },
  avatarWrapper: {
    position: 'absolute',
    left: 24,
    top: 110,
    borderRadius: 48,
    padding: 4,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  fbAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#fff',
  },
  fbProfileInfo: {
    marginTop: 56,
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  fbNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fbName: {
    fontSize: 26,
    fontWeight: '700',
    marginRight: 8,
  },
  fbStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fbStat: {
    fontSize: 15,
    fontWeight: '500',
  },
  fbDot: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  fbActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fbActionBtn: {
    marginRight: 10,
    minWidth: 90,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});