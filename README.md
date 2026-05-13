# Health AI — Teaching Template

A guided lab project where students build a real AI-powered health analysis web app from a skeleton codebase.

**Reference (completed) app:** https://dist-jet-psi-81.vercel.app

---

## What this app does

Users fill in a health form (age, sex, height, weight, activity level, goals). When they submit, the app:

1. Converts their measurements to metric if needed and calculates BMI.
2. Builds a prompt and sends it to an AI model via [OpenRouter](https://openrouter.ai).
3. Streams the AI's structured health report back to the screen in real time.

The finished app looks like this:

```
┌─────────────────────────────────┐
│  Health AI                      │
├─────────────────────────────────┤
│  [ Health Form — student fills  │
│    in Parts A, B, C ]           │
├─────────────────────────────────┤
│  Health Analysis Report         │
│  (streamed markdown from AI)    │
└─────────────────────────────────┘
```

---

## Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | TailwindCSS v4 + MUI v6 components |
| AI streaming | Vercel AI SDK (`ai`) |
| AI gateway | OpenRouter (`@openrouter/ai-sdk-provider`) |
| Default model | `openai/gpt-4o-mini` (via OpenRouter free tier) |

---

## Repository structure

```
src/
  components/
    HealthForm.tsx     ← Part A: students build the form UI
    HealthReport.tsx   ← provided — renders the AI report
  lib/
    ai.ts              ← Parts B & C: unit conversion + AI prompt
  types.ts             ← provided — TypeScript interfaces
  App.tsx              ← provided — wires form → AI → report
```

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Set your OpenRouter API key

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your key:

```env
VITE_OPENROUTER_API_KEY=sk-or-...
```

Get a free key at [openrouter.ai/keys](https://openrouter.ai/keys).

> **Note:** This is a client-side app — the API key is embedded in the JS bundle at build time and is visible in the browser. Set a spending limit on your OpenRouter account.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Student tasks

See **[LABSHEET.md](./LABSHEET.md)** for the full step-by-step guide.

| Part | File | Task | Est. time |
|---|---|---|---|
| A | `src/components/HealthForm.tsx` | Build the form UI | 3–4 h |
| B | `src/lib/ai.ts` — `toMetric()` | Unit conversion + BMI | 1.5–2 h |
| C | `src/lib/ai.ts` — `SYSTEM_PROMPT` | Write the AI system prompt | 2–3 h |
