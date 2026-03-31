import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { MacroRings } from '../../components/MacroRings';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const SAMPLE_FOODS = [
  { name: 'Chicken Breast (4oz)', calories: 185, protein: 35, carbs: 0, fat: 4 },
  { name: 'White Rice (1 cup)', calories: 206, protein: 4, carbs: 45, fat: 0 },
  { name: 'Broccoli (1 cup)', calories: 55, protein: 4, carbs: 11, fat: 1 },
  { name: 'Greek Yogurt (6oz)', calories: 100, protein: 17, carbs: 6, fat: 0 },
  { name: 'Oatmeal (1 cup)', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Eggs (2 large)', calories: 143, protein: 13, carbs: 1, fat: 10 },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Almonds (1oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
];

export default function FoodScreen() {
  const { dailyStats, updateDailyStats, addXP } = useUserStore();
  const [search, setSearch] = useState('');
  const [activeMeal, setActiveMeal] = useState<MealType>('Breakfast');
  const [mealLog, setMealLog] = useState<Record<MealType, typeof SAMPLE_FOODS[0][]>>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  const filtered = search.trim()
    ? SAMPLE_FOODS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : SAMPLE_FOODS;

  const handleAddFood = (food: typeof SAMPLE_FOODS[0]) => {
    setMealLog((prev) => ({
      ...prev,
      [activeMeal]: [...prev[activeMeal], food],
    }));
    const newCals = (dailyStats?.calories ?? 0) + food.calories;
    const newProtein = (dailyStats?.protein ?? 0) + food.protein;
    const newCarbs = (dailyStats?.carbs ?? 0) + food.carbs;
    const newFat = (dailyStats?.fat ?? 0) + food.fat;
    updateDailyStats({ calories: newCals, protein: newProtein, carbs: newCarbs, fat: newFat });
    addXP(10);
    Alert.alert('Added!', `${food.name} added to ${activeMeal} (+10 XP)`, [
      { text: 'OK' },
    ]);
  };

  const totalLogged = Object.values(mealLog).flat().reduce((s, f) => s + f.calories, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Log</Text>
        </View>

        {/* Calorie progress */}
        <Card>
          <ProgressBar
            label="Calories"
            current={dailyStats?.calories ?? 0}
            target={dailyStats?.calorieTarget ?? 2200}
            unit=" kcal"
            color={Colors.orange}
          />
          <View style={styles.calRow}>
            <View style={styles.calItem}>
              <Text style={[styles.calValue, { color: Colors.primary }]}>{dailyStats?.calorieTarget ?? 2200}</Text>
              <Text style={styles.calLabel}>Goal</Text>
            </View>
            <Ionicons name="remove" size={16} color={Colors.textMuted} />
            <View style={styles.calItem}>
              <Text style={[styles.calValue, { color: Colors.orange }]}>{dailyStats?.calories ?? 0}</Text>
              <Text style={styles.calLabel}>Eaten</Text>
            </View>
            <Text style={styles.calEquals}>=</Text>
            <View style={styles.calItem}>
              <Text style={[styles.calValue, { color: Colors.blue }]}>
                {(dailyStats?.calorieTarget ?? 2200) - (dailyStats?.calories ?? 0)}
              </Text>
              <Text style={styles.calLabel}>Remaining</Text>
            </View>
          </View>
        </Card>

        {/* Macro rings */}
        <Card>
          <Text style={styles.cardTitle}>Macros</Text>
          <MacroRings
            protein={dailyStats?.protein ?? 0}
            proteinTarget={dailyStats?.proteinTarget ?? 180}
            carbs={dailyStats?.carbs ?? 0}
            carbsTarget={dailyStats?.carbsTarget ?? 220}
            fat={dailyStats?.fat ?? 0}
            fatTarget={dailyStats?.fatTarget ?? 65}
          />
        </Card>

        {/* Meal type selector */}
        <View style={styles.mealTabs}>
          {MEAL_TYPES.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.mealTab, activeMeal === m && styles.mealTabActive]}
              onPress={() => setActiveMeal(m)}
            >
              <Text style={[styles.mealTabText, activeMeal === m && { color: Colors.primary }]}>
                {m}
              </Text>
              {mealLog[m].length > 0 && (
                <View style={styles.mealCount}>
                  <Text style={styles.mealCountText}>{mealLog[m].length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Current meal log */}
        {mealLog[activeMeal].length > 0 && (
          <Card>
            <Text style={styles.cardTitle}>{activeMeal}</Text>
            {mealLog[activeMeal].map((f, i) => (
              <View key={i} style={styles.loggedFood}>
                <View style={styles.loggedFoodIcon}>
                  <Text style={{ fontSize: 16 }}>🍽️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.loggedFoodName}>{f.name}</Text>
                  <Text style={styles.loggedFoodMacros}>
                    P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g
                  </Text>
                </View>
                <Text style={[styles.loggedFoodCals, { color: Colors.orange }]}>
                  {f.calories} kcal
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search food for ${activeMeal}...`}
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Food list */}
        <Card>
          <Text style={styles.cardTitle}>
            {search.trim() ? 'Search Results' : 'Common Foods'}
          </Text>
          {filtered.map((f) => (
            <TouchableOpacity key={f.name} style={styles.foodRow} onPress={() => handleAddFood(f)}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{f.name}</Text>
                <Text style={styles.foodMacros}>
                  P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g
                </Text>
              </View>
              <Text style={styles.foodCals}>{f.calories}</Text>
              <Text style={styles.foodCalLabel}>kcal</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAddFood(f)}>
                <Ionicons name="add" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
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
  calRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: Spacing.md },
  calItem: { alignItems: 'center' },
  calValue: { fontSize: FontSize.xl, fontWeight: '800' },
  calLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase' },
  calEquals: { fontSize: FontSize.lg, color: Colors.textMuted },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  mealTabs: { flexDirection: 'row', gap: Spacing.xs },
  mealTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  mealTabActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}18` },
  mealTabText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  mealCount: { backgroundColor: Colors.primary, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  mealCountText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  loggedFood: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  loggedFoodIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  loggedFoodName: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: '600' },
  loggedFoodMacros: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 1 },
  loggedFoodCals: { fontWeight: '700', fontSize: FontSize.md },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: { paddingHorizontal: Spacing.xs },
  searchInput: { flex: 1, paddingVertical: 12, color: Colors.textPrimary, fontSize: FontSize.md },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  foodInfo: { flex: 1 },
  foodName: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '500' },
  foodMacros: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  foodCals: { color: Colors.orange, fontWeight: '700', fontSize: FontSize.md },
  foodCalLabel: { color: Colors.textMuted, fontSize: FontSize.xs },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: `${Colors.primary}18`, alignItems: 'center', justifyContent: 'center' },
});
