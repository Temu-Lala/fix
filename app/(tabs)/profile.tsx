import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  CreditCard, 
  MapPin, 
  Heart, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Wrench
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { useFixerApplicationStore } from '@/store/fixerApplicationStore';
import Theme from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { applicationStatus } = useFixerApplicationStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const handleApplyAsFixer = () => {
    router.push('/fixer-application');
  };

  const handleApplyAsSeller = () => {
    router.push('/seller-application');
  };

  const menuItems = [
    {
      icon: <Settings size={24} color={colors.text} />,
      title: t('settings'),
      onPress: () => router.push('/settings'),
    },
    {
      icon: <CreditCard size={24} color={colors.text} />,
      title: t('paymentMethods'),
      onPress: () => router.push('/payment-methods'),
    },
    {
      icon: <MapPin size={24} color={colors.text} />,
      title: t('addressBook'),
      onPress: () => router.push('/address-book'),
    },
    {
      icon: <Heart size={24} color={colors.text} />,
      title: t('savedFixers'),
      onPress: () => router.push('/saved-fixers'),
    },
    {
      icon: <HelpCircle size={24} color={colors.text} />,
      title: t('helpSupport'),
      onPress: () => router.push('/help-support'),
    },
  ];

  const getApplicationStatusText = () => {
    switch (applicationStatus) {
      case 'pending':
        return t('applicationPending');
      case 'approved':
        return t('applicationApproved');
      case 'rejected':
        return t('applicationRejected');
      default:
        return t('applyAsFixer');
    }
  };

  const getApplicationStatusColor = () => {
    switch (applicationStatus) {
      case 'pending':
        return colors.warning;
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('profile')}</Text>
        </View>
        
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Image 
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36' }} 
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.name || 'Guest User'}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>
              {user?.email || 'guest@example.com'}
            </Text>
          </View>
          <Button 
            title="Edit" 
            onPress={() => router.push('/edit-profile')} 
            variant="outline"
            size="small"
          />
        </View>
        {/* Apply as Seller Section */}
        <TouchableOpacity style={[styles.applySellerBtn, { backgroundColor: colors.primary }]} onPress={handleApplyAsSeller} activeOpacity={0.85}>
          <Text style={styles.applySellerBtnText}>Apply as Seller</Text>
        </TouchableOpacity>
        {/* Apply as Fixer Section */}
        <View style={[styles.fixerApplicationCard, { backgroundColor: colors.card }]}>
          <View style={styles.fixerApplicationHeader}>
            <Wrench size={24} color={getApplicationStatusColor()} />
            <Text style={[styles.fixerApplicationTitle, { color: colors.text }]}>
              {t('becomeAFixer')}
            </Text>
          </View>
          <Text style={[styles.fixerApplicationDescription, { color: colors.textSecondary }]}>
            {applicationStatus === 'none' 
              ? t('fixerApplicationDescription')
              : t('applicationStatusDescription')
            }
          </Text>
          <Button
            title={getApplicationStatusText()}
            onPress={handleApplyAsFixer}
            disabled={applicationStatus === 'pending' || applicationStatus === 'approved'}
            style={{
              ...styles.fixerApplicationButton,
              backgroundColor: getApplicationStatusColor(),
            }}
          />
        </View>
        
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomColor: colors.border }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card }]}
          onPress={handleLogout}
        >
          <LogOut size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            {t('logout')}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          {t('version')} 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.l,
    paddingBottom: Theme.spacing.m,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '700' as any,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Theme.spacing.m,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600' as any,
    marginBottom: Theme.spacing.xs,
  },
  email: {
    fontSize: Theme.fontSize.s,
  },
  fixerApplicationCard: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  fixerApplicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.s,
  },
  fixerApplicationTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: '600' as any,
    marginLeft: Theme.spacing.s,
  },
  fixerApplicationDescription: {
    fontSize: Theme.fontSize.s,
    lineHeight: 20,
    marginBottom: Theme.spacing.m,
  },
  fixerApplicationButton: {
    marginTop: Theme.spacing.s,
  },
  menuContainer: {
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.l,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: Theme.fontSize.m,
    marginLeft: Theme.spacing.m,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.l,
    borderRadius: Theme.borderRadius.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutText: {
    fontSize: Theme.fontSize.m,
    fontWeight: '500' as any,
    marginLeft: Theme.spacing.m,
  },
  versionText: {
    fontSize: Theme.fontSize.xs,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  applySellerBtn: {
    marginTop: 18,
    marginHorizontal: 24,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#4A80F0',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  applySellerBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});