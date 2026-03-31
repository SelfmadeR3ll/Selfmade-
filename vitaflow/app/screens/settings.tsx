import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function SettingsScreen() {
  const { reset } = useUserStore();
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [notifications, setNotifications] = useState({
    workout: true,
    sleep: true,
    budget: true,
    streak: true,
    weekly: true,
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account. Your data will be anonymized but never sold.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            reset();
            router.replace('/(auth)/onboard');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Units */}
        <Card>
          <Text style={styles.cardTitle}>Units</Text>
          <View style={styles.unitRow}>
            {(['imperial', 'metric'] as const).map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.unitBtn, units === u && styles.unitBtnActive]}
                onPress={() => setUnits(u)}
              >
                <Text style={[styles.unitText, units === u && { color: Colors.primary }]}>
                  {u === 'imperial' ? '🇺🇸 Imperial (lbs, ft)' : '🌍 Metric (kg, cm)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Notifications */}
        <Card>
          <Text style={styles.cardTitle}>Notifications</Text>
          {[
            { key: 'workout' as const, label: 'Workout Reminders', desc: 'HRV-based morning alert' },
            { key: 'sleep' as const, label: 'Bedtime Reminder', desc: 'Based on your sleep target' },
            { key: 'budget' as const, label: 'Budget Alerts', desc: 'When spending is near limit' },
            { key: 'streak' as const, label: 'Streak Warnings', desc: 'When streak is at risk' },
            { key: 'weekly' as const, label: 'Weekly Summary', desc: 'Sunday evening report' },
          ].map((n) => (
            <View key={n.key} style={styles.notifRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifLabel}>{n.label}</Text>
                <Text style={styles.notifDesc}>{n.desc}</Text>
              </View>
              <Switch
                value={notifications[n.key]}
                onValueChange={(val) => setNotifications((p) => ({ ...p, [n.key]: val }))}
                trackColor={{ false: Colors.surface2, true: Colors.primary }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </Card>

        {/* Connected accounts */}
        <Card>
          <Text style={styles.cardTitle}>Connected Accounts</Text>
          {[
            { name: 'Plaid (Bank Sync)', icon: 'card-outline', connected: false, color: Colors.blue },
            { name: 'Apple HealthKit', icon: 'heart-outline', connected: false, color: Colors.red },
            { name: 'Apple Watch', icon: 'watch-outline', connected: false, color: Colors.textSecondary },
          ].map((acc) => (
            <View key={acc.name} style={styles.connRow}>
              <View style={[styles.connIcon, { backgroundColor: `${acc.color}18` }]}>
                <Ionicons name={acc.icon as any} size={18} color={acc.color} />
              </View>
              <Text style={styles.connLabel}>{acc.name}</Text>
              <TouchableOpacity
                style={[styles.connBtn, acc.connected && styles.connBtnConnected]}
              >
                <Text style={[styles.connBtnText, acc.connected && { color: Colors.primary }]}>
                  {acc.connected ? 'Connected' : 'Connect'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>

        {/* Privacy */}
        <Card>
          <Text style={styles.cardTitle}>Privacy & Data</Text>
          {[
            { label: 'Privacy Policy', icon: 'shield-outline' },
            { label: 'Terms of Service', icon: 'document-outline' },
            { label: 'Export My Data', icon: 'download-outline' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.privacyRow}>
              <Ionicons name={item.icon as any} size={18} color={Colors.textSecondary} />
              <Text style={styles.privacyLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* App info */}
        <Card>
          <Text style={styles.appVersion}>VitaFlow v1.0.0</Text>
          <Text style={styles.appNote}>
            Your data is private and never sold. Bank connections are read-only via Plaid.
          </Text>
        </Card>

        {/* Danger zone */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={18} color={Colors.red} />
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </TouchableOpacity>
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
  unitRow: { gap: Spacing.sm },
  unitBtn: { padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderWidth: 1.5, borderColor: Colors.border },
  unitBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  unitText: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.md },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  notifLabel: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md },
  notifDesc: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  connRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  connIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  connLabel: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  connBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border },
  connBtnConnected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  connBtnText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  privacyLabel: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  appVersion: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  appNote: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 6, lineHeight: 18 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: `${Colors.red}30` },
  deleteBtnText: { color: Colors.red, fontWeight: '600', fontSize: FontSize.md },
});
