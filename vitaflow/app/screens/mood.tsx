import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const MOODS = [
  { emoji: '😄', label: 'Great', value: 5 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '😔', label: 'Low', value: 2 },
  { emoji: '😞', label: 'Bad', value: 1 },
];

export default function MoodScreen() {
  const { updateDailyStats, addXP } = useUserStore();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [logged, setLogged] = useState(false);

  const handleLog = () => {
    if (!selectedMood || !stressLevel) {
      Alert.alert('Select mood and stress level');
      return;
    }
    updateDailyStats({ mood: selectedMood, stressLevel });
    addXP(5);
    setLogged(true);
    Alert.alert('Mood Logged! 😊', '+5 XP earned. Vita uses this to optimize your recommendations.');
  };

  const weeklyMoods = [4, 3, 5, 4, 2, 4, selectedMood ?? 3];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const moodEmojis = ['😞', '😔', '😐', '🙂', '😄'];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood</Text>
        </View>

        {/* Today's check-in */}
        <Card>
          <Text style={styles.cardTitle}>How are you feeling today?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[styles.moodBtn, selectedMood === m.value && styles.moodBtnActive]}
                onPress={() => setSelectedMood(m.value)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood === m.value && { color: Colors.primary }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.cardTitle, { marginTop: Spacing.md }]}>Stress Level</Text>
          <View style={styles.stressRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.stressBtn, stressLevel === level && styles.stressBtnActive]}
                onPress={() => setStressLevel(level)}
              >
                <Text style={[styles.stressNum, stressLevel === level && { color: Colors.primary }]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.stressLabels}>
            <Text style={styles.stressLabel}>Low stress</Text>
            <Text style={styles.stressLabel}>High stress</Text>
          </View>

          {!logged && (
            <GradientButton
              title="Log Mood"
              onPress={handleLog}
              disabled={!selectedMood || !stressLevel}
              style={{ marginTop: Spacing.md }}
            />
          )}
          {logged && (
            <View style={styles.loggedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              <Text style={styles.loggedText}>Mood logged! +5 XP</Text>
            </View>
          )}
        </Card>

        {/* Weekly trend */}
        <Card>
          <Text style={styles.cardTitle}>Weekly Mood Trend</Text>
          <View style={styles.weeklyMood}>
            {weeklyMoods.map((mood, i) => (
              <View key={i} style={styles.moodDayItem}>
                <Text style={styles.moodDayEmoji}>{moodEmojis[mood - 1]}</Text>
                <Text style={styles.moodDayLabel}>{days[i]}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Correlations */}
        <Card>
          <Text style={styles.cardTitle}>Vita's Insights</Text>
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightText}>
              Your mood tends to be higher on days you work out. You've logged workouts on 3 of your 5 "Great" days this week.
            </Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>💰</Text>
            <Text style={styles.insightText}>
              Low mood days correlate with higher discretionary spending. You spent 40% more on dining on low-mood days.
            </Text>
          </View>
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
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { alignItems: 'center', gap: 4, padding: 10, borderRadius: Radius.md, borderWidth: 1.5, borderColor: 'transparent' },
  moodBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  moodEmoji: { fontSize: 28 },
  moodLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  stressRow: { flexDirection: 'row', gap: Spacing.sm },
  stressBtn: { flex: 1, height: 44, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  stressBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  stressNum: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textSecondary },
  stressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  stressLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  loggedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginTop: Spacing.md },
  loggedText: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.md },
  weeklyMood: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing.sm },
  moodDayItem: { alignItems: 'center', gap: 4 },
  moodDayEmoji: { fontSize: 24 },
  moodDayLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  insightRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, alignItems: 'flex-start' },
  insightIcon: { fontSize: 18 },
  insightText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
});
