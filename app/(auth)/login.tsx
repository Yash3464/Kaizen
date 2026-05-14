import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useStore();

  const handleLogin = () => {
    // Mock login for now
    setUser({
      uid: 'user123',
      email: 'user@example.com',
      username: 'HabitHero',
      avatarEmoji: '🦸‍♂️',
      level: 2,
      xp: 150
    });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kaizen</Text>
        <Text style={styles.subtitle}>Build habits that stick.</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0A0B0"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0B0"
            secureTextEntry
          />
          
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>

          <Pressable style={styles.googleButton} onPress={handleLogin}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter',
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#A0A0B0',
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
  },
  button: {
    backgroundColor: '#7B2FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#0A0A0F',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  }
});
