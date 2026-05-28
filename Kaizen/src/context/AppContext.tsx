import React, { createContext, useContext, useState, useEffect } from 'react';
import { useKaizenStore } from '../stores/useKaizenStore';
import { Habit, FriendActivity, Challenge, UserProfile, Friend, FriendRequest, ChatMessage } from '../constants/mockData';

interface AppContextType {
  user: UserProfile;
  habits: Habit[];
  feed: FriendActivity[];
  challenges: Challenge[];
  completeHabit: (id: string, notes?: string, mood?: string) => void;
  skipHabit: (id: string, reason: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'progress' | 'notes' | 'mood' | 'missedReason' | 'history'>) => void;
  reactToActivity: (activityId: string, reactionType: string) => void;
  addCommentToActivity: (activityId: string, text: string) => void;
  joinChallenge: (challengeId: string) => void;
  addXP: (amount: number) => void;
  pomodoroTime: number;
  setPomodoroTime: React.Dispatch<React.SetStateAction<number>>;
  isFocusActive: boolean;
  setIsFocusActive: (active: boolean) => void;
  showCelebration: boolean;
  setShowCelebration: (show: boolean) => void;
  celebrationDetails: { type: string; value: string } | null;
  setCelebrationDetails: (details: { type: string; value: string } | null) => void;
  
  // Friends & Chat State
  friends: Friend[];
  pendingRequests: FriendRequest[];
  chatMessages: { [friendUsername: string]: ChatMessage[] };
  sendFriendRequest: (username: string) => Promise<{ success: boolean; message: string }>;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  sendChatMessage: (friendUsername: string, text: string) => void;

  // Auth State
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUser: UserProfile = {
  name: 'Kaizen Warrior',
  username: '@warrior',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  streak: 0,
  consistencyScore: 100,
  friendCount: 0,
  totalCompleted: 0,
  neonTheme: '#B5945F',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useKaizenStore();

  // Local UI-only animation/timer states
  const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationDetails, setCelebrationDetails] = useState<{ type: string; value: string } | null>(null);

  // Initialize auth change listener
  useEffect(() => {
    store.initializeAuth();
  }, []);

  // Focus Timer countdown listener
  useEffect(() => {
    let timer: any;
    if (isFocusActive && pomodoroTime > 0) {
      timer = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            setIsFocusActive(false);
            store.addXP(200); // Reward focus
            triggerCelebration('focus', 'Deep Work Session Complete! +200 XP');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFocusActive, pomodoroTime]);

  const triggerCelebration = (type: string, value: string) => {
    setCelebrationDetails({ type, value });
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 4000);
  };

  const completeHabit = async (id: string, notes?: string, mood?: string) => {
    try {
      const targetHabit = store.habits.find((h) => h.id === id);
      const updatedStreak = targetHabit ? targetHabit.streak + 1 : 1;
      const earnedXP = 50 + updatedStreak * 5;

      await store.completeHabit(id, notes, mood);
      triggerCelebration('streak', `${updatedStreak} Day Streak on ${targetHabit?.name || 'Habit'}! +${earnedXP} XP`);
    } catch (e) {
      console.error(e);
    }
  };

  const skipHabit = async (id: string, reason: string) => {
    try {
      await store.skipHabit(id, reason);
    } catch (e) {
      console.error(e);
    }
  };

  const addHabit = async (newHabitData: Omit<Habit, 'id' | 'streak' | 'progress' | 'notes' | 'mood' | 'missedReason' | 'history'>) => {
    try {
      await store.addHabit(newHabitData);
      triggerCelebration('habit', `New Habit "${newHabitData.name}" Activated! +100 XP`);
    } catch (e) {
      console.error(e);
    }
  };

  const reactToActivity = async (activityId: string, reactionType: string) => {
    await store.reactToActivity(activityId, reactionType);
  };

  const addCommentToActivity = async (activityId: string, text: string) => {
    await store.addCommentToActivity(activityId, text);
  };

  const joinChallenge = async (challengeId: string) => {
    const target = store.challenges.find((ch) => ch.id === challengeId);
    if (!target) return;
    const isJoining = !target.joined;

    await store.joinChallenge(challengeId);
    if (isJoining) {
      triggerCelebration('challenge', `Joined Challenge: ${target.name}! +200 XP`);
    }
  };

  const addXP = async (amount: number) => {
    await store.addXP(amount);
  };

  const sendFriendRequest = async (username: string) => {
    return await store.sendFriendRequest(username);
  };

  const acceptFriendRequest = async (requestId: string) => {
    const req = store.pendingRequests.find(r => r.id === requestId);
    await store.acceptFriendRequest(requestId);
    if (req) {
      triggerCelebration('habit', `New Friend Added: ${req.name}! +100 XP`);
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    await store.declineFriendRequest(requestId);
  };

  const sendChatMessage = async (friendUsername: string, text: string) => {
    await store.sendChatMessage(friendUsername, text);
  };

  const login = async (email: string, password: string) => {
    return await store.login(email, password);
  };

  const signUp = async (name: string, username: string, email: string, password: string) => {
    return await store.signUp(name, username, email, password);
  };

  const logout = () => {
    store.logout();
  };

  return (
    <AppContext.Provider
      value={{
        user: store.user || defaultUser,
        habits: store.habits,
        feed: store.feed,
        challenges: store.challenges,
        completeHabit,
        skipHabit,
        addHabit,
        reactToActivity,
        addCommentToActivity,
        joinChallenge,
        addXP,
        pomodoroTime,
        setPomodoroTime,
        isFocusActive,
        setIsFocusActive,
        showCelebration,
        setShowCelebration,
        celebrationDetails,
        setCelebrationDetails,
        friends: store.friends,
        pendingRequests: store.pendingRequests,
        chatMessages: store.chatMessages,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        sendChatMessage,
        isAuthenticated: store.isAuthenticated,
        login,
        signUp,
        logout,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
