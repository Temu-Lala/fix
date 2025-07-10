import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, MapPin, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';
import SearchBar from '@/components/SearchBar';
import FixerCard from '@/components/FixerCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fixers } from '@/mocks/fixers';

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'price'>('rating');
  
  const filteredFixers = fixers.filter(fixer =>
    fixer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fixer.services?.some(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    fixer.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFixers = [...filteredFixers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      case 'price':
        // Sort by minimum service price
        const aMinPrice = Math.min(...(a.services?.map(s => parseFloat(s.price.replace(/[^0-9.]/g, ''))) || [0]));
        const bMinPrice = Math.min(...(b.services?.map(s => parseFloat(s.price.replace(/[^0-9.]/g, ''))) || [0]));
        return aMinPrice - bMinPrice;
      default:
        return 0;
    }
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const renderFixer = useCallback(({ item }: { item: typeof fixers[0] }) => (
    <FixerCard
      fixer={item}
      onPress={() => console.log('Fixer pressed:', item.id)}
    />
  ), []);

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
          title: 'Search Results',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <MapPin size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <SlidersHorizontal size={20} color={colors.primary} />
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
            placeholder="Search fixers, services..."
            onVoiceSearch={() => console.log('Voice search')}
          />
        </View>
        
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: colors.text }]}>
            {sortedFixers.length} {sortedFixers.length === 1 ? 'result' : 'results'} found
          </Text>
          
          <View style={styles.sortContainer}>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'rating' && { backgroundColor: colors.primary }]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.sortText, { color: sortBy === 'rating' ? 'white' : colors.primary }]}>
                Rating
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'distance' && { backgroundColor: colors.primary }]}
              onPress={() => setSortBy('distance')}
            >
              <Text style={[styles.sortText, { color: sortBy === 'distance' ? 'white' : colors.primary }]}>
                Distance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'price' && { backgroundColor: colors.primary }]}
              onPress={() => setSortBy('price')}
            >
              <Text style={[styles.sortText, { color: sortBy === 'price' ? 'white' : colors.primary }]}>
                Price
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <FlatList
          data={sortedFixers}
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
                No results found for "{searchQuery}"
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Try adjusting your search terms or browse categories
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
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.m,
  },
  resultsCount: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
    marginBottom: Theme.spacing.m,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.s,
  },
  sortButton: {
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: 'transparent',
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