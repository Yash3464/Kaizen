import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image, 
  Modal, 
  TextInput, 
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { 
  Dumbbell, 
  Code, 
  Brain, 
  BookOpen, 
  Flame, 
  Plus, 
  Zap, 
  Check, 
  Sparkles, 
  X, 
  MessageSquare,
  Smile,
  Shield,
  HelpCircle,
  Play
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { habits, user, completeHabit, skipHabit, addHabit } = useApp();
  
  // Local state for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [category, setCategory] = useState<'Physical' | 'Focus' | 'Mind' | 'Growth'>('Focus');
  const [target, setTarget] = useState('30 mins');
  const [reminder, setReminder] = useState('08:00 AM');
  const [visibility, setVisibility] = useState<'Private' | 'Friends' | 'Public'>('Friends');
  
  // Local state for skip action
  const [selectedSkipHabitId, setSelectedSkipHabitId] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState('');

  // Local state for completing action with details
  const [selectedCompleteHabitId, setSelectedCompleteHabitId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('Energized');

  // Compute stats
  const completedTodayCount = habits.filter(h => h.progress >= 1.0).length;
  const totalHabitsCount = habits.length;
  const dailyProgress = totalHabitsCount > 0 ? completedTodayCount / totalHabitsCount : 0;
  
  // SVG Circle calculations
  const size = 70;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - dailyProgress * circumference;

  const handleCreateHabit = () => {
    if (!habitName.trim()) return;
    addHabit({
      name: habitName,
      category,
      icon: getIconNameByCategory(category),
      color: getColorByCategory(category),
      target,
      reminderTime: reminder,
      visibility
    });
    setHabitName('');
    setModalVisible(false);
  };

  const getIconNameByCategory = (cat: string) => {
    switch (cat) {
      case 'Physical': return 'dumbbell';
      case 'Focus': return 'code';
      case 'Mind': return 'brain';
      case 'Growth': return 'book-open';
      default: return 'check';
    }
  };

  const getColorByCategory = (cat: string) => {
    switch (cat) {
      case 'Physical': return '#D4A373'; // Clay Peach
      case 'Focus': return '#B5945F'; // Warm Muted Gold
      case 'Mind': return '#9CA986'; // Sage Olive
      case 'Growth': return '#B39EAE'; // Lavender Wisteria
      default: return '#B5945F';
    }
  };

  const getCategoryIcon = (categoryName: string, color: string, size = 20) => {
    switch (categoryName) {
      case 'Physical': return <Dumbbell color={color} size={size} />;
      case 'Focus': return <Code color={color} size={size} />;
      case 'Mind': return <Brain color={color} size={size} />;
      case 'Growth': return <BookOpen color={color} size={size} />;
      default: return <Sparkles color={color} size={size} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background soft ambient blobs */}
      <View style={[styles.glowBlob, { backgroundColor: '#F3EAD8', top: -100, left: -50 }]} pointerEvents="none" />
      <View style={[styles.glowBlob, { backgroundColor: '#EADFC9', top: 200, right: -100 }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TOP HERO SECTION */}
          <View style={styles.heroSection}>
            <View style={styles.heroLeft}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.username}>{user.name}</Text>
              <Text style={styles.quote}>"Consistency beats talent every single day."</Text>
            </View>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarGlow, { borderColor: user.neonTheme }]} />
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.streakIndicator}>
                <Flame color="#ef4444" size={14} fill="#ef4444" />
                <Text style={styles.streakIndicatorText}>{user.streak}d</Text>
              </View>
            </View>
          </View>

          {/* USER PROGRESS TRACKER */}
          <View style={styles.statsCard}>
            <View style={styles.statsInfo}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>LVL {user.level}</Text>
              </View>
              <Text style={styles.xpText}>{user.xp} / {user.xpToNextLevel} XP</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${(user.xp / user.xpToNextLevel) * 100}%`, backgroundColor: user.neonTheme }]} />
              </View>
              <View style={styles.consistencyStats}>
                <View style={styles.statMini}>
                  <Text style={styles.statMiniLabel}>Consistency</Text>
                  <Text style={styles.statMiniValue}>{user.consistencyScore}%</Text>
                </View>
                <View style={styles.statMini}>
                  <Text style={styles.statMiniLabel}>Completed</Text>
                  <Text style={styles.statMiniValue}>{completedTodayCount}/{totalHabitsCount}</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressRingContainer}>
              <Svg width={size} height={size}>
                <Circle stroke="rgba(255, 255, 255, 0.05)" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
                <Circle stroke={user.neonTheme} fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
              </Svg>
              <View style={styles.progressRingCenter}>
                <Text style={styles.progressRingPercentage}>
                  {Math.round(dailyProgress * 100)}%
                </Text>
              </View>
            </View>
          </View>

          {/* AI NUDGES */}
          <View style={styles.aiNudgeContainer}>
            <View style={styles.aiIconWrapper}>
              <Sparkles color="#10b981" size={16} />
            </View>
            <Text style={styles.aiNudgeText}>
              {dailyProgress === 1 
                ? "Perfect day locked in Rhythm! Rest well and maintain the streak tomorrow." 
                : `You're ${totalHabitsCount - completedTodayCount} habits away from a perfect day. Your workout habit is next.`
              }
            </Text>
          </View>

          {/* TODAY'S HABITS HEADER */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Rituals</Text>
            <Text style={styles.sectionSubtitle}>Tap card to complete or log</Text>
          </View>

          {/* HABITS LIST */}
          <View style={styles.habitsList}>
            {habits.map((habit) => {
              const isCompleted = habit.progress >= 1.0;
              return (
                <View 
                  key={habit.id} 
                  style={[
                    styles.habitCard, 
                    isCompleted && styles.habitCardCompleted,
                    { shadowColor: habit.color }
                  ]}
                >
                  <View style={[styles.habitColorAccent, { backgroundColor: habit.color }]} />
                  
                  <View style={styles.habitCardLeft}>
                    <View style={[styles.habitIconContainer, { backgroundColor: `rgba(${parseInt(habit.color.slice(1,3), 16) || 0}, ${parseInt(habit.color.slice(3,5), 16) || 0}, ${parseInt(habit.color.slice(5,7), 16) || 0}, 0.15)` }]}>
                      {getCategoryIcon(habit.category, habit.color)}
                    </View>
                    <View style={styles.habitDetails}>
                      <Text style={[styles.habitName, isCompleted && styles.habitNameCompleted]}>
                        {habit.name}
                      </Text>
                      <View style={styles.habitMeta}>
                        <Text style={styles.habitTarget}>{habit.target}</Text>
                        <View style={styles.habitDivider} />
                        <Text style={styles.habitTime}>{habit.reminderTime}</Text>
                        {habit.visibility !== 'Friends' && (
                          <>
                            <View style={styles.habitDivider} />
                            <Shield size={10} color="#6b7280" />
                            <Text style={styles.habitTime}>{habit.visibility}</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.habitCardRight}>
                    {/* Streak fire badge */}
                    <View style={styles.habitStreakContainer}>
                      <Flame color={habit.streak > 0 ? '#ef4444' : '#6b7280'} size={14} fill={habit.streak > 0 ? '#ef4444' : 'none'} />
                      <Text style={[styles.habitStreakText, habit.streak > 0 && styles.habitStreakActive]}>
                        {habit.streak}
                      </Text>
                    </View>

                    {/* Completion button */}
                    {isCompleted ? (
                      <View style={[styles.checkmarkCircle, { backgroundColor: habit.color }]}>
                        <Check color="#000" size={14} strokeWidth={3} />
                      </View>
                    ) : (
                      <View style={styles.actionButtons}>
                        <Pressable 
                          style={styles.skipButton}
                          onPress={() => setSelectedSkipHabitId(habit.id)}
                        >
                          <X color="#9ca3af" size={12} />
                        </Pressable>
                        <Pressable 
                          style={[styles.completeButton, { borderColor: habit.color }]}
                          onPress={() => setSelectedCompleteHabitId(habit.id)}
                        >
                          <Check color={habit.color} size={14} strokeWidth={2.5} />
                        </Pressable>
                      </View>
                    )}
                  </View>

                  {/* Completed notes section */}
                  {isCompleted && habit.notes && (
                    <View style={styles.notesSection}>
                      <MessageSquare size={10} color="#9ca3af" />
                      <Text style={styles.notesText}>"{habit.notes}" ({habit.mood})</Text>
                    </View>
                  )}
                  
                  {/* Missed reasons section */}
                  {habit.missedReason && (
                    <View style={styles.notesSection}>
                      <HelpCircle size={10} color="#f87171" />
                      <Text style={[styles.notesText, { color: '#f87171' }]}>Skipped: "{habit.missedReason}"</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* BOTTOM MARGIN FOR FLOATING BTN */}
          <View style={{ height: 75 }} />

        </ScrollView>
      </SafeAreaView>

      {/* FLOATING ACTION BUTTON */}
      <Pressable 
        style={[styles.fab, { backgroundColor: user.neonTheme }]} 
        onPress={() => setModalVisible(true)}
      >
        <Plus color="#ffffff" size={28} strokeWidth={2.5} />
      </Pressable>

      {/* CREATE HABIT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Initiate New Ritual</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X color="#ffffff" size={20} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Ritual Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Cold Plunge, Read 20 mins..."
              placeholderTextColor="#6b7280"
              value={habitName}
              onChangeText={setHabitName}
            />

            <Text style={styles.inputLabel}>Ritual Core Category</Text>
            <View style={styles.categorySelectors}>
              {(['Physical', 'Focus', 'Mind', 'Growth'] as const).map((cat) => {
                const color = getColorByCategory(cat);
                const isSelected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryCard,
                      isSelected && { borderColor: color, backgroundColor: 'rgba(255,255,255,0.05)' }
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    {getCategoryIcon(cat, isSelected ? color : '#9ca3af', 18)}
                    <Text style={[styles.categoryText, isSelected && { color: color, fontWeight: '700' }]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.inputRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>Daily Goal / Target</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 45 mins, 5km"
                  placeholderTextColor="#6b7280"
                  value={target}
                  onChangeText={setTarget}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>Reminder Time</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 08:00 AM"
                  placeholderTextColor="#6b7280"
                  value={reminder}
                  onChangeText={setReminder}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Privacy & Accountability</Text>
            <View style={styles.privacySelectors}>
              {(['Private', 'Friends', 'Public'] as const).map((priv) => {
                const isSelected = visibility === priv;
                return (
                  <Pressable
                    key={priv}
                    style={[
                      styles.privacyCard,
                      isSelected && styles.privacyCardSelected
                    ]}
                    onPress={() => setVisibility(priv)}
                  >
                    <Text style={[styles.privacyCardText, isSelected && styles.privacyCardTextActive]}>
                      {priv}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable 
              style={[styles.createSubmitBtn, { backgroundColor: user.neonTheme }]} 
              onPress={handleCreateHabit}
            >
              <Text style={styles.createSubmitText}>Activate Ritual</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* COMPLETE HABIT FLOW DIALOG */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedCompleteHabitId !== null}
        onRequestClose={() => setSelectedCompleteHabitId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.logDialogContent]}>
            <Text style={styles.modalTitle}>Reflect on Ritual Completion</Text>
            <Text style={styles.dialogSubtitle}>Write a reflection and capture your current vibe</Text>

            <Text style={styles.inputLabel}>Reflection Note</Text>
            <TextInput
              style={[styles.textInput, { height: 60 }]}
              placeholder="How did it feel? (e.g., New personal record, feeling focused...)"
              placeholderTextColor="#6b7280"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <Text style={styles.inputLabel}>Current Vibe / Mood</Text>
            <View style={styles.moodSelector}>
              {['Energized', 'Calm', 'Focused', 'Tired'].map((m) => {
                const isSelected = mood === m;
                return (
                  <Pressable 
                    key={m} 
                    style={[styles.moodBtn, isSelected && styles.moodBtnSelected]} 
                    onPress={() => setMood(m)}
                  >
                    <Text style={[styles.moodBtnText, isSelected && styles.moodBtnTextSelected]}>
                      {m}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.dialogActions}>
              <Pressable 
                style={styles.cancelDialogBtn} 
                onPress={() => {
                  setSelectedCompleteHabitId(null);
                  setNotes('');
                }}
              >
                <Text style={styles.cancelDialogText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.confirmDialogBtn, { backgroundColor: '#10b981' }]} 
                onPress={() => {
                  if (selectedCompleteHabitId) {
                    completeHabit(selectedCompleteHabitId, notes, mood);
                    setSelectedCompleteHabitId(null);
                    setNotes('');
                  }
                }}
              >
                <Text style={styles.confirmDialogText}>Log Complete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* SKIP HABIT DIALOG */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedSkipHabitId !== null}
        onRequestClose={() => setSelectedSkipHabitId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.logDialogContent]}>
            <Text style={[styles.modalTitle, { color: '#ef4444' }]}>Skipping Ritual</Text>
            <Text style={styles.dialogSubtitle}>Why are we skipping this today? Be honest with yourself.</Text>

            <Text style={styles.inputLabel}>Skip Reason</Text>
            <TextInput
              style={[styles.textInput, { height: 60 }]}
              placeholder="e.g., Felt sick, busy schedule, recovery day..."
              placeholderTextColor="#6b7280"
              value={skipReason}
              onChangeText={setSkipReason}
              multiline
            />

            <View style={styles.dialogActions}>
              <Pressable 
                style={styles.cancelDialogBtn} 
                onPress={() => {
                  setSelectedSkipHabitId(null);
                  setSkipReason('');
                }}
              >
                <Text style={styles.cancelDialogText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.confirmDialogBtn, { backgroundColor: '#ef4444' }]} 
                onPress={() => {
                  if (selectedSkipHabitId) {
                    skipHabit(selectedSkipHabitId, skipReason);
                    setSelectedSkipHabitId(null);
                    setSkipReason('');
                  }
                }}
              >
                <Text style={styles.confirmDialogText}>Log Skip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EE',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  glowBlob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.15,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 15,
  },
  greeting: {
    color: '#7A7265',
    fontSize: 14,
    fontWeight: '500',
  },
  username: {
    color: '#2D2820',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  quote: {
    color: '#7A7265',
    fontSize: 12,
    fontStyle: 'italic',
  },
  avatarContainer: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  avatarGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    borderWidth: 2,
    opacity: 0.5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: '#EAE1D2',
  },
  streakIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FAF6EE',
    borderColor: '#EAE1D2',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIndicatorText: {
    color: '#B5945F',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 2,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  statsInfo: {
    flex: 1,
    paddingRight: 15,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3EAD8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
    borderColor: '#E8DFCE',
    borderWidth: 1,
  },
  levelText: {
    color: '#B5945F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  xpText: {
    color: '#2D2820',
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#FAF6EE',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 206, 0.4)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  consistencyStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statMini: {
    flexDirection: 'column',
  },
  statMiniLabel: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  statMiniValue: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '700',
  },
  progressRingContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  progressRingCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingPercentage: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '800',
  },
  aiNudgeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(156, 169, 134, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 28,
    borderColor: 'rgba(156, 169, 134, 0.15)',
    borderWidth: 1,
  },
  aiIconWrapper: {
    backgroundColor: 'rgba(156, 169, 134, 0.12)',
    borderRadius: 8,
    padding: 6,
    marginRight: 12,
  },
  aiNudgeText: {
    color: '#556847',
    fontSize: 12.5,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#2D2820',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#7A7265',
    fontSize: 12.5,
    marginTop: 2,
  },
  habitsList: {
    gap: 14,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  habitCardCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderColor: 'rgba(234, 225, 210, 0.4)',
  },
  habitColorAccent: {
    position: 'absolute',
    top: 16,
    bottom: 16,
    left: 0,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  habitCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 8,
  },
  habitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    color: '#2D2820',
    fontSize: 15,
    fontWeight: '700',
  },
  habitNameCompleted: {
    color: '#7A7265',
    textDecorationLine: 'line-through',
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  habitTarget: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '500',
  },
  habitTime: {
    color: '#7A7265',
    fontSize: 11,
  },
  habitDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#EAE1D2',
    marginHorizontal: 6,
  },
  habitCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F5EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  habitStreakText: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '800',
  },
  habitStreakActive: {
    color: '#B5945F',
  },
  checkmarkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  skipButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FAF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  completeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  notesSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FAF6EE',
    paddingLeft: 8,
  },
  notesText: {
    color: '#7A7265',
    fontSize: 11,
    fontStyle: 'italic',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 100 : 110,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B5945F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 40, 32, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FAF6EE',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    width: Math.min(width, 500),
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logDialogContent: {
    borderRadius: 24,
    marginBottom: 'auto',
    marginTop: 'auto',
    alignSelf: 'center',
    width: Math.min(width - 32, 400),
  },
  dialogSubtitle: {
    color: '#7A7265',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#2D2820',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
    backgroundColor: '#EAE1D2',
    borderRadius: 12,
  },
  inputLabel: {
    color: '#7A7265',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 14,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#EAE1D2',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#2D2820',
    fontSize: 14,
  },
  categorySelectors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#EAE1D2',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryText: {
    color: '#7A7265',
    fontSize: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
  },
  privacySelectors: {
    flexDirection: 'row',
    gap: 8,
  },
  privacyCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  privacyCardSelected: {
    borderColor: '#B5945F',
    backgroundColor: '#F3EAD8',
  },
  privacyCardText: {
    color: '#7A7265',
    fontSize: 12,
    fontWeight: '600',
  },
  privacyCardTextActive: {
    color: '#B5945F',
  },
  createSubmitBtn: {
    marginTop: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  createSubmitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  moodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  moodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  moodBtnSelected: {
    borderColor: '#B5945F',
    backgroundColor: '#F3EAD8',
  },
  moodBtnText: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '600',
  },
  moodBtnTextSelected: {
    color: '#B5945F',
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelDialogBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#EAE1D2',
  },
  cancelDialogText: {
    color: '#2D2820',
    fontSize: 13,
    fontWeight: '600',
  },
  confirmDialogBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  confirmDialogText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
