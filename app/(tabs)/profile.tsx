import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const { user, setUser } = useStore();

  const handleLogout = async () => {
    // try { await signOut(auth); } catch(e) {}
    setUser(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{user?.avatarEmoji || '👤'}</Text>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.level}>Level {user?.level || 1} • {user?.xp || 0} XP</Text>
        
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
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
  header: {
    padding: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '800',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7B2FFF',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 48,
  },
  username: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '700',
    marginBottom: 4,
  },
  level: {
    color: '#00D4FF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginBottom: 32,
  },
  logoutBtn: {
    backgroundColor: '#1A1A24',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: '#FF1744',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  }
});
