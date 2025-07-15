import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Theme from '@/constants/theme';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { colors } = useTheme();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          color={colors.warning || '#FFA500'} 
          fill={i <= review.rating ? (colors.warning || '#FFA500') : 'none'} 
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow || '#000' }]}> 
      <View style={styles.header}>
        <Image 
          source={{ uri: review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }} 
          style={styles.avatar} 
          resizeMode="cover"
        />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{review.userName}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{review.date}</Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        {renderStars()}
      </View>
      
      <Text style={[styles.comment, { color: colors.text }]}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.s,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Theme.spacing.m,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
  },
  date: {
    fontSize: Theme.fontSize.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.m,
  },
  star: {
    marginRight: Theme.spacing.xs,
  },
  comment: {
    fontSize: Theme.fontSize.m,
    lineHeight: 22,
  },
});