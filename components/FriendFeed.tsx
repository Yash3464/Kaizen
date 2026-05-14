import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

interface FriendFeedProps {
  friends: { id: string, username: string, emoji: string }[];
  posts: { id: string, username: string, emoji: string, habitName: string, habitEmoji: string, time: string }[];
}

export const FriendFeed: React.FC<FriendFeedProps> = ({ friends, posts }) => {
  return (
    <View style={styles.container}>
      {/* Friends Horizontal List */}
      <View style={styles.friendsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.friendsScroll}>
          {friends.map(friend => (
            <View key={friend.id} style={styles.friendAvatar}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{friend.emoji}</Text>
              </View>
              <Text style={styles.friendName}>{friend.username}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Posts Vertical List */}
      <View style={styles.postsContainer}>
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text>{post.emoji}</Text>
              </View>
              <View>
                <Text style={styles.postUsername}>{post.username}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            <Text style={styles.postText}>
              Completed <Text style={styles.highlight}>{post.habitEmoji} {post.habitName}</Text>! 🔥
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  friendsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A24',
  },
  friendsScroll: {
    paddingHorizontal: 16,
  },
  friendAvatar: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7B2FFF',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  friendName: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter',
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#1A1A24',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postUsername: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  postTime: {
    color: '#A0A0B0',
    fontSize: 12,
    fontFamily: 'Inter',
    marginTop: 2,
  },
  postText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontFamily: 'Inter',
    lineHeight: 20,
  },
  highlight: {
    color: '#00D4FF',
    fontWeight: '600',
  }
});
