import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';
import { format, isAfter, parseISO, differenceInDays } from 'date-fns';

const screenWidth = Dimensions.get('window').width - Spacing.lg * 2;

const CATEGORY_COLORS: Record<string, string> = {
  Groceries: Colors.primary,
  Fitness: Colors.purple,
  Subscriptions: Colors.orange,
  Dining: Colors.red,
  Housing: Colors.blue,
  Utilities: Colors.textSecondary,
  Entertainment: Colors.orange,
  Other: Colors.textMuted,
};

export default function MoneyTab() {
  const { profile, dailyStats, transactions, bills } = useUserStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'bills'>('overview');

  const monthlyBudget = profile?.monthlyBudget ?? 2500;
  const monthlyIncome = profile?.monthlyIncome ?? 5000;
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const budgetRemaining = monthlyBudget - totalSpent;
  const savingsRate = Math.round(((monthlyIncome - totalSpent) / monthlyIncome) * 100);

  // Upcoming bills (next 7 days)
  const today = new Date();
  const upcomingBills = bills.filter((b) => {
    const due = parseISO(b.dueDate);
    const days = differenceInDays(due, today);
    return days >= 0 && days <= 7;
  });

  const totalBills = bills.reduce((s, b) => s + b.amount, 0);

  // Spending by category
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] ?? 0) + t.amount;
  });

  const savings = [
    { name: 'Emergency Fund', current: 2400, target: 10000, color: Colors.primary },
    { name: 'Vacation', current: 840, target: 3000, color: Colors.purple },
    { name: 'New Car', current: 1200, target: 8000, color: Colors.orange },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Money</Text>
          <TouchableOpacity onPress={() => router.push('/screens/billing')}>
            <Ionicons name="card-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Income vs Spend card */}
        <LinearGradient colors={['#1E2437', '#13172A']} style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroLabel}>Monthly Budget</Text>
              <Text style={styles.heroAmount}>${monthlyBudget.toLocaleString()}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.heroLabel}>Spent So Far</Text>
              <Text style={[styles.heroAmount, { color: Colors.orange }]}>
                ${totalSpent.toFixed(0)}
              </Text>
            </View>
          </View>
          <ProgressBar
            current={totalSpent}
            target={monthlyBudget}
            color={totalSpent > monthlyBudget * 0.8 ? Colors.red : Colors.primary}
            showValues={false}
            height={6}
          />
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>
              ${budgetRemaining.toFixed(0)} remaining · {savingsRate}% saved
            </Text>
          </View>
        </LinearGradient>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          {(['overview', 'transactions', 'bills'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <>
            {/* Savings jars */}
            <Card>
              <Text style={styles.cardTitle}>Savings Jars</Text>
              <View style={{ gap: Spacing.md, marginTop: Spacing.sm }}>
                {savings.map((jar) => (
                  <View key={jar.name}>
                    <View style={styles.jarRow}>
                      <Text style={styles.jarName}>{jar.name}</Text>
                      <Text style={[styles.jarAmount, { color: jar.color }]}>
                        ${jar.current.toLocaleString()}
                        <Text style={styles.jarTarget}> / ${jar.target.toLocaleString()}</Text>
                      </Text>
                    </View>
                    <ProgressBar
                      current={jar.current}
                      target={jar.target}
                      color={jar.color}
                      showValues={false}
                    />
                  </View>
                ))}
              </View>
            </Card>

            {/* Spending by category */}
            <Card>
              <Text style={styles.cardTitle}>Spending by Category</Text>
              <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
                {Object.entries(categoryTotals).map(([cat, amt]) => (
                  <View key={cat} style={styles.catRow}>
                    <View
                      style={[
                        styles.catDot,
                        { backgroundColor: CATEGORY_COLORS[cat] ?? Colors.textMuted },
                      ]}
                    />
                    <Text style={styles.catName}>{cat}</Text>
                    <Text style={styles.catAmt}>${amt.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {/* Subscription tracker */}
            <Card>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Subscriptions</Text>
                <Text style={styles.subTotal}>$40.98/mo</Text>
              </View>
              {[
                { name: 'Netflix', amount: 15.99, icon: '🎬' },
                { name: 'Spotify', amount: 9.99, icon: '🎵' },
                { name: 'Planet Fitness', amount: 24.99, icon: '🏋️' },
              ].map((sub) => (
                <View key={sub.name} style={styles.subRow}>
                  <Text style={styles.subIcon}>{sub.icon}</Text>
                  <Text style={styles.subName}>{sub.name}</Text>
                  <Text style={styles.subAmt}>${sub.amount}/mo</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Transactions tab */}
        {activeTab === 'transactions' && (
          <Card>
            <Text style={styles.cardTitle}>Recent Transactions</Text>
            <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
              {transactions.map((tx) => (
                <View key={tx.id} style={styles.txRow}>
                  <View
                    style={[
                      styles.txIcon,
                      { backgroundColor: `${CATEGORY_COLORS[tx.category] ?? Colors.textMuted}18` },
                    ]}
                  >
                    <Ionicons
                      name="receipt-outline"
                      size={18}
                      color={CATEGORY_COLORS[tx.category] ?? Colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txMerchant}>{tx.merchant}</Text>
                    <View style={styles.txMeta}>
                      <Text style={styles.txCategory}>{tx.category}</Text>
                      {tx.aiTag && (
                        <View style={styles.txTag}>
                          <Text style={styles.txTagText}>{tx.aiTag}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.txAmount}>-${tx.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Bills tab */}
        {activeTab === 'bills' && (
          <>
            {upcomingBills.length > 0 && (
              <Card style={{ backgroundColor: `${Colors.orange}10`, borderColor: `${Colors.orange}30` }}>
                <Text style={[styles.cardTitle, { color: Colors.orange }]}>
                  ⚠️ Due This Week
                </Text>
                {upcomingBills.map((bill) => (
                  <View key={bill.id} style={styles.billRow}>
                    <View>
                      <Text style={styles.billName}>{bill.name}</Text>
                      <Text style={styles.billDate}>
                        Due {format(parseISO(bill.dueDate), 'MMM d')}
                        {bill.autopay ? ' · Autopay' : ''}
                      </Text>
                    </View>
                    <Text style={styles.billAmt}>${bill.amount}</Text>
                  </View>
                ))}
              </Card>
            )}

            <Card>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>All Bills</Text>
                <Text style={styles.subTotal}>${totalBills}/mo</Text>
              </View>
              {bills.map((bill) => (
                <View key={bill.id} style={styles.billRow}>
                  <View style={styles.billInfo}>
                    <View
                      style={[
                        styles.billAutopayDot,
                        { backgroundColor: bill.autopay ? Colors.primary : Colors.textMuted },
                      ]}
                    />
                    <View>
                      <Text style={styles.billName}>{bill.name}</Text>
                      <Text style={styles.billDate}>
                        Due {format(parseISO(bill.dueDate), 'MMM d')} ·{' '}
                        {bill.autopay ? 'Autopay on' : 'Manual pay'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.billAmt}>${bill.amount}</Text>
                </View>
              ))}
            </Card>
          </>
        )}
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
  heroCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroAmount: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  heroDivider: { flex: 1 },
  heroFooter: { marginTop: 4 },
  heroFooterText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  tabRow: { flexDirection: 'row', gap: Spacing.sm },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: { backgroundColor: `${Colors.primary}20`, borderColor: Colors.primary },
  tabBtnText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  tabBtnTextActive: { color: Colors.primary },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  jarName: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500' },
  jarAmount: { fontSize: FontSize.md, fontWeight: '700' },
  jarTarget: { color: Colors.textMuted, fontWeight: '400', fontSize: FontSize.sm },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catName: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.md },
  catAmt: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  subTotal: { fontSize: FontSize.md, fontWeight: '700', color: Colors.orange },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  subIcon: { fontSize: 20 },
  subName: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  subAmt: { color: Colors.textSecondary, fontSize: FontSize.sm },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txMerchant: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  txMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 2 },
  txCategory: { color: Colors.textMuted, fontSize: FontSize.xs },
  txTag: {
    backgroundColor: `${Colors.primary}18`,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  txTagText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '600' },
  txAmount: { color: Colors.red, fontWeight: '700', fontSize: FontSize.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  billInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  billAutopayDot: { width: 8, height: 8, borderRadius: 4 },
  billName: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  billDate: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  billAmt: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSize.md },
});
