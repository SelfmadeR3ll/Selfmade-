// Stripe integration — server-side calls go through your backend
// Client-side just handles plan display and initiating checkout

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceStr: '$0',
    period: '',
    features: [
      '5 Vita AI messages/day',
      'Basic health tracking',
      'Budget overview',
      'Calorie logging',
    ],
    highlight: false,
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro',
    price: 9.99,
    priceStr: '$9.99',
    period: '/month',
    trial: '7-day free trial',
    features: [
      'Unlimited Vita AI',
      'Full health analytics',
      'Bank sync (Plaid)',
      'Meal planning AI',
      'Smart Grocery AI',
      'Apple Watch + wearables',
      'Priority support',
    ],
    highlight: true,
  },
  pro_annual: {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: 79.99,
    priceStr: '$79.99',
    period: '/year',
    trial: '7-day free trial',
    savingsLabel: 'Save $40/year',
    features: [
      'Everything in Pro Monthly',
      'Save $40 vs monthly',
      'Annual health report',
    ],
    highlight: false,
  },
  family: {
    id: 'family',
    name: 'Family',
    price: 14.99,
    priceStr: '$14.99',
    period: '/month',
    trial: '7-day free trial',
    features: [
      'Up to 5 members',
      'Family health dashboard',
      'Shared grocery lists',
      'Family budget view',
      'All Pro features',
    ],
    highlight: false,
  },
} as const;

export type PlanId = keyof typeof PLANS;

// Call your Node.js backend to create a Stripe Checkout session
export async function createCheckoutSession(
  planId: PlanId,
  userId: string,
  email: string
): Promise<{ url: string }> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
  const response = await fetch(`${apiUrl}/billing/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, userId, email }),
  });
  if (!response.ok) throw new Error('Failed to create checkout session');
  return response.json();
}

// Verify subscription status from your backend
export async function getSubscriptionStatus(userId: string): Promise<{
  tier: 'free' | 'pro' | 'family';
  trialEnd?: string;
  renewsAt?: string;
}> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
  const response = await fetch(`${apiUrl}/billing/status?userId=${userId}`);
  if (!response.ok) return { tier: 'free' };
  return response.json();
}
