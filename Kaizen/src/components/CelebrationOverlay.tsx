import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export function CelebrationOverlay() {
  const { showCelebration, celebrationDetails, setShowCelebration } = useApp();
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-15);

  useEffect(() => {
    if (showCelebration) {
      // Trigger haptic feedback if native
      if (Platform.OS !== 'web') {
        try {
          const Haptics = require('expo-haptics');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {}
      }

      // Smooth enter animation
      opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
      translateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) });
      scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });

      // Exit smoothly after 3 seconds
      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) });
        scale.value = withTiming(0.95, { duration: 400, easing: Easing.in(Easing.quad) });
        translateY.value = withTiming(-15, { duration: 400, easing: Easing.in(Easing.quad) }, (finished) => {
          if (finished) {
            runOnJS(setShowCelebration)(false);
          }
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showCelebration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ]
    };
  });

  if (!showCelebration || !celebrationDetails) return null;

  const getEmojiAndGlow = () => {
    switch (celebrationDetails.type) {
      case 'levelup':
        return { emoji: '👑', glow: '#B5945F', label: 'Level Up' };
      case 'streak':
        return { emoji: '🔥', glow: '#E0A996', label: 'Streak Updated' };
      case 'habit':
        return { emoji: '✨', glow: '#9CA986', label: 'Ritual Created' };
      case 'focus':
        return { emoji: '🧠', glow: '#B5945F', label: 'Focus Earned' };
      default:
        return { emoji: '🎉', glow: '#D4A373', label: 'Achievement' };
    }
  };

  const info = getEmojiAndGlow();

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={[styles.glowBorder, { borderColor: info.glow }]} />
        <View style={styles.contentRow}>
          <Text style={styles.emoji}>{info.emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: info.glow }]}>{info.label}</Text>
            <Text style={styles.message}>{celebrationDetails.value}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: Math.min(width - 32, 340),
    borderWidth: 1,
    borderColor: '#EAE1D2',
    shadowColor: '#2D2820',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  glowBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  message: {
    color: '#2D2820',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});
