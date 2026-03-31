import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { callClaude, buildMealPlanPrompt } from '../../lib/claude';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

interface Meal { name: string; calories: number; protein: number; cost: number; }
interface DayPlan { day: string; meals: { breakfast: Meal; lunch: Meal; dinner: Meal; snacks: Meal }; totalCost: number; }
interface MealPlan { days: DayPlan[]; weeklyTotal: number; prepDay: string; prepTasks: string[]; }

export default function MealsScreen() {
  const { profile, dailyStats } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = buildMealPlanPrompt(profile, dailyStats);
      const result = await callClaude(prompt);
      const parsed: MealPlan = JSON.parse(result);
      setMealPlan(parsed);
    } catch {
      // Demo fallback
      setMealPlan({
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
          day,
          meals: {
            breakfast: { name: 'Oatmeal with protein powder & berries', calories: 420, protein: 35, cost: 3.20 },
            lunch: { name: 'Grilled chicken rice bowl', calories: 620, protein: 48, cost: 5.50 },
            dinner: { name: 'Salmon with roasted vegetables', calories: 680, protein: 52, cost: 8.00 },
            snacks: { name: 'Greek yogurt & almonds', calories: 280, protein: 22, cost: 2.80 },
          },
          totalCost: 19.50,
        })),
        weeklyTotal: 136.50,
        prepDay: 'Sunday',
        prepTasks: [
          'Cook brown rice in bulk (4 cups)',
          'Grill 3 lbs chicken breast',
          'Roast mixed vegetables',
          'Portion oatmeal servings',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const day = mealPlan?.days[activeDay];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meal Planning</Text>
        </View>

        {!mealPlan && !loading && (
          <>
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>AI-Powered 7-Day Meal Plan</Text>
              <Text style={styles.infoDesc}>
                Vita generates a full week of meals optimized for your macros and food budget of ${profile?.weeklyGroceryBudget ?? 120}/week.
              </Text>
              <View style={styles.infoStats}>
                <View style={styles.infoStat}>
                  <Text style={styles.infoStatVal}>{dailyStats?.calorieTarget ?? 2200}</Text>
                  <Text style={styles.infoStatLabel}>kcal/day</Text>
                </View>
                <View style={styles.infoStat}>
                  <Text style={styles.infoStatVal}>{dailyStats?.proteinTarget ?? 180}g</Text>
                  <Text style={styles.infoStatLabel}>protein/day</Text>
                </View>
                <View style={styles.infoStat}>
                  <Text style={styles.infoStatVal}>${profile?.weeklyGroceryBudget ?? 120}</Text>
                  <Text style={styles.infoStatLabel}>weekly budget</Text>
                </View>
              </View>
            </Card>
            <GradientButton title="Generate 7-Day Plan" onPress={handleGenerate} />
          </>
        )}

        {loading && (
          <Card style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Vita is crafting your meal plan...</Text>
          </Card>
        )}

        {mealPlan && !loading && (
          <>
            {/* Summary */}
            <LinearGradient colors={['#00C896', '#7C5CFC']} style={styles.summaryCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.summaryTitle}>7-Day Plan Ready</Text>
              <Text style={styles.summaryCost}>~${mealPlan.weeklyTotal.toFixed(0)}/week</Text>
              <Text style={styles.summaryNote}>Prep on {mealPlan.prepDay}</Text>
            </LinearGradient>

            {/* Day selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -Spacing.lg }}>
              <View style={styles.dayRow}>
                {mealPlan.days.map((d, i) => (
                  <TouchableOpacity
                    key={d.day}
                    style={[styles.dayBtn, activeDay === i && styles.dayBtnActive]}
                    onPress={() => setActiveDay(i)}
                  >
                    <Text style={[styles.dayBtnText, activeDay === i && { color: Colors.primary }]}>
                      {d.day.slice(0, 3)}
                    </Text>
                    <Text style={styles.dayCost}>${d.totalCost.toFixed(0)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Day meals */}
            {day && (
              <Card>
                <Text style={styles.cardTitle}>{day.day}</Text>
                {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((mealType) => {
                  const meal = day.meals[mealType];
                  return (
                    <View key={mealType} style={styles.mealRow}>
                      <View style={styles.mealTypeTag}>
                        <Text style={styles.mealTypeText}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <Text style={styles.mealMacros}>
                          {meal.calories} kcal · {meal.protein}g protein
                        </Text>
                      </View>
                      <Text style={styles.mealCost}>${meal.cost.toFixed(2)}</Text>
                    </View>
                  );
                })}
                <View style={styles.dayTotal}>
                  <Text style={styles.dayTotalLabel}>Daily Cost</Text>
                  <Text style={styles.dayTotalValue}>${day.totalCost.toFixed(2)}</Text>
                </View>
              </Card>
            )}

            {/* Prep tasks */}
            <Card>
              <Text style={styles.cardTitle}>Sunday Prep Tasks</Text>
              {mealPlan.prepTasks.map((task, i) => (
                <View key={i} style={styles.prepRow}>
                  <View style={styles.prepNum}>
                    <Text style={styles.prepNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.prepTask}>{task}</Text>
                </View>
              ))}
            </Card>

            <TouchableOpacity style={styles.regenerateBtn} onPress={handleGenerate}>
              <Ionicons name="refresh" size={16} color={Colors.primary} />
              <Text style={styles.regenerateText}>Regenerate Plan</Text>
            </TouchableOpacity>
          </>
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
  infoCard: { gap: Spacing.sm },
  infoTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  infoDesc: { color: Colors.textSecondary, fontSize: FontSize.md, lineHeight: 22 },
  infoStats: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: Spacing.sm },
  infoStat: { alignItems: 'center' },
  infoStatVal: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  infoStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  loadingCard: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  loadingText: { color: Colors.textSecondary, fontSize: FontSize.md },
  summaryCard: { borderRadius: Radius.lg, padding: Spacing.md },
  summaryTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#fff' },
  summaryCost: { fontSize: FontSize.xxxl, fontWeight: '800', color: '#fff' },
  summaryNote: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  dayRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
  dayBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  dayBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  dayBtnText: { color: Colors.textSecondary, fontWeight: '700', fontSize: FontSize.sm },
  dayCost: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  mealRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  mealTypeTag: { backgroundColor: Colors.surface2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  mealTypeText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  mealName: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '500', lineHeight: 20 },
  mealMacros: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  mealCost: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  dayTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  dayTotalLabel: { color: Colors.textMuted, fontSize: FontSize.md },
  dayTotalValue: { color: Colors.primary, fontWeight: '800', fontSize: FontSize.md },
  prepRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, alignItems: 'center' },
  prepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: `${Colors.primary}18`, alignItems: 'center', justifyContent: 'center' },
  prepNumText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  prepTask: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.md },
  regenerateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs },
  regenerateText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
});
