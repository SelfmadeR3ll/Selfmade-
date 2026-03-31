import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalEvent {
  type: 'workout' | 'meal_prep' | 'sleep' | 'bill';
  title: string;
  time: string;
  color: string;
}

const WEEK_EVENTS: Record<number, CalEvent[]> = {
  1: [
    { type: 'workout', title: 'Push Day', time: '6:30 AM', color: Colors.purple },
    { type: 'sleep', title: 'Sleep Target', time: '10:00 PM', color: Colors.blue },
  ],
  2: [
    { type: 'workout', title: 'Pull Day', time: '6:30 AM', color: Colors.purple },
  ],
  3: [
    { type: 'meal_prep', title: 'Meal Prep', time: '2:00 PM', color: Colors.primary },
    { type: 'bill', title: 'Electric Bill Due', time: 'All day', color: Colors.red },
  ],
  4: [
    { type: 'workout', title: 'Leg Day', time: '6:30 AM', color: Colors.purple },
  ],
  5: [
    { type: 'workout', title: 'Cardio', time: '7:00 AM', color: Colors.orange },
    { type: 'bill', title: 'Internet Bill Due', time: 'All day', color: Colors.red },
  ],
  6: [
    { type: 'workout', title: 'Full Body', time: '9:00 AM', color: Colors.purple },
  ],
  0: [
    { type: 'meal_prep', title: 'Sunday Prep', time: '1:00 PM', color: Colors.primary },
    { type: 'sleep', title: 'Early Bedtime', time: '9:30 PM', color: Colors.blue },
  ],
};

const EVENT_ICONS: Record<string, string> = {
  workout: 'barbell-outline',
  meal_prep: 'restaurant-outline',
  sleep: 'moon-outline',
  bill: 'receipt-outline',
};

export default function CalendarScreen() {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDay());

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  const events = WEEK_EVENTS[selectedDay] ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>

        {/* Week strip */}
        <View style={styles.weekStrip}>
          {weekDates.map((date, i) => {
            const dayIdx = date.getDay();
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = dayIdx === selectedDay;
            const hasEvents = (WEEK_EVENTS[dayIdx] ?? []).length > 0;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayItem, isSelected && styles.dayItemActive]}
                onPress={() => setSelectedDay(dayIdx)}
              >
                <Text style={[styles.dayName, isSelected && { color: '#fff' }]}>{DAYS[dayIdx].slice(0, 1)}</Text>
                <Text style={[styles.dayNum, isToday && styles.dayNumToday, isSelected && { color: '#fff', fontWeight: '800' }]}>
                  {date.getDate()}
                </Text>
                {hasEvents && (
                  <View style={[styles.eventDot, isSelected && { backgroundColor: '#fff' }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Events for selected day */}
        <Text style={styles.sectionTitle}>
          {weekDates[selectedDay]?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>

        {events.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No events scheduled. Vita can add AI-scheduled workout blocks and meal prep times here.</Text>
          </Card>
        ) : (
          events.map((event, i) => (
            <Card key={i} style={styles.eventCard}>
              <View style={[styles.eventAccent, { backgroundColor: event.color }]} />
              <View style={[styles.eventIcon, { backgroundColor: `${event.color}18` }]}>
                <Ionicons name={EVENT_ICONS[event.type] as any} size={18} color={event.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            </Card>
          ))
        )}

        {/* Legend */}
        <Card>
          <Text style={styles.cardTitle}>Event Types</Text>
          {[
            { label: 'Workout', color: Colors.purple, icon: 'barbell-outline' },
            { label: 'Meal Prep', color: Colors.primary, icon: 'restaurant-outline' },
            { label: 'Sleep Target', color: Colors.blue, icon: 'moon-outline' },
            { label: 'Bill Due', color: Colors.red, icon: 'receipt-outline' },
          ].map((item) => (
            <View key={item.label} style={styles.legendRow}>
              <View style={[styles.legendIcon, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon as any} size={14} color={item.color} />
              </View>
              <Text style={styles.legendLabel}>{item.label}</Text>
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
  weekStrip: { flexDirection: 'row', gap: 4, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: 6, borderWidth: 1, borderColor: Colors.border },
  dayItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: Radius.lg, gap: 4 },
  dayItemActive: { backgroundColor: Colors.primary },
  dayName: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  dayNum: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  dayNumToday: { color: Colors.primary },
  eventDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.primary },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary },
  emptyCard: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyText: { color: Colors.textMuted, textAlign: 'center', fontSize: FontSize.sm, lineHeight: 22 },
  eventCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingLeft: 0, overflow: 'hidden' },
  eventAccent: { width: 4, alignSelf: 'stretch', borderTopLeftRadius: Radius.lg, borderBottomLeftRadius: Radius.lg },
  eventIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  eventTitle: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  eventTime: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  legendIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  legendLabel: { color: Colors.textSecondary, fontSize: FontSize.md },
});
