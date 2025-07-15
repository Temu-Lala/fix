import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

// Mock warehouse and delivery destination
const WAREHOUSE = { latitude: 9.010793, longitude: 38.761252 };
const DESTINATION = { latitude: 9.020793, longitude: 38.771252 };

export default function TrackDeliveryScreen() {
  const { orderId } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const [deliveryLocation, setDeliveryLocation] = useState(WAREHOUSE);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate polling backend for delivery location
  useEffect(() => {
    setLoading(true);
    // Simulate initial fetch
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    intervalRef.current = setInterval(() => {
      // Simulate location update (move closer to destination)
      setDeliveryLocation(prev => {
        const lat = prev.latitude + (DESTINATION.latitude - prev.latitude) * 0.15 + (Math.random() - 0.5) * 0.0005;
        const lng = prev.longitude + (DESTINATION.longitude - prev.longitude) * 0.15 + (Math.random() - 0.5) * 0.0005;
        return {
          latitude: Math.abs(lat - DESTINATION.latitude) < 0.0005 ? DESTINATION.latitude : lat,
          longitude: Math.abs(lng - DESTINATION.longitude) < 0.0005 ? DESTINATION.longitude : lng,
        };
      });
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Estimate arrival (mock)
  const getEta = () => {
    const dist = Math.sqrt(
      Math.pow(deliveryLocation.latitude - DESTINATION.latitude, 2) +
      Math.pow(deliveryLocation.longitude - DESTINATION.longitude, 2)
    );
    if (dist < 0.001) return 'Arriving now';
    if (dist < 0.005) return '2-5 min';
    return '10+ min';
  };

  const handleContact = () => {
    Alert.alert('Contact Delivery', 'Call or chat with your delivery person.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>Track Your Delivery</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Order #{orderId}</Text>
      </View>
      <View style={styles.mapBox}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: (WAREHOUSE.latitude + DESTINATION.latitude) / 2,
              longitude: (WAREHOUSE.longitude + DESTINATION.longitude) / 2,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* Route */}
            <Polyline
              coordinates={[WAREHOUSE, deliveryLocation, DESTINATION]}
              strokeColor={colors.primary}
              strokeWidth={4}
            />
            {/* Warehouse Marker */}
            <Marker coordinate={WAREHOUSE} title="Warehouse" pinColor="#888" />
            {/* Delivery Person Marker */}
            <Marker coordinate={deliveryLocation} title="Delivery" pinColor={colors.primary} />
            {/* Destination Marker */}
            <Marker coordinate={DESTINATION} title="Your Location" pinColor="#27ae60" />
          </MapView>
        )}
      </View>
      <View style={styles.infoBox}>
        <Text style={[styles.eta, { color: colors.primary }]}>Estimated Arrival: {getEta()}</Text>
        <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primary }]} onPress={handleContact}>
          <MessageCircle size={18} color="#fff" />
          <Text style={styles.contactBtnText}>Contact Delivery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 16,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
  },
  mapBox: {
    width: '92%',
    height: 320,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E8ECF4',
    backgroundColor: '#F0F4FF',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  eta: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 6,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
}); 