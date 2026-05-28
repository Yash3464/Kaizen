import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image, 
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { 
  MessageSquare, 
  Flame, 
  Sparkles, 
  Trophy, 
  Users, 
  Send,
  Plus,
  ShieldCheck,
  Zap,
  Target,
  ChevronLeft,
  UserPlus,
  UserCheck,
  Search,
  Check,
  X
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SocialScreen() {
  const { 
    feed, 
    reactToActivity, 
    addCommentToActivity, 
    user,
    friends,
    pendingRequests,
    chatMessages,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    sendChatMessage
  } = useApp();
  
  const [activeSegment, setActiveSegment] = useState<'feed' | 'squad' | 'chat'>('feed');
  const [commentInput, setCommentInput] = useState<{ [activityId: string]: string }>({});
  const [activeCommentSection, setActiveCommentSection] = useState<string | null>(null);

  // Friends & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Chat States
  const [activeChatFriendUsername, setActiveChatFriendUsername] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatScrollViewRef = useRef<ScrollView>(null);

  const handleSendComment = (activityId: string) => {
    const text = commentInput[activityId];
    if (!text || !text.trim()) return;
    addCommentToActivity(activityId, text.trim());
    setCommentInput(prev => ({ ...prev, [activityId]: '' }));
  };

  const handleSearchAndAdd = () => {
    if (!searchQuery.trim()) return;
    const res = sendFriendRequest(searchQuery);
    setSearchQuery('');
    setSearchStatus({ type: res.success ? 'success' : 'error', message: res.message });
    setTimeout(() => {
      setSearchStatus(null);
    }, 4000);
  };

  const handleSendChatMsg = () => {
    if (!activeChatFriendUsername || !chatInput.trim()) return;
    sendChatMessage(activeChatFriendUsername, chatInput.trim());
    setChatInput('');
    // auto-scroll
    setTimeout(() => {
      chatScrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.glowBlob, { backgroundColor: '#F3EAD8', top: -50, left: -50 }]} pointerEvents="none" />
      <View style={[styles.glowBlob, { backgroundColor: '#EADFC9', bottom: 100, right: -100 }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER BAR */}
        <View style={styles.header}>
          <Text style={styles.title}>Kaizen Circles</Text>
          <View style={styles.tabButtonsRow}>
            {['feed', 'squad', 'chat'].map((tab) => (
              <Pressable
                key={tab}
                style={[
                  styles.tabButton,
                  activeSegment === tab && styles.tabButtonActive
                ]}
                onPress={() => {
                  setActiveSegment(tab as any);
                  if (tab !== 'chat') {
                    setActiveChatFriendUsername(null);
                  }
                }}
              >
                <Text style={[styles.tabButtonText, activeSegment === tab && styles.tabButtonTextActive]}>
                  {tab === 'feed' ? 'Feed' : tab === 'squad' ? 'Squad' : 'Chats'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* FEED SEGMENT */}
          {activeSegment === 'feed' && (
            <View style={styles.feedContainer}>
              {feed.length === 0 ? (
                <View style={styles.emptySquadCard}>
                  <Users size={32} color="#52525b" />
                  <Text style={styles.emptySquadText}>Feed is quiet</Text>
                  <Text style={styles.emptySquadSubText}>Add friends under the "Squad" tab to see their consistency habits!</Text>
                </View>
              ) : (
                feed.map((activity) => (
                  <View key={activity.id} style={styles.feedCard}>
                    {/* User details */}
                    <View style={styles.cardHeader}>
                      <Image source={{ uri: activity.avatar }} style={styles.cardAvatar} />
                      <View style={styles.cardUserMeta}>
                        <Text style={styles.cardUserName}>{activity.userName}</Text>
                        <Text style={styles.cardTime}>{activity.time}</Text>
                      </View>
                      {activity.streak && (
                        <View style={styles.streakBadge}>
                          <Flame color="#ef4444" size={12} fill="#ef4444" />
                          <Text style={styles.streakBadgeText}>{activity.streak}d streak</Text>
                        </View>
                      )}
                    </View>

                    {/* Main activity content */}
                    <View style={styles.cardContent}>
                      <Text style={styles.actionText}>
                        {activity.action === 'completed habit' ? (
                          <>
                            Completed habit <Text style={styles.highlightText}>"{activity.habitName}"</Text>
                          </>
                        ) : activity.action === 'achieved perfect day' ? (
                          <Text style={styles.highlightText}>Achieved a Perfect Consistency Day! 🚀</Text>
                        ) : (
                          <>
                            Joined challenge <Text style={styles.highlightText}>"{activity.habitName}"</Text>
                          </>
                        )}
                      </Text>
                    </View>

                    {/* Reaction Buttons */}
                    <View style={styles.reactionRow}>
                      {activity.reactions.map((r, i) => (
                        <Pressable 
                          key={i} 
                          style={[
                            styles.reactionButton,
                            r.userReacted && styles.reactionButtonActive
                          ]}
                          onPress={() => reactToActivity(activity.id, r.type)}
                        >
                          <Text style={styles.reactionEmoji}>{r.type}</Text>
                          <Text style={[styles.reactionCount, r.userReacted && styles.reactionCountActive]}>
                            {r.count}
                          </Text>
                        </Pressable>
                      ))}
                      
                      <Pressable 
                        style={styles.commentToggleButton}
                        onPress={() => setActiveCommentSection(activeCommentSection === activity.id ? null : activity.id)}
                      >
                        <MessageSquare size={13} color="#a1a1aa" />
                        <Text style={styles.commentToggleText}>
                          {activity.comments.length}
                        </Text>
                      </Pressable>
                    </View>

                    {/* Comments section */}
                    {activeCommentSection === activity.id && (
                      <View style={styles.commentsSection}>
                        {activity.comments.map((comment) => (
                          <View key={comment.id} style={styles.commentItem}>
                            <Text style={styles.commentUserName}>{comment.userName}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                        ))}
                        
                        <View style={styles.commentInputRow}>
                          <TextInput
                            style={styles.commentInput}
                            placeholder="Type a cheer..."
                            placeholderTextColor="#6b7280"
                            value={commentInput[activity.id] || ''}
                            onChangeText={(val) => setCommentInput(prev => ({ ...prev, [activity.id]: val }))}
                          />
                          <Pressable 
                            style={styles.commentSendBtn}
                            onPress={() => handleSendComment(activity.id)}
                          >
                            <Send size={12} color="#ffffff" />
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          )}

          {/* SQUAD SEGMENT */}
          {activeSegment === 'squad' && (
            <View style={styles.squadContainer}>
              {/* SEARCH BOX */}
              <View style={styles.searchSection}>
                <Text style={styles.squadSubTitle}>Search by Friend ID</Text>
                <View style={styles.searchBar}>
                  <Search size={16} color="#71717a" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Enter username (e.g. @devon_lane)"
                    placeholderTextColor="#71717a"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                  />
                  <Pressable style={styles.searchBtn} onPress={handleSearchAndAdd}>
                    <UserPlus size={16} color="#ffffff" />
                  </Pressable>
                </View>

                {searchStatus && (
                  <View style={[
                    styles.statusBanner,
                    searchStatus.type === 'success' ? styles.statusSuccess : styles.statusError
                  ]}>
                    <Text style={styles.statusBannerText}>{searchStatus.message}</Text>
                  </View>
                )}
              </View>

              {/* INCOMING REQUESTS */}
              {pendingRequests.filter(r => r.type === 'incoming').length > 0 && (
                <View style={styles.requestsSection}>
                  <Text style={styles.sectionTitle}>Incoming Invites</Text>
                  {pendingRequests.filter(r => r.type === 'incoming').map((req) => (
                    <View key={req.id} style={styles.requestCard}>
                      <Image source={{ uri: req.avatar }} style={styles.requestAvatar} />
                      <View style={styles.requestUserMeta}>
                        <Text style={styles.requestName}>{req.name}</Text>
                        <Text style={styles.requestUsername}>{req.username}</Text>
                      </View>
                      <View style={styles.requestActions}>
                        <Pressable style={[styles.actionReqBtn, styles.acceptReqBtn]} onPress={() => acceptFriendRequest(req.id)}>
                          <Check size={14} color="#ffffff" />
                        </Pressable>
                        <Pressable style={[styles.actionReqBtn, styles.declineReqBtn]} onPress={() => declineFriendRequest(req.id)}>
                          <X size={14} color="#ffffff" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* OUTGOING REQUESTS */}
              {pendingRequests.filter(r => r.type === 'outgoing').length > 0 && (
                <View style={styles.requestsSection}>
                  <Text style={styles.sectionTitle}>Sent Requests</Text>
                  {pendingRequests.filter(r => r.type === 'outgoing').map((req) => (
                    <View key={req.id} style={styles.requestCard}>
                      <Image source={{ uri: req.avatar }} style={styles.requestAvatar} />
                      <View style={styles.requestUserMeta}>
                        <Text style={styles.requestName}>{req.name}</Text>
                        <Text style={styles.requestUsername}>{req.username}</Text>
                      </View>
                      <Text style={styles.outgoingPendingText}>Pending...</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* SQUAD MEMBERS */}
              <View style={styles.squadListSection}>
                <Text style={styles.sectionTitle}>My Squad ({friends.length})</Text>
                {friends.length === 0 ? (
                  <View style={styles.emptySquadCard}>
                    <Users size={32} color="#52525b" />
                    <Text style={styles.emptySquadText}>Your Squad is empty.</Text>
                    <Text style={styles.emptySquadSubText}>Search for user ID "@devon_lane" or "@elon" above to add friends!</Text>
                  </View>
                ) : (
                  friends.map((friend) => (
                    <View key={friend.id} style={styles.friendSquadCard}>
                      <Image source={{ uri: friend.avatar }} style={styles.friendSquadAvatar} />
                      <View style={styles.friendSquadMeta}>
                        <Text style={styles.friendSquadName}>{friend.name}</Text>
                        <Text style={styles.friendSquadUsername}>{friend.username}</Text>
                      </View>
                      <View style={styles.friendSquadActions}>
                        <View style={styles.friendSquadStreak}>
                          <Flame color="#ef4444" size={12} fill="#ef4444" />
                          <Text style={styles.friendSquadStreakText}>{friend.streak}d</Text>
                        </View>
                        <Pressable 
                          style={styles.friendSquadChatBtn}
                          onPress={() => {
                            setActiveChatFriendUsername(friend.username);
                            setActiveSegment('chat');
                          }}
                        >
                          <MessageSquare size={13} color="#ffffff" />
                          <Text style={styles.friendSquadChatText}>Chat</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {/* CHAT SEGMENT */}
          {activeSegment === 'chat' && (
            <View style={styles.chatContainer}>
              {activeChatFriendUsername === null ? (
                // LIST OF CHATS
                <View style={styles.chatFriendList}>
                  <Text style={styles.sectionTitle}>Messages</Text>
                  {friends.length === 0 ? (
                    <View style={styles.emptySquadCard}>
                      <MessageSquare size={32} color="#52525b" />
                      <Text style={styles.emptySquadText}>No chats active</Text>
                      <Text style={styles.emptySquadSubText}>Connect with friends in the Squad tab to start messaging.</Text>
                    </View>
                  ) : (
                    friends.map((friend) => {
                      const msgs = chatMessages[friend.username] || [];
                      const lastMsg = msgs[msgs.length - 1];
                      return (
                        <Pressable 
                          key={friend.id} 
                          style={styles.chatFriendCard}
                          onPress={() => setActiveChatFriendUsername(friend.username)}
                        >
                          <Image source={{ uri: friend.avatar }} style={styles.chatFriendAvatar} />
                          <View style={styles.chatFriendMeta}>
                            <Text style={styles.chatFriendName}>{friend.name}</Text>
                            <Text style={styles.chatLastMessage} numberOfLines={1}>
                              {lastMsg ? lastMsg.text : "No messages yet. Send a cheer! 👋"}
                            </Text>
                          </View>
                          <ChevronLeft size={16} color="#71717a" style={{ transform: [{ rotate: '180deg' }] }} />
                        </Pressable>
                      );
                    })
                  )}
                </View>
              ) : (
                // ACTIVE CHAT SCREEN
                (() => {
                  const friend = friends.find(f => f.username === activeChatFriendUsername) || {
                    name: 'Friend',
                    username: activeChatFriendUsername,
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                  };
                  const msgs = chatMessages[activeChatFriendUsername] || [];
                  return (
                    <View style={styles.activeChatWrapper}>
                      {/* Active Chat Header */}
                      <View style={styles.activeChatHeader}>
                        <Pressable style={styles.chatBackBtn} onPress={() => setActiveChatFriendUsername(null)}>
                          <ChevronLeft size={18} color="#ffffff" />
                        </Pressable>
                        <Image source={{ uri: friend.avatar }} style={styles.activeChatAvatar} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.activeChatName}>{friend.name}</Text>
                          <Text style={styles.activeChatUsername}>{friend.username}</Text>
                        </View>
                      </View>

                      {/* Chat messages area */}
                      <ScrollView 
                        ref={chatScrollViewRef}
                        style={styles.chatScroll}
                        contentContainerStyle={styles.chatScrollContent}
                        onContentSizeChange={() => chatScrollViewRef.current?.scrollToEnd({ animated: true })}
                      >
                        {msgs.length === 0 ? (
                          <View style={styles.emptyChatBanner}>
                            <Text style={styles.emptyChatBannerText}>This is the start of your consistency journey with {friend.name}.</Text>
                            <Text style={styles.emptyChatBannerSub}>Type a message to motivate them! 🚀</Text>
                          </View>
                        ) : (
                          msgs.map((msg) => {
                            const isMe = msg.senderId === 'me';
                            return (
                              <View 
                                key={msg.id} 
                                style={[
                                  styles.msgRow, 
                                  isMe ? styles.myMsgRow : styles.friendMsgRow
                                ]}
                              >
                                <View style={[
                                  styles.msgBubble, 
                                  isMe ? styles.myMsgBubble : styles.friendMsgBubble
                                ]}>
                                  <Text style={[
                                    styles.msgText,
                                    isMe ? styles.myMsgText : styles.friendMsgText
                                  ]}>
                                    {msg.text}
                                  </Text>
                                  <Text style={styles.msgTime}>{msg.time}</Text>
                                </View>
                              </View>
                            );
                          })
                        )}
                      </ScrollView>

                      {/* Input area */}
                      <View style={styles.chatInputRow}>
                        <TextInput
                          style={styles.chatTextInput}
                          placeholder="Type a message..."
                          placeholderTextColor="#71717a"
                          value={chatInput}
                          onChangeText={setChatInput}
                          onSubmitEditing={handleSendChatMsg}
                        />
                        <Pressable style={styles.chatSendBtn} onPress={handleSendChatMsg}>
                          <Send size={14} color="#ffffff" />
                        </Pressable>
                      </View>
                    </View>
                  );
                })()
              )}
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    color: '#2D2820',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  tabButtonsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#F3EAD8',
  },
  tabButtonText: {
    color: '#7A7265',
    fontSize: 12,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#B5945F',
  },
  feedContainer: {
    gap: 16,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  cardUserMeta: {
    flex: 1,
  },
  cardUserName: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '700',
  },
  cardTime: {
    color: '#7A7265',
    fontSize: 11.5,
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9F5EB',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  streakBadgeText: {
    color: '#B5945F',
    fontSize: 10,
    fontWeight: '700',
  },
  cardContent: {
    marginBottom: 14,
  },
  actionText: {
    color: '#7A7265',
    fontSize: 13.5,
    lineHeight: 19,
  },
  highlightText: {
    color: '#2D2820',
    fontWeight: '700',
  },
  reactionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  reactionButtonActive: {
    backgroundColor: '#F3EAD8',
    borderColor: '#B5945F',
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '700',
  },
  reactionCountActive: {
    color: '#B5945F',
  },
  commentToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  commentToggleText: {
    color: '#7A7265',
    fontSize: 11,
    fontWeight: '700',
  },
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FAF6EE',
    paddingTop: 12,
    gap: 8,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  commentUserName: {
    color: '#2D2820',
    fontSize: 11.5,
    fontWeight: '700',
  },
  commentText: {
    color: '#7A7265',
    fontSize: 11.5,
    flex: 1,
  },
  commentInputRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 10,
    color: '#2D2820',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  commentSendBtn: {
    backgroundColor: '#B5945F',
    borderRadius: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squadContainer: {
    gap: 16,
  },
  squadSubTitle: {
    color: '#7A7265',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: {
    flex: 1,
    color: '#2D2820',
    fontSize: 14,
    height: '100%',
  },
  searchBtn: {
    backgroundColor: '#B5945F',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBanner: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusSuccess: {
    backgroundColor: 'rgba(156, 169, 134, 0.08)',
    borderColor: 'rgba(156, 169, 134, 0.2)',
  },
  statusError: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusBannerText: {
    color: '#2D2820',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  requestsSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  sectionTitle: {
    color: '#2D2820',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 14,
    padding: 10,
  },
  requestAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  requestUserMeta: {
    flex: 1,
  },
  requestName: {
    color: '#2D2820',
    fontSize: 13,
    fontWeight: '700',
  },
  requestUsername: {
    color: '#7A7265',
    fontSize: 11,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionReqBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptReqBtn: {
    backgroundColor: '#9CA986',
  },
  declineReqBtn: {
    backgroundColor: '#ef4444',
  },
  outgoingPendingText: {
    color: '#B5945F',
    fontSize: 11,
    fontWeight: '700',
  },
  squadListSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  emptySquadCard: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
    gap: 8,
  },
  emptySquadText: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  emptySquadSubText: {
    color: '#7A7265',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  friendSquadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 18,
    padding: 12,
  },
  friendSquadAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  friendSquadMeta: {
    flex: 1,
  },
  friendSquadName: {
    color: '#2D2820',
    fontSize: 13.5,
    fontWeight: '700',
  },
  friendSquadUsername: {
    color: '#7A7265',
    fontSize: 11,
  },
  friendSquadActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendSquadStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  friendSquadStreakText: {
    color: '#B5945F',
    fontSize: 11,
    fontWeight: '700',
  },
  friendSquadChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#B5945F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  friendSquadChatText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  chatContainer: {
    gap: 16,
  },
  chatFriendList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  chatFriendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 18,
    padding: 12,
  },
  chatFriendAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  chatFriendMeta: {
    flex: 1,
  },
  chatFriendName: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '700',
  },
  chatLastMessage: {
    color: '#7A7265',
    fontSize: 12,
    marginTop: 2,
  },
  activeChatWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    overflow: 'hidden',
  },
  activeChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderBottomWidth: 1,
    borderBottomColor: '#EAE1D2',
    padding: 12,
  },
  chatBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#EAE1D2',
  },
  activeChatAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  activeChatName: {
    color: '#2D2820',
    fontSize: 13.5,
    fontWeight: '700',
  },
  activeChatUsername: {
    color: '#7A7265',
    fontSize: 11,
  },
  chatScroll: {
    height: 300,
    backgroundColor: '#FAF6EE',
  },
  chatScrollContent: {
    padding: 12,
    gap: 10,
  },
  emptyChatBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyChatBannerText: {
    color: '#2D2820',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyChatBannerSub: {
    color: '#7A7265',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  msgRow: {
    flexDirection: 'row',
    width: '100%',
  },
  myMsgRow: {
    justifyContent: 'flex-end',
  },
  friendMsgRow: {
    justifyContent: 'flex-start',
  },
  msgBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  myMsgBubble: {
    backgroundColor: '#F3EAD8',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderBottomRightRadius: 4,
  },
  friendMsgBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  myMsgText: {
    color: '#2D2820',
  },
  friendMsgText: {
    color: '#2D2820',
  },
  msgTime: {
    color: '#7A7265',
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAE1D2',
    padding: 10,
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    color: '#2D2820',
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
  },
  chatSendBtn: {
    backgroundColor: '#B5945F',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
