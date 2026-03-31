import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../constants/theme';

interface Props {
  label?: string;
  current: number;
  target: number;
  color?: string;
  showValues?: boolean;
  unit?: string;
  height?: number;
}

export function ProgressBar({
  label,
  current,
  target,
  color = Colors.primary,
  showValues = true,
  unit = '',
  height = 8,
}: Props) {
  const progress = Math.min(current / (target || 1), 1);

  return (
    <View style={styles.container}>
      {(label || showValues) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValues && (
            <Text style={styles.values}>
              <Text style={{ color }}>{current}</Text>
              <Text style={styles.target}>/{target}{unit}</Text>
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              backgroundColor: color,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  values: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  target: {
    color: Colors.textMuted,
    fontWeight: '400',
  },
  track: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.full,
  },
});
