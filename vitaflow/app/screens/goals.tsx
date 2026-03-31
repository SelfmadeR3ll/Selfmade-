import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function GoalsScreen() {
  const { profile, updateProfile } = useUserStore();
  const [goalWeight, setGoalWeight] = useState(String(profile?.goalWeight ?? 160));
  const [monthlySavings, setMonthlySavings] = useState('500');

  const currentWeight = profile?.currentWeight ?? 171;
  const goalWeightNum = parseFloat(goalWeight) || 160;
  const progress = Math.max(0, Math.min(1, 1 - (currentWeight - goalWeightNum) / Math.max(currentWeight - goalWeightNum, 1)));

  const weeklyChallenge = [
    { label: 'Log 4 workouts', current: 2, target: 4, xp: 150 },
    { label: '8h sleep 3 nights', current: 1, target: 3, xp: 75 },
    { label: 'Stay under food budget', current: 0, target: 1, xp: 100 },
  ];

  const savingsGoals = [
    { name: 'Emergency Fund', current: 2400, target: 10000, color: Colors.primary },
    { name: 'Vacation', current: 840, target: 3000, color: Colors.purple },
  ];

  const handleSaveGoals = () => {
    updateProfile({ goalWeight: goalWeightNum });
    Alert.alert('Goals Updated!', 'Your goals have been saved.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Goals</Text>
        </View>

        {/* Weight goal */}
        <Card>
          <Text style={styles.cardTitle}>Weight Goal</Text>
          <View style={styles.weightGoalRow}>
            <View style={styles.weightGoalStat}>
              <Text style={styles.weightCurrent}>{currentWeight}</Text>
              <Text style={styles.weightLabel}>Current (lbs)</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
            <View style={styles.weightGoalStat}>
              <TextInput
                style={styles.goalInput}
                value={goalWeight}
                onChangeText={setGoalWeight}
                keyboardType="decimal-pad"
              />
              <Text style={styles.weightLabel}>Goal (lbs)</Text>
            </View>
          </View>
          <ProgressBar
            label="Progress"
            current={currentWeight - (currentWeight - goalWeightNum)}
            target={currentWeight}
            color={Colors.primary}
            unit=" lbs"
          />
          <Text style={styles.etaText}>
            At 1 lb/week: ~{Math.ceil(Math.abs(currentWeight - goalWeightNum))} weeks to goal
          </Text>
        </Card>

        {/* Weekly challenges */}
        <Card>
          <Text style={styles.cardTitle}>Weekly Challenges</Text>
          {weeklyChallenge.map((ch) => (
            <View key={ch.label} style={styles.challengeRow}>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeLabel}>{ch.label}</Text>
                <Text style={styles.challengeXP}>+{ch.xp} XP</Text>
              </View>
              <ProgressBar
                current={ch.current}
                target={ch.target}
                color={Colors.purple}
                showValues={true}
                height={6}
              />
            </View>
          ))}
        </Card>

        {/* Savings goals */}
        <Card>
          <Text style={styles.cardTitle}>Savings Goals</Text>
          {savingsGoals.map((g) => (
            <View key={g.name} style={styles.savingsRow}>
              <View style={styles.savingsHeader}>
                <Text style={styles.savingsName}>{g.name}</Text>
                <Text style={[styles.savingsAmt, { color: g.color }]}>
                  ${g.current.toLocaleString()} / ${g.target.toLocaleString()}
                </Text>
              </View>
              <ProgressBar current={g.current} target={g.target} color={g.color} showValues={false} />
            </View>
          ))}
          <View style={styles.savingsInputRow}>
            <Text style={styles.inputLabel}>Monthly Savings Target ($)</Text>
            <TextInput
              style={styles.savingsInput}
              value={monthlySavings}
              onChangeText={setMonthlySavings}
              keyboardType="decimal-pad"
            />
          </View>
        </Card>

        <GradientButton title="Save Goals" onPress={handleSaveGoals} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.md, gap: Spacing.sm },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  weightGoalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: Spacing.md },
  weightGoalStat: { alignItems: 'center', gap: 4 },
  weightCurrent: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  weightLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  goalInput: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.primary, textAlign: 'center', borderBottomWidth: 2, borderBottomColor: Colors.primary, minWidth: 80 },
  etaText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: Spacing.sm },
  challengeRow: { gap: 6, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  challengeInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  challengeLabel: { color: Colors.textPrimary, fontSize: FontSize.md },
  challengeXP: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  savingsRow: { gap: 6, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  savingsHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  savingsName: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '600' },
  savingsAmt: { fontWeight: '700', fontSize: FontSize.md },
  savingsInputRow: { paddingTop: Spacing.md, gap: 8 },
  inputLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  savingsInput: { backgroundColor: Colors.surface2, borderRadius: Radius.md, padding: Spacing.md, color: Colors.textPrimary, fontSize: FontSize.md, borderWidth: 1, borderColor: Colors.border },
});
