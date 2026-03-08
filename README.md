# What's the Catch?

A standalone AI micro-tool that surfaces the downsides, caveats, and counterpoints people often miss when evaluating popular beliefs, trends, or products.

## Features

- **One input → structured output**: Enter a popular belief, trend, or product (e.g. "remote work", "AI will replace writers", "crypto")
- **3–5 catches**: Short downsides, caveats, or counterpoints
- **Nuanced take**: One balanced paragraph synthesizing the key insight
- **Plain HTML/CSS/JS frontend**: No React, no npm, no build step. Dark theme consistent with our other tools.
- **FastAPI backend**: Same stack as Teach Me This and Quiz Generator

## Local Setup

1. Clone or copy this repo to `C:\whats_the_catch`
2. Create a virtual environment and install dependencies:

   ```bash
   cd C:\whats_the_catch
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and add your API key:

   ```
   PLATFORM_GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the app:

   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. Open http://localhost:8000

## GitHub + Railway

### 1. Push to GitHub

```bash
# Create a new repo on github.com (e.g. whats-the-catch), then:
cd C:\whats_the_catch
git remote add origin https://github.com/YOUR_USERNAME/whats-the-catch.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your `whats-the-catch` repo
3. Railway auto-detects the Procfile. Add environment variables:
   - **Variables** → **New Variable** → `PLATFORM_GROQ_API_KEY` = your Groq key
4. **Settings** → **Generate Domain** to get a public URL

### 3. Env vars on Railway

Add these under **Variables** (Settings → Variables):
- `PLATFORM_GROQ_API_KEY` (required)
- `PLATFORM_GROQ_API_KEY_2`, `PLATFORM_GROQ_API_KEY_3` (optional, for key rotation)
- `PLATFORM_OPENAI_API_KEY` (optional, fallback if no Groq key)

Railway detects the Procfile and runs `uvicorn main:app --host 0.0.0.0 --port $PORT`.

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
