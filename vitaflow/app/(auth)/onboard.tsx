import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore, Goal, ActivityLevel } from '../../stores/userStore';
import { GradientButton } from '../../components/GradientButton';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const { width } = Dimensions.get('window');

// ─── Step 0 — Welcome ─────────────────────────────────────────────────────────
function WelcomeStep({ onNext }: { onNext: () => void }) {
  const features = [
    { icon: '✦', title: 'Vita AI Coach', desc: 'Your personal health + money AI' },
    { icon: '⌚', title: 'Apple Watch Sync', desc: 'HRV, sleep, steps & more' },
    { icon: '🏦', title: 'Bank Sync', desc: 'Track spending automatically' },
    { icon: '🏆', title: 'Gamification', desc: 'XP, levels & weekly challenges' },
  ];

  return (
    <View style={styles.stepContainer}>
      <View style={styles.welcomeLogo}>
        <LinearGradient
          colors={['#00C896', '#7C5CFC']}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.logoText}>V</Text>
        </LinearGradient>
        <Text style={styles.appName}>VitaFlow</Text>
        <Text style={styles.tagline}>The only app that manages your body and money — powered by AI</Text>
      </View>

      <View style={styles.featureList}>
        {features.map((f) => (
          <View key={f.title} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={{ fontSize: 20 }}>{f.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <GradientButton title="Get Started Free" onPress={onNext} />
      <TouchableOpacity onPress={() => router.replace('/(auth)/signin')} style={{ marginTop: 16, alignItems: 'center' }}>
        <Text style={styles.signInLink}>Already have an account? <Text style={{ color: Colors.primary }}>Sign in</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Step 1 — Name + Goal ─────────────────────────────────────────────────────
function GoalStep({
  name,
  setName,
  goal,
  setGoal,
}: {
  name: string;
  setName: (s: string) => void;
  goal: Goal | null;
  setGoal: (g: Goal) => void;
}) {
  const goals: { id: Goal; label: string; icon: string; desc: string }[] = [
    { id: 'lose_weight', label: 'Lose Weight', icon: '🔥', desc: 'Burn fat, get lean' },
    { id: 'build_muscle', label: 'Build Muscle', icon: '💪', desc: 'Gain strength & size' },
    { id: 'both', label: 'Body Recomp', icon: '⚡', desc: 'Lose fat + build muscle' },
    { id: 'save_money', label: 'Save Money', icon: '💰', desc: 'Build financial wealth' },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Your first name"
        placeholderTextColor={Colors.textMuted}
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={[styles.stepTitle, { marginTop: Spacing.lg }]}>What's your main goal?</Text>
      <View style={styles.goalGrid}>
        {goals.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[styles.goalCard, goal === g.id && styles.goalCardActive]}
            onPress={() => setGoal(g.id)}
          >
            <Text style={styles.goalIcon}>{g.icon}</Text>
            <Text style={[styles.goalLabel, goal === g.id && { color: Colors.primary }]}>
              {g.label}
            </Text>
            <Text style={styles.goalDesc}>{g.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Step 2 — Body Stats ──────────────────────────────────────────────────────
function StatsStep({
  weight,
  setWeight,
  goalWeight,
  setGoalWeight,
  height,
  setHeight,
  age,
  setAge,
  activity,
  setActivity,
}: {
  weight: string; setWeight: (s: string) => void;
  goalWeight: string; setGoalWeight: (s: string) => void;
  height: string; setHeight: (s: string) => void;
  age: string; setAge: (s: string) => void;
  activity: ActivityLevel; setActivity: (a: ActivityLevel) => void;
}) {
  const activities: { id: ActivityLevel; label: string; desc: string }[] = [
    { id: 'light', label: 'Light', desc: '1-2x/week' },
    { id: 'moderate', label: 'Moderate', desc: '3-4x/week' },
    { id: 'very_active', label: 'Very Active', desc: '5+/week' },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your body stats</Text>
      <View style={styles.inputGrid}>
        {[
          { label: 'Current Weight (lbs)', val: weight, set: setWeight, key: 'number-pad' },
          { label: 'Goal Weight (lbs)', val: goalWeight, set: setGoalWeight, key: 'number-pad' },
          { label: 'Height (inches)', val: height, set: setHeight, key: 'number-pad' },
          { label: 'Age', val: age, set: setAge, key: 'number-pad' },
        ].map((field) => (
          <View key={field.label} style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              value={field.val}
              onChangeText={field.set}
              keyboardType="number-pad"
            />
          </View>
        ))}
      </View>

      <Text style={[styles.stepTitle, { marginTop: Spacing.md }]}>Activity level</Text>
      <View style={styles.activityRow}>
        {activities.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={[styles.activityBtn, activity === a.id && styles.activityBtnActive]}
            onPress={() => setActivity(a.id)}
          >
            <Text style={[styles.activityLabel, activity === a.id && { color: Colors.primary }]}>
              {a.label}
            </Text>
            <Text style={styles.activityDesc}>{a.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Step 3 — Money ───────────────────────────────────────────────────────────
function MoneyStep({
  income,
  setIncome,
  budget,
  setBudget,
  groceryBudget,
  setGroceryBudget,
}: {
  income: string; setIncome: (s: string) => void;
  budget: string; setBudget: (s: string) => void;
  groceryBudget: string; setGroceryBudget: (s: string) => void;
}) {
  const fields = [
    { label: 'Monthly Income ($)', val: income, set: setIncome, placeholder: '5000' },
    { label: 'Monthly Budget ($)', val: budget, set: setBudget, placeholder: '2500' },
    { label: 'Weekly Grocery Budget ($)', val: groceryBudget, set: setGroceryBudget, placeholder: '120' },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Money setup</Text>
      <Text style={styles.stepSubtitle}>
        Vita uses this to optimize your spending and savings goals.
      </Text>
      {fields.map((f) => (
        <View key={f.label}>
          <Text style={styles.inputLabel}>{f.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={f.placeholder}
            placeholderTextColor={Colors.textMuted}
            value={f.val}
            onChangeText={f.set}
            keyboardType="decimal-pad"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.plaidBtn}>
        <Ionicons name="card-outline" size={20} color={Colors.primary} />
        <Text style={styles.plaidBtnText}>Connect Bank (Optional)</Text>
        <Text style={styles.plaidTag}>via Plaid</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Onboarding screen ───────────────────────────────────────────────────
export default function Onboard() {
  const [step, setStep] = useState(0);
  const { setProfile, setOnboardingComplete, setAuthenticated } = useUserStore();

  // Step 1
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal | null>(null);

  // Step 2
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  // Step 3
  const [income, setIncome] = useState('');
  const [budget, setBudget] = useState('');
  const [groceryBudget, setGroceryBudget] = useState('');

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return name.trim().length > 0 && goal !== null;
    if (step === 2) return weight.length > 0 && goalWeight.length > 0 && height.length > 0 && age.length > 0;
    if (step === 3) return income.length > 0 && budget.length > 0 && groceryBudget.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      setProfile({
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: '',
        goal: goal!,
        currentWeight: parseFloat(weight) || 170,
        goalWeight: parseFloat(goalWeight) || 160,
        height: parseFloat(height) || 68,
        age: parseInt(age) || 28,
        activityLevel: activity,
        monthlyIncome: parseFloat(income) || 5000,
        monthlyBudget: parseFloat(budget) || 2500,
        weeklyGroceryBudget: parseFloat(groceryBudget) || 120,
      });
      setOnboardingComplete(true);
      setAuthenticated(true);
      router.replace('/(auth)/signin');
    }
  };

  const stepTitles = ['Welcome', 'Your Goal', 'Body Stats', 'Money'];
  const TOTAL_STEPS = 4;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Progress bar — hidden on welcome step */}
        {step > 0 && (
          <View style={styles.progressContainer}>
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              hitSlop={12}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.progressBar}>
              {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i < step && { backgroundColor: Colors.primary },
                  ]}
                />
              ))}
            </View>

            <Text style={styles.stepCount}>{step}/{TOTAL_STEPS - 1}</Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && <WelcomeStep onNext={handleNext} />}
          {step === 1 && (
            <GoalStep name={name} setName={setName} goal={goal} setGoal={setGoal} />
          )}
          {step === 2 && (
            <StatsStep
              weight={weight} setWeight={setWeight}
              goalWeight={goalWeight} setGoalWeight={setGoalWeight}
              height={height} setHeight={setHeight}
              age={age} setAge={setAge}
              activity={activity} setActivity={setActivity}
            />
          )}
          {step === 3 && (
            <MoneyStep
              income={income} setIncome={setIncome}
              budget={budget} setBudget={setBudget}
              groceryBudget={groceryBudget} setGroceryBudget={setGroceryBudget}
            />
          )}
        </ScrollView>

        {/* Bottom CTA — shown on steps 1-3 */}
        {step > 0 && (
          <View style={styles.bottomCta}>
            <GradientButton
              title={step === 3 ? 'Start My Journey' : 'Continue'}
              onPress={handleNext}
              disabled={!canProceed()}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn: { padding: 4 },
  progressBar: { flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center' },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surface2,
  },
  stepCount: { color: Colors.textMuted, fontSize: FontSize.sm, minWidth: 30 },

  stepContainer: { gap: Spacing.md, paddingTop: Spacing.xl },
  stepTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  stepSubtitle: { color: Colors.textSecondary, fontSize: FontSize.md, lineHeight: 22, marginTop: -Spacing.xs },
  inputLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  inputGrid: { gap: Spacing.sm },
  bottomCta: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  // Welcome step
  welcomeLogo: { alignItems: 'center', gap: Spacing.md, paddingTop: Spacing.xxl },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  appName: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.xl,
  },
  featureList: { gap: Spacing.sm, marginTop: Spacing.lg },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSize.md },
  featureDesc: { color: Colors.textMuted, fontSize: FontSize.sm, marginTop: 2 },
  signInLink: { color: Colors.textSecondary, fontSize: FontSize.md },

  // Goal step
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  goalCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  goalCardActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  goalIcon: { fontSize: 28 },
  goalLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  goalDesc: { fontSize: FontSize.sm, color: Colors.textMuted },

  // Stats step
  activityRow: { flexDirection: 'row', gap: Spacing.sm },
  activityBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  activityBtnActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  activityLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  activityDesc: { fontSize: FontSize.xs, color: Colors.textMuted },

  // Money step
  plaidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  plaidBtnText: { flex: 1, color: Colors.textSecondary, fontWeight: '600' },
  plaidTag: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    backgroundColor: Colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
