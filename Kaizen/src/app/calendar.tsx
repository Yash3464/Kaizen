import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Dimensions, 
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Flame, 
  Trophy, 
  ChevronRight, 
  ChevronLeft, 
  Smile, 
  MessageSquare,
  Users,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const { habits, user, friends } = useApp();
  
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, ...
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const todayStr = today.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [activeView, setActiveView] = useState<'me' | 'friends'>('me');

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Tally actual completed habits for this date
    let done = 0;
    const total = habits.length;
    habits.forEach((h) => {
      if (h.history && h.history[dateStr] === 'completed') {
        done += 1;
      }
    });

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { day: 'numeric' });

    return {
      name: dayName,
      day: dayNum,
      date: dateStr,
      done,
      total,
    };
  });

  // Friend shared calendars — built from real accepted friends
  const friendCalendars = friends.map((friend) => ({
    id: friend.id,
    name: friend.name,
    avatar: friend.avatar,
    // These will be empty until we query their logs — shows the real relationship exists
    done: 0,
    total: 0,
    habits: [] as string[],
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.glowBlob, { backgroundColor: '#F3EAD8', top: -80, right: -50 }]} pointerEvents="none" />
      <View style={[styles.glowBlob, { backgroundColor: '#EADFC9', bottom: 100, left: -100 }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Ritual Timeline</Text>
              <Text style={styles.subtitle}>Track density, streaks, and history</Text>
            </View>
            <View style={styles.headerTabs}>
              <Pressable 
                style={[styles.headerTabBtn, activeView === 'me' && styles.headerTabBtnActive]}
                onPress={() => setActiveView('me')}
              >
                <Text style={[styles.headerTabBtnText, activeView === 'me' && styles.headerTabBtnTextActive]}>Me</Text>
              </Pressable>
              <Pressable 
                style={[styles.headerTabBtn, activeView === 'friends' && styles.headerTabBtnActive]}
                onPress={() => setActiveView('friends')}
              >
                <Users size={12} color={activeView === 'friends' ? '#B5945F' : '#7A7265'} />
                <Text style={[styles.headerTabBtnText, activeView === 'friends' && styles.headerTabBtnTextActive]}>Shared</Text>
              </Pressable>
            </View>
          </View>

          {activeView === 'me' ? (
            <>
              {/* STREAK SUMMARY */}
              <View style={styles.streakGrid}>
                <View style={styles.streakGridCard}>
                  <Flame color="#E0A996" size={24} fill="#E0A996" />
                  <Text style={styles.streakValue}>{user.streak} Days</Text>
                  <Text style={styles.streakLabel}>Current Streak</Text>
                </View>
                <View style={styles.streakGridCard}>
                  <Trophy color="#B5945F" size={24} fill="#B5945F" />
                  <Text style={styles.streakValue}>
                    {habits.length > 0 ? Math.max(...habits.map(h => h.streak), user.streak) : user.streak} Days
                  </Text>
                  <Text style={styles.streakLabel}>All-Time Peak</Text>
                </View>
              </View>

              {/* WEEKLY TIMELINE */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Weekly Snapshot</Text>
                <View style={styles.weeklyContainer}>
                  {daysOfWeek.map((day) => {
                    const isSelected = selectedDate === day.date;
                    const completionRatio = day.done / day.total;
                    
                    return (
                      <Pressable 
                        key={day.day} 
                        style={[
                          styles.weeklyDayCard,
                          isSelected && styles.weeklyDayCardSelected
                        ]}
                        onPress={() => setSelectedDate(day.date)}
                      >
                        <Text style={styles.weeklyDayName}>{day.name}</Text>
                        <Text style={[styles.weeklyDayNumber, isSelected && styles.weeklyDayNumberActive]}>
                          {day.day}
                        </Text>
                        
                        {/* Bullet indicators of completed */}
                        <View style={styles.weeklyIndicatorRow}>
                          {[...Array(day.total)].map((_, i) => (
                            <View 
                              key={i} 
                              style={[
                                styles.weeklyIndicatorDot, 
                                i < day.done ? { backgroundColor: '#B5945F' } : { backgroundColor: '#EAE1D2' }
                              ]} 
                            />
                          ))}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>



              {/* LOG DETAILS FOR SELECTED DAY */}
              <View style={styles.sectionContainer}>
                <View style={styles.detailsHeader}>
                  <CalendarIcon color="#B5945F" size={18} />
                  <Text style={styles.detailsTitle}>Logs for {selectedDate}</Text>
                </View>

                <View style={styles.logsContainer}>
                  {habits.map((h) => {
                    const log = h.historyDetails?.[selectedDate];
                    const status = log?.status || (selectedDate === todayStr ? (h.progress >= 1.0 ? 'completed' : h.missedReason ? 'skipped' : 'pending') : 'pending');
                    const note = log?.notes || (selectedDate === todayStr && h.notes ? h.notes : '');
                    const mood = log?.mood || (selectedDate === todayStr && h.mood ? h.mood : '');
                    const missedReason = log?.missedReason || (selectedDate === todayStr && h.missedReason ? h.missedReason : '');

                    return (
                      <View key={h.id} style={styles.logItem}>
                        <View style={[styles.logStatusIndicator, { backgroundColor: h.color }]} />
                        <View style={styles.logItemContent}>
                          <Text style={styles.logItemName}>{h.name}</Text>
                          {status === 'completed' ? (
                            <View style={styles.logStatusTextRow}>
                              <CheckCircle size={12} color="#9CA986" />
                              <Text style={[styles.logStatusText, { color: '#9CA986' }]}>
                                {note || 'Completed successfully'}
                              </Text>
                            </View>
                          ) : status === 'skipped' ? (
                            <View style={styles.logStatusTextRow}>
                              <HelpCircle size={12} color="#E0A996" />
                              <Text style={[styles.logStatusText, { color: '#E0A996' }]}>
                                Skipped: {missedReason || 'Focus on other core milestones'}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.logStatusTextRow}>
                              <Clock size={12} color="#B5945F" />
                              <Text style={[styles.logStatusText, { color: '#B5945F' }]}>Awaiting log</Text>
                            </View>
                          )}
                        </View>
                        {status === 'completed' && mood ? (
                          <View style={styles.vibeCard}>
                            <Smile size={10} color="#9CA986" />
                            <Text style={styles.vibeText}>{mood}</Text>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.friendsSection}>
              <Text style={styles.sectionTitle}>Shared Calendars</Text>
              <Text style={styles.sectionSubtitle}>See consistency of friends who hold you accountable</Text>

              {friendCalendars.map((friend) => (
                <View key={friend.id} style={styles.friendCalCard}>
                  <View style={styles.friendHeader}>
                    <View style={styles.friendInfo}>
                      <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                      <View>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendStats}>Today: {friend.done}/{friend.total} Rituals</Text>
                      </View>
                    </View>
                    <View style={[styles.friendProgressCircle, { borderColor: '#9CA986' }]}>
                      <Text style={styles.friendProgressText}>{Math.round((friend.done/friend.total)*100)}%</Text>
                    </View>
                  </View>

                  <View style={styles.friendWeeklyRow}>
                    {daysOfWeek.map((day, i) => {
                      const active = i < 5; // simulate first 5 days completed
                      return (
                        <View key={day.day} style={styles.friendWeeklyDay}>
                          <Text style={styles.friendWeeklyName}>{day.name.slice(0, 1)}</Text>
                          <View style={[
                            styles.friendDayDot,
                            active ? { backgroundColor: '#9CA986' } : { backgroundColor: '#EAE1D2' }
                          ]} />
                        </View>
                      );
                    })}
                  </View>

                  <View style={styles.friendHabitList}>
                    {friend.habits.map((h, i) => (
                      <View key={i} style={styles.friendHabitTag}>
                        <View style={[styles.friendTagDot, { backgroundColor: i === 0 ? '#D4A373' : i === 1 ? '#9CA986' : '#B5945F' }]} />
                        <Text style={styles.friendTagText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 75 }} />
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    color: '#2D2820',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#7A7265',
    fontSize: 13,
    marginTop: 2,
  },
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  headerTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6,
  },
  headerTabBtnActive: {
    backgroundColor: '#F3EAD8',
  },
  headerTabBtnText: {
    color: '#7A7265',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTabBtnTextActive: {
    color: '#B5945F',
  },
  streakGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  streakGridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  streakValue: {
    color: '#2D2820',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  streakLabel: {
    color: '#7A7265',
    fontSize: 11,
    marginTop: 2,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#2D2820',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: '#7A7265',
    fontSize: 12,
    marginBottom: 16,
  },
  weeklyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  weeklyDayCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  weeklyDayCardSelected: {
    backgroundColor: '#F3EAD8',
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  weeklyDayName: {
    color: '#7A7265',
    fontSize: 10,
    fontWeight: '500',
  },
  weeklyDayNumber: {
    color: '#7A7265',
    fontSize: 14,
    fontWeight: '700',
  },
  weeklyDayNumberActive: {
    color: '#B5945F',
  },
  weeklyIndicatorRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  weeklyIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    color: '#7A7265',
    fontSize: 9,
  },
  legendBox: {
    width: 8,
    height: 8,
    borderRadius: 1.5,
  },
  heatmapCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 20,
    padding: 16,
  },
  heatmapScroll: {
    paddingVertical: 10,
  },
  heatmapGrid: {
    flexDirection: 'column',
    position: 'relative',
    height: 100,
    width: 500,
  },
  monthsRow: {
    flexDirection: 'row',
    position: 'relative',
    height: 15,
    marginBottom: 8,
  },
  monthLabel: {
    position: 'absolute',
    color: '#7A7265',
    fontSize: 10,
    fontWeight: '600',
  },
  matrixWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    height: 77,
    width: '100%',
  },
  heatmapCell: {
    width: 8,
    height: 8,
    borderRadius: 1.5,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailsTitle: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '700',
  },
  logsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logStatusIndicator: {
    width: 3,
    height: 32,
    borderRadius: 1.5,
    marginRight: 12,
  },
  logItemContent: {
    flex: 1,
  },
  logItemName: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '700',
  },
  logStatusTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  logStatusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  vibeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(156, 169, 134, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: 'rgba(156, 169, 134, 0.15)',
    borderWidth: 1,
  },
  vibeText: {
    color: '#9CA986',
    fontSize: 10,
    fontWeight: '700',
  },
  friendsSection: {
    gap: 16,
  },
  friendCalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  friendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  friendName: {
    color: '#2D2820',
    fontSize: 15,
    fontWeight: '700',
  },
  friendStats: {
    color: '#7A7265',
    fontSize: 11,
    marginTop: 1,
  },
  friendProgressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendProgressText: {
    color: '#9CA986',
    fontSize: 11,
    fontWeight: '800',
  },
  friendWeeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#FAF6EE',
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  friendWeeklyDay: {
    alignItems: 'center',
    gap: 6,
  },
  friendWeeklyName: {
    color: '#7A7265',
    fontSize: 9,
    fontWeight: '600',
  },
  friendDayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  friendHabitList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  friendHabitTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF6EE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  friendTagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  friendTagText: {
    color: '#7A7265',
    fontSize: 10.5,
    fontWeight: '500',
  },
});
