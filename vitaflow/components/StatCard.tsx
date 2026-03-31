import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../constants/theme';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  subLabel?: string;
  color?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, unit, subLabel, color = Colors.primary, icon }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon && <View style={[styles.iconBg, { backgroundColor: `${color}18` }]}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color }]}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '500',
  },
  value: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  unit: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  subLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
