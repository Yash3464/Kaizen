import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { CreateChallengeModal } from '../../components/CreateChallengeModal';

export default function ChallengesScreen() {
  const router = useRouter();
  const { challenges } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <Pressable style={styles.addBtn} onPress={() => setShowCreateModal(true)}>
          <Plus color="#FFF" size={24} />
        </Pressable>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {challenges.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.placeholder}>Join a group challenge to compete with friends!</Text>
            <Pressable style={styles.createBtn} onPress={() => setShowCreateModal(true)}>
              <Text style={styles.createBtnText}>Create Challenge</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {challenges.map(challenge => (
              <Pressable 
                key={challenge.id} 
                style={styles.card}
                onPress={() => router.push(`/challenge/${challenge.id}`)}
              >
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{challenge.name}</Text>
                  <View style={styles.participantsRow}>
                    <Users color="#A0A0B0" size={16} />
                    <Text style={styles.participantsText}>
                      {challenge.participants.length} friends
                    </Text>
                  </View>
                </View>
                <ChevronRight color="#606070" size={24} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <CreateChallengeModal 
        visible={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '800',
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A24',
    borderWidth: 1,
    borderColor: '#2A2A35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#A0A0B0',
    fontSize: 16,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 24,
  },
  createBtn: {
    backgroundColor: '#7B2FFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  list: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A24',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7B2FFF',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '700',
    marginBottom: 8,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  participantsText: {
    color: '#A0A0B0',
    fontSize: 14,
    fontFamily: 'Inter',
  }
});
