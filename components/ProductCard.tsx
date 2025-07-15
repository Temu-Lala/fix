import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.details}>
          <Text style={styles.price}>ETB {product.price}</Text>
          <Text style={styles.rating}>⭐ {product.rating}</Text>
        </View>

        <Text style={styles.stock}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of stock'}
        </Text>

        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A80F0',
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
  },
  stock: {
    fontSize: 12,
    color: '#2e7d32',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A80F0',
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
});
