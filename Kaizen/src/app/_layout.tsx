import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppProvider, useApp } from '@/context/AppContext';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { AuthScreen } from '@/components/auth-screen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const BeigeTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B5945F',
    background: '#FAF6EE',
    card: '#FAF6EE',
    text: '#2D2820',
    border: '#E8DFCE',
    notification: '#B5945F',
  },
};

function RootLayoutContent() {
  const { isAuthenticated, isLoading } = useApp();

  // Show neutral loading screen while Supabase resolves the session
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B5945F" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <ThemeProvider value={BeigeTheme}>
      <AnimatedSplashOverlay />
      <CelebrationOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAF6EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function TabLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
