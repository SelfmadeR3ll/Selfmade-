import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { useUserStore } from '../../stores/userStore';
import { MacroRings } from '../../components/MacroRings';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const screenWidth = Dimensions.get('window').width - Spacing.lg * 2;

export default function HealthTab() {
  const { profile, dailyStats, weightHistory } = useUserStore();

  const chartData = weightHistory.length >= 2
    ? weightHistory.slice(-7)
    : [
        { date: '3/25', weight: 174 },
        { date: '3/26', weight: 173.5 },
        { date: '3/27', weight: 173 },
        { date: '3/28', weight: 172.8 },
        { date: '3/29', weight: 172.2 },
        { date: '3/30', weight: 171.8 },
        { date: '3/31', weight: 171 },
      ];

  const bodyFatPct = 18.5;
  const leanMass = Math.round((profile?.currentWeight ?? 171) * (1 - bodyFatPct / 100));
  const goalWeight = profile?.goalWeight ?? 160;
  const currentWeight = profile?.currentWeight ?? 171;
  const weightLeft = Math.abs(currentWeight - goalWeight);
  const weeksLeft = Math.ceil(weightLeft / 1);
  const etaDate = new Date();
  etaDate.setDate(etaDate.getDate() + weeksLeft * 7);
  const eta = etaDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const linkedScreens = [
    { label: 'Workout', icon: 'barbell-outline', route: '/screens/workout', color: Colors.purple },
    { label: 'Food Log', icon: 'restaurant-outline', route: '/screens/food', color: Colors.orange },
    { label: 'Sleep', icon: 'moon-outline', route: '/screens/sleep', color: Colors.blue },
    { label: 'Water', icon: 'water-outline', route: '/screens/water', color: Colors.primary },
    { label: 'Wearables', icon: 'watch-outline', route: '/screens/wearables', color: Colors.textSecondary },
    { label: 'Photos', icon: 'camera-outline', route: '/screens/photos', color: Colors.orange },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health</Text>
          <TouchableOpacity onPress={() => router.push('/screens/wearables')}>
            <Ionicons name="watch-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Weight chart */}
        <Card style={{ overflow: 'hidden', padding: 0 }}>
          <View style={{ padding: Spacing.md }}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Weight Trend</Text>
              <Text style={styles.cardValue}>{currentWeight} lbs</Text>
            </View>
            <Text style={styles.cardSub}>
              Goal: {goalWeight} lbs · ETA {eta}
            </Text>
          </View>
          <LineChart
            data={{
              labels: chartData.map((d) => d.date.slice(-3)),
              datasets: [{ data: chartData.map((d) => d.weight) }],
            }}
            width={screenWidth + Spacing.lg * 2}
            height={120}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: Colors.card,
              backgroundGradientTo: Colors.card,
              decimalPlaces: 1,
              color: () => Colors.primary,
              labelColor: () => Colors.textMuted,
              propsForDots: { r: '4', strokeWidth: '2', stroke: Colors.primary },
              propsForBackgroundLines: { stroke: Colors.border },
            }}
            bezier
            style={{ marginLeft: -Spacing.lg }}
            withInnerLines={false}
            withOuterLines={false}
          />
        </Card>

        {/* Macros */}
        <Card>
          <Text style={styles.cardTitle}>Today's Macros</Text>
          <MacroRings
            protein={dailyStats?.protein ?? 0}
            proteinTarget={dailyStats?.proteinTarget ?? 180}
            carbs={dailyStats?.carbs ?? 0}
            carbsTarget={dailyStats?.carbsTarget ?? 220}
            fat={dailyStats?.fat ?? 0}
            fatTarget={dailyStats?.fatTarget ?? 65}
          />
          <ProgressBar
            label="Calories"
            current={dailyStats?.calories ?? 0}
            target={dailyStats?.calorieTarget ?? 2200}
            unit=" kcal"
            color={Colors.orange}
          />
        </Card>

        {/* Body stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Body Fat', value: `${bodyFatPct}%`, color: Colors.orange, icon: '📊' },
            { label: 'Lean Mass', value: `${leanMass} lbs`, color: Colors.primary, icon: '💪' },
            { label: 'Goal Weight', value: `${goalWeight} lbs`, color: Colors.purple, icon: '🎯' },
            { label: 'ETA', value: eta, color: Colors.blue, icon: '📅' },
          ].map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statEmoji}>{item.icon}</Text>
              <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Linked screens */}
        <Text style={styles.sectionTitle}>Track & Log</Text>
        <View style={styles.linksGrid}>
          {linkedScreens.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={styles.linkCard}
              onPress={() => router.push(s.route as any)}
            >
              <View style={[styles.linkIcon, { backgroundColor: `${s.color}18` }]}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
              </View>
              <Text style={styles.linkLabel}>{s.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  cardValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  cardSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    width: (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.xs },
  linksGrid: { gap: Spacing.xs },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500' },
});
