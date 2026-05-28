import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Dimensions,
  TextInput,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { 
  BarChart2, 
  Brain, 
  TrendingUp, 
  Sparkles, 
  MessageSquare, 
  Send,
  Zap,
  Activity,
  Smile,
  ShieldAlert
} from 'lucide-react-native';
import Svg, { Rect, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface Message {
  sender: 'user' | 'coach';
  text: string;
  time: string;
}

export default function AnalyticsScreen() {
  const { habits, user } = useApp();
  const [activeTab, setActiveTab] = useState<'metrics' | 'coach'>('metrics');
  
  // AI Coach Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { 
      sender: 'coach', 
      text: 'Hey Rhythm! I analyzed your rituals for the past 2 weeks. Your physical habits are at 96% consistency, but coding rituals drop slightly after 8 PM due to mental fatigue. Ready to optimize?', 
      time: '10:30 AM' 
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  // Category completion rates
  const categories = [
    { name: 'Physical', rate: 96, color: '#D4A373', icon: 'dumbbell' },
    { name: 'Focus', rate: 82, color: '#B5945F', icon: 'code' },
    { name: 'Mind', rate: 100, color: '#9CA986', icon: 'brain' },
    { name: 'Growth', rate: 75, color: '#B39EAE', icon: 'book-open' },
  ];

  // Mood completions
  const moods = [
    { type: 'Energized', completion: 98, color: '#D4A373', count: 18 },
    { type: 'Focused', completion: 92, color: '#B5945F', count: 12 },
    { type: 'Calm', completion: 100, color: '#9CA986', count: 8 },
    { type: 'Tired', completion: 42, color: '#E0A996', count: 6 }
  ];

  const handleSendMessage = () => {
    if (!inputVal.trim()) return;
    const userMsg: Message = {
      sender: 'user',
      text: inputVal.trim(),
      time: 'Just now'
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Generate responsive coach reply
    setTimeout(() => {
      let replyText = "Fascinating query! I suggest building a micro-habit (5 mins minimum) on days when you feel tired. This preserves your neural pathways without inducing burnout.";
      
      const query = userMsg.text.toLowerCase();
      if (query.includes('sleep') || query.includes('tired')) {
        replyText = "Indeed. Sleep quality increases ritual compliance by 21%. I advise blocking out phone usage 45 mins before bedtime to stabilize REM sleep.";
      } else if (query.includes('streak') || query.includes('motivation')) {
        replyText = "Motivation is temporary, design systems are permanent. Your 14-day gym streak works because of cue consistency. Let's apply that cue structure to your coding rituals!";
      } else if (query.includes('burnout')) {
        replyText = "Burnout Warning: I noticed your Growth habits fell 15% this week. Reduce target goals by half for 3 days to recover your cognitive battery.";
      }

      const coachMsg: Message = {
        sender: 'coach',
        text: replyText,
        time: 'Just now'
      };
      setChatMessages(prev => [...prev, coachMsg]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.glowBlob, { backgroundColor: '#F3EAD8', top: -50, right: -50 }]} pointerEvents="none" />
      <View style={[styles.glowBlob, { backgroundColor: '#EADFC9', bottom: 100, left: -100 }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Consistency Intel</Text>
          <View style={styles.toggleRow}>
            <Pressable 
              style={[styles.toggleBtn, activeTab === 'metrics' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('metrics')}
            >
              <BarChart2 size={13} color={activeTab === 'metrics' ? '#B5945F' : '#7A7265'} />
              <Text style={[styles.toggleBtnText, activeTab === 'metrics' && styles.toggleBtnTextActive]}>Analytics</Text>
            </Pressable>
            <Pressable 
              style={[styles.toggleBtn, activeTab === 'coach' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('coach')}
            >
              <Sparkles size={13} color={activeTab === 'coach' ? '#B5945F' : '#7A7265'} />
              <Text style={[styles.toggleBtnText, activeTab === 'coach' && styles.toggleBtnTextActive]}>AI Coach</Text>
            </Pressable>
          </View>
        </View>

        {activeTab === 'metrics' ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* AI PREDICTIVE INSIGHT CARD */}
            <View style={styles.aiInsightCard}>
              <View style={styles.aiInsightHeader}>
                <Sparkles size={16} color="#B5945F" />
                <Text style={styles.aiInsightTitle}>AI Predictive Insights</Text>
              </View>
              <View style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Coding habits are 24% more successful when scheduled before 6 PM.</Text>
              </View>
              <View style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Streak compliance increases by 32% when friends react to your feed.</Text>
              </View>
              <View style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: '#E0A996' }]} />
                <Text style={[styles.bulletText, { color: '#8F5E52' }]}>Mild fatigue detected. Focus rituals have skipped 1 day. Recalibrating targets.</Text>
              </View>
            </View>

            {/* WEEKLY METRICS CHART (SVG) */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Weekly Productivity Index</Text>
              <View style={styles.chartCard}>
                <Svg width={width - 72} height={150}>
                  <Line x1="30" y1="20" x2="280" y2="20" stroke="rgba(45,40,32,0.05)" />
                  <Line x1="30" y1="60" x2="280" y2="60" stroke="rgba(45,40,32,0.05)" />
                  <Line x1="30" y1="100" x2="280" y2="100" stroke="rgba(45,40,32,0.05)" />
                  <Line x1="30" y1="130" x2="280" y2="130" stroke="rgba(45,40,32,0.1)" />
                  <SvgText x="5" y="25" fill="#7A7265" fontSize="10">100%</SvgText>
                  <SvgText x="5" y="65" fill="#7A7265" fontSize="10">60%</SvgText>
                  <SvgText x="5" y="105" fill="#7A7265" fontSize="10">30%</SvgText>
                  {[
                    { day: 'M', h: 100, x: 45 },
                    { day: 'T', h: 80, x: 80 },
                    { day: 'W', h: 110, x: 115 },
                    { day: 'T', h: 70, x: 150 },
                    { day: 'F', h: 95, x: 185 },
                    { day: 'S', h: 40, x: 220 },
                    { day: 'S', h: 50, x: 255 },
                  ].map((bar, i) => (
                    <React.Fragment key={i}>
                      <Rect x={bar.x} y={130 - bar.h} width="16" height={bar.h} rx="4" fill={bar.h > 80 ? 'url(#gradBlue)' : 'url(#gradPurple)'} />
                      <SvgText x={bar.x + 4} y="145" fill="#7A7265" fontSize="10">{bar.day}</SvgText>
                    </React.Fragment>
                  ))}
                  <Defs>
                    <LinearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1"><Stop offset="0%" stopColor="#D4A373" /><Stop offset="100%" stopColor="#B5945F" /></LinearGradient>
                    <LinearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1"><Stop offset="0%" stopColor="#9CA986" /><Stop offset="100%" stopColor="#B39EAE" /></LinearGradient>
                  </Defs>
                </Svg>
              </View>
            </View>

            {/* CATEGORY BREAKDOWN LIST */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Category Mastery</Text>
              <View style={styles.categoryStatsGrid}>
                {categories.map((cat, idx) => (
                  <View key={idx} style={styles.categoryMetricCard}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={[styles.categoryRate, { color: cat.color }]}>{cat.rate}%</Text>
                    </View>
                    <View style={styles.metricBarOuter}>
                      <View style={[styles.metricBarInner, { width: `${cat.rate}%`, backgroundColor: cat.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* MOOD CORRELATION */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Vibe Correlations</Text>
              <Text style={styles.sectionSubtitle}>How your emotional state drives completion success</Text>
              
              <View style={styles.moodCorrelationsContainer}>
                {moods.map((moodItem, idx) => (
                  <View key={idx} style={styles.moodRow}>
                    <View style={styles.moodLeft}>
                      <Smile size={14} color={moodItem.color} />
                      <Text style={styles.moodName}>{moodItem.type}</Text>
                      <Text style={styles.moodCount}>({moodItem.count} sessions)</Text>
                    </View>
                    <View style={styles.moodRight}>
                      <Text style={[styles.moodCompletionText, { color: moodItem.color }]}>
                        {moodItem.completion}% success
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: 75 }} />
          </ScrollView>
        ) : (
          <View style={styles.chatWrapper}>
            <ScrollView 
              style={styles.chatMessagesScroll} 
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            >
              {chatMessages.map((msg, idx) => {
                const isCoach = msg.sender === 'coach';
                return (
                  <View 
                    key={idx} 
                    style={[
                      styles.chatBubbleContainer, 
                      isCoach ? styles.chatBubbleLeft : styles.chatBubbleRight
                    ]}
                  >
                    {isCoach && (
                      <View style={styles.coachAvatarWrapper}>
                        <Sparkles size={12} color="#9CA986" />
                      </View>
                    )}
                    <View style={[
                      styles.chatBubble, 
                      isCoach ? styles.chatBubbleCoach : styles.chatBubbleUser
                    ]}>
                      <Text style={[
                        styles.chatText, 
                        isCoach ? styles.chatTextCoach : styles.chatTextUser
                      ]}>
                        {msg.text}
                      </Text>
                      <Text style={styles.chatTime}>{msg.time}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* CHAT INPUT PANEL */}
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Ask Coach Rhythm to check burnout limits..."
                placeholderTextColor="#7A7265"
                value={inputVal}
                onChangeText={setInputVal}
                onSubmitEditing={handleSendMessage}
              />
              <Pressable style={styles.chatSendBtn} onPress={handleSendMessage}>
                <Send size={16} color="#ffffff" />
              </Pressable>
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
  aiInsightCard: {
    backgroundColor: 'rgba(181, 148, 95, 0.08)',
    borderColor: 'rgba(181, 148, 95, 0.25)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiInsightTitle: {
    color: '#B5945F',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B5945F',
    marginTop: 6,
  },
  bulletText: {
    color: '#7A7265',
    fontSize: 12.5,
    flex: 1,
    lineHeight: 18,
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
    marginBottom: 14,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryStatsGrid: {
    gap: 12,
  },
  categoryMetricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    color: '#2D2820',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryRate: {
    fontSize: 13,
    fontWeight: '800',
  },
  metricBarOuter: {
    height: 6,
    backgroundColor: '#FAF6EE',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 206, 0.4)',
  },
  metricBarInner: {
    height: '100%',
    borderRadius: 3,
  },
  moodCorrelationsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF6EE',
  },
  moodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodName: {
    color: '#2D2820',
    fontSize: 13,
    fontWeight: '600',
  },
  moodCount: {
    color: '#7A7265',
    fontSize: 11,
  },
  moodRight: {
    alignItems: 'flex-end',
  },
  moodCompletionText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  chatWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FAF6EE',
  },
  chatMessagesScroll: {
    flex: 1,
  },
  chatBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  chatBubbleLeft: {
    alignSelf: 'flex-start',
  },
  chatBubbleRight: {
    alignSelf: 'flex-end',
  },
  coachAvatarWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAE1D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  chatBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatBubbleCoach: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderTopLeftRadius: 4,
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 5,
  },
  chatBubbleUser: {
    backgroundColor: '#F3EAD8',
    borderWidth: 1,
    borderColor: '#EAE1D2',
    borderTopRightRadius: 4,
  },
  chatText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#2D2820',
  },
  chatTextCoach: {
    color: '#2D2820',
  },
  chatTextUser: {
    color: '#2D2820',
    fontWeight: '500',
  },
  chatTime: {
    color: '#7A7265',
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAE1D2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 12,
    paddingBottom: Platform.OS === 'web' ? 24 : 36,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#FAF6EE',
    borderColor: '#EAE1D2',
    borderWidth: 1,
    borderRadius: 14,
    color: '#2D2820',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13.5,
  },
  chatSendBtn: {
    backgroundColor: '#B5945F',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B5945F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
