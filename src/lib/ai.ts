import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import type { HealthFormData, MetricValues } from '../types';

export function toMetric(data: HealthFormData): MetricValues {
  if (data.unitSystem === 'metric') {
    return {
      heightCm: parseFloat(data.heightCm) || 0,
      weightKg: parseFloat(data.weightKg) || 0,
    };
  }
  // Imperial to metric
  const totalInches = (parseFloat(data.heightFt) || 0) * 12 + (parseFloat(data.heightIn) || 0);
  return {
    heightCm: Math.round(totalInches * 2.54 * 10) / 10,
    weightKg: Math.round((parseFloat(data.weightLbs) || 0) * 0.453592 * 10) / 10,
  };
}

const SYSTEM_PROMPT = `You are a health analysis assistant. When given a user's health data, respond with a structured health report in the following exact format. Use markdown with clear section headers. Be informative, supportive, and non-alarmist.

## 1. Personal Profile
Summarize the user's provided details (name, age, sex, activity level, goals).

## 2. Body Metrics
- **Height**: [value in cm and ft/in]
- **Weight**: [value in kg and lbs]
- **BMI**: [calculated value, 1 decimal]
- **BMI Category**: [Underweight / Normal weight / Overweight / Obese — use standard WHO ranges: <18.5, 18.5–24.9, 25–29.9, ≥30]
- **Ideal Weight Range**: [healthy BMI range 18.5–24.9 for this height, in both kg and lbs]

## 3. Health Assessment
Provide a brief overall health status assessment (2–4 sentences). Then list any notable risk factors or positive health indicators based on the provided data.

## 4. Recommendations
Provide personalised, actionable recommendations in three sub-sections:
### Lifestyle
### Diet
### Exercise

Keep each sub-section to 3–5 bullet points. Tailor advice to the user's stated goals and activity level. End with a brief motivating closing statement.

Important: Do not include any disclaimers about not being a doctor or professional unless specifically asked. Keep the tone positive and practical.`;

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
