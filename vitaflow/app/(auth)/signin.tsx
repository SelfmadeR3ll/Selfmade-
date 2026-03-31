import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmail, signUpWithEmail } from '../../lib/supabase';
import { useUserStore } from '../../stores/userStore';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const { setAuthenticated, hasCompletedOnboarding } = useUserStore();

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      setAuthenticated(true);
      router.replace(hasCompletedOnboarding ? '/(tabs)/home' : '/(auth)/onboard');
    } catch (err: unknown) {
      // Demo mode: allow any credentials if Supabase isn't configured
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('fetch') || message.includes('network') || !process.env.EXPO_PUBLIC_SUPABASE_URL) {
        setAuthenticated(true);
        router.replace(hasCompletedOnboarding ? '/(tabs)/home' : '/(auth)/onboard');
      } else {
        Alert.alert('Auth Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    setAuthenticated(true);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoRow}>
            <LinearGradient
              colors={['#00C896', '#7C5CFC']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoLetter}>V</Text>
            </LinearGradient>
            <Text style={styles.appName}>VitaFlow</Text>
          </View>

          <Text style={styles.title}>{isSignUp ? 'Create account' : 'Welcome back'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Start your health + money journey'
              : 'Sign in to continue your journey'}
          </Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={8}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {!isSignUp && (
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <GradientButton
            title={loading ? '' : isSignUp ? 'Create Account' : 'Sign In'}
            onPress={handleAuth}
            loading={loading}
            style={{ marginTop: Spacing.md }}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* SSO Buttons */}
          <TouchableOpacity style={styles.ssoBtn}>
            <Text style={styles.ssoBtnText}>🍎  Continue with Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ssoBtn}>
            <Text style={styles.ssoBtnText}>🔵  Continue with Google</Text>
          </TouchableOpacity>

          {/* Demo mode */}
          <TouchableOpacity onPress={handleDemoMode} style={styles.demoBtn}>
            <Text style={styles.demoText}>Try demo mode (no account needed)</Text>
          </TouchableOpacity>

          {/* Toggle sign in / sign up */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account? ' : 'New to VitaFlow? '}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleLink}>{isSignUp ? 'Sign in' : 'Get started'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, padding: Spacing.lg, paddingBottom: Spacing.xxl },
  backBtn: { marginBottom: Spacing.xl, alignSelf: 'flex-start' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  logoGradient: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { fontSize: 22, fontWeight: '900', color: '#fff' },
  appName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  title: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.xl },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 8, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  inputIcon: { paddingLeft: Spacing.md },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  eyeBtn: { paddingRight: Spacing.md },
  forgotRow: { alignItems: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.sm },
  forgotText: { color: Colors.primary, fontSize: FontSize.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, fontSize: FontSize.sm },
  ssoBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  ssoBtnText: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '500' },
  demoBtn: { alignItems: 'center', marginTop: Spacing.md },
  demoText: { color: Colors.primary, fontSize: FontSize.sm, textDecorationLine: 'underline' },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  toggleText: { color: Colors.textSecondary, fontSize: FontSize.md },
  toggleLink: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
});
