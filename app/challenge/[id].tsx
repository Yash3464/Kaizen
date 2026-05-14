import React from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trophy, Flame } from 'lucide-react-native';
import { useStore } from '../../store/useStore';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { challenges, user } = useStore();

  const challenge = challenges.find(c => c.id === id);

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#FFF" size={24} />
          </Pressable>
          <Text style={styles.title}>Not Found</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.placeholder}>This challenge does not exist.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Include user in participants for leaderboard if user is implicitly participating
  // For now, we will just show the friends in the challenge and mock user if needed.
  // We'll create a combined array of all participants
  const allParticipants = [
    {
      id: user?.uid || 'user',
      username: user?.username || 'You',
      emoji: user?.avatarEmoji || '👤',
      stats: { habitsCompleted: 15, currentStreak: 3 } // Mock user stats
    },
    ...challenge.participants
  ].sort((a, b) => (b.stats?.habitsCompleted || 0) - (a.stats?.habitsCompleted || 0));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </Pressable>
        <Text style={styles.title}>{challenge.name}</Text>
        <View style={styles.placeholderBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Challenge Leaderboard</Text>
          <Text style={styles.statsSubtitle}>Based on total habits completed</Text>
        </View>

        <View style={styles.leaderboard}>
          {allParticipants.map((p, index) => (
            <View key={p.id} style={[styles.participantRow, index === 0 && styles.firstPlace]}>
              <View style={styles.rankCol}>
                {index === 0 ? (
                  <Trophy color="#FFD600" size={20} />
                ) : (
                  <Text style={styles.rankText}>{index + 1}</Text>
                )}
              </View>
              
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.emoji}>{p.emoji}</Text>
                </View>
                <Text style={styles.username}>{p.username}</Text>
              </View>

              <View style={styles.userStats}>
                <View style={styles.statBadge}>
                  <Text style={styles.statValue}>{p.stats?.habitsCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={[styles.statBadge, styles.streakBadge]}>
                  <Flame color="#FF9500" size={12} style={styles.streakIcon} />
                  <Text style={styles.streakValue}>{p.stats?.currentStreak || 0}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A24',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBtn: {
    width: 40,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 24,
  },
  placeholder: {
    color: '#A0A0B0',
    fontSize: 16,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 24,
  },
  statsTitle: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '800',
    marginBottom: 4,
  },
  statsSubtitle: {
    color: '#A0A0B0',
    fontSize: 14,
    fontFamily: 'Inter',
  },
  leaderboard: {
    gap: 12,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A24',
    padding: 16,
    borderRadius: 16,
  },
  firstPlace: {
    borderWidth: 1,
    borderColor: '#FFD600',
    backgroundColor: '#FFD60010',
  },
  rankCol: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    color: '#A0A0B0',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  username: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  userStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF950020',
  },
  streakIcon: {
    marginRight: 2,
  },
  statValue: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  streakValue: {
    color: '#FF9500',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  statLabel: {
    color: '#606070',
    fontSize: 10,
    fontFamily: 'Inter',
    textTransform: 'uppercase',
  }
});
