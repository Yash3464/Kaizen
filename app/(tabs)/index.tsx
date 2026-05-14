import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitCard } from '../../components/HabitCard';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useStore, DayStatus, Habit } from '../../store/useStore';
import { Plus } from 'lucide-react-native';
import { AddHabitModal } from '../../components/AddHabitModal';
import { ReasonModal } from '../../components/ReasonModal';
import { StatusSelectionModal } from '../../components/StatusSelectionModal';

export default function HomeScreen() {
  const { user, habits, addHabit, updateHabitDayStatus } = useStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Modals State
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const [pendingSelection, setPendingSelection] = useState<{ habitId: string, dateStr: string, habitName: string } | null>(null);

  const handleQuickCheckIn = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    updateHabitDayStatus(id, todayStr, 'completed');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleDayPress = (habitId: string, habitName: string, dateStr: string) => {
    setPendingSelection({ habitId, dateStr, habitName });
    setShowStatusModal(true);
  };

  const handleStatusSelect = (status: DayStatus) => {
    if (!pendingSelection) return;
    
    if (status === 'other') {
      setShowStatusModal(false);
      // Wait for Status Modal to dismiss before showing Reason Modal to prevent UI glitch
      setTimeout(() => setShowReasonModal(true), 150);
    } else {
      updateHabitDayStatus(pendingSelection.habitId, pendingSelection.dateStr, status);
      if (status === 'completed') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setShowStatusModal(false);
    }
  };

  const handleReasonSubmit = (reason: string) => {
    if (pendingSelection) {
      updateHabitDayStatus(pendingSelection.habitId, pendingSelection.dateStr, 'other', reason);
    }
    setShowReasonModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello {user?.username || 'Guest'}</Text>
            <Text style={styles.date}>Today</Text>
          </View>
          <Pressable style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Plus color="#FFF" size={24} />
          </Pressable>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyDesc}>Start building a better you by adding your first habit.</Text>
            <Pressable style={styles.createBtn} onPress={() => setShowAddModal(true)}>
              <Text style={styles.createBtnText}>Create Habit</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                onCheckIn={() => handleQuickCheckIn(habit.id)}
                onDayPress={(dateStr) => handleDayPress(habit.id, habit.name, dateStr)}
              />
            ))}
          </View>
        )}
      </ScrollView>
      
      {showConfetti && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <ConfettiCannon count={100} origin={{x: -10, y: 0}} />
        </View>
      )}

      <AddHabitModal 
        visible={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={addHabit}
      />

      <StatusSelectionModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSelect={handleStatusSelect}
        habitName={pendingSelection?.habitName || ''}
        dateStr={pendingSelection?.dateStr || new Date().toISOString().split('T')[0]}
      />

      <ReasonModal
        visible={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onSubmit={handleReasonSubmit}
        habitName={pendingSelection?.habitName || ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scroll: {
    padding: 24,
    paddingBottom: 100, // For tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  greeting: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '800',
  },
  date: {
    color: '#A0A0B0',
    fontSize: 16,
    fontFamily: 'Inter',
    marginTop: 4,
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
  habitsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    color: '#A0A0B0',
    fontSize: 16,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
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
  }
});
