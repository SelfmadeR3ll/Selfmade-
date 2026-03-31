import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function ProfileScreen() {
  const { profile, gamification, subscriptionTier, reset } = useUserStore();

  const LEVEL_EMOJIS: Record<string, string> = {
    'New Starter': '🌱', Consistent: '💪', Dedicated: '🔥',
    Committed: '⚡', Elite: '🏆', 'Vita Legend': '👑',
  };

  const stats = [
    { label: 'Current Weight', value: `${profile?.currentWeight ?? 0} lbs` },
    { label: 'Goal Weight', value: `${profile?.goalWeight ?? 0} lbs` },
    { label: 'Height', value: `${profile?.height ?? 0} in` },
    { label: 'Age', value: `${profile?.age ?? 0} yrs` },
    { label: 'Activity', value: profile?.activityLevel?.replace('_', ' ') ?? 'Moderate' },
    { label: 'Goal', value: profile?.goal?.replace('_', ' ') ?? 'Fitness' },
  ];

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: () => { reset(); router.replace('/(auth)/signin'); },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/screens/settings')}>
            <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Avatar + info */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={['#00C896', '#7C5CFC']} style={styles.avatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.avatarInitial}>{(profile?.name?.[0] ?? 'U').toUpperCase()}</Text>
          </LinearGradient>
          <Text style={styles.name}>{profile?.name ?? 'Athlete'}</Text>
          <Text style={styles.email}>{profile?.email || 'No email set'}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>
              {subscriptionTier === 'free' ? '🆓 Free Plan' : subscriptionTier === 'pro' ? '⭐ Pro' : '👨‍👩‍👧 Family'}
            </Text>
          </View>
        </View>

        {/* Level + streak */}
        <Card style={styles.levelCard}>
          <View style={styles.levelRow}>
            <Text style={styles.levelEmoji}>{LEVEL_EMOJIS[gamification.level] ?? '🌱'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelName}>{gamification.level}</Text>
              <Text style={styles.levelXP}>{gamification.xp.toLocaleString()} XP</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {gamification.streak} day streak</Text>
            </View>
          </View>
        </Card>

        {/* Body stats */}
        <Card>
          <Text style={styles.cardTitle}>Body Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Actions */}
        <Card>
          {[
            { label: 'Edit Goals', icon: 'trophy-outline', route: '/screens/goals' },
            { label: 'Wearables', icon: 'watch-outline', route: '/screens/wearables' },
            { label: 'Settings', icon: 'settings-outline', route: '/screens/settings' },
            { label: 'Refer a Friend', icon: 'share-outline', route: '/screens/referral' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.actionRow}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
              <Text style={styles.actionLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={Colors.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.md, gap: Spacing.sm },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  avatarSection: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  avatar: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: FontSize.xxxl, fontWeight: '800', color: '#fff' },
  name: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  email: { fontSize: FontSize.md, color: Colors.textMuted },
  planBadge: { backgroundColor: `${Colors.primary}18`, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: `${Colors.primary}30` },
  planText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  levelCard: {},
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  levelEmoji: { fontSize: 32 },
  levelName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  levelXP: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  streakBadge: { backgroundColor: `${Colors.orange}18`, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  streakText: { color: Colors.orange, fontWeight: '600', fontSize: FontSize.sm },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statItem: { width: '30%', flex: 1 },
  statValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  actionLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: `${Colors.red}30` },
  signOutText: { color: Colors.red, fontWeight: '600', fontSize: FontSize.md },
});
