import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Modal } from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');
  const router = useRouter();
  
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // You can now use authentication.accessToken to fetch user info from Google
      // Example: fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${authentication.accessToken}` } })
      // Then log in or register the user in your app
    }
  }, [response]);

  const [telegramVisible, setTelegramVisible] = useState(false);
  const TELEGRAM_BOT = 'YOUR_TELEGRAM_BOT'; // e.g. 'my_bot'
  const TELEGRAM_URL = `https://oauth.telegram.org/auth?bot=${TELEGRAM_BOT}&origin=${encodeURIComponent('https://your-app.com')}&embed=1&request_access=write`;

  const handleTelegramAuth = () => {
    setTelegramVisible(true);
  };

  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotMessage('');
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (forgotEmail.includes('@')) {
      setForgotMessage('If this email is registered, a reset link has been sent.');
    } else {
      setForgotMessage('Please enter a valid email address.');
    }
    setForgotLoading(false);
  };

  const handleAuth = async () => {
    setLocalError('');
    if (!isLogin) {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (!agreed) {
        setLocalError('You must agree to the terms and conditions');
        return;
      }
    }
    if (isLogin) {
      await login(email, password);
    } else {
      await register(name, email, password, phone);
    }
    
    // Navigate to main app if authenticated
    router.replace('/(tabs)');
  };

  const toggleAuthMode = () => {
    clearError();
    setIsLogin(!isLogin);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Sign in to continue fixing things' 
                : 'Sign up to start fixing things'
              }
            </Text>
          </View>
          
          <View style={styles.form}>
            {!isLogin && (
              <>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  leftIcon={<User size={20} color={Colors.light.textSecondary} />}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  leftIcon={<Mail size={20} color={Colors.light.textSecondary} />}
                />
              </>
            )}
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              leftIcon={<Mail size={20} color={Colors.light.textSecondary} />}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Lock size={20} color={Colors.light.textSecondary} />}
            />
            {!isLogin && (
              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Lock size={20} color={Colors.light.textSecondary} />}
              />
            )}
            {!isLogin && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => setAgreed(!agreed)}
                  style={{ width: 24, height: 24, borderWidth: 1, borderColor: Colors.light.primary, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: agreed ? Colors.light.primary : 'transparent' }}
                >
                  {agreed && <View style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: 2 }} />}
                </TouchableOpacity>
                <Text style={{ marginLeft: 8 }}>
                  I agree to the <Text style={{ color: Colors.light.primary, textDecorationLine: 'underline' }}>Terms & Conditions</Text>
                </Text>
              </View>
            )}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword} onPress={() => setForgotVisible(true)}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            
            {(error || localError) && (
              <Text style={styles.errorText}>{error || localError}</Text>
            )}
            
            <Button
              title={isLogin ? 'Login' : 'Register'}
              onPress={handleAuth}
              loading={isLoading}
              style={styles.button}
            />
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <Button
              title="Sign in with Google"
              onPress={() => promptAsync()}
              variant="outline"
              style={styles.socialButton}
            />
            <Button
              title="Sign in with Telegram"
              onPress={handleTelegramAuth}
              variant="outline"
              style={styles.socialButton}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.footerLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={forgotVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setForgotVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0008', // semi-transparent black
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 12,
              width: '85%',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
              Reset Password
            </Text>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
            />
            {forgotMessage ? (
              <Text
                style={{
                  color: forgotMessage.startsWith('If') ? 'green' : 'red',
                  marginBottom: 8,
                }}
              >
                {forgotMessage}
              </Text>
            ) : null}
            <Button
              title={forgotLoading ? 'Sending...' : 'Send Reset Link'}
              onPress={handleForgotPassword}
              disabled={forgotLoading}
              style={{ marginBottom: 8 }}
            />
            <Button title="Close" onPress={() => setForgotVisible(false)} variant="outline" />
          </View>
        </View>
      </Modal>
      <Modal visible={telegramVisible} animationType="slide" onRequestClose={() => setTelegramVisible(false)}>
        <WebView
          source={{ uri: TELEGRAM_URL }}
          onNavigationStateChange={navState => {
            // You need to handle the redirect/callback here
            // For production, set up a backend to verify the Telegram login
            if (navState.url.startsWith('https://your-app.com/telegram-auth-callback')) {
              // Parse user info from navState.url
              setTelegramVisible(false);
              // Log in or register the user in your app
            }
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.spacing.xl,
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.fontSize.xxxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.s,
  },
  subtitle: {
    fontSize: Theme.fontSize.l,
    color: Colors.light.textSecondary,
  },
  form: {
    marginBottom: Theme.spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Theme.spacing.l,
  },
  forgotPasswordText: {
    fontSize: Theme.fontSize.s,
    color: Colors.light.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: Theme.fontSize.s,
    marginBottom: Theme.spacing.m,
  },
  button: {
    marginBottom: Theme.spacing.l,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    marginHorizontal: Theme.spacing.m,
    color: Colors.light.textSecondary,
    fontSize: Theme.fontSize.s,
  },
  socialButton: {
    marginBottom: Theme.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: Theme.spacing.m,
  },
  footerText: {
    fontSize: Theme.fontSize.m,
    color: Colors.light.textSecondary,
  },
  footerLink: {
    fontSize: Theme.fontSize.m,
    color: Colors.light.primary,
    fontWeight: Theme.fontWeight.semiBold,
  },
});