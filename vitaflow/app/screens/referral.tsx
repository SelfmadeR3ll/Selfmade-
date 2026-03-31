import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { Card } from '../../components/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function ReferralScreen() {
  const { profile } = useUserStore();
  const referralCode = `VITA-${(profile?.name ?? 'USER').toUpperCase().slice(0, 4)}-2026`;
  const referralLink = `https://vitaflow.app/join?ref=${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on VitaFlow — the only app that manages your body and money with AI! Use my link to get 1 month Pro free: ${referralLink}`,
        url: referralLink,
      });
    } catch {
      Alert.alert('Share', 'Could not open share sheet.');
    }
  };

  const handleCopyCode = () => {
    Alert.alert('Copied!', `Referral code ${referralCode} copied to clipboard.`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer a Friend</Text>
        </View>

        <LinearGradient colors={['#00C896', '#7C5CFC']} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>Give 1 month Pro</Text>
          <Text style={styles.heroSubtitle}>Get 1 month Pro</Text>
          <Text style={styles.heroDesc}>
            For every friend who signs up with your link, you both get 1 month of Pro free.
          </Text>
        </LinearGradient>

        {/* Referral code */}
        <Card>
          <Text style={styles.cardTitle}>Your Referral Code</Text>
          <View style={styles.codeRow}>
            <Text style={styles.code}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode}>
              <Ionicons name="copy-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.codeLink}>{referralLink}</Text>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Friends Referred</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0 mo</Text>
            <Text style={styles.statLabel}>Pro Rewards Earned</Text>
          </Card>
        </View>

        {/* Share buttons */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <LinearGradient colors={['#00C896', '#7C5CFC']} style={styles.shareBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.shareBtnText}>Share My Link</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* How it works */}
        <Card>
          <Text style={styles.cardTitle}>How It Works</Text>
          {[
            { step: '1', text: 'Share your unique referral link with a friend' },
            { step: '2', text: 'Your friend signs up and starts a free trial' },
            { step: '3', text: 'When they upgrade, you both get 1 month Pro free' },
            { step: '4', text: 'No limit — keep referring for more free months!' },
          ].map((item) => (
            <View key={item.step} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{item.step}</Text>
              </View>
              <Text style={styles.stepText}>{item.text}</Text>
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
  heroCard: { borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#fff' },
  heroSubtitle: { fontSize: FontSize.xl, fontWeight: '800', color: 'rgba(255,255,255,0.8)' },
  heroDesc: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22 },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface2, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  code: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, letterSpacing: 2 },
  copyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: `${Colors.primary}18`, alignItems: 'center', justifyContent: 'center' },
  codeLink: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.lg },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  shareBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  shareBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: 16 },
  shareBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.lg },
  stepRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border, alignItems: 'flex-start' },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: `${Colors.primary}18`, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: Colors.primary, fontWeight: '700' },
  stepText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.md, lineHeight: 22 },
});
