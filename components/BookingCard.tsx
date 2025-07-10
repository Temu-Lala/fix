import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
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
  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed':
        return Colors.light.success;
      case 'pending':
        return Colors.light.warning;
      case 'completed':
        return Colors.light.primary;
      case 'cancelled':
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusText = () => {
    return booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
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
          <Text style={styles.fixerName}>{booking.fixerName}</Text>
          <Text style={styles.service}>{booking.service}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{booking.time}</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>{booking.address}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>{booking.price}</Text>
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
    color: Colors.light.text,
  },
  service: {
    fontSize: Theme.fontSize.s,
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.s,
  },
  statusText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.common.white,
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
    color: Colors.light.text,
    marginLeft: Theme.spacing.s,
  },
  address: {
    fontSize: Theme.fontSize.s,
    color: Colors.light.text,
    marginTop: Theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Theme.spacing.m,
  },
  price: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.light.text,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: Theme.spacing.s,
  },
});