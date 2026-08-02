import { Fallacy } from './types';

/**
 * Mantec Gemini Engine
 * ---------------------------------------------------------------
 * Calls Google's Gemini API directly from the browser, using the user's
 * own free API key (obtained at https://aistudio.google.com/apikey).
 *
 * Why "bring your own key":
 *  - No shared quota: every user has their own free-tier limit, so no
 *    single account ever gets rate-limited by everyone else's usage.
 *  - No cost to us, no backend to run or pay for.
 *  - The key never leaves the user's browser except to talk directly to
 *    Google's API — it's stored only in localStorage, on their device.
 *
 * This always requires an internet connection (it's a cloud API), but in
 * exchange gives noticeably stronger, more consistent reasoning quality
 * than a model that has to be squeezed down to run inside a browser tab.
 */

const STORAGE_KEY = 'mantec_gemini_api_key';
const MODEL_ID = 'gemini-2.5-flash';

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredApiKey(key: string) {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {
    /* ignore */
  }
}

export function clearStoredApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function buildPrompt(text: string, isPersian: boolean): string {
  return `You are an exceptionally rigorous, strict, academic-grade pure logic analyzer and logical fallacy expert ("منطق‌سنج"). You must be demanding and precise — do not let weak or borderline reasoning slide.

Perform a dual-layered evaluation of the user's text:

LAYER 1 — PURE RATIONALITY & SYSTEMATIC ERRORS: category mistakes, logical absurdities/contradictions, invalid syllogisms, non-sequiturs, unjustified leaps in reasoning.

LAYER 2 — FORMAL & INFORMAL FALLACIES: strawman, ad hominem, circular reasoning / begging the question, hasty generalization, false dilemma, appeal to popularity, false cause / post hoc, slippery slope, appeal to emotion, appeal to false or irrelevant authority, equivocation, poisoning the well, tu quoque, red herring, and any other standard fallacy that genuinely applies.

RULES:
- Be strict and thorough: actively look for subtle, implicit fallacies, not just the obvious ones. Do not under-report.
- Be fair: do not flag genuine artistic language, metaphor, humor, or plainly-labeled opinion as a logical error unless it's presented as a literal logical claim.
- Find EVERY distinct issue you can — do not stop after the first one found.
- If, after rigorous scrutiny, there are truly no errors, return an empty "issues" array. Do not invent issues that aren't there.
- Respond with a single JSON object of exactly this shape, and nothing else — no markdown fences, no commentary:
{"issues": [{"quote": "<exact flawed segment from the text, in the original language>", "errorName": "<name of the fallacy/error, in ${isPersian ? 'Persian' : 'English'}>", "explanation": "<clear, rigorous, educational explanation of exactly why it's flawed, in ${isPersian ? 'Persian' : 'English'}>"}]}

TEXT TO EVALUATE:
"""
${text}
"""`;
}

function extractIssues(raw: string): any[] {
  let s = raw.trim();
  s = s.replace(/^```(json)?/i, '').replace(/```$/, '').trim();

  const tryParse = (str: string): any[] | null => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.issues)) return parsed.issues;
    } catch {
      /* fall through */
    }
    return null;
  };

  let result = tryParse(s);
  if (result) return result;

  const objStart = s.indexOf('{');
  const objEnd = s.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    result = tryParse(s.slice(objStart, objEnd + 1));
    if (result) return result;
  }

  throw new Error('Gemini did not return valid, parseable JSON');
}

export async function runGeminiAnalysis(text: string, lang: 'fa' | 'en'): Promise<Fallacy[]> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const isPersian = lang === 'fa';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(text, isPersian) }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 400 && /API_KEY_INVALID/i.test(body)) {
      throw new Error('INVALID_API_KEY');
    }
    if (res.status === 429) {
      throw new Error('RATE_LIMITED');
    }
    throw new Error(`Gemini request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const content: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{"issues":[]}';
  const parsed = extractIssues(content);

  return parsed
    .filter((item: any) => item && (item.quote || item.errorName))
    .map((item: any) => ({
      quote: String(item.quote ?? ''),
      errorName: String(item.errorName ?? ''),
      explanation: String(item.explanation ?? ''),
    }));
}
