import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { FriendFeed } from '../../components/FriendFeed';

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const friends = [
    { id: '1', username: 'Alex', emoji: '🧑‍🚀' },
    { id: '2', username: 'Sam', emoji: '👩‍🎤' },
    { id: '3', username: 'Jordan', emoji: '🥷' },
  ];

  const posts = [
    { id: 'p1', username: 'Alex', emoji: '🧑‍🚀', habitName: 'Morning Run', habitEmoji: '🏃', time: '2m ago' },
    { id: 'p2', username: 'Sam', emoji: '👩‍🎤', habitName: 'Meditation', habitEmoji: '🧘‍♀️', time: '1h ago' },
  ];

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <View style={styles.searchContainer}>
          <Search color="#606070" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends by username..."
            placeholderTextColor="#606070"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FriendFeed friends={filteredFriends} posts={posts} />
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
    paddingBottom: 0,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '800',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    paddingVertical: 12,
  }
});
