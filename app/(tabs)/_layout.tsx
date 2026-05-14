import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Users, Trophy, BarChart2, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 80,
        },
        tabBarBackground: () => (
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: '#00D4FF',
        tabBarInactiveTintColor: '#A0A0B0',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color, size }) => <Users color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
