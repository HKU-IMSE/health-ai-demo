import React from 'react';
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
  activityLevel: 'moderately_active',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputCls =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:opacity-50';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Name (optional)</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className={labelCls}>Age *</label>
          <input
            type="number"
            className={inputCls}
            placeholder="e.g. 30"
            min={1}
            max={120}
            required
            value={form.age}
            onChange={(e) => set('age', e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className={labelCls}>Sex *</label>
          <select
            className={inputCls}
            value={form.sex}
            onChange={(e) => set('sex', e.target.value as HealthFormData['sex'])}
            disabled={isLoading}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Unit Toggle */}
      <div>
        <label className={labelCls}>Unit System</label>
        <div className="flex gap-2">
          {(['metric', 'imperial'] as UnitSystem[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => switchUnits(u)}
              disabled={isLoading}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                form.unitSystem === u
                  ? 'border-violet-600 bg-violet-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {u === 'metric' ? 'Metric (cm / kg)' : 'Imperial (ft / lbs)'}
            </button>
          ))}
        </div>
      </div>

      {/* Height & Weight */}
      {form.unitSystem === 'metric' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Height (cm) *</label>
            <input
              type="number"
              className={inputCls}
              placeholder="e.g. 175"
              min={50}
              max={250}
              required
              value={form.heightCm}
              onChange={(e) => set('heightCm', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className={labelCls}>Weight (kg) *</label>
            <input
              type="number"
              className={inputCls}
              placeholder="e.g. 70"
              min={10}
              max={500}
              step="0.1"
              required
              value={form.weightKg}
              onChange={(e) => set('weightKg', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Height (ft) *</label>
            <input
              type="number"
              className={inputCls}
              placeholder="e.g. 5"
              min={1}
              max={8}
              required
              value={form.heightFt}
              onChange={(e) => set('heightFt', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className={labelCls}>Height (in)</label>
            <input
              type="number"
              className={inputCls}
              placeholder="e.g. 9"
              min={0}
              max={11}
              value={form.heightIn}
              onChange={(e) => set('heightIn', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className={labelCls}>Weight (lbs) *</label>
            <input
              type="number"
              className={inputCls}
              placeholder="e.g. 154"
              min={20}
              max={1000}
              step="0.1"
              required
              value={form.weightLbs}
              onChange={(e) => set('weightLbs', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Activity Level */}
      <div>
        <label className={labelCls}>Activity Level *</label>
        <select
          className={inputCls}
          value={form.activityLevel}
          onChange={(e) => set('activityLevel', e.target.value as HealthFormData['activityLevel'])}
          disabled={isLoading}
        >
          <option value="sedentary">Sedentary — little or no exercise</option>
          <option value="lightly_active">Lightly active — 1–3 days/week</option>
          <option value="moderately_active">Moderately active — 3–5 days/week</option>
          <option value="very_active">Very active — 6–7 days/week</option>
          <option value="extra_active">Extra active — hard exercise + physical job</option>
        </select>
      </div>

      {/* Medical Conditions */}
      <div>
        <label className={labelCls}>Medical Conditions / Medications</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={2}
          placeholder="e.g. Type 2 diabetes, hypertension, metformin — or leave blank"
          value={form.medicalConditions}
          onChange={(e) => set('medicalConditions', e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Goals */}
      <div>
        <label className={labelCls}>Health Goals</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={2}
          placeholder="e.g. Lose 10 kg, build muscle, improve energy levels"
          value={form.goals}
          onChange={(e) => set('goals', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Generating Report…
          </span>
        ) : (
          'Generate Health Report'
        )}
      </button>
    </form>
  );
}
