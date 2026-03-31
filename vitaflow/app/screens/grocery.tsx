import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { callClaude, buildGroceryPrompt } from '../../lib/claude';
import { Card } from '../../components/Card';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

interface GroceryItem {
  name: string;
  quantity: string;
  estimatedPrice: number;
  bestStore: string;
  category: string;
}

interface GroceryList {
  items: GroceryItem[];
  totalEstimate: number;
  stores: string[];
  notes: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  Protein: '🥩',
  Vegetables: '🥦',
  Fruits: '🍎',
  Grains: '🌾',
  Dairy: '🥛',
  Snacks: '🍿',
  Other: '🛒',
};

export default function GroceryScreen() {
  const { profile, dailyStats } = useUserStore();
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    if (!request.trim()) {
      Alert.alert('Tell Vita what you need', 'E.g. "Meal prep for 5 days under $60 — high protein"');
      return;
    }
    setLoading(true);
    setGroceryList(null);
    try {
      const prompt = buildGroceryPrompt(request, profile, dailyStats);
      const result = await callClaude(prompt);
      const parsed: GroceryList = JSON.parse(result);
      setGroceryList(parsed);
      setCheckedItems(new Set());
    } catch (err) {
      Alert.alert(
        'Demo Mode',
        'Add your ANTHROPIC_API_KEY to .env to enable AI grocery lists. Showing sample list.',
      );
      // Fallback demo list
      setGroceryList({
        items: [
          { name: 'Chicken Breast', quantity: '3 lbs', estimatedPrice: 8.99, bestStore: 'Aldi', category: 'Protein' },
          { name: 'Brown Rice', quantity: '2 lbs', estimatedPrice: 2.49, bestStore: 'Walmart', category: 'Grains' },
          { name: 'Broccoli', quantity: '2 heads', estimatedPrice: 2.98, bestStore: 'Aldi', category: 'Vegetables' },
          { name: 'Greek Yogurt', quantity: '32oz', estimatedPrice: 5.49, bestStore: 'Walmart', category: 'Dairy' },
          { name: 'Eggs (18ct)', quantity: '1 carton', estimatedPrice: 3.99, bestStore: 'Aldi', category: 'Protein' },
          { name: 'Bananas', quantity: '1 bunch', estimatedPrice: 1.29, bestStore: 'Aldi', category: 'Fruits' },
          { name: 'Oats', quantity: '42oz', estimatedPrice: 3.49, bestStore: 'Walmart', category: 'Grains' },
          { name: 'Almonds', quantity: '16oz', estimatedPrice: 6.99, bestStore: 'Walmart', category: 'Snacks' },
        ],
        totalEstimate: 35.71,
        stores: ['Aldi', 'Walmart'],
        notes: 'Shop Aldi first for produce and proteins, then Walmart for pantry items to save ~$8.',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const groupedItems =
    groceryList?.items.reduce<Record<string, GroceryItem[]>>((acc, item) => {
      const cat = item.category || 'Other';
      acc[cat] = [...(acc[cat] ?? []), item];
      return acc;
    }, {}) ?? {};

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Grocery</Text>
        </View>

        {/* Input */}
        <Card>
          <Text style={styles.cardTitle}>Tell Vita what you need</Text>
          <Text style={styles.cardSub}>Budget: ${profile?.weeklyGroceryBudget ?? 100}/week</Text>
          <TextInput
            style={styles.input}
            placeholder='e.g. "Meal prep for 5 days under $60 — high protein"'
            placeholderTextColor={Colors.textMuted}
            value={request}
            onChangeText={setRequest}
            multiline
            numberOfLines={3}
          />
          <GradientButton
            title={loading ? '' : groceryList ? 'Regenerate List' : 'Generate Grocery List'}
            onPress={handleGenerate}
            loading={loading}
          />
        </Card>

        {/* Loading */}
        {loading && (
          <Card style={styles.loadingCard}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingText}>Vita is building your grocery list...</Text>
          </Card>
        )}

        {/* Generated list */}
        {groceryList && !loading && (
          <>
            {/* Summary */}
            <LinearGradient colors={['#00C896', '#7C5CFC']} style={styles.summaryCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View>
                <Text style={styles.summaryLabel}>Estimated Total</Text>
                <Text style={styles.summaryTotal}>${groceryList.totalEstimate.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryLabel}>Best Stores</Text>
                <Text style={styles.summaryStores}>{groceryList.stores.join(' + ')}</Text>
              </View>
            </LinearGradient>

            {groceryList.notes && (
              <Card style={styles.notesCard}>
                <Ionicons name="bulb-outline" size={18} color={Colors.orange} />
                <Text style={styles.notesText}>{groceryList.notes}</Text>
              </Card>
            )}

            {/* Progress */}
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {checkedItems.size} / {groceryList.items.length} items checked
              </Text>
              {checkedItems.size > 0 && (
                <TouchableOpacity onPress={() => setCheckedItems(new Set())}>
                  <Text style={styles.clearBtn}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Items by category */}
            {Object.entries(groupedItems).map(([category, items]) => (
              <Card key={category}>
                <View style={styles.catHeader}>
                  <Text style={styles.catIcon}>{CATEGORY_ICONS[category] ?? '🛒'}</Text>
                  <Text style={styles.catTitle}>{category}</Text>
                </View>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={[styles.itemRow, checkedItems.has(item.name) && styles.itemRowChecked]}
                    onPress={() => toggleItem(item.name)}
                  >
                    <View style={[styles.checkbox, checkedItems.has(item.name) && styles.checkboxChecked]}>
                      {checkedItems.has(item.name) && (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemName, checkedItems.has(item.name) && styles.itemNameChecked]}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemQty}>
                        {item.quantity} · {item.bestStore}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>${item.estimatedPrice.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </Card>
            ))}
          </>
        )}

        {/* Empty state */}
        {!groceryList && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyTitle}>AI-Powered Grocery Lists</Text>
            <Text style={styles.emptyDesc}>
              Tell Vita your meal prep goals and budget. She'll build an optimized grocery list with the best prices across stores.
            </Text>
          </View>
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
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  cardSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  loadingCard: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xl },
  loadingText: { color: Colors.textSecondary, fontSize: FontSize.md },
  summaryCard: { borderRadius: Radius.lg, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' },
  summaryTotal: { fontSize: FontSize.xxxl, fontWeight: '800', color: '#fff' },
  summaryRight: { alignItems: 'flex-end' },
  summaryStores: { fontSize: FontSize.lg, fontWeight: '700', color: '#fff' },
  notesCard: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  notesText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { color: Colors.textMuted, fontSize: FontSize.sm },
  clearBtn: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  catIcon: { fontSize: 20 },
  catTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  itemRowChecked: { opacity: 0.5 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  itemName: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '500' },
  itemNameChecked: { textDecorationLine: 'line-through', color: Colors.textMuted },
  itemQty: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 1 },
  itemPrice: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
  emptyState: { alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xxl },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  emptyDesc: { color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: Spacing.xl },
});
