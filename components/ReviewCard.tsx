import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          color={Colors.light.warning} 
          fill={i <= review.rating ? Colors.light.warning : 'none'} 
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }} 
          style={styles.avatar} 
          resizeMode="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.userName}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        {renderStars()}
      </View>
      
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.common.white,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
    shadowColor: Colors.common.black,
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
    color: Colors.light.text,
  },
  date: {
    fontSize: Theme.fontSize.xs,
    color: Colors.light.textSecondary,
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
    color: Colors.light.text,
    lineHeight: 22,
  },
});