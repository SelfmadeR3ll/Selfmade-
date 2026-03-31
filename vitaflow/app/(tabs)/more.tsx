import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const MENU_ITEMS = [
  { label: 'Meal Planning', icon: 'calendar-outline', route: '/screens/meals', color: Colors.primary, emoji: '🥗' },
  { label: 'Smart Grocery', icon: 'cart-outline', route: '/screens/grocery', color: Colors.orange, emoji: '🛒' },
  { label: 'Calendar', icon: 'calendar', route: '/screens/calendar', color: Colors.blue, emoji: '📅' },
  { label: 'Games & XP', icon: 'game-controller-outline', route: '/screens/games', color: Colors.purple, emoji: '🎮' },
  { label: 'Goals', icon: 'trophy-outline', route: '/screens/goals', color: Colors.orange, emoji: '🎯' },
  { label: 'Bills', icon: 'receipt-outline', route: '/screens/bills', color: Colors.red, emoji: '📋' },
  { label: 'Wearables', icon: 'watch-outline', route: '/screens/wearables', color: Colors.primary, emoji: '⌚' },
  { label: 'Progress Photos', icon: 'camera-outline', route: '/screens/photos', color: Colors.purple, emoji: '📸' },
  { label: 'Profile', icon: 'person-outline', route: '/screens/profile', color: Colors.textSecondary, emoji: '👤' },
  { label: 'Settings', icon: 'settings-outline', route: '/screens/settings', color: Colors.textSecondary, emoji: '⚙️' },
  { label: 'Refer a Friend', icon: 'share-outline', route: '/screens/referral', color: Colors.primary, emoji: '🎁' },
  { label: 'Upgrade', icon: 'star-outline', route: '/screens/billing', color: Colors.orange, emoji: '⭐' },
];

export default function MoreTab() {
  const { profile, gamification, subscriptionTier } = useUserStore();

  const levelLabels: Record<string, string> = {
    'New Starter': '🌱',
    Consistent: '💪',
    Dedicated: '🔥',
    Committed: '⚡',
    Elite: '🏆',
    'Vita Legend': '👑',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
        </View>

        {/* Profile summary */}
        <LinearGradient colors={['#1E2437', '#13172A']} style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {(profile?.name?.[0] ?? 'U').toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.name ?? 'Athlete'}</Text>
            <Text style={styles.profileLevel}>
              {levelLabels[gamification.level] ?? '🌱'} {gamification.level} · {gamification.xp} XP
            </Text>
          </View>
          <View style={[styles.planBadge, subscriptionTier === 'pro' && { backgroundColor: `${Colors.primary}25`, borderColor: Colors.primary }]}>
            <Text style={[styles.planText, subscriptionTier === 'pro' && { color: Colors.primary }]}>
              {subscriptionTier === 'free' ? 'Free' : subscriptionTier === 'pro' ? 'Pro' : 'Family'}
            </Text>
          </View>
        </LinearGradient>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          {[
            { label: 'Streak', value: `${gamification.streak}d`, icon: '🔥' },
            { label: 'XP', value: gamification.xp.toString(), icon: '⚡' },
            { label: 'Badges', value: gamification.badges.length.toString(), icon: '🏅' },
          ].map((s) => (
            <View key={s.label} style={styles.quickStatItem}>
              <Text style={styles.quickStatEmoji}>{s.icon}</Text>
              <Text style={styles.quickStatValue}>{s.value}</Text>
              <Text style={styles.quickStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu grid */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.gridItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIcon, { backgroundColor: `${item.color}18` }]}>
                <Text style={styles.gridEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { paddingTop: Spacing.md },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  profileCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${Colors.primary}20`,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  profileName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  profileLevel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  planBadge: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planText: { color: Colors.textMuted, fontWeight: '700', fontSize: FontSize.sm },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  quickStatItem: { flex: 1, alignItems: 'center', gap: 4 },
  quickStatEmoji: { fontSize: 20 },
  quickStatValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  quickStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  gridItem: {
    width: '30%',
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 80,
  },
  gridIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  gridEmoji: { fontSize: 22 },
  gridLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },
});
