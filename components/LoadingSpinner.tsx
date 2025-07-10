import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export default function LoadingSpinner({ 
  size = 'large', 
  color, 
  style 
}: LoadingSpinnerProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator 
        size={size} 
        color={color || colors.primary} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});