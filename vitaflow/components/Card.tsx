import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  variant?: 'default' | 'surface' | 'elevated';
}

export function Card({ children, style, padding = Spacing.md, variant = 'default' }: Props) {
  const bgColors: Record<string, string> = {
    default: Colors.card,
    surface: Colors.surface,
    elevated: Colors.surface2,
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bgColors[variant], padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
