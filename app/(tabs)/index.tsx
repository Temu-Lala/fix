import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, Camera, BookOpen } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import FixerCard from '@/components/FixerCard';
import FixerCardSkeleton from '@/components/FixerCardSkeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import { categories } from '@/mocks/categories';
import { fixers } from '@/mocks/fixers';
import { useAuthStore } from '@/store/authStore';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fixersLoading, setFixersLoading] = useState(true);
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
      setFixersLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFixersLoading(true);
    
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRefreshing(false);
    setFixersLoading(false);
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    router.push(`/category/${categoryId}`);
  }, [router]);

  const handleFixerPress = useCallback((fixerId: string) => {
    router.push(`/fixer/${fixerId}`);
  }, [router]);

  const handleBookPress = useCallback(() => {
    router.push('/booking/new');
  }, [router]);

  const handleVideoHelpPress = useCallback(() => {
    console.log('Video help pressed');
  }, []);

  const handleDIYPress = useCallback(() => {
    console.log('DIY tutorials pressed');
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      router.push({
        pathname: '/search',
        params: { q: query }
      });
    }
  }, [router]);

  const renderCategory = useCallback(({ item }: { item: typeof categories[0] }) => (
    <CategoryCard
      category={item}
      onPress={() => handleCategoryPress(item.id)}
    />
  ), [handleCategoryPress]);

  const renderFixerSkeleton = useCallback(() => (
    <FixerCardSkeleton />
  ), []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        removeClippedSubviews={Platform.OS === 'android'}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {t('greeting')}, {user?.name || 'there'}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('subtitle')}
            </Text>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchPlaceholder')}
            onVoiceSearch={() => console.log('Voice search')}
          />
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleBookPress}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <Camera size={24} color="white" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>
              {t('bookAFix')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleVideoHelpPress}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
              <Video size={24} color="white" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>
              {t('videoHelp')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDIYPress}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
              <BookOpen size={24} color="white" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>
              {t('diyGuides')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('categories')}
          </Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            removeClippedSubviews={Platform.OS === 'android'}
            maxToRenderPerBatch={5}
            windowSize={10}
            getItemLayout={(data, index) => ({
              length: 90,
              offset: 90 * index,
              index,
            })}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('featuredFixers')}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                {t('seeAll')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {fixersLoading ? (
            <>
              {[1, 2, 3].map((item) => (
                <FixerCardSkeleton key={item} />
              ))}
            </>
          ) : (
            fixers.map((fixer) => (
              <FixerCard
                key={fixer.id}
                fixer={fixer}
                onPress={() => handleFixerPress(fixer.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.l,
    paddingBottom: Theme.spacing.m,
  },
  greeting: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700' as any,
  },
  subtitle: {
    fontSize: Theme.fontSize.m,
    marginTop: Theme.spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.l,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.s,
  },
  actionText: {
    fontSize: Theme.fontSize.s,
    fontWeight: '500' as any,
  },
  sectionContainer: {
    marginBottom: Theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.m,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600' as any,
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.m,
  },
  categoriesContainer: {
    paddingHorizontal: Theme.spacing.l,
  },
  seeAllText: {
    fontSize: Theme.fontSize.s,
    fontWeight: '500' as any,
  },
});