import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppProvider, useApp } from '@/context/AppContext';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { AuthScreen } from '@/components/auth-screen';

const BeigeTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B5945F', // Muted Gold Accent
    background: '#FAF6EE', // Serene beige
    card: '#FAF6EE', // Tab bar background
    text: '#2D2820', // Soft graphite
    border: '#E8DFCE', // Subtle beige borders
    notification: '#B5945F',
  },
};

function RootLayoutContent() {
  const { isAuthenticated } = useApp();

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

export default function TabLayout() {
  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}
