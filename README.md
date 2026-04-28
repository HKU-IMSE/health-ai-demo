# Health AI Demo

A React + Vite + TailwindCSS app that takes user health data, sends it to an AI model via [OpenRouter](https://openrouter.ai), and streams back a structured health analysis report.

**Live demo:** https://dist-jet-psi-81.vercel.app

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS v4** for styling
- **Vercel AI SDK** (`ai`) + `@openrouter/ai-sdk-provider` for streaming AI responses
- **Model**: `openai/gpt-4o-mini` via OpenRouter

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set your OpenRouter API key

Copy `.env.example` to `.env.local` and fill in your key:

```bash
cp .env.example .env.local
```

```env
VITE_OPENROUTER_API_KEY=sk-or-...
```

Get a free API key at [openrouter.ai/keys](https://openrouter.ai/keys).

> **Note:** This is a client-side-only app — the API key is baked into the JS bundle at build time and visible in the browser. Set a spending limit on your OpenRouter account to prevent unexpected charges.

### 3. Run locally

```bash
npm run dev
```

## Deploying to Vercel

The app is deployed as a **static site** by uploading the local `dist` folder directly to Vercel. Vercel never runs a build or pulls from GitHub — the API key is baked in locally before uploading.

### First-time setup

```bash
# Install Vercel CLI
npm install -g vercel

# Log in (opens browser)
vercel login
```

### Deploy

```bash
npm run build && vercel deploy dist --prod
```

That's it. The `dist` folder is uploaded as-is with the API key already embedded.

### Subsequent deployments

Same command — just make sure `.env.local` has the correct API key before running:

```bash
npm run build && vercel deploy dist --prod
```
