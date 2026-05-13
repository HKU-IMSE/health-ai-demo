import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import type { HealthFormData, MetricValues } from '../types';

// ─── Part B: Unit conversion ──────────────────────────────────────────────
//
// Complete the toMetric() function.
//
// It receives a HealthFormData object and must return a MetricValues object
// { heightCm: number, weightKg: number }.
//
// Rules:
//   • If data.unitSystem === 'metric', parse heightCm and weightKg directly.
//   • If data.unitSystem === 'imperial':
//       - Convert feet + inches to centimetres:  total_inches × 2.54
//       - Convert pounds to kilograms:           lbs × 0.453592
//       - Round both results to 1 decimal place.
//   • All input fields are strings — use parseFloat() to convert.
//     Guard against empty strings with:  (parseFloat(x) || 0)
//
// BMI is calculated later in streamHealthAnalysis as:
//   weightKg / (heightCm / 100) ^ 2
// so getting the conversion right matters!
// ─────────────────────────────────────────────────────────────────────────

export function toMetric(data: HealthFormData): MetricValues {
  // TODO: implement this function
  return { heightCm: 0, weightKg: 0 };
}

// ─── Part C: AI system prompt ─────────────────────────────────────────────
//
// Write a system prompt that instructs the AI to produce a structured health
// report in markdown.  The AI will receive a user message containing:
//   - Name, Age, Sex
//   - Height (cm), Weight (kg), pre-calculated BMI
//   - Activity level, Medical conditions, Health goals
//
// Your prompt must make the AI output EXACTLY these sections (in order):
//
//   ## 1. Personal Profile
//   ## 2. Body Metrics
//   ## 3. Health Assessment
//   ## 4. Recommendations
//      ### Lifestyle
//      ### Diet
//      ### Exercise
//
// Section requirements:
//   1. Personal Profile  — summarise the user's provided details
//   2. Body Metrics      — height (cm + ft/in), weight (kg + lbs), BMI value,
//                          BMI category (WHO ranges: <18.5 / 18.5–24.9 / 25–29.9 / ≥30),
//                          ideal weight range for this height
//   3. Health Assessment — 2–4 sentence overall status + notable risk/positive factors
//   4. Recommendations   — 3–5 bullet points per sub-section, tailored to the user's
//                          goals and activity level; end with a motivating statement
//
// Tone guidance:
//   • Informative, supportive, and non-alarmist
//   • No disclaimer about not being a doctor (unless asked)
//   • Positive and practical
// ─────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `TODO: write your system prompt here`;

// ─── Provided: AI streaming call ─────────────────────────────────────────
// You do NOT need to modify anything below this line.
// ─────────────────────────────────────────────────────────────────────────

export async function streamHealthAnalysis(
  data: HealthFormData,
  onChunk: (text: string) => void,
  onFinish: () => void,
  onError: (error: Error) => void,
) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    onError(new Error('Missing VITE_OPENROUTER_API_KEY in .env.local'));
    return;
  }

  const metrics = toMetric(data);
  const bmi = metrics.weightKg / Math.pow(metrics.heightCm / 100, 2);

  const activityLabels: Record<string, string> = {
    sedentary: 'Sedentary (little or no exercise)',
    lightly_active: 'Lightly active (1–3 days/week)',
    moderately_active: 'Moderately active (3–5 days/week)',
    very_active: 'Very active (6–7 days/week)',
    extra_active: 'Extra active (hard exercise + physical job)',
  };

  const userMessage = `Please analyse my health data:
- Name: ${data.name || 'Not provided'}
- Age: ${data.age} years
- Sex: ${data.sex}
- Height: ${metrics.heightCm} cm
- Weight: ${metrics.weightKg} kg
- Pre-calculated BMI: ${bmi.toFixed(1)}
- Activity level: ${activityLabels[data.activityLevel]}
- Medical conditions / medications: ${data.medicalConditions || 'None mentioned'}
- Health goals: ${data.goals || 'General health improvement'}`;

  const openrouter = createOpenRouter({ apiKey });

  const modelId = import.meta.env.VITE_OPENROUTER_MODEL_ID || 'openrouter/free';
  try {
    const result = streamText({
      model: openrouter(modelId),
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    for await (const chunk of result.textStream) {
      onChunk(chunk);
    }
    onFinish();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
