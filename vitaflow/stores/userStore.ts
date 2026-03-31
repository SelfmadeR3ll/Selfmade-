import { create } from 'zustand';

export type Goal = 'lose_weight' | 'build_muscle' | 'both' | 'save_money';
export type ActivityLevel = 'light' | 'moderate' | 'very_active';
export type SubscriptionTier = 'free' | 'pro' | 'family';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  goal: Goal;
  currentWeight: number;
  goalWeight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  monthlyIncome: number;
  monthlyBudget: number;
  weeklyGroceryBudget: number;
  avatarUrl?: string;
}

export interface DailyStats {
  date: string;
  calories: number;
  calorieTarget: number;
  steps: number;
  stepTarget: number;
  water: number;
  waterTarget: number;
  spend: number;
  spendTarget: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  sleep: number;
  sleepScore: number;
  hrv: number;
  mood?: number;
  stressLevel?: number;
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  aiTag?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  autopay: boolean;
  category: string;
}

export interface GamificationState {
  xp: number;
  level: string;
  streak: number;
  badges: string[];
  weeklyChallengProgress: Record<string, number>;
}

interface UserStore {
  // Auth
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  subscriptionTier: SubscriptionTier;
  vitaMessageCount: number;

  // Profile
  profile: UserProfile | null;

  // Daily data
  dailyStats: DailyStats | null;
  weightHistory: { date: string; weight: number }[];
  workoutLogs: WorkoutLog[];
  transactions: Transaction[];
  bills: Bill[];

  // Gamification
  gamification: GamificationState;

  // UI state
  vitaBubbleVisible: boolean;
  isVitaBubbleExpanded: boolean;

  // Actions
  setAuthenticated: (val: boolean) => void;
  setOnboardingComplete: (val: boolean) => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setDailyStats: (stats: DailyStats) => void;
  updateDailyStats: (partial: Partial<DailyStats>) => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  incrementVitaMessageCount: () => void;
  resetVitaMessageCount: () => void;
  toggleVitaBubble: () => void;
  setVitaBubbleExpanded: (expanded: boolean) => void;
  addTransaction: (tx: Transaction) => void;
  addBill: (bill: Bill) => void;
  addWeightEntry: (entry: { date: string; weight: number }) => void;
  reset: () => void;
}

const XP_LEVELS = [
  { min: 0, max: 499, name: 'New Starter' },
  { min: 500, max: 1499, name: 'Consistent' },
  { min: 1500, max: 3499, name: 'Dedicated' },
  { min: 3500, max: 6999, name: 'Committed' },
  { min: 7000, max: 14999, name: 'Elite' },
  { min: 15000, max: Infinity, name: 'Vita Legend' },
];

function getLevelName(xp: number): string {
  return XP_LEVELS.find((l) => xp >= l.min && xp <= l.max)?.name ?? 'New Starter';
}

const initialGamification: GamificationState = {
  xp: 0,
  level: 'New Starter',
  streak: 0,
  badges: [],
  weeklyChallengProgress: {},
};

const todayStr = new Date().toISOString().split('T')[0];

const initialDailyStats: DailyStats = {
  date: todayStr,
  calories: 0,
  calorieTarget: 2200,
  steps: 0,
  stepTarget: 10000,
  water: 0,
  waterTarget: 64,
  spend: 0,
  spendTarget: 50,
  protein: 0,
  carbs: 0,
  fat: 0,
  proteinTarget: 180,
  carbsTarget: 220,
  fatTarget: 65,
  sleep: 0,
  sleepScore: 0,
  hrv: 0,
  mood: undefined,
  stressLevel: undefined,
};

export const useUserStore = create<UserStore>((set, get) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  subscriptionTier: 'free',
  vitaMessageCount: 0,

  profile: null,
  dailyStats: initialDailyStats,
  weightHistory: [],
  workoutLogs: [],
  transactions: [
    { id: '1', date: todayStr, merchant: 'Whole Foods', amount: 67.32, category: 'Groceries', aiTag: 'Meal Prep' },
    { id: '2', date: todayStr, merchant: 'Planet Fitness', amount: 24.99, category: 'Fitness', aiTag: 'Health' },
    { id: '3', date: todayStr, merchant: 'Netflix', amount: 15.99, category: 'Subscriptions', aiTag: 'Entertainment' },
    { id: '4', date: todayStr, merchant: 'Chipotle', amount: 12.45, category: 'Dining', aiTag: 'Eating Out' },
  ],
  bills: [
    { id: '1', name: 'Rent', amount: 1500, dueDate: '2026-04-01', autopay: true, category: 'Housing' },
    { id: '2', name: 'Electric', amount: 85, dueDate: '2026-04-05', autopay: false, category: 'Utilities' },
    { id: '3', name: 'Internet', amount: 60, dueDate: '2026-04-08', autopay: true, category: 'Utilities' },
    { id: '4', name: 'Car Insurance', amount: 145, dueDate: '2026-04-15', autopay: true, category: 'Insurance' },
  ],

  gamification: initialGamification,

  vitaBubbleVisible: true,
  isVitaBubbleExpanded: false,

  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setOnboardingComplete: (val) => set({ hasCompletedOnboarding: val }),
  setProfile: (profile) => set({ profile }),
  updateProfile: (partial) =>
    set((state) => ({ profile: state.profile ? { ...state.profile, ...partial } : null })),
  setDailyStats: (stats) => set({ dailyStats: stats }),
  updateDailyStats: (partial) =>
    set((state) => ({ dailyStats: state.dailyStats ? { ...state.dailyStats, ...partial } : null })),
  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
  addXP: (amount) =>
    set((state) => {
      const newXP = state.gamification.xp + amount;
      return {
        gamification: {
          ...state.gamification,
          xp: newXP,
          level: getLevelName(newXP),
        },
      };
    }),
  incrementStreak: () =>
    set((state) => ({
      gamification: { ...state.gamification, streak: state.gamification.streak + 1 },
    })),
  incrementVitaMessageCount: () => set((s) => ({ vitaMessageCount: s.vitaMessageCount + 1 })),
  resetVitaMessageCount: () => set({ vitaMessageCount: 0 }),
  toggleVitaBubble: () => set((s) => ({ isVitaBubbleExpanded: !s.isVitaBubbleExpanded })),
  setVitaBubbleExpanded: (expanded) => set({ isVitaBubbleExpanded: expanded }),
  addTransaction: (tx) => set((s) => ({ transactions: [tx, ...s.transactions] })),
  addBill: (bill) => set((s) => ({ bills: [...s.bills, bill] })),
  addWeightEntry: (entry) => set((s) => ({ weightHistory: [...s.weightHistory, entry] })),
  reset: () =>
    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      subscriptionTier: 'free',
      profile: null,
      dailyStats: initialDailyStats,
      gamification: initialGamification,
      vitaMessageCount: 0,
    }),
}));
