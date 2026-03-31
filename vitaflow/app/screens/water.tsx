import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const QUICK_AMOUNTS = [8, 12, 16, 20, 24, 32];

export default function WaterScreen() {
  const { dailyStats, updateDailyStats, addXP } = useUserStore();
  const water = dailyStats?.water ?? 0;
  const target = dailyStats?.waterTarget ?? 64;
  const progress = Math.min(water / target, 1);

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleLog = (oz: number) => {
    const newWater = water + oz;
    updateDailyStats({ water: newWater });
    if (newWater >= target && water < target) {
      addXP(5);
      Alert.alert('Daily Goal Reached! 💧', `You hit your ${target}oz water goal! +5 XP`);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Water</Text>
        </View>

        {/* Ring */}
        <View style={styles.ringSection}>
          <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
              <Circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={Colors.surface2} strokeWidth={strokeWidth} />
              <Circle
                cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke={Colors.blue} strokeWidth={strokeWidth}
                strokeLinecap="round" strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                rotation="-90" origin={`${size / 2}, ${size / 2}`}
              />
            </Svg>
            <View style={styles.ringCenter}>
              <Text style={styles.ringValue}>{water}</Text>
              <Text style={styles.ringUnit}>/ {target} oz</Text>
              <Text style={styles.ringLabel}>{Math.round(progress * 100)}% of goal</Text>
            </View>
          </View>
        </View>

        {/* Quick log */}
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickGrid}>
          {QUICK_AMOUNTS.map((oz) => (
            <TouchableOpacity
              key={oz}
              style={styles.quickBtn}
              onPress={() => handleLog(oz)}
            >
              <Text style={styles.quickBtnOz}>+{oz}</Text>
              <Text style={styles.quickBtnLabel}>oz</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reset */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => updateDailyStats({ water: 0 })}
        >
          <Ionicons name="refresh" size={16} color={Colors.textMuted} />
          <Text style={styles.resetText}>Reset today's log</Text>
        </TouchableOpacity>

        {/* Tips */}
        <Card>
          <Text style={styles.cardTitle}>Hydration Tips</Text>
          {[
            { tip: `Drink ${Math.round(target / 8)} glasses of water today based on your weight`, icon: '💧' },
            { tip: 'Drink a glass before each meal to control appetite', icon: '🥛' },
            { tip: 'Add lemon or cucumber for electrolytes and flavor', icon: '🍋' },
          ].map((t, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipIcon}>{t.icon}</Text>
              <Text style={styles.tipText}>{t.tip}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.md, gap: Spacing.sm },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  ringSection: { alignItems: 'center', paddingVertical: Spacing.md },
  ringCenter: { alignItems: 'center' },
  ringValue: { fontSize: 48, fontWeight: '800', color: Colors.blue },
  ringUnit: { fontSize: FontSize.md, color: Colors.textMuted },
  ringLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickBtn: {
    flex: 1,
    minWidth: 80,
    backgroundColor: `${Colors.blue}18`,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: `${Colors.blue}30`,
  },
  quickBtnOz: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.blue },
  quickBtnLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs },
  resetText: { color: Colors.textMuted, fontSize: FontSize.sm },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  tipRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, alignItems: 'flex-start' },
  tipIcon: { fontSize: 18 },
  tipText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
});
