import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Habit, FriendActivity, Challenge, UserProfile, Friend, FriendRequest, ChatMessage } from '../constants/mockData';

interface KaizenState {
  user: UserProfile | null;
  habits: Habit[];
  feed: FriendActivity[];
  challenges: Challenge[];
  friends: Friend[];
  pendingRequests: FriendRequest[];
  chatMessages: { [friendUsername: string]: ChatMessage[] };
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Auth Functions
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  
  // Profile Functions
  updateProfileTheme: (color: string) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  
  // Habits Functions
  fetchHabits: () => Promise<void>;
  addHabit: (newHabit: Omit<Habit, 'id' | 'streak' | 'progress' | 'notes' | 'mood' | 'missedReason' | 'history'>) => Promise<void>;
  completeHabit: (id: string, notes?: string, mood?: string) => Promise<void>;
  skipHabit: (id: string, reason: string) => Promise<void>;
  
  // Social Feed Functions
  fetchFeed: () => Promise<void>;
  reactToActivity: (activityId: string, reactionType: string) => Promise<void>;
  addCommentToActivity: (activityId: string, text: string) => Promise<void>;
  
  // Friend System Functions
  fetchFriendsAndRequests: () => Promise<void>;
  sendFriendRequest: (username: string) => Promise<{ success: boolean; message: string }>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  
  // Challenge Functions
  fetchChallenges: () => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  
  // Chat Functions
  fetchChatMessages: () => Promise<void>;
  sendChatMessage: (friendUsername: string, text: string) => Promise<void>;
  
  // Realtime Subscriptions
  setupRealtimeSubscriptions: (userId: string) => void;
  cleanupRealtimeSubscriptions: () => void;
}

// Helper to format relative time
function formatRelativeTime(dateStr: string): string {
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}

// Central Realtime Subscriptions manager
let realtimeChannels: any[] = [];

export const useKaizenStore = create<KaizenState>((set, get) => ({
  user: null,
  habits: [],
  feed: [],
  challenges: [],
  friends: [],
  pendingRequests: [],
  chatMessages: {},
  isAuthenticated: false,
  isLoading: true,

  initializeAuth: () => {
    // Listen to Supabase auth events
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({ isAuthenticated: true });
        // Fetch profile and all user data
        await get().fetchFriendsAndRequests(); // load first so we can fetch habits/feed
        await get().fetchHabits();
        await get().fetchFeed();
        await get().fetchChallenges();
        await get().fetchChatMessages();
        
        // Setup realtime channels
        get().setupRealtimeSubscriptions(session.user.id);
      } else {
        // Reset state
        get().cleanupRealtimeSubscriptions();
        set({
          user: null,
          habits: [],
          feed: [],
          challenges: [],
          friends: [],
          pendingRequests: [],
          chatMessages: {},
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
  },

  setupRealtimeSubscriptions: (userId: string) => {
    get().cleanupRealtimeSubscriptions();

    // Channel for Profile Changes
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload: any) => {
          if (payload.new) {
            const p = payload.new;
            set({
              user: {
                name: p.display_name || 'Kaizen Warrior',
                username: p.username,
                avatar: p.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
                level: p.level,
                xp: p.xp,
                xpToNextLevel: p.xp_to_next_level,
                streak: p.streak,
                consistencyScore: p.consistency_score,
                friendCount: p.friend_count,
                totalCompleted: p.total_completed,
                neonTheme: p.theme_color,
              },
            });
          }
        }
      )
      .subscribe();

    // Channel for Feed (activities, comments, reactions)
    const feedChannel = supabase
      .channel('feed-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        () => { get().fetchFeed(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reactions' },
        () => { get().fetchFeed(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        () => { get().fetchFeed(); }
      )
      .subscribe();

    // Channel for Friend Requests & Friendships
    const socialChannel = supabase
      .channel('social-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'friendships' },
        () => { get().fetchFriendsAndRequests(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'friend_requests' },
        () => { get().fetchFriendsAndRequests(); }
      )
      .subscribe();

    // Channel for Chat Messages
    const chatChannel = supabase
      .channel('chat-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => { get().fetchChatMessages(); }
      )
      .subscribe();

    // Channel for Habits and Habit Logs
    const habitsChannel = supabase
      .channel('habits-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${userId}` },
        () => { get().fetchHabits(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${userId}` },
        () => { get().fetchHabits(); }
      )
      .subscribe();

    // Channel for Challenges
    const challengeChannel = supabase
      .channel('challenge-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'challenges' },
        () => { get().fetchChallenges(); }
      )
      .subscribe();

    realtimeChannels = [profileChannel, feedChannel, socialChannel, chatChannel, habitsChannel, challengeChannel];
  },

  cleanupRealtimeSubscriptions: () => {
    realtimeChannels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    realtimeChannels = [];
  },

  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, message: 'Logged in successfully' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Login failed' };
    }
  },

  signUp: async (name, username, email, password) => {
    try {
      // Validate unique username first
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.startsWith('@') ? username : `@${username}`)
        .maybeSingle();

      if (existingUser) {
        return { success: false, message: 'Username is already taken!' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.startsWith('@') ? username : `@${username}`,
            display_name: name,
          },
        },
      });

      if (error) throw error;
      return { success: true, message: 'Account created! Verification email sent.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Signup failed' };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  updateProfileTheme: async (color) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;
    await supabase
      .from('profiles')
      .update({ theme_color: color })
      .eq('id', session.user.id);
  },

  addXP: async (amount) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level, xp_to_next_level')
      .eq('id', session.user.id)
      .single();

    if (!profile) return;

    let newXp = profile.xp + amount;
    let newLevel = profile.level;
    let newXpToNext = profile.xp_to_next_level;

    if (newXp >= newXpToNext) {
      newLevel += 1;
      newXp = newXp - newXpToNext;
      newXpToNext = Math.round(newXpToNext * 1.5);
    }

    await supabase
      .from('profiles')
      .update({ xp: newXp, level: newLevel, xp_to_next_level: newXpToNext })
      .eq('id', session.user.id);
  },

  fetchHabits: async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    set({ isLoading: true });

    // Fetch habits
    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', session.user.id);

    // Fetch logs
    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', session.user.id);

    const logsMap: { [habitId: string]: any[] } = {};
    logsData?.forEach((log) => {
      if (!logsMap[log.habit_id]) logsMap[log.habit_id] = [];
      logsMap[log.habit_id].push(log);
    });

    const todayStr = new Date().toISOString().split('T')[0];

    const mappedHabits: Habit[] = (habitsData || []).map((h) => {
      const hLogs = logsMap[h.id] || [];
      const history: { [date: string]: 'completed' | 'skipped' | 'missed' } = {};
      const historyDetails: {
        [date: string]: {
          status: 'completed' | 'skipped' | 'missed';
          notes?: string;
          mood?: string;
          missedReason?: string;
        }
      } = {};
      let progress = 0.0;
      let notes = '';
      let mood = '';
      let missedReason = '';

      hLogs.forEach((log) => {
        history[log.logged_date] = log.status as any;
        historyDetails[log.logged_date] = {
          status: log.status as any,
          notes: log.notes,
          mood: log.mood,
          missedReason: log.missed_reason,
        };
        if (log.logged_date === todayStr) {
          progress = log.status === 'completed' ? 1.0 : 0.0;
          notes = log.notes || '';
          mood = log.mood || '';
          missedReason = log.missed_reason || '';
        }
      });

      return {
        id: h.id,
        name: h.name,
        category: h.category as any,
        icon: h.icon,
        color: h.color,
        streak: h.streak,
        target: h.target,
        progress,
        notes,
        mood,
        missedReason,
        reminderTime: h.reminder_time || '',
        visibility: h.visibility as any,
        history,
        historyDetails,
      };
    });

    set({ habits: mappedHabits, isLoading: false });
  },

  addHabit: async (newHabitData) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: session.user.id,
        name: newHabitData.name,
        category: newHabitData.category,
        icon: newHabitData.icon,
        color: newHabitData.color,
        target: newHabitData.target,
        visibility: newHabitData.visibility,
        reminder_time: newHabitData.reminderTime,
      })
      .select()
      .single();

    if (error) throw error;

    await get().addXP(100);
    await get().fetchHabits();
  },

  completeHabit: async (id, notes, mood) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    const targetHabit = get().habits.find((h) => h.id === id);
    if (!targetHabit) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // Log the habit completion
    const { error: logError } = await supabase
      .from('habit_logs')
      .upsert({
        habit_id: id,
        user_id: session.user.id,
        logged_date: todayStr,
        status: 'completed',
        notes: notes || 'Completed today!',
        mood: mood || 'Motivated',
        missed_reason: '',
      });

    if (logError) throw logError;

    // Increment habit streak
    const newStreak = targetHabit.streak + 1;
    await supabase
      .from('habits')
      .update({ streak: newStreak })
      .eq('id', id);

    // Increment total completed count on profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_completed')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({ total_completed: profile.total_completed + 1 })
        .eq('id', session.user.id);
    }

    // Add activity to feed
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: 'completed habit',
        habit_name: targetHabit.name,
        streak: newStreak,
      });

    await get().addXP(50 + newStreak * 5);
    await get().fetchHabits();
    await get().fetchFeed();
  },

  skipHabit: async (id, reason) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    const todayStr = new Date().toISOString().split('T')[0];

    const { error: logError } = await supabase
      .from('habit_logs')
      .upsert({
        habit_id: id,
        user_id: session.user.id,
        logged_date: todayStr,
        status: 'skipped',
        notes: '',
        mood: '',
        missed_reason: reason,
      });

    if (logError) throw logError;

    await get().addXP(10);
    await get().fetchHabits();
  },

  fetchFeed: async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    // Fetch activities
    const { data: actsData } = await supabase
      .from('activities')
      .select('*, profiles(username, display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!actsData) return;

    // Fetch comments and reactions for these activities
    const actIds = actsData.map((a) => a.id);

    const { data: reactionsData } = await supabase
      .from('reactions')
      .select('*')
      .in('activity_id', actIds);

    const { data: commentsData } = await supabase
      .from('comments')
      .select('*, profiles(username, display_name)')
      .in('activity_id', actIds);

    const reactionsMap: { [actId: string]: any[] } = {};
    reactionsData?.forEach((r) => {
      if (!reactionsMap[r.activity_id]) reactionsMap[r.activity_id] = [];
      reactionsMap[r.activity_id].push(r);
    });

    const commentsMap: { [actId: string]: any[] } = {};
    commentsData?.forEach((c) => {
      if (!commentsMap[c.activity_id]) commentsMap[c.activity_id] = [];
      commentsMap[c.activity_id].push(c);
    });

    const mappedFeed: FriendActivity[] = actsData.map((a: any) => {
      const reactionsRaw = reactionsMap[a.id] || [];
      const commentsRaw = commentsMap[a.id] || [];

      // Group reactions by type
      const reactionTypes = ['🔥', '💪', '👑', '⚡️', '🚀', '⭐️', '👟'];
      const reactions = reactionTypes.map((type) => {
        const matching = reactionsRaw.filter((r) => r.type === type);
        const userReacted = matching.some((r) => r.user_id === session.user.id);
        return {
          type,
          count: matching.length,
          userReacted,
        };
      });

      const comments = commentsRaw.map((c) => ({
        id: c.id,
        userName: c.profiles?.display_name || c.profiles?.username || 'Kaizen Friend',
        text: c.text,
        time: formatRelativeTime(c.created_at),
      }));

      return {
        id: a.id,
        userName: a.profiles?.display_name || a.profiles?.username || 'Kaizen Warrior',
        avatar: a.profiles?.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        action: a.action,
        habitName: a.habit_name,
        streak: a.streak,
        time: formatRelativeTime(a.created_at),
        reactions,
        comments,
      };
    });

    set({ feed: mappedFeed });
  },

  reactToActivity: async (activityId, reactionType) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    // Check if user already reacted
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('id')
      .eq('activity_id', activityId)
      .eq('user_id', session.user.id)
      .eq('type', reactionType)
      .maybeSingle();

    if (existingReaction) {
      // Remove it
      await supabase
        .from('reactions')
        .delete()
        .eq('id', existingReaction.id);
    } else {
      // Add it
      await supabase
        .from('reactions')
        .insert({
          activity_id: activityId,
          user_id: session.user.id,
          type: reactionType,
        });
    }

    await get().fetchFeed();
  },

  addCommentToActivity: async (activityId, text) => {
    if (!text.trim()) return;
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    await supabase
      .from('comments')
      .insert({
        activity_id: activityId,
        user_id: session.user.id,
        text: text.trim(),
      });

    await get().addXP(15);
    await get().fetchFeed();
  },

  fetchFriendsAndRequests: async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    // Fetch Profile first to update own user state
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      set({
        user: {
          name: profile.display_name || 'Kaizen Warrior',
          username: profile.username,
          avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
          level: profile.level,
          xp: profile.xp,
          xpToNextLevel: profile.xp_to_next_level,
          streak: profile.streak,
          consistencyScore: profile.consistency_score,
          friendCount: profile.friend_count,
          totalCompleted: profile.total_completed,
          neonTheme: profile.theme_color,
        },
      });
    }

    // Fetch friendships (friendship row contains user_id_1 and user_id_2)
    const { data: friendsData } = await supabase
      .from('friendships')
      .select('*, user1:profiles!friendships_user_id_1_fkey(id, username, display_name, avatar_url, streak, consistency_score), user2:profiles!friendships_user_id_2_fkey(id, username, display_name, avatar_url, streak, consistency_score)')
      .or(`user_id_1.eq.${session.user.id},user_id_2.eq.${session.user.id}`);

    const mappedFriends: Friend[] = (friendsData || []).map((f: any) => {
      const friendProfile = f.user_id_1 === session.user.id ? f.user2 : f.user1;
      return {
        id: friendProfile.id,
        name: friendProfile.display_name || friendProfile.username,
        username: friendProfile.username,
        avatar: friendProfile.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        streak: friendProfile.streak,
        consistencyScore: friendProfile.consistency_score,
      };
    });

    // Fetch pending requests
    const { data: requestsData } = await supabase
      .from('friend_requests')
      .select('*, sender:profiles!friend_requests_sender_id_fkey(id, username, display_name, avatar_url), receiver:profiles!friend_requests_receiver_id_fkey(id, username, display_name, avatar_url)')
      .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
      .eq('status', 'pending');

    const mappedRequests: FriendRequest[] = (requestsData || []).map((req: any) => {
      const isIncoming = req.receiver_id === session.user.id;
      const otherProfile = isIncoming ? req.sender : req.receiver;
      return {
        id: req.id,
        name: otherProfile.display_name || otherProfile.username,
        username: otherProfile.username,
        avatar: otherProfile.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        type: isIncoming ? 'incoming' : 'outgoing',
      };
    });

    set({ friends: mappedFriends, pendingRequests: mappedRequests });
  },

  sendFriendRequest: async (usernameToFind) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return { success: false, message: 'Auth session not found' };

    const query = usernameToFind.trim().toLowerCase();
    if (!query) return { success: false, message: 'Please enter a valid username.' };
    const normalized = query.startsWith('@') ? query : `@${query}`;

    // Find the profile of the friend
    const { data: targetProfile, error } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('username', normalized)
      .maybeSingle();

    if (!targetProfile) {
      return { success: false, message: 'User not found!' };
    }

    if (targetProfile.id === session.user.id) {
      return { success: false, message: 'You cannot friend request yourself!' };
    }

    // Try to insert request
    const { error: insertError } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: session.user.id,
        receiver_id: targetProfile.id,
        status: 'pending',
      });

    if (insertError) {
      return { success: false, message: 'Request already pending or friendship exists!' };
    }

    await get().fetchFriendsAndRequests();
    return { success: true, message: `Request sent to ${targetProfile.display_name || normalized}!` };
  },

  acceptFriendRequest: async (requestId) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    // Fetch the request details
    const { data: req } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!req) return;

    // Delete the request
    await supabase
      .from('friend_requests')
      .delete()
      .eq('id', requestId);

    // Create the friendship row (ensuring user_id_1 < user_id_2)
    const u1 = req.sender_id < req.receiver_id ? req.sender_id : req.receiver_id;
    const u2 = req.sender_id < req.receiver_id ? req.receiver_id : req.sender_id;

    await supabase
      .from('friendships')
      .insert({
        user_id_1: u1,
        user_id_2: u2,
      });

    await get().addXP(100);
    await get().fetchFriendsAndRequests();
  },

  declineFriendRequest: async (requestId) => {
    await supabase
      .from('friend_requests')
      .delete()
      .eq('id', requestId);
    await get().fetchFriendsAndRequests();
  },

  fetchChallenges: async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    // Fetch all challenges
    const { data: chsData } = await supabase
      .from('challenges')
      .select('*');

    if (!chsData) return;

    // Fetch user joined challenges
    const { data: userJoined } = await supabase
      .from('challenge_members')
      .select('challenge_id, progress')
      .eq('user_id', session.user.id);

    const joinedMap = new Map<string, number>();
    userJoined?.forEach((item) => {
      joinedMap.set(item.challenge_id, item.progress);
    });

    const mappedChallenges: Challenge[] = chsData.map((ch) => {
      const isJoined = joinedMap.has(ch.id);
      const progress = joinedMap.get(ch.id) || 0;

      return {
        id: ch.id,
        name: ch.name,
        description: ch.description,
        membersCount: ch.members_count,
        daysRemaining: ch.days_remaining,
        creator: ch.creator_name,
        progress,
        joined: isJoined,
        rewardXP: ch.reward_xp,
        badgeId: ch.badge_id || 'challenge-warrior',
      };
    });

    set({ challenges: mappedChallenges });
  },

  joinChallenge: async (challengeId) => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    const target = get().challenges.find((ch) => ch.id === challengeId);
    if (!target) return;

    if (target.joined) {
      // Leave
      await supabase
        .from('challenge_members')
        .delete()
        .eq('challenge_id', challengeId)
        .eq('user_id', session.user.id);
    } else {
      // Join
      await supabase
        .from('challenge_members')
        .insert({
          challenge_id: challengeId,
          user_id: session.user.id,
          progress: 0,
        });

      await get().addXP(200);
    }

    await get().fetchChallenges();
  },

  fetchChatMessages: async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    // Get current profile
    const currentUsername = get().user?.username;
    if (!currentUsername) return;

    // Fetch messages where sender is me OR receiver is my username
    const { data: msgsData } = await supabase
      .from('chat_messages')
      .select('*, profiles!chat_messages_sender_id_fkey(username)')
      .or(`sender_id.eq.${session.user.id},receiver_username.eq.${currentUsername}`)
      .order('created_at', { ascending: true });

    if (!msgsData) return;

    const messagesGrouped: { [friendUsername: string]: ChatMessage[] } = {};

    msgsData.forEach((m) => {
      const senderIsMe = m.sender_id === session.user.id;
      const senderUsername = m.profiles?.username || 'unknown';
      const friendUsername = senderIsMe ? m.receiver_username : senderUsername;

      if (!messagesGrouped[friendUsername]) {
        messagesGrouped[friendUsername] = [];
      }

      // Convert timestamp to HH:MM format
      const date = new Date(m.created_at);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      messagesGrouped[friendUsername].push({
        id: m.id,
        senderId: senderIsMe ? 'me' : friendUsername,
        text: m.text,
        time: timeStr,
      });
    });

    set({ chatMessages: messagesGrouped });
  },

  sendChatMessage: async (friendUsername, text) => {
    if (!text.trim()) return;
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;

    // Insert message
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_id: session.user.id,
        receiver_username: friendUsername,
        text: text.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    await get().fetchChatMessages();
  },
}));
