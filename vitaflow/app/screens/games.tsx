import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const LEVEL_THRESHOLDS = [0, 500, 1500, 3500, 7000, 15000];
const LEVEL_NAMES = ['New Starter', 'Consistent', 'Dedicated', 'Committed', 'Elite', 'Vita Legend'];
const LEVEL_EMOJIS = ['🌱', '💪', '🔥', '⚡', '🏆', '👑'];

const WEEKLY_CHALLENGES = [
  { id: 'workouts', label: 'Log 4 workouts', xp: 150, target: 4, current: 2, icon: '🏋️' },
  { id: 'budget', label: 'Stay under food budget', xp: 100, target: 1, current: 0, icon: '💰' },
  { id: 'sleep', label: '8h sleep 3 nights', xp: 75, target: 3, current: 1, icon: '😴' },
  { id: 'save', label: 'Save $50 this week', xp: 200, target: 50, current: 22, icon: '💵' },
  { id: 'mood', label: 'Log mood 7 days', xp: 50, target: 7, current: 3, icon: '😊' },
];

const BADGES = [
  { id: 'first_workout', label: 'First Workout', icon: '🏋️', earned: true },
  { id: 'week_streak', label: '7-Day Streak', icon: '🔥', earned: true },
  { id: 'budget_master', label: 'Budget Master', icon: '💰', earned: false },
  { id: 'sleep_champion', label: 'Sleep Champion', icon: '😴', earned: false },
  { id: 'macro_king', label: 'Macro King', icon: '🥗', earned: false },
  { id: 'savings_hero', label: 'Savings Hero', icon: '🦸', earned: false },
  { id: 'vita_legend_badge', label: 'Vita Legend', icon: '👑', earned: false },
  { id: '30_day', label: '30-Day Journey', icon: '🗓️', earned: false },
];

const XP_ACTIONS = [
  { action: 'Log a meal', xp: '+10 XP', icon: '🍽️' },
  { action: 'Complete a workout', xp: '+25 XP', icon: '🏋️' },
  { action: 'Log water goal', xp: '+5 XP', icon: '💧' },
  { action: 'Log mood', xp: '+5 XP', icon: '😊' },
  { action: 'Stay under budget', xp: '+20 XP', icon: '💰' },
  { action: 'Perfect sleep (7-9h)', xp: '+15 XP', icon: '😴' },
  { action: '7-day streak bonus', xp: '+100 XP', icon: '🔥' },
];

export default function GamesScreen() {
  const { gamification } = useUserStore();
  const { xp, level, streak, badges } = gamification;

  const levelIdx = LEVEL_NAMES.indexOf(level);
  const currentThreshold = LEVEL_THRESHOLDS[levelIdx] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[levelIdx + 1] ?? xp;
  const levelProgress = nextThreshold > currentThreshold
    ? (xp - currentThreshold) / (nextThreshold - currentThreshold)
    : 1;
  const xpToNext = nextThreshold - xp;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Games & XP</Text>
        </View>

        {/* Level card */}
        <LinearGradient colors={['#7C5CFC', '#00C896']} style={styles.levelCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.levelTop}>
            <Text style={styles.levelEmoji}>{LEVEL_EMOJIS[levelIdx] ?? '🌱'}</Text>
            <View>
              <Text style={styles.levelName}>{level}</Text>
              <Text style={styles.levelXP}>{xp.toLocaleString()} XP total</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak}d</Text>
            </View>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${levelProgress * 100}%` }]} />
          </View>
          <Text style={styles.xpToNext}>
            {levelIdx < LEVEL_NAMES.length - 1
              ? `${xpToNext.toLocaleString()} XP to ${LEVEL_NAMES[levelIdx + 1]}`
              : '🎉 Max level reached!'}
          </Text>
        </LinearGradient>

        {/* Weekly challenges */}
        <Text style={styles.sectionTitle}>Weekly Challenges</Text>
        <Text style={styles.sectionSub}>Resets Sunday midnight</Text>
        {WEEKLY_CHALLENGES.map((ch) => (
          <Card key={ch.id} style={ch.current >= ch.target ? styles.challengeComplete : {}}>
            <View style={styles.challengeRow}>
              <Text style={styles.challengeIcon}>{ch.icon}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.challengeHeader}>
                  <Text style={styles.challengeLabel}>{ch.label}</Text>
                  <Text style={[styles.challengeXP, ch.current >= ch.target && { color: Colors.primary }]}>
                    +{ch.xp} XP
                  </Text>
                </View>
                <ProgressBar
                  current={ch.current}
                  target={ch.target}
                  color={ch.current >= ch.target ? Colors.primary : Colors.purple}
                  showValues={true}
                  height={6}
                />
              </View>
              {ch.current >= ch.target && (
                <View style={styles.completeBadge}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </View>
          </Card>
        ))}

        {/* Badges */}
        <Text style={styles.sectionTitle}>Badge Collection</Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((badge) => (
            <View
              key={badge.id}
              style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}
            >
              <Text style={styles.badgeEmoji}>{badge.icon}</Text>
              <Text style={[styles.badgeLabel, !badge.earned && { color: Colors.textMuted }]}>
                {badge.label}
              </Text>
              {!badge.earned && (
                <View style={styles.lockIcon}>
                  <Ionicons name="lock-closed" size={10} color={Colors.textMuted} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* How to earn XP */}
        <Card>
          <Text style={styles.cardTitle}>How to Earn XP</Text>
          {XP_ACTIONS.map((a) => (
            <View key={a.action} style={styles.xpActionRow}>
              <Text style={styles.xpActionIcon}>{a.icon}</Text>
              <Text style={styles.xpActionLabel}>{a.action}</Text>
              <Text style={styles.xpActionXP}>{a.xp}</Text>
            </View>
          ))}
        </Card>

        {/* Level roadmap */}
        <Card>
          <Text style={styles.cardTitle}>Level Roadmap</Text>
          {LEVEL_NAMES.map((name, i) => (
            <View key={name} style={styles.levelRow}>
              <Text style={styles.levelRowEmoji}>{LEVEL_EMOJIS[i]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.levelRowName, levelIdx === i && { color: Colors.primary }]}>
                  {name} {levelIdx === i ? '← You' : ''}
                </Text>
                <Text style={styles.levelRowXP}>{LEVEL_THRESHOLDS[i].toLocaleString()} XP</Text>
              </View>
              {levelIdx > i && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
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
  levelCard: { borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.sm },
  levelTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  levelEmoji: { fontSize: 40 },
  levelName: { fontSize: FontSize.xl, fontWeight: '800', color: '#fff' },
  levelXP: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  streakBadge: { marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  streakText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
  xpBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: 8, backgroundColor: '#fff', borderRadius: 4 },
  xpToNext: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  sectionSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: -Spacing.sm },
  challengeComplete: { borderColor: `${Colors.primary}50`, backgroundColor: `${Colors.primary}08` },
  challengeRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  challengeIcon: { fontSize: 24 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  challengeLabel: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  challengeXP: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  completeBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  badgeItem: {
    width: '22%',
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 72,
    position: 'relative',
  },
  badgeItemLocked: { opacity: 0.5 },
  badgeEmoji: { fontSize: 28 },
  badgeLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  lockIcon: { position: 'absolute', top: 4, right: 4 },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  xpActionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.sm },
  xpActionIcon: { fontSize: 18 },
  xpActionLabel: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.md },
  xpActionXP: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
  levelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.sm },
  levelRowEmoji: { fontSize: 22 },
  levelRowName: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  levelRowXP: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
});
