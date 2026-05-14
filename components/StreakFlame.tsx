import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

interface StreakFlameProps {
  streak: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const StreakFlame: React.FC<StreakFlameProps> = ({ streak }) => {
  // Base scale calculation: starts at 0.5, caps at 1.5 for 100+ days
  const baseScale = Math.min(0.5 + (streak / 100), 1.5);
  
  const scale = useSharedValue(baseScale);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    if (streak > 0) {
      scale.value = withRepeat(
        withSequence(
          withTiming(baseScale * 1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(baseScale, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.8, { duration: 600 })
        ),
        -1,
        true
      );
    }
  }, [streak, baseScale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (streak === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path 
            d="M12 2C12 2 17 6.5 17 11.5C17 15.5 14.5 18 12 18C9.5 18 7 15.5 7 11.5C7 6.5 12 2 12 2Z" 
            fill="url(#flameGradient)" 
          />
          <Path 
            d="M12 2C12 2 14.5 6.5 14.5 11.5C14.5 14 13 15 12 15C11 15 9.5 14 9.5 11.5C9.5 6.5 12 2 12 2Z" 
            fill="#FFD600" 
          />
          <Defs>
            <LinearGradient id="flameGradient" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#FFD600" />
              <Stop offset="1" stopColor="#FF6B00" />
            </LinearGradient>
          </Defs>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  }
});
