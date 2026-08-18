import { Fallacy } from './types';

const STORAGE_KEY = 'mantec_groq_api_key';
// استفاده از مدل کاملاً فعال Groq
const MODEL_ID = 'llama-3.3-70b-versatile';

export function getStoredGroqApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredGroqApiKey(key: string) {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {
    /* ignore */
  }
}

export function clearStoredGroqApiKey() {
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
- Respond with a single JSON object of exactly this shape, and nothing else:
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

  throw new Error('Groq did not return valid, parseable JSON');
}

export async function runGroqAnalysis(text: string, lang: 'fa' | 'en'): Promise<Fallacy[]> {
  const apiKey = getStoredGroqApiKey();
  if (!apiKey || !apiKey.trim()) {
    console.error('[Groq Engine Error]: No API key found in localStorage');
    throw new Error('NO_API_KEY');
  }

  const isPersian = lang === 'fa';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: 'system',
            content: 'You are a JSON-only response generator. Output strictly valid JSON matching the schema.'
          },
          { 
            role: 'user', 
            content: buildPrompt(text, isPersian) 
          }
        ],
        temperature: 0,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Groq Network Response Error] Status ${res.status}:`, errorText);
      if (res.status === 401) throw new Error('INVALID_API_KEY');
      if (res.status === 429) throw new Error('RATE_LIMITED');
      throw new Error(`Groq request failed (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content ?? '{"issues":[]}';
    const parsed = extractIssues(content);

    return parsed
      .filter((item: any) => item && (item.quote || item.errorName))
      .map((item: any) => ({
        quote: String(item.quote ?? ''),
        errorName: String(item.errorName ?? ''),
        explanation: String(item.explanation ?? ''),
      }));
  } catch (error) {
    console.error('[Groq Engine Crash Details]:', error);
    throw error; // اجازه بده خطا بالا برود تا دقیقاً ریشه‌یابی شود
  }
}
