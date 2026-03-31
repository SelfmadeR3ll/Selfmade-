import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function BillsScreen() {
  const { bills } = useUserStore();
  const today = new Date();
  const totalMonthly = bills.reduce((s, b) => s + b.amount, 0);

  const getDaysUntil = (dateStr: string) => differenceInDays(parseISO(dateStr), today);
  const getUrgencyColor = (days: number) => {
    if (days <= 3) return Colors.red;
    if (days <= 7) return Colors.orange;
    return Colors.textSecondary;
  };

  const sortedBills = [...bills].sort((a, b) =>
    differenceInDays(parseISO(a.dueDate), parseISO(b.dueDate))
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bills</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Monthly Bills Total</Text>
          <Text style={styles.summaryAmount}>${totalMonthly.toLocaleString()}</Text>
          <Text style={styles.summaryNote}>{bills.filter((b) => b.autopay).length} on autopay</Text>
        </Card>

        <Text style={styles.sectionTitle}>Upcoming Bills</Text>
        {sortedBills.map((bill) => {
          const days = getDaysUntil(bill.dueDate);
          const color = getUrgencyColor(days);
          return (
            <Card key={bill.id} style={days <= 3 ? { borderColor: `${Colors.red}40` } : {}}>
              <View style={styles.billRow}>
                <View style={[styles.billIcon, { backgroundColor: `${color}18` }]}>
                  <Ionicons name="receipt-outline" size={18} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.billName}>{bill.name}</Text>
                  <View style={styles.billMeta}>
                    <Text style={[styles.billDue, { color }]}>
                      {days <= 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due in ${days} days`}
                    </Text>
                    <Text style={styles.billDate}>· {format(parseISO(bill.dueDate), 'MMM d')}</Text>
                    {bill.autopay && (
                      <View style={styles.autopayTag}>
                        <Text style={styles.autopayText}>Autopay</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.billAmount}>${bill.amount}</Text>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.md, gap: Spacing.sm },
  headerTitle: { flex: 1, fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: `${Colors.primary}18`, alignItems: 'center', justifyContent: 'center' },
  summaryCard: { alignItems: 'center', paddingVertical: Spacing.lg, gap: 4 },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryAmount: { fontSize: 48, fontWeight: '800', color: Colors.textPrimary },
  summaryNote: { fontSize: FontSize.sm, color: Colors.textSecondary },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  billRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  billIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  billName: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  billMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  billDue: { fontSize: FontSize.xs, fontWeight: '600' },
  billDate: { fontSize: FontSize.xs, color: Colors.textMuted },
  autopayTag: { backgroundColor: `${Colors.primary}18`, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  autopayText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  billAmount: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
});
