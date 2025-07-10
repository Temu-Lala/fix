import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, MapPin } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';
import SearchBar from '@/components/SearchBar';
import FixerCard from '@/components/FixerCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { categories } from '@/mocks/categories';
import { fixers } from '@/mocks/fixers';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Find category by id
  const category = categories.find(c => c.id === id);
  
  // Filter fixers by category
  const categoryFixers = fixers.filter(fixer => 
    fixer.category === category?.name.toLowerCase()
  );
  
  const filteredFixers = categoryFixers.filter(fixer =>
    fixer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fixer.services?.some(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleFixerPress = useCallback((fixerId: string) => {
    router.push(`/fixer/${fixerId}`);
  }, [router]);

  const renderFixer = useCallback(({ item }: { item: typeof fixers[0] }) => (
    <FixerCard
      fixer={item}
      onPress={() => handleFixerPress(item.id)}
    />
  ), [handleFixerPress]);

  if (!category) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            Category not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: category.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <MapPin size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Filter size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${category.name.toLowerCase()} fixers...`}
            onVoiceSearch={() => console.log('Voice search')}
          />
        </View>
        
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: colors.text }]}>
            {filteredFixers.length} {filteredFixers.length === 1 ? 'fixer' : 'fixers'} found
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={[styles.sortText, { color: colors.primary }]}>
              Sort by rating
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredFixers}
          renderItem={renderFixer}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No fixers found for "{category.name}"
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Try adjusting your search or check back later
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: Theme.fontSize.l,
  },
  content: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: Theme.spacing.m,
  },
  searchContainer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.m,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.m,
  },
  resultsCount: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
  },
  sortButton: {
    paddingVertical: Theme.spacing.xs,
  },
  sortText: {
    fontSize: Theme.fontSize.s,
    fontWeight: '500' as any,
  },
  listContainer: {
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.l,
    fontWeight: '500' as any,
    marginBottom: Theme.spacing.s,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.m,
    textAlign: 'center',
  },
});