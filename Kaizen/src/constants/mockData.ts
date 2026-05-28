export interface Habit {
  id: string;
  name: string;
  category: 'Physical' | 'Focus' | 'Mind' | 'Growth';
  icon: string;
  color: string;
  streak: number;
  target: string;
  progress: number; // 0 to 1
  notes: string;
  mood: string;
  missedReason: string;
  reminderTime: string;
  visibility: 'Private' | 'Friends' | 'Public' | 'Group';
  history: { [date: string]: 'completed' | 'skipped' | 'missed' };
}

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
  senderId: 'me' | string;
  text: string;
  time: string;
}

export interface FriendActivity {
  id: string;
  userName: string;
  avatar: string;
  action: string;
  habitName?: string;
  streak?: number;
  time: string;
  reactions: { type: string; count: number; userReacted: boolean }[];
  comments: { id: string; userName: string; text: string; time: string }[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  daysRemaining: number;
  creator: string;
  progress: number; // user progress in challenge
  joined: boolean;
  rewardXP: number;
  badgeId: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  consistencyScore: number;
  friendCount: number;
  totalCompleted: number;
  neonTheme: string;
}

export const INITIAL_USER: UserProfile = {
  name: 'Rhythm',
  username: '@rhythm_dev',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
  level: 14,
  xp: 1845,
  xpToNextLevel: 2500,
  streak: 14,
  consistencyScore: 96,
  friendCount: 142,
  totalCompleted: 348,
  neonTheme: '#a855f7', // purple
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Gym Session',
    category: 'Physical',
    icon: 'dumbbell',
    color: '#06b6d4', // Neon Cyan
    streak: 14,
    target: '60 mins',
    progress: 1.0,
    notes: 'Pushed a new PR on Bench Press!',
    mood: 'Energized',
    missedReason: '',
    reminderTime: '07:00 AM',
    visibility: 'Friends',
    history: {
      '2026-05-28': 'completed',
      '2026-05-27': 'completed',
      '2026-05-26': 'completed',
      '2026-05-25': 'completed',
      '2026-05-24': 'completed',
      '2026-05-23': 'completed',
      '2026-05-22': 'completed',
    }
  },
  {
    id: '2',
    name: 'Code Kaizen App',
    category: 'Focus',
    icon: 'code',
    color: '#a855f7', // Neon Purple
    streak: 8,
    target: '2 hours',
    progress: 0.0,
    notes: '',
    mood: '',
    missedReason: '',
    reminderTime: '02:00 PM',
    visibility: 'Public',
    history: {
      '2026-05-27': 'completed',
      '2026-05-26': 'completed',
      '2026-05-25': 'completed',
      '2026-05-24': 'skipped',
      '2026-05-23': 'completed',
    }
  },
  {
    id: '3',
    name: 'Mindfulness Meditation',
    category: 'Mind',
    icon: 'brain',
    color: '#10b981', // Neon Green
    streak: 5,
    target: '15 mins',
    progress: 1.0,
    notes: 'Felt very present. Focus on breathing.',
    mood: 'Calm',
    missedReason: '',
    reminderTime: '09:00 PM',
    visibility: 'Private',
    history: {
      '2026-05-28': 'completed',
      '2026-05-27': 'completed',
      '2026-05-26': 'completed',
      '2026-05-25': 'completed',
      '2026-05-24': 'completed',
    }
  },
  {
    id: '4',
    name: 'Read Sci-Fi Novel',
    category: 'Growth',
    icon: 'book-open',
    color: '#ec4899', // Neon Pink
    streak: 12,
    target: '30 pages',
    progress: 0.5,
    notes: 'Halfway through chapter 12.',
    mood: 'Focused',
    missedReason: '',
    reminderTime: '10:00 PM',
    visibility: 'Friends',
    history: {
      '2026-05-28': 'skipped', // Partially done
      '2026-05-27': 'completed',
      '2026-05-26': 'completed',
      '2026-05-25': 'completed',
    }
  }
];

export const INITIAL_FEED: FriendActivity[] = [
  {
    id: 'f1',
    userName: 'Aryan Shah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    action: 'completed habit',
    habitName: 'Morning Calisthenics',
    streak: 30,
    time: '2 hours ago',
    reactions: [
      { type: '🔥', count: 8, userReacted: false },
      { type: '🚀', count: 3, userReacted: true },
      { type: '💪', count: 5, userReacted: false }
    ],
    comments: [
      { id: 'c1', userName: 'Anaya Gupta', text: '30 days! Insane consistency Aryan!', time: '1 hour ago' }
    ]
  },
  {
    id: 'f2',
    userName: 'Anaya Gupta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    action: 'achieved perfect day',
    streak: 5,
    time: '4 hours ago',
    reactions: [
      { type: '👑', count: 12, userReacted: false },
      { type: '⭐️', count: 6, userReacted: false }
    ],
    comments: []
  },
  {
    id: 'f3',
    userName: 'Kiara Sen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    action: 'joined challenge',
    habitName: 'Neon Runners Arena',
    time: 'Yesterday',
    reactions: [
      { type: '👟', count: 4, userReacted: false }
    ],
    comments: []
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch1',
    name: '30-Day Sleep Mastery',
    description: 'Build perfect circadian rhythm. Sleep by 10:30 PM and wake up by 6:00 AM daily.',
    membersCount: 142,
    daysRemaining: 18,
    creator: 'System AI',
    progress: 75,
    joined: true,
    rewardXP: 1000,
    badgeId: 'sleep-master'
  },
  {
    id: 'ch2',
    name: 'Neon Runners Arena',
    description: 'Sprint, jog, or run at least 5km every single day. Log with GPS proof.',
    membersCount: 512,
    daysRemaining: 12,
    creator: 'Aryan Shah',
    progress: 40,
    joined: false,
    rewardXP: 1500,
    badgeId: 'run-king'
  },
  {
    id: 'ch3',
    name: 'Deep Work Syndicate',
    description: 'Execute 4 Pomodoro focus sessions (100 mins total) of pure learning or creation.',
    membersCount: 89,
    daysRemaining: 24,
    creator: 'Rhythm',
    progress: 90,
    joined: true,
    rewardXP: 800,
    badgeId: 'focus-expert'
  }
];

export const LEADERBOARD = [
  { rank: 1, name: 'Aryan Shah', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', score: 98, streak: 30 },
  { rank: 2, name: 'Rhythm (You)', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', score: 96, streak: 14 },
  { rank: 3, name: 'Anaya Gupta', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', score: 92, streak: 5 },
  { rank: 4, name: 'Kiara Sen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', score: 89, streak: 12 },
  { rank: 5, name: 'Devon Lane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', score: 85, streak: 7 }
];

export const AI_COACH_RECOMMENDATIONS = [
  'Sleep quality is the strongest correlation to your morning routine. Sleep 30m earlier tonight.',
  'Your coding habits peak after 7 PM. Use deep focus block then.',
  'Meditation has a 100% completion rate when completed right after exercise.',
];
