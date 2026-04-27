export type UnitSystem = 'metric' | 'imperial';

export interface HealthFormData {
  name: string;
  age: string;
  sex: 'male' | 'female' | 'other';
  unitSystem: UnitSystem;
  // Metric
  heightCm: string;
  weightKg: string;
  // Imperial
  heightFt: string;
  heightIn: string;
  weightLbs: string;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  medicalConditions: string;
  goals: string;
}

export interface MetricValues {
  heightCm: number;
  weightKg: number;
}
