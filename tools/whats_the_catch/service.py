"""Core logic for What's the Catch — no FastAPI dependencies here."""
import json
import re

from fastapi import HTTPException

from core.llm import get_llm_client
from tools.whats_the_catch.models import CatchRequest, CatchResponse


def _build_prompt(payload: CatchRequest) -> str:
    return f"""You are a thoughtful analyst. The user has shared a popular belief, trend, or product. Your job is to surface the "catches" — downsides, caveats, or counterpoints that people often miss — and then offer one balanced, nuanced take.

Claim/trend/product: {payload.claim}

Be balanced and thoughtful. Provide real caveats and counterpoints, not just negativity. Avoid being preachy or one-sided. The nuanced take should acknowledge both benefits and drawbacks.

Return ONLY valid JSON in exactly this structure (no markdown, no code fences, no control characters):
{{
  "catches": [
    "First catch or caveat (short, clear)",
    "Second catch",
    "Third catch",
    "Fourth catch",
    "Fifth catch (optional; include 3-5 total)"
  ],
  "nuanced_take": "One clear, balanced paragraph that synthesizes the key insight. Not purely negative — acknowledge complexity."
}}

Rules:
- catches must be a list of 3-5 strings. Each string should be one concise point.
- nuanced_take must be a single string (one paragraph).
- All string values must be valid JSON — escape any special characters.
- Do NOT include newlines or tab characters inside string values; use a space instead.""".strip()


def _sanitize(content: str) -> str:
    content = content.lstrip("\ufeff")
    content = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', content)
    return content


def _fix_json_escapes(content: str) -> str:
    """Repair invalid JSON escape sequences (e.g. \\s, \\.) that LLMs sometimes emit."""
    result = []
    i = 0
    while i < len(content):
        if content[i] == "\\" and i + 1 < len(content):
            next_char = content[i + 1]
            if next_char in '"\\/bfnrt':
                result.append(content[i : i + 2])
                i += 2
            elif next_char == "u" and i + 5 <= len(content):
                hex_part = content[i + 2 : i + 6]
                if all(c in "0123456789abcdefABCDEF" for c in hex_part):
                    result.append(content[i : i + 6])
                    i += 6
                else:
                    result.append(next_char)
                    i += 2
            else:
                result.append(next_char)
                i += 2
        else:
            result.append(content[i])
            i += 1
    return "".join(result)


def _parse_response(content: str) -> dict:
    content = _sanitize(content)
    content = _fix_json_escapes(content)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start, end = content.find("{"), content.rfind("}")
        if start != -1 and end > start:
            try:
                return json.loads(content[start : end + 1])
            except json.JSONDecodeError:
                pass
        raise


def get_catches(payload: CatchRequest) -> CatchResponse:
    client, model = get_llm_client()
    prompt = _build_prompt(payload)

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a balanced analyst. Return valid JSON only — no markdown, no code fences.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM API error: {exc}") from exc

    raw = completion.choices[0].message.content or ""

    try:
        data = _parse_response(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to parse model output: {exc}"
        ) from exc

    required_fields = {"catches", "nuanced_take"}
    missing = required_fields - data.keys()
    if missing:
        raise HTTPException(
            status_code=502,
            detail=f"Model response missing fields: {', '.join(missing)}",
        )

    catches = data.get("catches", [])
    if not isinstance(catches, list):
        raise HTTPException(status_code=502, detail="catches must be a list")
    catches = [str(c).strip() for c in catches if c]
    if len(catches) < 3:
        raise HTTPException(
            status_code=502,
            detail="Model must return at least 3 catches",
        )

    nuanced_take = str(data.get("nuanced_take", "")).strip()
    if not nuanced_take:
        raise HTTPException(status_code=502, detail="nuanced_take cannot be empty")

    return CatchResponse(
        claim=payload.claim,
        catches=catches[:5],
        nuanced_take=nuanced_take,
    )
