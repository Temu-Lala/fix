import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Theme from '@/constants/theme';
import OptimizedImage from './OptimizedImage';
import { Fixer } from '@/types';

interface FixerCardProps {
  fixer: Fixer;
  onPress: () => void;
}

function FixerCard({ fixer, onPress }: FixerCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <OptimizedImage 
        source={{ uri: fixer.avatar }} 
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {fixer.name}
          </Text>
          {fixer.verified && (
            <CheckCircle size={16} color={colors.primary} style={styles.verifiedIcon} />
          )}
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color={colors.warning} fill={colors.warning} />
          <Text style={[styles.rating, { color: colors.text }]}>{fixer.rating}</Text>
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            ({fixer.reviewCount})
          </Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={[styles.priceRange, { color: colors.textSecondary }]}>
            {fixer.priceRange || `$${fixer.hourlyRate}/hour`}
          </Text>
          <Text style={[styles.dot, { color: colors.textSecondary }]}>•</Text>
          <Text style={[styles.distance, { color: colors.textSecondary }]}>
            {fixer.distance}km away
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Theme.spacing.m,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  name: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600' as any,
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
    fontSize: Theme.fontSize.s,
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
    fontSize: Theme.fontSize.s,
  },
  dot: {
    fontSize: Theme.fontSize.s,
    marginHorizontal: Theme.spacing.xs,
  },
  distance: {
    fontSize: Theme.fontSize.s,
  },
});

export default memo(FixerCard);