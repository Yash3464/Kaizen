import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useStore } from '../store/useStore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { setUser, isLoading, setIsLoading } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // In a real app, fetch full profile from Firestore here
        setUser({
          uid: user.uid,
          email: user.email || '',
          username: user.displayName || 'User',
          avatarEmoji: '👤',
          level: 1,
          xp: 0
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
        <ActivityIndicator size="large" color="#00D4FF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
