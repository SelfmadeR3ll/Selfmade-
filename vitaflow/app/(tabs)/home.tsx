import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { callClaude, buildVitaSystemPrompt } from '../../lib/claude';
import { VitalityOrb } from '../../components/VitalityOrb';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

function computeVitalityScore(stats: ReturnType<typeof useUserStore.getState>['dailyStats']): number {
  if (!stats) return 0;
  let score = 0;
  score += Math.min((stats.calories / (stats.calorieTarget || 1)) * 25, 25);
  score += Math.min((stats.steps / (stats.stepTarget || 1)) * 20, 20);
  score += Math.min((stats.water / (stats.waterTarget || 1)) * 15, 15);
  score += Math.min(((stats.calorieTarget - stats.spend) / (stats.calorieTarget || 1)) * 10, 10);
  if (stats.sleepScore > 0) score += (stats.sleepScore / 100) * 20;
  if (stats.hrv > 0) score += Math.min((stats.hrv / 80) * 10, 10);
  return Math.round(Math.min(score, 100));
}

export default function HomeTab() {
  const { profile, dailyStats, gamification, subscriptionTier, updateDailyStats } = useUserStore();
  const [greeting, setGreeting] = useState('');
  const [greetingLoading, setGreetingLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const vitalityScore = computeVitalityScore(dailyStats);
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    loadGreeting();
  }, []);

  const loadGreeting = async () => {
    setGreetingLoading(true);
    try {
      const systemPrompt = buildVitaSystemPrompt(profile, dailyStats);
      const msg = await callClaude(
        `Give a short (1-2 sentences), warm, personalized morning greeting for ${profile?.name ?? 'the user'} based on their profile. Reference one specific thing from their data. No preamble.`,
        systemPrompt
      );
      setGreeting(msg);
    } catch {
      setGreeting(`${timeGreeting}, ${profile?.name ?? 'there'}! Ready to crush your goals today?`);
    } finally {
      setGreetingLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGreeting();
    setRefreshing(false);
  };

  const quickActions = [
    { label: 'Log Meal', icon: 'restaurant-outline', route: '/screens/food', color: Colors.orange },
    { label: 'Log Workout', icon: 'barbell-outline', route: '/screens/workout', color: Colors.purple },
    { label: 'Log Water', icon: 'water-outline', route: '/screens/water', color: Colors.blue },
    { label: 'Log Mood', icon: 'happy-outline', route: '/screens/mood', color: Colors.primary },
  ];

  const stats = [
    {
      label: 'Calories',
      value: dailyStats?.calories ?? 0,
      target: dailyStats?.calorieTarget ?? 2200,
      unit: 'kcal',
      color: Colors.orange,
      icon: 'flame-outline',
    },
    {
      label: 'Steps',
      value: dailyStats?.steps ?? 0,
      target: dailyStats?.stepTarget ?? 10000,
      unit: '',
      color: Colors.primary,
      icon: 'footsteps-outline',
    },
    {
      label: 'Water',
      value: dailyStats?.water ?? 0,
      target: dailyStats?.waterTarget ?? 64,
      unit: 'oz',
      color: Colors.blue,
      icon: 'water-outline',
    },
    {
      label: 'Spend',
      value: `$${(dailyStats?.spend ?? 0).toFixed(0)}`,
      target: `$${dailyStats?.spendTarget ?? 50}`,
      unit: '',
      color: Colors.purple,
      icon: 'card-outline',
      isText: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>{timeGreeting} 👋</Text>
            <Text style={styles.headerName}>{profile?.name ?? 'Athlete'}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.push('/screens/profile')}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {(profile?.name?.[0] ?? 'U').toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Vita greeting */}
        {greeting ? (
          <Card style={styles.greetingCard}>
            <View style={styles.greetingRow}>
              <LinearGradient
                colors={['#00C896', '#7C5CFC']}
                style={styles.vitaIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>V</Text>
              </LinearGradient>
              <Text style={styles.greetingText}>{greeting}</Text>
            </View>
          </Card>
        ) : null}

        {/* Vitality Score orb */}
        <View style={styles.orbSection}>
          <VitalityOrb score={vitalityScore} size={200} />
          <View style={styles.streakBadge}>
            <Text style={styles.streakFlame}>🔥</Text>
            <Text style={styles.streakText}>{gamification.streak} day streak</Text>
          </View>
        </View>

        {/* Today's stats row */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: `${s.color}18` }]}>
                <Ionicons name={s.icon as any} size={16} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.isText ? s.value : s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              {!s.isText && (
                <ProgressBar
                  current={s.value as number}
                  target={s.target as number}
                  color={s.color}
                  showValues={false}
                  height={3}
                  unit={s.unit}
                />
              )}
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickActionsRow}>
          {quickActions.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={styles.quickAction}
              onPress={() => router.push(a.route as any)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${a.color}18` }]}>
                <Ionicons name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={styles.quickActionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly summary teaser */}
        <Card style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.weeklyTitle}>This Week</Text>
            <TouchableOpacity>
              <Text style={styles.weeklyLink}>View full report →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weeklyStats}>
            {[
              { label: 'Workouts', value: '3', icon: '🏋️' },
              { label: 'Avg Sleep', value: '7.2h', icon: '😴' },
              { label: 'Saved', value: '$142', icon: '💰' },
              { label: 'XP Earned', value: `${gamification.xp}`, icon: '⚡' },
            ].map((item) => (
              <View key={item.label} style={styles.weeklyStatItem}>
                <Text style={styles.weeklyStatEmoji}>{item.icon}</Text>
                <Text style={styles.weeklyStatValue}>{item.value}</Text>
                <Text style={styles.weeklyStatLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Upgrade banner for free users */}
        {subscriptionTier === 'free' && (
          <TouchableOpacity
            onPress={() => router.push('/screens/billing')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#00C896', '#7C5CFC']}
              style={styles.upgradeBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View>
                <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
                <Text style={styles.upgradeSubtitle}>Unlock unlimited Vita AI + all features</Text>
              </View>
              <View style={styles.upgradeCta}>
                <Text style={styles.upgradeCtaText}>7 days free</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md },
  headerSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  headerName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  profileBtn: {},
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.primary}20`,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary },
  greetingCard: { backgroundColor: `${Colors.primary}0F` },
  greetingRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  vitaIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  greetingText: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md, lineHeight: 22 },
  orbSection: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Colors.orange}18`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: `${Colors.orange}30`,
  },
  streakFlame: { fontSize: 16 },
  streakText: { color: Colors.orange, fontWeight: '700', fontSize: FontSize.sm },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statIconBg: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: FontSize.lg, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  weeklyCard: { gap: Spacing.md },
  weeklyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weeklyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  weeklyLink: { fontSize: FontSize.sm, color: Colors.primary },
  weeklyStats: { flexDirection: 'row', justifyContent: 'space-between' },
  weeklyStatItem: { alignItems: 'center', gap: 4 },
  weeklyStatEmoji: { fontSize: 22 },
  weeklyStatValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  weeklyStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  upgradeBanner: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upgradeTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#fff' },
  upgradeSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  upgradeCta: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  upgradeCtaText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
});
