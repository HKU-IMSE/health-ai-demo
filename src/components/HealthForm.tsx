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

  const set = <K extends keyof HealthFormData>(key: K, value: HealthFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Personal Info */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Name (optional)"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            disabled={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Age"
            required
            type="number"
            placeholder="e.g. 30"
            slotProps={{ htmlInput: { min: 1, max: 120 } }}
            value={form.age}
            onChange={(e) => set('age', e.target.value)}
            disabled={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            label="Sex"
            required
            value={form.sex}
            onChange={(e) => set('sex', e.target.value as HealthFormData['sex'])}
            disabled={isLoading}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other / Prefer not to say</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Unit Toggle */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1.5">Unit System</p>
        <ToggleButtonGroup
          value={form.unitSystem}
          exclusive
          onChange={(_, val) => val && switchUnits(val as UnitSystem)}
          disabled={isLoading}
          size="small"
        >
          <ToggleButton value="metric">Metric (cm / kg)</ToggleButton>
          <ToggleButton value="imperial">Imperial (ft / lbs)</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Height & Weight */}
      {form.unitSystem === 'metric' ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Height (cm)"
              required
              type="number"
              placeholder="e.g. 175"
              slotProps={{ htmlInput: { min: 50, max: 250 } }}
              value={form.heightCm}
              onChange={(e) => set('heightCm', e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Weight (kg)"
              required
              type="number"
              placeholder="e.g. 70"
              slotProps={{ htmlInput: { min: 10, max: 500, step: 0.1 } }}
              value={form.weightKg}
              onChange={(e) => set('weightKg', e.target.value)}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Height (ft)"
              required
              type="number"
              placeholder="e.g. 5"
              slotProps={{ htmlInput: { min: 1, max: 8 } }}
              value={form.heightFt}
              onChange={(e) => set('heightFt', e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Height (in)"
              type="number"
              placeholder="e.g. 9"
              slotProps={{ htmlInput: { min: 0, max: 11 } }}
              value={form.heightIn}
              onChange={(e) => set('heightIn', e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Weight (lbs)"
              required
              type="number"
              placeholder="e.g. 154"
              slotProps={{ htmlInput: { min: 20, max: 1000, step: 0.1 } }}
              value={form.weightLbs}
              onChange={(e) => set('weightLbs', e.target.value)}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      )}

      {/* Activity Level */}
      <TextField
        select
        label="Activity Level"
        required
        value={form.activityLevel}
        onChange={(e) => set('activityLevel', e.target.value as HealthFormData['activityLevel'])}
        disabled={isLoading}
        slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
      >
        <MenuItem value="">-- Select one --</MenuItem>
        <MenuItem value="sedentary">Sedentary — little or no exercise</MenuItem>
        <MenuItem value="lightly_active">Lightly active — 1–3 days/week</MenuItem>
        <MenuItem value="moderately_active">Moderately active — 3–5 days/week</MenuItem>
        <MenuItem value="very_active">Very active — 6–7 days/week</MenuItem>
        <MenuItem value="extra_active">Extra active — hard exercise + physical job</MenuItem>
      </TextField>

      {/* Medical Conditions */}
      <TextField
        label="Medical Conditions / Medications"
        placeholder="e.g. Type 2 diabetes, hypertension, metformin — or leave blank"
        multiline
        rows={2}
        value={form.medicalConditions}
        onChange={(e) => set('medicalConditions', e.target.value)}
        disabled={isLoading}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/* Goals */}
      <TextField
        label="Health Goals"
        placeholder="e.g. Lose 10 kg, build muscle, improve energy levels"
        multiline
        rows={2}
        value={form.goals}
        onChange={(e) => set('goals', e.target.value)}
        disabled={isLoading}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        fullWidth
        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
      >
        {isLoading ? 'Generating Report…' : 'Generate Health Report'}
      </Button>
    </form>
  );
}
