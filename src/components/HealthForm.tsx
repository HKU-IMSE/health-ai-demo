import React from 'react';
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import type { HealthFormData, UnitSystem } from '../types';

interface Props {
  onSubmit: (data: HealthFormData) => void;
  isLoading: boolean;
}

const defaultForm: HealthFormData = {
  name: '',
  age: '',
  sex: 'male',
  unitSystem: 'metric',
  heightCm: '',
  weightKg: '',
  heightFt: '',
  heightIn: '',
  weightLbs: '',
  activityLevel: '',
  medicalConditions: '',
  goals: '',
};

export function HealthForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = React.useState<HealthFormData>(defaultForm);

  // Helper: update a single field in the form state
  const set = <K extends keyof HealthFormData>(key: K, value: HealthFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Clears height/weight fields when the unit system changes
  const switchUnits = (system: UnitSystem) => {
    setForm((prev) => ({
      ...prev,
      unitSystem: system,
      heightCm: '',
      weightKg: '',
      heightFt: '',
      heightIn: '',
      weightLbs: '',
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  // ─── Part A: Build the form UI ────────────────────────────────────────────
  //
  // Return a <form> element with onSubmit={handleSubmit} and className="flex flex-col gap-6".
  //
  // Inside the form, add the following sections IN ORDER:
  //
  // 1. PERSONAL INFO — a <Grid container spacing={2}> with three columns:
  //    a) Name field       — TextField, label "Name (optional)", not required
  //    b) Age field        — TextField, type="number", required, min=1, max=120
  //    c) Sex field        — TextField select, required
  //                          Options: "male" / "female" / "other / Prefer not to say"
  //
  // 2. UNIT TOGGLE — a <ToggleButtonGroup> (exclusive) bound to form.unitSystem.
  //    Call switchUnits(val) on change.
  //    Two buttons: value="metric" and value="imperial"
  //
  // 3. HEIGHT & WEIGHT — conditional on form.unitSystem:
  //    • "metric"   → two TextFields: Height (cm) + Weight (kg)
  //    • "imperial" → three TextFields: Height (ft) + Height (in) + Weight (lbs)
  //    Wrap each group in a <Grid container spacing={2}>.
  //
  // 4. ACTIVITY LEVEL — a TextField select, required.
  //    Options (value → label):
  //      sedentary          → "Sedentary — little or no exercise"
  //      lightly_active     → "Lightly active — 1–3 days/week"
  //      moderately_active  → "Moderately active — 3–5 days/week"
  //      very_active        → "Very active — 6–7 days/week"
  //      extra_active       → "Extra active — hard exercise + physical job"
  //
  // 5. MEDICAL CONDITIONS — multiline TextField (2 rows), not required
  //
  // 6. HEALTH GOALS — multiline TextField (2 rows), not required
  //
  // 7. SUBMIT BUTTON — MUI <Button type="submit" variant="contained" fullWidth>
  //    • Show a <CircularProgress size={16} /> spinner as startIcon when isLoading
  //    • Disable the button when isLoading
  //    • Label: "Generating Report…" when loading, "Generate Health Report" otherwise
  //
  // All interactive fields should have:
  //   disabled={isLoading}
  //   value={form.<field>}
  //   onChange={(e) => set('<field>', e.target.value)}
  //
  // Hints:
  //   • Use <Grid size={{ xs: 12, sm: 4 }}> for three-column rows
  //   • Use <Grid size={{ xs: 12, sm: 6 }}> for two-column rows
  //   • For number inputs use slotProps={{ htmlInput: { min, max, step } }}
  //   • For selects add slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
  //     so the placeholder label displays correctly
  // ─────────────────────────────────────────────────────────────────────────

  // TODO: replace this placeholder with your form JSX
  return <p style={{ color: 'red' }}>HealthForm not yet implemented — complete Part A</p>;
}
