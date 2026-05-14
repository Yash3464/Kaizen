import { Redirect } from 'expo-router';
import { useStore } from '../store/useStore';

export default function Index() {
  const { user } = useStore();
  
  if (user) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
