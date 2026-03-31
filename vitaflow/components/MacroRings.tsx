import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, FontSize, Spacing } from '../constants/theme';

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
  size?: number;
}

function MacroRing({ label, current, target, color, unit = 'g', size = 80 }: MacroRingProps) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / (target || 1), 1);
  const strokeDashoffset = circumference * (1 - progress);
  const pct = Math.round(progress * 100);

  return (
    <View style={styles.ringItem}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <Text style={[styles.pct, { color }]}>{pct}%</Text>
      </View>
      <Text style={styles.macroValue}>
        {current}
        <Text style={styles.macroUnit}>/{target}{unit}</Text>
      </Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

interface Props {
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

export function MacroRings({ protein, proteinTarget, carbs, carbsTarget, fat, fatTarget }: Props) {
  return (
    <View style={styles.container}>
      <MacroRing label="Protein" current={protein} target={proteinTarget} color={Colors.primary} />
      <MacroRing label="Carbs" current={carbs} target={carbsTarget} color={Colors.orange} />
      <MacroRing label="Fat" current={fat} target={fatTarget} color={Colors.purple} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  ringItem: {
    alignItems: 'center',
    gap: 4,
  },
  pct: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  macroValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  macroUnit: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  macroLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
