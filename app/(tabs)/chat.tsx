import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Video } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';
import Input from '@/components/Input';
import OptimizedImage from '@/components/OptimizedImage';
import { fixers } from '@/mocks/fixers';

// Mock chat data
const chats = fixers.map(fixer => ({
  id: fixer.id,
  name: fixer.name,
  avatar: fixer.avatar,
  lastMessage: "Hi there! How can I help you today?",
  timestamp: "10:30 AM",
  unread: Math.random() > 0.5 ? 1 : 0,
}));

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = useCallback((chatId: string) => {
    router.push(`/chat/${chatId}`);
  }, [router]);

  const renderChatItem = useCallback(({ item }: { item: typeof chats[0] }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id)}
      activeOpacity={0.7}
    >
      <OptimizedImage 
        source={{ uri: item.avatar }} 
        style={styles.avatar}
      />
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {item.timestamp}
          </Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text 
            style={[
              styles.lastMessage,
              { color: colors.textSecondary },
              item.unread > 0 && [styles.unreadMessage, { color: colors.text }]
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ), [handleChatPress, colors]);

  const keyExtractor = useCallback((item: typeof chats[0]) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80, // Approximate height of chat item
    offset: 80 * index,
    index,
  }), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <TouchableOpacity 
          style={[styles.videoButton, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
        >
          <Video size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search conversations"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.textSecondary} />}
          containerStyle={styles.searchInput}
        />
      </View>
      
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={15}
        windowSize={10}
        getItemLayout={getItemLayout}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No conversations found
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.l,
    paddingBottom: Theme.spacing.m,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '700' as any,
  },
  videoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.l,
  },
  searchInput: {
    marginBottom: 0,
  },
  chatList: {
    paddingHorizontal: Theme.spacing.xl,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: Theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Theme.spacing.m,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xs,
  },
  name: {
    fontSize: Theme.fontSize.m,
    fontWeight: '600' as any,
  },
  timestamp: {
    fontSize: Theme.fontSize.xs,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: Theme.fontSize.s,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600' as any,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.s,
  },
  unreadCount: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700' as any,
    color: 'white',
  },
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Theme.fontSize.m,
    textAlign: 'center',
  },
});