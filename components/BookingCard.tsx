import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Theme from '@/constants/theme';
import { Booking } from '@/types';
import Button from './Button';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  onRebook?: () => void;
  onCancel?: () => void;
}

export default function BookingCard({ 
  booking, 
  onPress, 
  onRebook, 
  onCancel 
}: BookingCardProps) {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed':
        return colors.success || '#4CAF50';
      case 'pending':
        return colors.warning || '#FFA500';
      case 'completed':
        return colors.primary;
      case 'cancelled':
        return colors.error || '#FF3B30';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    return booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow || '#000' }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: booking.fixerAvatar }} 
          style={styles.avatar} 
          resizeMode="cover"
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.fixerName, { color: colors.text }]}>{booking.fixerName}</Text>
          <Text style={[styles.service, { color: colors.textSecondary }]}>{booking.service}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}> 
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.text }]}>{booking.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.text }]}>{booking.time}</Text>
        </View>
        <Text style={[styles.address, { color: colors.text }]} numberOfLines={1}>{booking.address}</Text>
      </View>
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}> 
        <Text style={[styles.price, { color: colors.text }]}>{booking.price}</Text>
        <View style={styles.actions}>
          {booking.status === 'completed' && onRebook && (
            <Button 
              title="Rebook" 
              onPress={onRebook} 
              variant="outline" 
              size="small"
              style={styles.actionButton}
            />
          )}
          {booking.status === 'pending' && onCancel && (
            <Button 
              title="Cancel" 
              onPress={onCancel} 
              variant="outline" 
              size="small"
              style={styles.actionButton}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    marginBottom: Theme.spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Theme.spacing.m,
  },
  headerInfo: {
    flex: 1,
  },
  fixerName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
  },
  service: {
    fontSize: Theme.fontSize.s,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.s,
  },
  statusText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.medium,
    color: '#fff',
  },
  detailsContainer: {
    marginBottom: Theme.spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  detailText: {
    fontSize: Theme.fontSize.s,
    marginLeft: Theme.spacing.s,
  },
  address: {
    fontSize: Theme.fontSize.s,
    marginTop: Theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Theme.spacing.m,
  },
  price: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.bold,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: Theme.spacing.s,
  },
});