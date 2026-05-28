import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Habit, 
  FriendActivity, 
  Challenge, 
  UserProfile, 
  INITIAL_USER, 
  INITIAL_HABITS, 
  INITIAL_FEED, 
  INITIAL_CHALLENGES 
} from '../constants/mockData';

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  streak: number;
  consistencyScore: number;
}

export interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar: string;
  type: 'incoming' | 'outgoing';
}

export interface ChatMessage {
  id: string;
  senderId: 'me' | string; // 'me' or friend's username
  text: string;
  time: string;
}

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
  sendFriendRequest: (username: string) => { success: boolean; message: string };
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  sendChatMessage: (friendUsername: string, text: string) => void;

  // Auth State
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  signUp: (name: string, username: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  // Friends list (Aryan Shah accepted by default)
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 'f1',
      name: 'Aryan Shah',
      username: '@aryan_shah',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      streak: 30,
      consistencyScore: 98
    }
  ]);

  // Pending incoming requests
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([
    {
      id: 'f2',
      name: 'Anaya Gupta',
      username: '@anaya_gupta',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      type: 'incoming'
    },
    {
      id: 'f3',
      name: 'Kiara Sen',
      username: '@kiara_sen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      type: 'incoming'
    }
  ]);

  // Chat message histories
  const [chatMessages, setChatMessages] = useState<{ [friendUsername: string]: ChatMessage[] }>({
    '@aryan_shah': [
      { id: 'm1', senderId: '@aryan_shah', text: 'Hey Rhythm! Ready for today\'s grind? ⚡️', time: '10:00 AM' },
      { id: 'm2', senderId: 'me', text: 'Always ready! Just completed the Morning Gym Session.', time: '10:05 AM' },
      { id: 'm3', senderId: '@aryan_shah', text: 'Legendary. I am about to run 5k now. Keep it up! 🚀', time: '10:06 AM' }
    ]
  });

  const [feed, setFeed] = useState<FriendActivity[]>(INITIAL_FEED);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  
  // Focus Mode State
  const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState<boolean>(false);
  
  // Celebration Overlay state (confetti/levels)
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationDetails, setCelebrationDetails] = useState<{ type: string; value: string } | null>(null);

  // Focus Timer Tick
  useEffect(() => {
    let timer: any;
    if (isFocusActive && pomodoroTime > 0) {
      timer = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            setIsFocusActive(false);
            addXP(200); // XP reward for finishing pomodoro
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

  const addXP = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let leveledUp = false;

      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        newXpToNext = Math.round(prev.xpToNextLevel * 1.5);
        leveledUp = true;
      }

      if (leveledUp) {
        triggerCelebration('levelup', `LEVEL UP! You are now Level ${newLevel}`);
      }

      return {
        ...prev,
        xp: leveledUp ? newXp - prev.xpToNextLevel : newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        totalCompleted: prev.totalCompleted + 1,
      };
    });
  };

  const completeHabit = (id: string, notes?: string, mood?: string) => {
    const targetHabit = habits.find((h) => h.id === id);
    if (!targetHabit) return;

    const alreadyCompleted = targetHabit.progress >= 1.0;
    if (alreadyCompleted) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const updatedHistory = { ...targetHabit.history, [todayStr]: 'completed' as const };
    const updatedStreak = targetHabit.streak + 1;
    const earnedXP = 50 + updatedStreak * 5;

    // Update habits array
    setHabits((prevHabits) =>
      prevHabits.map((h) => {
        if (h.id === id) {
          return {
            ...h,
            progress: 1.0,
            streak: updatedStreak,
            notes: notes || 'Completed today!',
            mood: mood || 'Motivated',
            missedReason: '',
            history: updatedHistory,
          };
        }
        return h;
      })
    );

    // Push event to feed (outside of setHabits)
    const newFeedEvent: FriendActivity = {
      id: `f-user-${Date.now()}`,
      userName: `${user.name} (You)`,
      avatar: user.avatar,
      action: 'completed habit',
      habitName: targetHabit.name,
      streak: updatedStreak,
      time: 'Just now',
      reactions: [
        { type: '🔥', count: 1, userReacted: true },
        { type: '⚡️', count: 0, userReacted: false },
        { type: '👑', count: 0, userReacted: false }
      ],
      comments: []
    };
    setFeed(prev => [newFeedEvent, ...prev]);

    // Trigger UI effects (outside of setHabits)
    triggerCelebration('streak', `${updatedStreak} Day Streak on ${targetHabit.name}! +${earnedXP} XP`);
    addXP(earnedXP);
  };

  const skipHabit = (id: string, reason: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((h) => {
        if (h.id === id) {
          const todayStr = new Date().toISOString().split('T')[0];
          const updatedHistory = { ...h.history, [todayStr]: 'skipped' as const };
          return {
            ...h,
            progress: 0.0,
            notes: '',
            mood: '',
            missedReason: reason,
            history: updatedHistory,
          };
        }
        return h;
      })
    );
    addXP(10); // small XP just for logging/honesty
  };

  const addHabit = (newHabitData: Omit<Habit, 'id' | 'streak' | 'progress' | 'notes' | 'mood' | 'missedReason' | 'history'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `h-${Date.now()}`,
      streak: 0,
      progress: 0.0,
      notes: '',
      mood: '',
      missedReason: '',
      history: {},
    };
    setHabits((prev) => [...prev, newHabit]);
    addXP(100); // 100 XP for creating a new habit
    triggerCelebration('habit', `New Habit "${newHabit.name}" Activated! +100 XP`);
  };

  const reactToActivity = (activityId: string, reactionType: string) => {
    setFeed((prevFeed) =>
      prevFeed.map((activity) => {
        if (activity.id === activityId) {
          const updatedReactions = activity.reactions.map((r) => {
            if (r.type === reactionType) {
              const userReacted = !r.userReacted;
              return {
                ...r,
                count: userReacted ? r.count + 1 : Math.max(0, r.count - 1),
                userReacted,
              };
            }
            return r;
          });
          return { ...activity, reactions: updatedReactions };
        }
        return activity;
      })
    );
  };

  const addCommentToActivity = (activityId: string, text: string) => {
    setFeed((prevFeed) =>
      prevFeed.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            comments: [
              ...activity.comments,
              {
                id: `c-${Date.now()}`,
                userName: 'Rhythm (You)',
                text,
                time: 'Just now',
              },
            ],
          };
        }
        return activity;
      })
    );
    addXP(15); // XP for social interaction!
  };

  const joinChallenge = (challengeId: string) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((ch) => {
        if (ch.id === challengeId) {
          const joined = !ch.joined;
          if (joined) {
            addXP(200);
            triggerCelebration('challenge', `Joined Challenge: ${ch.name}! +200 XP`);
          }
          return {
            ...ch,
            joined,
            membersCount: joined ? ch.membersCount + 1 : ch.membersCount - 1,
          };
        }
        return ch;
      })
    );
  };

  // User directory for search
  const ALL_SEARCHABLE_USERS = [
    { id: 'f2', name: 'Anaya Gupta', username: '@anaya_gupta', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', streak: 5, consistencyScore: 92 },
    { id: 'f3', name: 'Kiara Sen', username: '@kiara_sen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', streak: 12, consistencyScore: 89 },
    { id: 'f4', name: 'Devon Lane', username: '@devon_lane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', streak: 7, consistencyScore: 85 },
    { id: 'f5', name: 'Elon Musk', username: '@elon', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', streak: 100, consistencyScore: 99 }
  ];

  const sendFriendRequest = (searchVal: string) => {
    const query = searchVal.trim().toLowerCase();
    if (!query) return { success: false, message: 'Please enter a valid Username.' };
    const normalized = query.startsWith('@') ? query : `@${query}`;

    // Check if already friends
    if (friends.some(f => f.username.toLowerCase() === normalized)) {
      return { success: false, message: 'You are already friends!' };
    }

    // Check if already pending
    if (pendingRequests.some(r => r.username.toLowerCase() === normalized)) {
      return { success: false, message: 'Friend request is already pending.' };
    }

    const matchedUser = ALL_SEARCHABLE_USERS.find(u => u.username.toLowerCase() === normalized);
    if (!matchedUser) {
      return { success: false, message: 'User not found! Try @devon_lane or @elon' };
    }

    // Add outgoing request
    const newRequest: FriendRequest = {
      id: `req-out-${Date.now()}`,
      name: matchedUser.name,
      username: matchedUser.username,
      avatar: matchedUser.avatar,
      type: 'outgoing'
    };

    setPendingRequests(prev => [...prev, newRequest]);

    // Simulate auto-accept after 2.5 seconds to make UX responsive and rewarding!
    setTimeout(() => {
      setPendingRequests(prev => prev.filter(r => r.username.toLowerCase() !== normalized));
      setFriends(prev => {
        if (prev.some(f => f.username.toLowerCase() === normalized)) return prev;
        return [...prev, {
          id: matchedUser.id,
          name: matchedUser.name,
          username: matchedUser.username,
          avatar: matchedUser.avatar,
          streak: matchedUser.streak,
          consistencyScore: matchedUser.consistencyScore
        }];
      });
      addXP(100);
      triggerCelebration('habit', `Request Accepted! ${matchedUser.name} added. +100 XP`);
    }, 2500);

    return { success: true, message: 'Request sent! Waiting for response...' };
  };

  const acceptFriendRequest = (requestId: string) => {
    const req = pendingRequests.find(r => r.id === requestId);
    if (!req) return;

    setPendingRequests(prev => prev.filter(r => r.id !== requestId));

    const match = ALL_SEARCHABLE_USERS.find(u => u.username.toLowerCase() === req.username.toLowerCase());
    const score = match ? match.consistencyScore : 82;
    const streak = match ? match.streak : 6;

    setFriends(prev => {
      if (prev.some(f => f.username.toLowerCase() === req.username.toLowerCase())) return prev;
      return [...prev, {
        id: req.id,
        name: req.name,
        username: req.username,
        avatar: req.avatar,
        streak,
        consistencyScore: score
      }];
    });

    addXP(100);
    triggerCelebration('habit', `New Friend Added: ${req.name}! +100 XP`);
  };

  const declineFriendRequest = (requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const sendChatMessage = (friendUsername: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => {
      const current = prev[friendUsername] || [];
      return {
        ...prev,
        [friendUsername]: [...current, newMsg]
      };
    });

    // Simulated reply after 1.5 seconds
    setTimeout(() => {
      let replyText = 'Consistency beats talent! Let\'s go! 🔥';
      if (friendUsername === '@aryan_shah') {
        const replies = [
          'Epic work today! Let\'s stay consistent ⚡️',
          'Lock in Rhythm! Zero excuse days! 👑',
          'Smashed my run. Ready for tomorrow!'
        ];
        replyText = replies[Math.floor(Math.random() * replies.length)];
      } else if (friendUsername === '@anaya_gupta') {
        replyText = 'Just finished my focus study session. Rhythm you are killing it! 🌸';
      } else if (friendUsername === '@kiara_sen') {
        replyText = 'Keep pushing! The streak looks beautiful. 🚀';
      } else if (friendUsername === '@elon') {
        replyText = 'Excellent. Hard work pays off. Let\'s build the future. 🛸';
      } else if (friendUsername === '@devon_lane') {
        replyText = 'Nice work. Keep holding me accountable!';
      }

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: friendUsername,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => {
        const current = prev[friendUsername] || [];
        return {
          ...prev,
          [friendUsername]: [...current, replyMsg]
        };
      });
    }, 1500);
  };

  const login = (email: string, password: string) => {
    if (!email.includes('@') || password.length < 6) {
      return { success: false, message: 'Invalid email or password (min 6 characters)' };
    }
    setIsAuthenticated(true);
    return { success: true, message: 'Logged in successfully' };
  };

  const signUp = (name: string, username: string, email: string, password: string) => {
    if (!name || !username || !email || password.length < 6) {
      return { success: false, message: 'Please fill all fields (password min 6 characters)' };
    }
    const cleanUsername = username.startsWith('@') ? username : `@${username}`;
    setUser(prev => ({
      ...prev,
      name,
      username: cleanUsername,
    }));
    setIsAuthenticated(true);
    return { success: true, message: 'Registered successfully' };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Filter feed to show ONLY user and accepted friends' activities
  const visibleFeed = feed.filter(activity => 
    activity.userName.includes(user.name) || 
    friends.some(f => activity.userName.toLowerCase().includes(f.name.toLowerCase()))
  );

  return (
    <AppContext.Provider
      value={{
        user,
        habits,
        feed: visibleFeed,
        challenges,
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
        friends,
        pendingRequests,
        chatMessages,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        sendChatMessage,
        isAuthenticated,
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
