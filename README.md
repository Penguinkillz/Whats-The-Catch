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

## Deploy on Railway

1. Create a new project and connect this repo
2. Add environment variables (Settings → Variables):
   - `PLATFORM_GROQ_API_KEY` (required)
   - `PLATFORM_GROQ_API_KEY_2`, `PLATFORM_GROQ_API_KEY_3` (optional, for key rotation)
   - `PLATFORM_OPENAI_API_KEY` (optional, fallback if no Groq key)
3. Railway will detect the Procfile and run `uvicorn main:app --host 0.0.0.0 --port $PORT`

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
