import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

const { width } = Dimensions.get('window');

export function AuthScreen() {
  const { login, signUp } = useApp();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  
  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  
  // Status feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isLogin) {
      const res = login(email, password);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
      }
    } else {
      const res = signUp(name, username, email, password);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Glow Blobs */}
        <View style={[styles.glowBlob, { backgroundColor: '#F3EAD8', top: -100, right: -50 }]} />
        <View style={[styles.glowBlob, { backgroundColor: '#EADFC9', bottom: -100, left: -50 }]} />

        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Sparkles size={28} color="#B5945F" />
          </View>
          <Text style={styles.brandTitle}>KAIZEN</Text>
          <Text style={styles.brandSubtitle}>Forge your ultimate self-improvement rhythm</Text>
        </View>

        {/* Auth Beige Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.cardSubtitle}>
            {isLogin ? 'Sign in to access your squad feed' : 'Register to start tracking habits with friends'}
          </Text>

          {/* Error Message */}
          {errorMsg && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Inputs */}
          {!isLogin && (
            <>
              {/* Full Name */}
              <View style={styles.inputContainer}>
                <User size={18} color="#7A7265" style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#7A7265"
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Username */}
              <View style={styles.inputContainer}>
                <Text style={styles.atSymbol}>@</Text>
                <TextInput
                  placeholder="username"
                  placeholderTextColor="#7A7265"
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </>
          )}

          {/* Email */}
          <View style={styles.inputContainer}>
            <Mail size={18} color="#7A7265" style={styles.inputIcon} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#7A7265"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Lock size={18} color="#7A7265" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#7A7265"
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Submit Button */}
          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </Pressable>

          {/* Toggle Link */}
          <Pressable style={styles.toggleLink} onPress={() => {
            setIsLogin(!isLogin);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.toggleHighlight}>{isLogin ? 'Register' : 'Log In'}</Text>
            </Text>
          </Pressable>
        </View>

        {/* Trust Badge */}
        <View style={styles.footerBadge}>
          <ShieldCheck size={14} color="#7A7265" />
          <Text style={styles.footerBadgeText}>Secure accountability connection</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    position: 'relative',
  },
  glowBlob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3EAD8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8DFCE',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D2820',
    letterSpacing: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#7A7265',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    padding: 24,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2820',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#7A7265',
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  atSymbol: {
    fontSize: 16,
    color: '#7A7265',
    fontWeight: '600',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#2D2820',
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B5945F',
    borderRadius: 14,
    height: 50,
    gap: 8,
    marginTop: 10,
    shadowColor: '#B5945F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  toggleLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    fontSize: 13,
    color: '#7A7265',
  },
  toggleHighlight: {
    color: '#B5945F',
    fontWeight: '600',
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 6,
  },
  footerBadgeText: {
    fontSize: 12,
    color: '#7A7265',
  },
});
