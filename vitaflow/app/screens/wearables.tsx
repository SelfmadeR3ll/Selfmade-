import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const DEVICES = [
  { name: 'Apple Watch', icon: '⌚', connected: false, description: 'HRV, sleep, steps, calories, SpO2', color: Colors.textSecondary },
  { name: 'Fitbit', icon: '📲', connected: false, description: 'Heart rate, sleep, steps', color: Colors.primary },
  { name: 'Garmin', icon: '🏃', connected: false, description: 'Advanced running metrics', color: Colors.purple },
  { name: 'WHOOP', icon: '💪', connected: false, description: 'HRV, strain, recovery', color: Colors.red },
];

const HEALTH_DATA = [
  { label: 'HRV', value: '65 ms', icon: '💓', color: Colors.purple },
  { label: 'Resting HR', value: '58 bpm', icon: '❤️', color: Colors.red },
  { label: 'Active Cal', value: '420 kcal', icon: '🔥', color: Colors.orange },
  { label: 'SpO2', value: '98%', icon: '🌡️', color: Colors.blue },
  { label: 'Steps', value: '7,420', icon: '👟', color: Colors.primary },
  { label: 'Sleep', value: '7.2h', icon: '😴', color: Colors.blue },
];

export default function WearablesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wearables</Text>
        </View>

        {/* Current health data */}
        <Card>
          <View style={styles.dataHeader}>
            <Text style={styles.cardTitle}>Health Data</Text>
            <Text style={styles.syncStatus}>Last synced: Just now</Text>
          </View>
          <View style={styles.dataGrid}>
            {HEALTH_DATA.map((item) => (
              <View key={item.label} style={styles.dataItem}>
                <Text style={styles.dataIcon}>{item.icon}</Text>
                <Text style={[styles.dataValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.dataLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Devices */}
        <Text style={styles.sectionTitle}>Connect Devices</Text>
        {DEVICES.map((device) => (
          <Card key={device.name}>
            <View style={styles.deviceRow}>
              <Text style={styles.deviceIcon}>{device.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceDesc}>{device.description}</Text>
              </View>
              <TouchableOpacity
                style={[styles.connectBtn, device.connected && styles.connectBtnConnected]}
              >
                <Text style={[styles.connectBtnText, device.connected && { color: Colors.primary }]}>
                  {device.connected ? 'Connected' : 'Connect'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {/* Apple HealthKit info */}
        <Card style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.blue} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Apple HealthKit</Text>
            <Text style={styles.infoDesc}>
              VitaFlow reads heart rate, HRV, sleep stages, steps, and activity data from HealthKit. Data is never shared with third parties.
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
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  dataHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  syncStatus: { fontSize: FontSize.xs, color: Colors.primary },
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dataItem: { width: '30%', flex: 1, alignItems: 'center', gap: 4 },
  dataIcon: { fontSize: 22 },
  dataValue: { fontSize: FontSize.md, fontWeight: '800' },
  dataLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  deviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  deviceIcon: { fontSize: 28 },
  deviceName: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSize.md },
  deviceDesc: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  connectBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border },
  connectBtnConnected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  connectBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
  infoCard: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  infoTitle: { color: Colors.textPrimary, fontWeight: '600', fontSize: FontSize.md, marginBottom: 4 },
  infoDesc: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
});
