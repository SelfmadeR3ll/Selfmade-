import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';
import { useUserStore } from '../../stores/userStore';

const W = Dimensions.get('window').width - Spacing.lg * 2;

const SLEEP_STAGES = [
  { label: 'Deep', hours: 1.5, color: Colors.purple },
  { label: 'REM', hours: 1.8, color: Colors.primary },
  { label: 'Light', hours: 3.2, color: Colors.blue },
  { label: 'Awake', hours: 0.5, color: Colors.red },
];

export default function SleepScreen() {
  const { dailyStats } = useUserStore();
  const sleepHours = dailyStats?.sleep || 7.0;
  const sleepScore = dailyStats?.sleepScore || 78;
  const hrv = dailyStats?.hrv || 65;

  const weekData = [6.5, 7.2, 6.8, 8.0, 7.5, 6.9, 7.0];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.primary;
    if (score >= 60) return Colors.orange;
    return Colors.red;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sleep</Text>
        </View>

        {/* Last night summary */}
        <Card style={styles.heroCard}>
          <Text style={styles.heroLabel}>LAST NIGHT</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroValue}>{sleepHours}h</Text>
              <Text style={styles.heroStatLabel}>Duration</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroValue, { color: getScoreColor(sleepScore) }]}>
                {sleepScore}
              </Text>
              <Text style={styles.heroStatLabel}>Quality Score</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroValue, { color: Colors.purple }]}>{hrv}</Text>
              <Text style={styles.heroStatLabel}>HRV (ms)</Text>
            </View>
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: `${getScoreColor(sleepScore)}15`, borderColor: `${getScoreColor(sleepScore)}40` }]}>
            <Text style={[styles.scoreBadgeText, { color: getScoreColor(sleepScore) }]}>
              {sleepScore >= 80 ? '😴 Excellent sleep!' : sleepScore >= 60 ? '🙂 Good sleep' : '😔 Could be better'}
            </Text>
          </View>
        </Card>

        {/* Sleep stages */}
        <Card>
          <Text style={styles.cardTitle}>Sleep Stages</Text>
          <View style={styles.stagesBar}>
            {SLEEP_STAGES.map((s) => (
              <View
                key={s.label}
                style={[
                  styles.stageSegment,
                  { flex: s.hours, backgroundColor: s.color },
                ]}
              />
            ))}
          </View>
          <View style={styles.stagesLegend}>
            {SLEEP_STAGES.map((s) => (
              <View key={s.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                <Text style={styles.legendLabel}>{s.label}</Text>
                <Text style={styles.legendHours}>{s.hours}h</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* 7-day trend */}
        <Card style={{ overflow: 'hidden', padding: 0 }}>
          <View style={{ padding: Spacing.md }}>
            <Text style={styles.cardTitle}>7-Day Trend</Text>
            <Text style={styles.cardSub}>
              Avg: {(weekData.reduce((a, b) => a + b, 0) / weekData.length).toFixed(1)}h · Target: 8h
            </Text>
          </View>
          <BarChart
            data={{ labels: days, datasets: [{ data: weekData }] }}
            width={W + Spacing.lg * 2}
            height={140}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: Colors.card,
              backgroundGradientTo: Colors.card,
              color: (opacity = 1) => `rgba(124, 92, 252, ${opacity})`,
              labelColor: () => Colors.textMuted,
              barPercentage: 0.7,
            }}
            style={{ marginLeft: -Spacing.lg / 2 }}
            showValuesOnTopOfBars={false}
            withInnerLines={false}
            fromZero
            yAxisLabel=""
            yAxisSuffix="h"
          />
        </Card>

        {/* HRV correlation */}
        <Card>
          <Text style={styles.cardTitle}>HRV Correlation</Text>
          <Text style={styles.cardSub}>Better sleep = higher HRV = better workout readiness</Text>
          <View style={styles.correlationRow}>
            <View style={styles.corrItem}>
              <Text style={[styles.corrValue, { color: Colors.purple }]}>{hrv}ms</Text>
              <Text style={styles.corrLabel}>Morning HRV</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
            <View style={styles.corrItem}>
              <Text style={[styles.corrValue, { color: Colors.primary }]}>
                {hrv >= 65 ? 'High Readiness' : hrv >= 50 ? 'Moderate' : 'Low'}
              </Text>
              <Text style={styles.corrLabel}>Workout Impact</Text>
            </View>
          </View>
        </Card>

        {/* Sleep tips */}
        <Card>
          <Text style={styles.cardTitle}>Vita's Sleep Tips</Text>
          {[
            { tip: 'Consistent bedtime improves deep sleep by up to 30%', icon: '🌙' },
            { tip: 'Avoid screens 1h before bed to boost melatonin', icon: '📵' },
            { tip: 'Keep your room at 65-68°F for optimal sleep quality', icon: '🌡️' },
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
  heroCard: { gap: Spacing.sm },
  heroLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroValue: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  heroStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  heroDivider: { width: 1, height: 50, backgroundColor: Colors.border },
  scoreBadge: { borderRadius: Radius.full, padding: 10, alignItems: 'center', borderWidth: 1 },
  scoreBadgeText: { fontWeight: '600', fontSize: FontSize.md },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: FontSize.sm, color: Colors.textMuted },
  stagesBar: { flexDirection: 'row', height: 16, borderRadius: 8, overflow: 'hidden', marginVertical: Spacing.md, gap: 2 },
  stageSegment: { borderRadius: 4 },
  stagesLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  legendHours: { fontSize: FontSize.xs, color: Colors.textMuted },
  correlationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: Spacing.md },
  corrItem: { alignItems: 'center', gap: 4 },
  corrValue: { fontSize: FontSize.lg, fontWeight: '700' },
  corrLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  tipRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, alignItems: 'flex-start' },
  tipIcon: { fontSize: 18 },
  tipText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
});
