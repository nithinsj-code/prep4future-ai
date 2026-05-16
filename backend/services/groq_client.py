import os
from groq import Groq
import json
from dotenv import load_dotenv

load_dotenv()

MODEL = "llama-3.3-70b-versatile"


def _get_client() -> Groq:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured.")
    return Groq(api_key=api_key)


def call_groq(system_prompt: str, user_message: str, max_tokens: int = 1500) -> str:
    """Call Groq API with llama-3.3-70b-versatile and return text response."""
    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=max_tokens,
        temperature=0.7,
    )
    return response.choices[0].message.content

def call_groq_json(system_prompt: str, user_message: str, max_tokens: int = 1500) -> dict:
    """Call Groq and parse JSON response. Retries once on parse failure."""
    system_with_json = system_prompt + "\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, no backticks."

    for attempt in range(2):
        try:
            raw = call_groq(system_with_json, user_message, max_tokens)
            # Strip markdown code fences if present
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except json.JSONDecodeError:
            if attempt == 1:
                raise ValueError(f"Groq returned invalid JSON after 2 attempts: {raw[:200]}")
            continue

def call_groq_chat(system_prompt: str, messages: list, max_tokens: int = 1000) -> str:
    """Call Groq with full conversation history (for career coach)."""
    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": system_prompt}] + messages,
        max_tokens=max_tokens,
        temperature=0.8,
    )
    return response.choices[0].message.content
