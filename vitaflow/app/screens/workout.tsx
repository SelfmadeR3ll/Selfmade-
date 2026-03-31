import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

type WorkoutSplit = 'Push' | 'Pull' | 'Legs' | 'Cardio' | 'Rest' | 'Full Body';

const SPLITS: WorkoutSplit[] = ['Push', 'Pull', 'Legs', 'Cardio', 'Rest', 'Full Body'];

const SPLIT_EXERCISES: Record<WorkoutSplit, string[]> = {
  Push: ['Bench Press', 'Shoulder Press', 'Tricep Pushdown', 'Lateral Raises', 'Incline DB Press'],
  Pull: ['Deadlift', 'Pull-ups', 'Barbell Row', 'Face Pulls', 'Bicep Curl'],
  Legs: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curls', 'Calf Raises'],
  Cardio: ['Treadmill Run', 'Cycling', 'Rowing', 'Jump Rope', 'HIIT Intervals'],
  'Full Body': ['Squat', 'Bench Press', 'Deadlift', 'Pull-ups', 'Overhead Press'],
  Rest: [],
};

export default function WorkoutScreen() {
  const { dailyStats, gamification, addXP } = useUserStore();
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit>('Push');
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hrv = dailyStats?.hrv ?? 65;
  const sleepScore = dailyStats?.sleepScore ?? 75;
  const readiness = Math.round((hrv / 80) * 50 + (sleepScore / 100) * 50);

  const getHRVRecommendation = () => {
    if (readiness >= 80) return { text: 'Great day to push hard! 💪', color: Colors.primary };
    if (readiness >= 60) return { text: 'Moderate intensity advised', color: Colors.orange };
    return { text: 'Recovery day recommended 🔄', color: Colors.blue };
  };

  const rec = getHRVRecommendation();
  const exercises = SPLIT_EXERCISES[activeSplit];

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFinishWorkout = () => {
    setTimerRunning(false);
    addXP(25);
    Alert.alert('Workout Complete! 🎉', `You earned +25 XP! Duration: ${formatTime(elapsed)}`, [
      { text: 'Nice!', onPress: () => router.back() },
    ]);
  };

  // Circular timer
  const size = 180;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(elapsed / 3600, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {gamification.streak}</Text>
          </View>
        </View>

        {/* HRV recommendation */}
        <Card style={[styles.recCard, { borderColor: `${rec.color}40` }]}>
          <Text style={styles.recLabel}>READINESS SCORE</Text>
          <View style={styles.recRow}>
            <Text style={[styles.recScore, { color: rec.color }]}>{readiness}/100</Text>
            <Text style={styles.recText}>{rec.text}</Text>
          </View>
          <View style={styles.recMeta}>
            <Text style={styles.recMetaItem}>HRV: {hrv}ms</Text>
            <Text style={styles.recMetaItem}>Sleep: {sleepScore}/100</Text>
          </View>
        </Card>

        {/* Workout split selector */}
        <Text style={styles.sectionTitle}>Today's Split</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -Spacing.lg }}>
          <View style={styles.splitRow}>
            {SPLITS.map((split) => (
              <TouchableOpacity
                key={split}
                style={[styles.splitBtn, activeSplit === split && styles.splitBtnActive]}
                onPress={() => setActiveSplit(split)}
              >
                <Text style={[styles.splitText, activeSplit === split && { color: Colors.primary }]}>
                  {split}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Exercise list */}
        {exercises.length > 0 ? (
          <Card>
            <Text style={styles.cardTitle}>{activeSplit} Day</Text>
            {exercises.map((ex, i) => (
              <View key={ex} style={styles.exerciseRow}>
                <View style={styles.exerciseNum}>
                  <Text style={styles.exerciseNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.exerciseName}>{ex}</Text>
                <Text style={styles.exerciseSets}>3×10</Text>
              </View>
            ))}
          </Card>
        ) : (
          <Card style={styles.restCard}>
            <Text style={styles.restEmoji}>😴</Text>
            <Text style={styles.restTitle}>Rest Day</Text>
            <Text style={styles.restDesc}>
              Recovery is when your muscles actually grow. Take it easy today!
            </Text>
          </Card>
        )}

        {/* Live workout timer */}
        <Text style={styles.sectionTitle}>Workout Timer</Text>
        <Card style={styles.timerCard}>
          <View style={styles.timerOrb}>
            <Svg width={size} height={size}>
              <Circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={Colors.border} strokeWidth={strokeWidth} />
              <Circle
                cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke={Colors.primary} strokeWidth={strokeWidth}
                strokeLinecap="round" strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                rotation="-90" origin={`${size / 2}, ${size / 2}`}
              />
            </Svg>
            <View style={styles.timerCenter}>
              <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
              <Text style={styles.timerLabel}>{timerRunning ? 'ACTIVE' : 'READY'}</Text>
            </View>
          </View>
          <View style={styles.timerBtns}>
            <TouchableOpacity
              style={styles.timerBtn}
              onPress={() => setTimerRunning(!timerRunning)}
            >
              <Ionicons name={timerRunning ? 'pause' : 'play'} size={28} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timerBtn}
              onPress={() => { setTimerRunning(false); setElapsed(0); }}
            >
              <Ionicons name="refresh" size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* PRs */}
        <Card>
          <Text style={styles.cardTitle}>Personal Records</Text>
          {[
            { lift: 'Bench Press', weight: '185 lbs', date: '3 weeks ago' },
            { lift: 'Squat', weight: '225 lbs', date: '2 weeks ago' },
            { lift: 'Deadlift', weight: '275 lbs', date: '1 week ago' },
          ].map((pr) => (
            <View key={pr.lift} style={styles.prRow}>
              <Text style={styles.prLift}>{pr.lift}</Text>
              <Text style={styles.prWeight}>{pr.weight}</Text>
              <Text style={styles.prDate}>{pr.date}</Text>
            </View>
          ))}
        </Card>

        {exercises.length > 0 && (
          <GradientButton
            title={timerRunning ? 'Finish Workout' : 'Start Workout'}
            onPress={timerRunning ? handleFinishWorkout : () => setTimerRunning(true)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.md, gap: Spacing.sm },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  streakBadge: { backgroundColor: `${Colors.orange}18`, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  streakText: { color: Colors.orange, fontWeight: '700', fontSize: FontSize.sm },
  recCard: { gap: 8 },
  recLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  recScore: { fontSize: FontSize.xxl, fontWeight: '800' },
  recText: { fontSize: FontSize.md, color: Colors.textSecondary, flex: 1 },
  recMeta: { flexDirection: 'row', gap: Spacing.md },
  recMetaItem: { fontSize: FontSize.sm, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  splitRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
  splitBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  splitBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  splitText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  exerciseNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: `${Colors.primary}18`, alignItems: 'center', justifyContent: 'center' },
  exerciseNumText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  exerciseName: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  exerciseSets: { color: Colors.textMuted, fontSize: FontSize.sm },
  restCard: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl },
  restEmoji: { fontSize: 48 },
  restTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  restDesc: { color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  timerCard: { alignItems: 'center', gap: Spacing.md },
  timerOrb: { alignItems: 'center', justifyContent: 'center' },
  timerCenter: { position: 'absolute', alignItems: 'center' },
  timerText: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  timerLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  timerBtns: { flexDirection: 'row', gap: Spacing.xl },
  timerBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  prRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  prLift: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  prWeight: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md, marginRight: Spacing.md },
  prDate: { color: Colors.textMuted, fontSize: FontSize.xs },
});
