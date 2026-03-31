import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors, FontSize } from '../constants/theme';

interface Props {
  score: number; // 0–100
  size?: number;
}

export function VitalityOrb({ score, size = 180 }: Props) {
  const animatedScore = useRef(new Animated.Value(0)).current;
  const displayScore = useRef(0);

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    animatedScore.addListener(({ value }) => {
      displayScore.current = Math.round(value);
    });
    return () => animatedScore.removeAllListeners();
  }, [score]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const getScoreColor = () => {
    if (score >= 80) return Colors.primary;
    if (score >= 60) return Colors.orange;
    if (score >= 40) return Colors.blue;
    return Colors.red;
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Great';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Glow effect */}
      <View
        style={[
          styles.glow,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            backgroundColor: getScoreColor(),
          },
        ]}
      />

      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00C896" />
            <Stop offset="100%" stopColor="#7C5CFC" />
          </SvgGradient>
        </Defs>

        {/* Background ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Progress ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#orbGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreNumber, { color: getScoreColor() }]}>{score}</Text>
        <Text style={styles.scoreLabel}>{getScoreLabel()}</Text>
        <Text style={styles.scoreSubLabel}>Vitality Score</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    opacity: 0.08,
  },
  scoreContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
  },
  scoreLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  scoreSubLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
