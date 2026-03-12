# What's the Catch?

A standalone AI micro-tool that surfaces the downsides, caveats, and counterpoints people often miss when evaluating popular beliefs, trends, or products.

## Features

- **One input → structured output**: Enter a popular belief, trend, or product (e.g. "remote work", "AI will replace writers", "crypto")
- **3–5 catches**: Short downsides, caveats, or counterpoints
- **Nuanced take**: One balanced paragraph synthesizing the key insight
- **Plain HTML/CSS/JS frontend**: No React, no npm, no build step. Dark theme consistent with our other tools.
- **FastAPI backend**: Same stack as Teach Me This and Quiz Generator

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Lucide |
| Backend | Python, FastAPI, Groq (via OpenAI-compatible client) |
| Fonts | Inter + Plus Jakarta Sans |

## Local Setup

### 1. Backend (FastAPI)

```bash
cd C:\whats_the_catch
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt

# Copy and fill in your API key
copy .env.example .env
# Edit .env → PLATFORM_GROQ_API_KEY=your_key_here

uvicorn main:app --reload --port 8000
```

### 2. Frontend (Next.js)

```bash
cd C:\whats_the_catch\frontend
npm install

# Optional: copy frontend/.env.example → frontend/.env.local
# BACKEND_URL defaults to http://localhost:8000

npm run dev   # runs on http://localhost:3000
```

Open **http://localhost:3000** — the Next.js app proxies `/api/*` to the FastAPI backend on port 8000.

## GitHub + Deploy

### 1. Push to GitHub

```bash
cd C:\whats_the_catch
git remote add origin https://github.com/YOUR_USERNAME/whats-the-catch.git
git push -u origin main
```

### 2. Deploy Backend → Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repo, set **Root Directory** to `/` (repo root uses the Procfile)
3. Add variables:
   - `PLATFORM_GROQ_API_KEY` (required)
   - `PLATFORM_GROQ_API_KEY_2`, `PLATFORM_GROQ_API_KEY_3` (optional)
4. **Settings → Networking → Generate Domain** — copy the URL (e.g. `https://whats-the-catch.up.railway.app`)

### 3. Deploy Frontend → Vercel

1. [vercel.com](https://vercel.com) → **New Project** → import same GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `BACKEND_URL` = your Railway backend URL (e.g. `https://whats-the-catch.up.railway.app`)
4. Deploy — Vercel auto-detects Next.js

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLATFORM_GROQ_API_KEY` | Yes | Groq API key for LLM calls |
| `PLATFORM_GROQ_API_KEY_2` | No | Second Groq key for rotation |
| `PLATFORM_GROQ_API_KEY_3` | No | Third Groq key for rotation |
| `PLATFORM_OPENAI_API_KEY` | No | OpenAI fallback if no Groq key |

## API

- `POST /api/catch/analyze` — JSON body: `{"claim": "your belief or trend"}` → returns `{"claim": "...", "catches": ["...", ...], "nuanced_take": "..."}`

## Future Upgrades

We will later upgrade to a better tech stack, significantly improve the frontend, and add a solid backend (auth, payments, etc.). This repo is MVP only.
