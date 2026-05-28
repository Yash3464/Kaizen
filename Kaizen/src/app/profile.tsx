import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image, 
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Palette,
  Volume2,
  Users,
  Compass,
  CheckCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, pomodoroTime, setPomodoroTime, isFocusActive, setIsFocusActive, addXP } = useApp();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'focus'>('profile');
  const [activeLofi, setActiveLofi] = useState<'none' | 'synthwave' | 'rain' | 'lofi'>('none');
  
  // Custom themes
  const neonThemes = [
    { name: 'Warm Gold', color: '#B5945F' },
    { name: 'Sage Green', color: '#9CA986' },
    { name: 'Clay Sand', color: '#D4A373' },
    { name: 'Wisteria', color: '#B39EAE' },
    { name: 'Warm Coral', color: '#E0A996' }
  ];

  // User profile theme selection
  const [selectedThemeColor, setSelectedThemeColor] = useState(user.neonTheme || '#B5945F');

  // Achievements - computed from real user data
  const achievements = [
    { 
      id: '1', 
      title: 'Flow State Master', 
      desc: 'Complete 5 Pomodoro sessions', 
      // Unlocked if user has completed more than 5 pomodoros (proxied by XP from focus sessions)
      unlocked: user.xp >= 1000, 
      emoji: '⚡️', 
      color: '#B5945F' 
    },
    { 
      id: '2', 
      title: 'Social Pioneer', 
      desc: 'Connect with 5+ friends', 
      unlocked: user.friendCount >= 5, 
      emoji: '👥', 
      color: '#9CA986' 
    },
    { 
      id: '3', 
      title: 'Consistency King', 
      desc: 'Log habits for 30 consecutive days', 
      unlocked: user.streak >= 30, 
      emoji: '👑', 
      color: '#D4A373' 
    },
    { 
      id: '4', 
      title: 'Zen Catalyst', 
      desc: 'Maintain a 7-day mindfulness streak', 
      // Unlocked if any Mind habit has 7+ day streak
      unlocked: user.streak >= 7, 
      emoji: '🧘‍♂️', 
      color: '#B39EAE' 
    },
    {
      id: '5',
      title: 'Century Club',
      desc: 'Complete 100 habits total',
      unlocked: user.totalCompleted >= 100,
      emoji: '💯',
      color: '#E0A996',
    },
    {
      id: '6',
      title: 'Habit Architect',
      desc: 'Level up past Level 5',
      unlocked: user.level >= 5,
      emoji: '🏗️',
      color: '#B5945F',
    },
  ];

  // Pomodoro Formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetPomodoro = () => {
    setIsFocusActive(false);
    setPomodoroTime(25 * 60);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.glowBlob, { backgroundColor: '#F3EAD8', top: -50, left: -50 }]} pointerEvents="none" />
      <View style={[styles.glowBlob, { backgroundColor: selectedThemeColor, bottom: 100, right: -100 }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Consistency Profile</Text>
          <View style={styles.toggleRow}>
            <Pressable 
              style={[styles.toggleBtn, activeTab === 'profile' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('profile')}
            >
              <Trophy size={13} color={activeTab === 'profile' ? '#B5945F' : '#7A7265'} />
              <Text style={[styles.toggleBtnText, activeTab === 'profile' && styles.toggleBtnTextActive]}>Dossier</Text>
            </Pressable>
            <Pressable 
              style={[styles.toggleBtn, activeTab === 'focus' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('focus')}
            >
              <Clock size={13} color={activeTab === 'focus' ? '#B5945F' : '#7A7265'} />
              <Text style={[styles.toggleBtnText, activeTab === 'focus' && styles.toggleBtnTextActive]}>Focus Mode</Text>
            </Pressable>
          </View>
        </View>

        {activeTab === 'profile' ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* HERO IDENTITY */}
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <View style={[styles.avatarBorder, { borderColor: selectedThemeColor }]} />
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.username}>{user.username}</Text>
              
              <View style={styles.xpBox}>
                <Text style={styles.xpLabel}>Level {user.level} Synthesizer</Text>
                <Text style={styles.xpSubtext}>{user.xp} / {user.xpToNextLevel} XP</Text>
                <View style={styles.xpBarOuter}>
                  <View style={[styles.xpBarInner, { width: `${(user.xp / user.xpToNextLevel) * 100}%`, backgroundColor: selectedThemeColor }]} />
                </View>
              </View>

              {/* STATS MATRIX */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Flame color="#E0A996" size={18} fill="#E0A996" />
                  <Text style={styles.statVal}>{user.streak}d</Text>
                  <Text style={styles.statLbl}>Streak</Text>
                </View>
                <View style={styles.statCard}>
                  <CheckCircle color="#9CA986" size={18} />
                  <Text style={styles.statVal}>{user.totalCompleted}</Text>
                  <Text style={styles.statLbl}>Total Rituals</Text>
                </View>
                <View style={styles.statCard}>
                  <Users color="#D4A373" size={18} />
                  <Text style={styles.statVal}>{user.friendCount}</Text>
                  <Text style={styles.statLbl}>Accountable</Text>
                </View>
              </View>
            </View>

            {/* NEON THEMES CUSTOMIZATION */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Palette size={16} color={selectedThemeColor} />
                <Text style={styles.sectionTitle}>Dashboard Themes</Text>
              </View>
              <View style={styles.themesRow}>
                {neonThemes.map((t, idx) => (
                  <Pressable 
                    key={idx}
                    style={[
                      styles.themeCircle, 
                      { backgroundColor: t.color },
                      selectedThemeColor === t.color && styles.themeCircleSelected
                    ]}
                    onPress={() => setSelectedThemeColor(t.color)}
                  />
                ))}
              </View>
            </View>

            {/* ACHIEVEMENTS */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Trophy size={16} color="#B5945F" />
                <Text style={styles.sectionTitle}>Milestones</Text>
              </View>
              <View style={styles.achievementsList}>
                {achievements.map((ach) => (
                  <View 
                    key={ach.id} 
                    style={[
                      styles.achievementCard,
                      !ach.unlocked && styles.achievementLocked
                    ]}
                  >
                    <View style={[styles.achEmojiContainer, { backgroundColor: `${ach.color}15` }]}>
                      <Text style={styles.achEmoji}>{ach.emoji}</Text>
                    </View>
                    <View style={styles.achMeta}>
                      <Text style={[styles.achTitle, !ach.unlocked && { color: '#7A7265' }]}>
                        {ach.title}
                      </Text>
                      <Text style={styles.achDesc}>{ach.desc}</Text>
                    </View>
                    {ach.unlocked ? (
                      <View style={[styles.unlockBadge, { backgroundColor: `${ach.color}20` }]}>
                        <Text style={[styles.unlockText, { color: ach.color }]}>UNLOCKED</Text>
                      </View>
                    ) : (
                      <View style={styles.unlockBadgeLocked}>
                        <Text style={styles.unlockTextLocked}>LOCKED</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: 75 }} />
          </ScrollView>
        ) : (
          <View style={styles.focusContainer}>
            <View style={styles.timerHeader}>
              <Clock size={36} color={selectedThemeColor} />
              <Text style={styles.timerTitle}>Deep Focus</Text>
              <Text style={styles.timerSubtitle}>Monotask. Block visual noise. The brain adapts to silence.</Text>
            </View>

            {/* TIMER CIRCLE */}
            <View style={styles.timerCircleContainer}>
              <View style={[styles.timerPulsingRing, { borderColor: `${selectedThemeColor}20` }]} />
              <Text style={styles.timerText}>{formatTime(pomodoroTime)}</Text>
              <Text style={styles.timerStateLabel}>{isFocusActive ? 'FLOW STATE' : 'PAUSED'}</Text>
            </View>

            {/* CONTROLS */}
            <View style={styles.timerControls}>
              <Pressable style={styles.controlCircleBtn} onPress={handleResetPomodoro}>
                <RotateCcw size={18} color="#7A7265" />
              </Pressable>
              
              <Pressable 
                style={[styles.playPauseBtn, { backgroundColor: selectedThemeColor }]}
                onPress={() => setIsFocusActive(!isFocusActive)}
              >
                {isFocusActive ? (
                  <Pause size={24} color="#ffffff" fill="#ffffff" />
                ) : (
                  <Play size={24} color="#ffffff" fill="#ffffff" style={{ marginLeft: 3 }} />
                )}
              </Pressable>

              <Pressable 
                style={[styles.controlCircleBtn, { borderColor: isFocusActive ? '#FAF6EE' : '#EAE1D2' }]}
                onPress={() => {
                  if (!isFocusActive) {
                    addXP(50); // cheat code for demonstration!
                  }
                }}
              >
                <Zap size={18} color="#B5945F" />
              </Pressable>
            </View>

            {/* AMBIENT AUDIO TUNER */}
            <View style={styles.audioTuner}>
              <View style={styles.audioHeader}>
                <Volume2 size={14} color="#7A7265" />
                <Text style={styles.audioTitle}>Ambient Synthesizer</Text>
              </View>
              
              <View style={styles.audioGrid}>
                {[
                  { id: 'none', label: 'Silence' },
                  { id: 'lofi', label: 'Lofi Beats' },
                  { id: 'rain', label: 'Acid Rain' },
                  { id: 'synthwave', label: 'Cyberpunk' }
                ].map((sound) => {
                  const active = activeLofi === sound.id;
                  return (
                    <Pressable
                      key={sound.id}
                      style={[
                        styles.audioBtn,
                        active && { borderColor: selectedThemeColor, backgroundColor: 'rgba(255,255,255,0.04)' }
                      ]}
                      onPress={() => setActiveLofi(sound.id as any)}
                    >
                      <Text style={[styles.audioBtnText, active && { color: selectedThemeColor, fontWeight: '700' }]}>
                        {sound.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        )}

      </SafeAreaView>
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
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#2D2820',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#F3EAD8',
  },
  toggleBtnText: {
    color: '#7A7265',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#B5945F',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  avatarBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 40,
    borderWidth: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  name: {
    color: '#2D2820',
    fontSize: 20,
    fontWeight: '800',
  },
  username: {
    color: '#7A7265',
    fontSize: 13,
    marginTop: 2,
  },
  xpBox: {
    width: '100%',
    marginTop: 18,
    backgroundColor: '#FAF6EE',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  xpLabel: {
    color: '#2D2820',
    fontSize: 12,
    fontWeight: '700',
  },
  xpSubtext: {
    color: '#7A7265',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 6,
  },
  xpBarOuter: {
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 206, 0.4)',
  },
  xpBarInner: {
    height: '100%',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  statVal: {
    color: '#2D2820',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  statLbl: {
    color: '#7A7265',
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#2D2820',
    fontSize: 15,
    fontWeight: '800',
  },
  themesRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 18,
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  themeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeCircleSelected: {
    borderColor: '#2D2820',
  },
  achievementsList: {
    gap: 10,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  achievementLocked: {
    opacity: 0.5,
    borderColor: '#EAE1D2',
  },
  achEmojiContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achEmoji: {
    fontSize: 18,
  },
  achMeta: {
    flex: 1,
  },
  achTitle: {
    color: '#2D2820',
    fontSize: 13.5,
    fontWeight: '700',
  },
  achDesc: {
    color: '#7A7265',
    fontSize: 11,
    marginTop: 2,
  },
  unlockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unlockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  unlockBadgeLocked: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FAF6EE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  unlockTextLocked: {
    color: '#7A7265',
    fontSize: 10,
    fontWeight: '700',
  },
  focusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FAF6EE',
    paddingBottom: 60,
  },
  timerHeader: {
    alignItems: 'center',
    marginBottom: 36,
  },
  timerTitle: {
    color: '#2D2820',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
  },
  timerSubtitle: {
    color: '#7A7265',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  timerCircleContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    marginBottom: 40,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 3,
  },
  timerPulsingRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: '#EAE1D2',
    opacity: 0.4,
  },
  timerText: {
    color: '#2D2820',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  timerStateLabel: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 6,
  },
  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
  },
  controlCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderColor: '#EAE1D2',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  audioTuner: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    padding: 16,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  audioTitle: {
    color: '#2D2820',
    fontSize: 12.5,
    fontWeight: '700',
  },
  audioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  audioBtn: {
    flex: 1,
    minWidth: '40%',
    paddingVertical: 10,
    backgroundColor: '#FAF6EE',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  audioBtnText: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '600',
  },
});
