import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.title}>Welcome to Kaizen</Text>
        <Text style={styles.subtitle}>Let's build some powerful habits.</Text>
      </View>
      <View style={styles.footer}>
        <Pressable 
          style={styles.button} 
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontFamily: 'Inter',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#A0A0B0',
    fontSize: 18,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#7B2FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '600',
  }
});
