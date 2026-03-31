import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../stores/userStore';
import { PLANS, PlanId } from '../../lib/stripe';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function BillingScreen() {
  const { subscriptionTier, setSubscriptionTier } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro_monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Demo mode: simulate subscription
      await new Promise((r) => setTimeout(r, 1500));
      setSubscriptionTier('pro');
      Alert.alert(
        '🎉 Welcome to Pro!',
        'Your 7-day free trial has started. You now have unlimited Vita AI access and all Pro features.',
        [{ text: "Let's Go!", onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const plan = PLANS[selectedPlan];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upgrade VitaFlow</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero */}
        <LinearGradient
          colors={['#00C896', '#7C5CFC']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Unlimited Vita AI, bank sync, wearables, and everything you need to transform your health and finances.
          </Text>
        </LinearGradient>

        {/* Plan selector */}
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        {(['pro_monthly', 'pro_annual', 'family'] as PlanId[]).map((planId) => {
          const p = PLANS[planId];
          return (
            <TouchableOpacity
              key={planId}
              style={[
                styles.planCard,
                selectedPlan === planId && styles.planCardActive,
                p.highlight && styles.planCardHighlighted,
              ]}
              onPress={() => setSelectedPlan(planId)}
            >
              {p.highlight && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              {'savingsLabel' in p && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{(p as any).savingsLabel}</Text>
                </View>
              )}
              <View style={styles.planRow}>
                <View style={[styles.planRadio, selectedPlan === planId && styles.planRadioActive]}>
                  {selectedPlan === planId && <View style={styles.planRadioDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{p.name}</Text>
                  {'trial' in p && <Text style={styles.planTrial}>{(p as any).trial}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.planPrice}>{p.priceStr}</Text>
                  <Text style={styles.planPeriod}>{p.period}</Text>
                </View>
              </View>
              <View style={styles.planFeatures}>
                {p.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Free plan comparison */}
        <View style={styles.freeCard}>
          <Text style={styles.freePlanTitle}>Free Plan (Current)</Text>
          <View style={styles.planFeatures}>
            {PLANS.free.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="remove-circle-outline" size={16} color={Colors.textMuted} />
                <Text style={[styles.featureText, { color: Colors.textMuted }]}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        {subscriptionTier !== 'pro' && (
          <View style={styles.ctaContainer}>
            <GradientButton
              title={loading ? '' : `Start ${('trial' in plan) ? (plan as any).trial : 'Now'}`}
              onPress={handleSubscribe}
              loading={loading}
            />
            <Text style={styles.ctaNote}>
              Cancel anytime · Secure payment · No hidden fees
            </Text>
          </View>
        )}

        {subscriptionTier === 'pro' && (
          <View style={styles.currentPlan}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
            <Text style={styles.currentPlanText}>You're already on Pro — enjoy all features!</Text>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  hero: { borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.sm },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#fff' },
  heroSubtitle: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.85)', lineHeight: 22 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.sm,
    position: 'relative',
  },
  planCardActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` },
  planCardHighlighted: { borderColor: Colors.purple },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: Colors.purple,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.5 },
  savingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${Colors.primary}20`,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  savingsText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioActive: { borderColor: Colors.primary },
  planRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  planName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  planTrial: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '500' },
  planPrice: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  planPeriod: { fontSize: FontSize.xs, color: Colors.textMuted },
  planFeatures: { gap: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  featureText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  freeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  freePlanTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textMuted },
  ctaContainer: { gap: Spacing.sm },
  ctaNote: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.sm },
  currentPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: `${Colors.primary}10`,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  currentPlanText: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.md },
});
