import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import SkeletonLoader from './SkeletonLoader';
import Theme from '@/constants/theme';

export default function FixerCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <SkeletonLoader 
        width={60} 
        height={60} 
        borderRadius={30} 
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <SkeletonLoader width="70%" height={18} style={styles.name} />
        <SkeletonLoader width="50%" height={14} style={styles.rating} />
        <SkeletonLoader width="60%" height={14} style={styles.details} />
      </View>
    </View>
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
    marginRight: Theme.spacing.m,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    marginBottom: Theme.spacing.xs,
  },
  rating: {
    marginBottom: Theme.spacing.xs,
  },
  details: {},
});