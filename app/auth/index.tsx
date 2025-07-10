import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleAuth = async () => {
    if (isLogin) {
      await login(email, password);
    } else {
      await register(name, email, password);
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
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                leftIcon={<User size={20} color={Colors.light.textSecondary} />}
              />
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
            
            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
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
              title={`Sign in with Google`}
              onPress={() => {}}
              variant="outline"
              style={styles.socialButton}
            />
            
            <Button
              title={`Sign in with Apple`}
              onPress={() => {}}
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