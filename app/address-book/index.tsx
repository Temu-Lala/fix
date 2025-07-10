import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, MapPin, Star } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import { useAddressStore } from '@/store/addressStore';
import Button from '@/components/Button';
import Theme from '@/constants/theme';

export default function AddressBookScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { addresses, deleteAddress, setDefaultAddress } = useAddressStore();

  const handleAddAddress = () => {
    router.push('/address-book/add');
  };

  const handleEditAddress = (addressId: string) => {
    router.push(`/address-book/edit/${addressId}`);
  };

  const renderAddressItem = ({ item }: { item: typeof addresses[0] }) => (
    <TouchableOpacity 
      style={[styles.addressCard, { backgroundColor: colors.card }]}
      onPress={() => handleEditAddress(item.id)}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleContainer}>
          <MapPin size={20} color={colors.primary} />
          <Text style={[styles.addressName, { color: colors.text }]}>
            {item.name}
          </Text>
          {item.isDefault && (
            <Star size={16} color={colors.warning} fill={colors.warning} />
          )}
        </View>
      </View>
      
      <Text style={[styles.addressText, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.address}
      </Text>
      
      <View style={styles.addressActions}>
        {!item.isDefault && (
          <TouchableOpacity 
            onPress={() => setDefaultAddress(item.id)}
            style={styles.actionButton}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Set Default
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          onPress={() => deleteAddress(item.id)}
          style={styles.actionButton}
        >
          <Text style={[styles.actionButtonText, { color: colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: t('addressBook'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      
      <View style={styles.content}>
        <Button
          title="Add New Address"
          onPress={handleAddAddress}
          icon={<Plus size={20} color="white" />}
          style={styles.addButton}
        />
        
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No addresses saved yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Add your first address to get started
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
    padding: Theme.spacing.xl,
  },
  addButton: {
    marginBottom: Theme.spacing.l,
  },
  addressCard: {
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.m,
    marginBottom: Theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  addressHeader: {
    marginBottom: Theme.spacing.s,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
    marginLeft: Theme.spacing.s,
    marginRight: Theme.spacing.s,
  },
  addressText: {
    fontSize: Theme.fontSize.s,
    lineHeight: 20,
    marginBottom: Theme.spacing.m,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: Theme.spacing.m,
  },
  actionButtonText: {
    fontSize: Theme.fontSize.s,
    fontWeight: Theme.fontWeight.medium,
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
