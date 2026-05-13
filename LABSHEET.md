# Health AI — Lab Sheet

**Estimated time:** 7–9 hours (Parts A–C) + optional bonus challenges

**Reference app (fully working):** https://dist-jet-psi-81.vercel.app

---

## Overview

You have been given a skeleton React application that needs three things implemented before it works:

| Part | File | What you will build |
|---|---|---|
| **A** | `src/components/HealthForm.tsx` | The form UI that collects health data |
| **B** | `src/lib/ai.ts` — `toMetric()` | Unit conversion (imperial → metric) and BMI setup |
| **C** | `src/lib/ai.ts` — `SYSTEM_PROMPT` | The AI system prompt that shapes the health report |

Everything else is already written for you — the AI streaming call, the report renderer, routing, and styles.

---

## Section 1 — Environment Setup

### 1.1 Install VSCode

Download and install [Visual Studio Code](https://code.visualstudio.com/).

Recommended extensions:
- **ESLint** — real-time linting
- **Prettier** — code formatting
- **TypeScript Vue Plugin** or **TypeScript** (usually pre-installed)

### 1.2 Install Node.js

Download the **LTS** version from [nodejs.org](https://nodejs.org/).

Verify it installed correctly:

```bash
node -v   # should print v20.x.x or higher
npm -v    # should print 10.x.x or higher
```

### 1.3 Install Git

- **Mac:** Git is pre-installed. Confirm with `git --version`.
- **Windows:** Download from [git-scm.com](https://git-scm.com/).

### 1.4 Get an OpenRouter API key

1. Go to [openrouter.ai](https://openrouter.ai) and create a free account.
2. Navigate to **Keys** → **Create Key**.
3. Copy the key (starts with `sk-or-`). You will need it in Section 2.

> **Tip:** Set a spending limit (e.g. $2) under **Settings → Limits** so you cannot accidentally overspend.

---

## Section 2 — Clone & Run the Skeleton

### 2.1 Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd health-ai-demo
```

### 2.2 Install dependencies

```bash
npm install
```

### 2.3 Configure the API key

```bash
cp .env.example .env.local
```

Open `.env.local` in VSCode and replace the placeholder with your key:

```env
VITE_OPENROUTER_API_KEY=sk-or-your-key-here
```

### 2.4 Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

You should see the page load with a red placeholder message: **"HealthForm not yet implemented — complete Part A"**. That is expected — it means the skeleton is running correctly.

---

## Section 3 — Part A: Build the Form UI (3–4 hours)

**File:** `src/components/HealthForm.tsx`

### What you are building

A form that collects: name, age, sex, unit system (metric / imperial), height, weight, activity level, medical conditions, and health goals.

When submitted, it calls `onSubmit(form)` which is already wired up in `App.tsx` to trigger the AI call.

### Before you start — read these files

Open and read:
- `src/types.ts` — the `HealthFormData` interface tells you exactly what fields exist
- `src/App.tsx` — shows how `HealthForm` is used (`onSubmit` and `isLoading` props)
- The comment block inside `HealthForm.tsx` — it lists every section you need to build

### MUI components you will use

| Component | What it does |
|---|---|
| `<TextField>` | Single-line or multiline text/number input |
| `<TextField select>` | Dropdown select — wrap `<MenuItem>` children inside |
| `<MenuItem value="...">` | An option inside a select |
| `<ToggleButtonGroup exclusive>` | Mutually exclusive toggle buttons |
| `<ToggleButton value="...">` | One button in the group |
| `<Grid container spacing={2}>` | Responsive row layout |
| `<Grid size={{ xs: 12, sm: 4 }}>` | A responsive column (full-width on mobile, 1/3 on desktop) |
| `<Button type="submit" variant="contained">` | The submit button |
| `<CircularProgress size={16}>` | Small spinner |

### Hints

**Linking a field to state:**
```tsx
value={form.age}
onChange={(e) => set('age', e.target.value)}
```

**Number input with min/max:**
```tsx
<TextField
  type="number"
  slotProps={{ htmlInput: { min: 1, max: 120 } }}
/>
```

**Select with empty placeholder:**
```tsx
<TextField
  select
  slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
>
  <MenuItem value="">-- Select one --</MenuItem>
  <MenuItem value="sedentary">Sedentary</MenuItem>
</TextField>
```

**Conditional rendering (metric vs imperial):**
```tsx
{form.unitSystem === 'metric' ? (
  // metric fields
) : (
  // imperial fields
)}
```

**Toggle button group:**
```tsx
<ToggleButtonGroup
  value={form.unitSystem}
  exclusive
  onChange={(_, val) => val && switchUnits(val as UnitSystem)}
>
  <ToggleButton value="metric">Metric (cm / kg)</ToggleButton>
  <ToggleButton value="imperial">Imperial (ft / lbs)</ToggleButton>
</ToggleButtonGroup>
```

**Submit button with loading state:**
```tsx
<Button
  type="submit"
  variant="contained"
  fullWidth
  disabled={isLoading}
  startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
>
  {isLoading ? 'Generating Report…' : 'Generate Health Report'}
</Button>
```

### Checkpoint A

After completing Part A:

- [ ] The form renders (no red placeholder text).
- [ ] You can type in all fields.
- [ ] Switching between Metric and Imperial shows different height/weight fields.
- [ ] Submitting the form with a valid API key triggers the AI (you will see the report card appear, even if the AI output looks odd — that is fine for now).

---

## Section 4 — Part B: Unit Conversion (1.5–2 hours)

**File:** `src/lib/ai.ts` — function `toMetric()`

### What you are building

A pure function that converts the form data into metric values (centimetres and kilograms) regardless of which unit system the user chose.

### The function signature

```ts
export function toMetric(data: HealthFormData): MetricValues
// MetricValues = { heightCm: number, weightKg: number }
```

### Conversions you need

| From | To | Formula |
|---|---|---|
| feet + inches → cm | `heightCm` | `(ft × 12 + in) × 2.54` |
| pounds → kg | `weightKg` | `lbs × 0.453592` |
| cm → cm | `heightCm` | parse directly |
| kg → kg | `weightKg` | parse directly |

### Hints

- All form fields are **strings**. Use `parseFloat()` to convert them.
- Guard against empty strings: `parseFloat(data.heightCm) || 0`
- Round to 1 decimal place: `Math.round(value * 10) / 10`

### Example inputs / outputs

| Input | Expected output |
|---|---|
| metric, height=175, weight=70 | `{ heightCm: 175, weightKg: 70 }` |
| imperial, ft=5, in=9, lbs=154 | `{ heightCm: 175.3, weightKg: 69.9 }` |
| imperial, ft=6, in=0, lbs=180 | `{ heightCm: 182.9, weightKg: 81.6 }` |

### Checkpoint B

After completing Part B:

- [ ] Submit the form in metric mode — the AI report shows the correct height/weight in Section 2 (Body Metrics).
- [ ] Switch to imperial, enter 5 ft 9 in / 154 lbs — the report should show approximately 175 cm / 70 kg.
- [ ] The BMI value in the report looks reasonable (18–30 for typical inputs).

---

## Section 5 — Part C: Write the AI System Prompt (2–3 hours)

**File:** `src/lib/ai.ts` — constant `SYSTEM_PROMPT`

### What you are building

A string that acts as the AI's "instructions manual". The AI reads this before it reads the user's health data.  A good prompt produces a consistent, well-structured, useful report every time.

### Required output structure

Your prompt must instruct the AI to produce these exact sections:

```
## 1. Personal Profile
## 2. Body Metrics
## 3. Health Assessment
## 4. Recommendations
   ### Lifestyle
   ### Diet
   ### Exercise
```

### What each section should contain

**1. Personal Profile** — a summary of the user's details (name, age, sex, activity level, stated goals).

**2. Body Metrics** — bullet list including:
- Height in both cm and ft/in
- Weight in both kg and lbs
- BMI (1 decimal place)
- BMI category using WHO ranges: Underweight (<18.5), Normal weight (18.5–24.9), Overweight (25–29.9), Obese (≥30)
- Ideal weight range for the user's height (BMI 18.5–24.9), in both kg and lbs

**3. Health Assessment** — 2–4 sentences on overall health status, then list any notable risk factors or positive indicators.

**4. Recommendations** — 3–5 bullet points per sub-section (Lifestyle, Diet, Exercise). Tailor advice to the user's goals and activity level. Close with a short motivating statement.

### Tone requirements

- Informative, supportive, and non-alarmist.
- No disclaimer about not being a doctor.
- Positive and practical.

### Tips for writing good prompts

1. **Be explicit about format.** Tell the AI the exact markdown headings to use.
2. **Give an example of the output you want** for any section that has a specific format (e.g. the Body Metrics bullet list).
3. **Include constraints.** "Keep each sub-section to 3–5 bullet points" prevents the AI from rambling.
4. **Specify tone in concrete terms.** "Non-alarmist" and "no medical disclaimers" are clearer than "be friendly".
5. **Test and iterate.** Change one thing at a time and re-submit the form to see the effect.

### Checkpoint C

After completing Part C:

- [ ] The AI report has all four section headers in the correct order.
- [ ] Body Metrics shows BMI and BMI category.
- [ ] Recommendations has all three sub-sections (Lifestyle, Diet, Exercise).
- [ ] The tone feels supportive and practical, not robotic.
- [ ] Try the reference app (https://dist-jet-psi-81.vercel.app) with the same data — how close is your output?

---

## Section 6 — Bonus Challenges

Finished early? Try one or more of these extensions.

### Bonus 1 — Input validation

Before calling `onSubmit`, check that required fields are filled and within sensible ranges. Show an inline error message (MUI `<Alert severity="error">`) if validation fails.

Suggested checks:
- Age between 5 and 120
- Height and weight are positive numbers
- Activity level is not empty

### Bonus 2 — Clear / Reset button

Add a secondary `<Button variant="outlined">` next to the submit button that resets the form to `defaultForm` and clears the report in `App.tsx`.

To clear the report from `HealthForm` you will need to lift a callback prop up through `App.tsx`.

### Bonus 3 — Extra AI section

Add a **## 5. Sample Meal Plan** section to your system prompt. Instruct the AI to provide a one-day sample meal plan (breakfast, lunch, dinner, snack) suited to the user's goals and activity level.

### Bonus 4 — Model switcher

Add a `<TextField select>` to the form that lets the user choose between two or three OpenRouter models (e.g. `openai/gpt-4o-mini`, `google/gemma-3-27b-it:free`, `meta-llama/llama-3.3-70b-instruct:free`).

Pass the chosen model ID into `streamHealthAnalysis` and use it instead of the hardcoded default. Compare the quality of outputs between models.

---

## Appendix — TypeScript quick reference

```ts
// Reading a string field
const name: string = data.name;

// Converting a string to a number safely
const height: number = parseFloat(data.heightCm) || 0;

// Updating one field in a React state object
setForm((prev) => ({ ...prev, age: '25' }));

// Conditional JSX
{condition ? <ComponentA /> : <ComponentB />}

// Type assertion (when you know better than TypeScript)
set('sex', e.target.value as HealthFormData['sex']);
```

---

*Good luck! Check the reference app at https://dist-jet-psi-81.vercel.app whenever you want to compare your output.*
