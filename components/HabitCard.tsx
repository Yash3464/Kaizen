import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import { StreakFlame } from './StreakFlame';
import { Habit, DayStatus } from '../store/useStore';
import { ChevronDown, ChevronUp, Check, X, CircleEllipsis } from 'lucide-react-native';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: () => void; // for the quick today checkin
  onDayPress: (dateStr: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onCheckIn, onDayPress }) => {
  const [expanded, setExpanded] = useState(false);
  const scale = useSharedValue(1);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const handleQuickCheckIn = (e: any) => {
    e.stopPropagation();
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    onCheckIn();
  };

  const getWeekDays = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.getTime());
    monday.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.history[todayStr]?.status === 'completed';

  // Find any reasons attached to days in the current week
  const weekReasons = weekDays.map(d => {
    const dateStr = d.toISOString().split('T')[0];
    const history = habit.history[dateStr];
    if (history?.status === 'other' && history.reason) {
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      return { dayName, reason: history.reason };
    }
    return null;
  }).filter(Boolean) as { dayName: string, reason: string }[];

  return (
    <View style={[styles.card, { borderLeftColor: habit.color }]}>
      <Pressable onPress={handlePress} style={styles.headerRow}>
        <View style={styles.leftContent}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{habit.name}</Text>
            <View style={styles.streakContainer}>
              <StreakFlame streak={habit.streak} />
              <Text style={styles.streakText}>{habit.streak} days</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightContent}>
          {expanded ? <ChevronUp color="#A0A0B0" /> : <ChevronDown color="#A0A0B0" />}
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          <Text style={styles.weeklyTitle}>This Week</Text>
          
          <View style={styles.daysRow}>
            {weekDays.map((d, i) => {
              const dateStr = d.toISOString().split('T')[0];
              const dayName = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
              const status = habit.history[dateStr]?.status || 'none';
              const isToday = dateStr === todayStr;

              return (
                <Pressable 
                  key={i} 
                  style={styles.dayCol}
                  onPress={() => onDayPress(dateStr)}
                >
                  <Text style={[styles.dayName, isToday && styles.todayText]}>{dayName}</Text>
                  <View style={[
                    styles.dayCircle,
                    status === 'completed' && { backgroundColor: habit.color, borderColor: habit.color },
                    status === 'missed' && { backgroundColor: '#FF3B3020', borderColor: '#FF3B30' },
                    status === 'other' && { backgroundColor: '#FFD60020', borderColor: '#FFD600' },
                    isToday && status === 'none' && styles.todayCircle
                  ]}>
                    {status === 'completed' && <Check color="#FFF" size={14} />}
                    {status === 'missed' && <X color="#FF3B30" size={14} />}
                    {status === 'other' && <CircleEllipsis color="#FFD600" size={14} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {weekReasons.length > 0 && (
            <View style={styles.reasonsContainer}>
              <Text style={styles.reasonsHeader}>Notes</Text>
              {weekReasons.map((r, i) => (
                <View key={i} style={styles.reasonRow}>
                  <Text style={styles.reasonDay}>{r.dayName}:</Text>
                  <Text style={styles.reasonText}>{r.reason}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A24',
    borderRadius: 16,
    borderLeftWidth: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    color: '#A0A0B0',
    fontSize: 12,
    fontFamily: 'Inter',
    marginLeft: 4,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickCheckBtn: {
    padding: 4,
  },
  quickCheckRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#2A2A35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A35',
    marginBottom: 16,
  },
  weeklyTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  dayName: {
    color: '#606070',
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  todayText: {
    color: '#FFF',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2A2A35',
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    borderColor: '#A0A0B0',
  },
  reasonsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A35',
  },
  reasonsHeader: {
    color: '#A0A0B0',
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reasonDay: {
    color: '#606070',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    width: 40,
  },
  reasonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter',
    flex: 1,
  }
});
