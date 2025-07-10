import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { 
  Zap, 
  Droplet, 
  Refrigerator, 
  Hammer, 
  Flower, 
  Car, 
  Paintbrush, 
  Sparkles 
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Theme from '@/constants/theme';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  style?: ViewStyle;
}

export default function CategoryCard({ category, onPress, style }: CategoryCardProps) {
  const { colors } = useTheme();
  
  const getIcon = () => {
    switch (category.icon) {
      case 'zap':
        return <Zap size={24} color={colors.primary} />;
      case 'droplet':
        return <Droplet size={24} color={colors.primary} />;
      case 'refrigerator':
        return <Refrigerator size={24} color={colors.primary} />;
      case 'hammer':
        return <Hammer size={24} color={colors.primary} />;
      case 'flower':
        return <Flower size={24} color={colors.primary} />;
      case 'car':
        return <Car size={24} color={colors.primary} />;
      case 'paintbrush':
        return <Paintbrush size={24} color={colors.primary} />;
      case 'sparkles':
        return <Sparkles size={24} color={colors.primary} />;
      default:
        return <Hammer size={24} color={colors.primary} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
        {getIcon()}
      </View>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.s,
    width: 90,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.s,
  },
  name: {
    fontSize: Theme.fontSize.s,
    fontWeight: Theme.fontWeight.medium as any,
    textAlign: 'center',
  },
});