import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, Platform.OS === 'android' ? 1500 : 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <LinearGradient
      colors={[Colors.light.primary, Colors.light.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>TAB</Text>
          <Text style={styles.logoAccent}>Fix</Text>
        </View>
        <Text style={styles.tagline}>Get it fixed fast, by trusted locals.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.m,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700' as any,
    color: 'white',
  },
  logoAccent: {
    fontSize: 48,
    fontWeight: '700' as any,
    color: Colors.light.secondary,
  },
  tagline: {
    fontSize: Theme.fontSize.l,
    color: 'white',
    textAlign: 'center',
    marginTop: Theme.spacing.m,
  },
});