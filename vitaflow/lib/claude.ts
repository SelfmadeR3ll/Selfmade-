import { UserProfile, DailyStats } from '../stores/userStore';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const MODEL = 'claude-sonnet-4-20250514';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── System prompt builder ────────────────────────────────────────────────────

export function buildVitaSystemPrompt(
  profile: UserProfile | null,
  stats: DailyStats | null
): string {
  if (!profile) {
    return `You are Vita, an AI health and money coach inside the VitaFlow app.
Be warm, direct, and coach-like. The user hasn't set up their profile yet — encourage them to complete onboarding to get personalized advice.`;
  }

  const goalLabels: Record<string, string> = {
    lose_weight: 'Lose Weight',
    build_muscle: 'Build Muscle',
    both: 'Recomposition (Lose Fat + Build Muscle)',
    save_money: 'Save Money & Build Wealth',
  };

  const activityLabels: Record<string, string> = {
    light: 'Light (1-2x/week)',
    moderate: 'Moderate (3-4x/week)',
    very_active: 'Very Active (5+x/week)',
  };

  const weightLbs = profile.currentWeight;
  const goalLbs = profile.goalWeight;
  const diff = Math.abs(weightLbs - goalLbs);
  const weeksToGoal = profile.goal === 'lose_weight' ? Math.ceil(diff / 1) : Math.ceil(diff / 0.5);
  const etaDate = new Date();
  etaDate.setDate(etaDate.getDate() + weeksToGoal * 7);
  const eta = etaDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const calories = stats?.calorieTarget ?? Math.round(weightLbs * 14);
  const protein = stats?.proteinTarget ?? Math.round(weightLbs * 0.8);
  const carbs = stats?.carbsTarget ?? Math.round((calories * 0.4) / 4);
  const fat = stats?.fatTarget ?? Math.round((calories * 0.3) / 9);

  return `You are Vita, an AI health and money coach inside the VitaFlow app. You know everything about the user.

USER PROFILE:
- Name: ${profile.name}
- Goal: ${goalLabels[profile.goal] ?? profile.goal}
- Current Weight: ${weightLbs} lbs | Goal: ${goalLbs} lbs | ETA: ${eta}
- Height: ${profile.height} inches | Age: ${profile.age} | Activity: ${activityLabels[profile.activityLevel] ?? profile.activityLevel}
- Daily Calories: ${calories} kcal | Protein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g
- Monthly Budget: $${profile.monthlyBudget} | Income: $${profile.monthlyIncome} | Weekly Grocery Budget: $${profile.weeklyGroceryBudget}
${stats ? `- Last Night Sleep: ${stats.sleep}h, Quality ${stats.sleepScore}/100
- HRV: ${stats.hrv}ms
- Today's Spending: $${stats.spend.toFixed(2)}
- Today's Calories: ${stats.calories}/${stats.calorieTarget} kcal
- Steps: ${stats.steps}/${stats.stepTarget}
- Water: ${stats.water}/${stats.waterTarget} oz` : ''}

Respond in a warm, direct, coach-like tone. Be specific — reference their actual numbers.
Keep responses concise (2-4 sentences for quick answers, more for plans).
Never make up data not provided. If data is missing, ask for it.
Use markdown sparingly — short paragraphs work best. Never use excessive bullet points.`;
}

// ─── Grocery prompt builder ───────────────────────────────────────────────────

export function buildGroceryPrompt(
  userRequest: string,
  profile: UserProfile | null,
  stats: DailyStats | null
): string {
  const groceryBudget = profile?.weeklyGroceryBudget ?? 100;
  const protein = stats?.proteinTarget ?? 180;
  const carbs = stats?.carbsTarget ?? 220;
  const fat = stats?.fatTarget ?? 65;

  return `The user wants to grocery shop with this request: "${userRequest}"
Their weekly grocery budget is $${groceryBudget}.
Their macro targets: ${protein}g protein, ${carbs}g carbs, ${fat}g fat/day.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "items": [
    {
      "name": "Chicken Breast",
      "quantity": "3 lbs",
      "estimatedPrice": 8.99,
      "bestStore": "Aldi",
      "category": "Protein"
    }
  ],
  "totalEstimate": 54.20,
  "stores": ["Aldi", "Walmart"],
  "notes": "Split your shopping between Aldi and Walmart to save ~$12"
}

Be realistic with 2026 prices. Prioritize budget efficiency. Include 8-15 items.`;
}

// ─── Meal plan prompt builder ─────────────────────────────────────────────────

export function buildMealPlanPrompt(profile: UserProfile | null, stats: DailyStats | null): string {
  const budget = profile?.weeklyGroceryBudget ?? 100;
  const protein = stats?.proteinTarget ?? 180;
  const carbs = stats?.carbsTarget ?? 220;
  const fat = stats?.fatTarget ?? 65;
  const calories = stats?.calorieTarget ?? 2200;

  return `Create a 7-day meal plan for this user.
Daily targets: ${calories} kcal, ${protein}g protein, ${carbs}g carbs, ${fat}g fat.
Weekly food budget: $${budget}.

Return ONLY valid JSON:
{
  "days": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": { "name": "...", "calories": 400, "protein": 30, "cost": 3.50 },
        "lunch": { "name": "...", "calories": 600, "protein": 45, "cost": 5.00 },
        "dinner": { "name": "...", "calories": 700, "protein": 55, "cost": 7.00 },
        "snacks": { "name": "...", "calories": 300, "protein": 20, "cost": 2.50 }
      },
      "totalCost": 18.00
    }
  ],
  "weeklyTotal": 126.00,
  "prepDay": "Sunday",
  "prepTasks": ["Cook rice in bulk", "Grill chicken breasts", "Chop vegetables"]
}

Focus on high-protein, budget-friendly meals. 2026 food prices.`;
}

// ─── Weekly summary prompt ────────────────────────────────────────────────────

export function buildWeeklySummaryPrompt(
  profile: UserProfile | null,
  weeklyData: Record<string, unknown>
): string {
  return `Generate a motivating weekly health and money summary for ${profile?.name ?? 'the user'}.

Weekly data:
${JSON.stringify(weeklyData, null, 2)}

Write 3-4 short paragraphs:
1. Health highlights (workouts, sleep, nutrition wins)
2. Money highlights (spending, savings, budget adherence)
3. Top 3 wins this week
4. 2 focus areas for next week

Keep it warm, specific, and encouraging. Reference actual numbers.`;
}

// ─── Core streaming chat call ─────────────────────────────────────────────────

export async function streamVitaChat(
  messages: ChatMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        stream: true,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${text}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
            onChunk(parsed.delta.text);
          }
        } catch {
          // skip malformed SSE lines
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

// ─── Non-streaming call (for structured JSON responses) ───────────────────────

export async function callClaude(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt ?? 'You are a helpful AI assistant.',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? '';
}
