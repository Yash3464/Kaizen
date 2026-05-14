import { create } from 'zustand';

export type DayStatus = 'completed' | 'missed' | 'other' | 'none';

export interface HabitHistory {
  status: DayStatus;
  reason?: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  streak: number;
  history: Record<string, HabitHistory>; // Keyed by 'YYYY-MM-DD'
}

interface User {
  uid: string;
  email: string;
  username: string;
  avatarEmoji: string;
  level: number;
  xp: number;
}

export interface Friend {
  id: string;
  username: string;
  emoji: string;
  stats?: {
    habitsCompleted: number;
    currentStreak: number;
  };
}

export interface Challenge {
  id: string;
  name: string;
  participants: Friend[];
  createdAt: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  theme: 'dark' | 'light';
  
  // Habit State
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabitDayStatus: (habitId: string, dateStr: string, status: DayStatus, reason?: string) => void;
  
  // Challenges State
  challenges: Challenge[];
  addChallenge: (challenge: Challenge) => void;
  
  // Friends List (mock data for now)
  friends: Friend[];
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  theme: 'dark',
  
  habits: [],
  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  updateHabitDayStatus: (habitId, dateStr, status, reason) => set((state) => ({
    habits: state.habits.map(h => {
      if (h.id !== habitId) return h;
      const history = { ...h.history, [dateStr]: { status, reason } };
      
      let streak = h.streak;
      if (status === 'completed' && dateStr === new Date().toISOString().split('T')[0]) {
        streak += 1;
      } else if (status === 'missed') {
        streak = 0;
      }
      
      return { ...h, streak, history };
    })
  })),
  
  challenges: [],
  addChallenge: (challenge) => set((state) => ({ challenges: [...state.challenges, challenge] })),
  
  friends: [
    { id: '1', username: 'Alex', emoji: '🧑‍🚀', stats: { habitsCompleted: 42, currentStreak: 5 } },
    { id: '2', username: 'Sam', emoji: '👩‍🎤', stats: { habitsCompleted: 18, currentStreak: 2 } },
    { id: '3', username: 'Jordan', emoji: '🥷', stats: { habitsCompleted: 104, currentStreak: 12 } },
  ],
}));
