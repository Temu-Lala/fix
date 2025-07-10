import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import Theme from '@/constants/theme';

interface OptimizedImageProps {
  source: { uri: string };
  style?: ViewStyle;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  placeholder?: string;
  transition?: number;
}

export default function OptimizedImage({
  source,
  style,
  contentFit = 'cover',
  placeholder,
  transition = 300,
}: OptimizedImageProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={[styles.image, style]}
        contentFit={contentFit}
        transition={transition}
        placeholder={placeholder}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        cachePolicy="memory-disk"
        recyclingKey={source.uri}
      />
      {loading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      {error && (
        <View style={[styles.errorOverlay, { backgroundColor: colors.card }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.s,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Theme.borderRadius.s,
  },
});