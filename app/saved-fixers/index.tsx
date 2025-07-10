import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList 
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useSavedFixersStore } from '@/store/savedFixersStore';
import { fixers } from '@/mocks/fixers';
import FixerCard from '@/components/FixerCard';
import Theme from '@/constants/theme';

export default function SavedFixersScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { savedFixerIds } = useSavedFixersStore();
  
  const savedFixers = fixers.filter(fixer => savedFixerIds.includes(fixer.id));

  const handleFixerPress = (fixerId: string) => {
    // Navigate to fixer details
    console.log(`Navigate to fixer: ${fixerId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('savedFixers'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <FlatList
        data={savedFixers}
        renderItem={({ item }) => (
          <FixerCard
            fixer={item}
            onPress={() => handleFixerPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No saved fixers yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Save your favorite fixers to find them easily later
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: Theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.medium,
    marginTop: Theme.spacing.m,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.s,
    marginTop: Theme.spacing.s,
    textAlign: 'center',
  },
});