import { Fallacy } from './types';

const ACCOUNT_KEY = 'mantec_cloudflare_account_id';
const TOKEN_KEY = 'mantec_cloudflare_api_token';
const MODEL_ID = '@cf/meta/llama-3.1-8b-instruct';

export function getStoredCloudflareCredentials() {
  try {
    return { accountId: localStorage.getItem(ACCOUNT_KEY), apiToken: localStorage.getItem(TOKEN_KEY) };
  } catch {
    return { accountId: null, apiToken: null };
  }
}

export function setStoredCloudflareCredentials(accountId: string, apiToken: string) {
  try {
    localStorage.setItem(ACCOUNT_KEY, accountId.trim());
    localStorage.setItem(TOKEN_KEY, apiToken.trim());
  } catch {
    throw new Error('LOCAL_STORAGE_UNAVAILABLE');
  }
}

export function clearStoredCloudflareCredentials() {
  try {
    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch { /* ignore */ }
}

function buildPrompt(text: string, lang: 'fa' | 'en') {
  const language = lang === 'fa' ? 'Persian' : 'English';
  return 'You are a rigorous academic logical reasoning and fallacy analyzer. Analyze explicit and implicit contradictions, invalid inferences, category errors, hidden assumptions, ambiguity, non-sequiturs, and formal and informal fallacies. Be thorough but fair. Do not label metaphors, humor, or clearly stated opinions as errors unless used as literal arguments. Identify every distinct genuine issue. Return only valid JSON in this shape: {"issues":[{"quote":"exact excerpt in original language","errorName":"error name in ' + language + '","explanation":"clear explanation in ' + language + '"}]}. If no genuine issue exists, return {"issues":[]}.\n\nTEXT:\n"""\n' + text + '\n"""';
}

function parseIssues(raw: string): Fallacy[] {
  const cleaned = raw.trim().replace(/^\x60\x60\x60(?:json)?/i, '').replace(/\x60\x60\x60$/, '').trim();
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('Cloudflare returned invalid JSON');
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  }
  const issues = Array.isArray(parsed) ? parsed : parsed?.issues;
  if (!Array.isArray(issues)) throw new Error('Cloudflare response has no issues array');
  return issues.filter((x: any) => x && (x.quote || x.errorName)).map((x: any) => ({
    quote: String(x.quote ?? ''),
    errorName: String(x.errorName ?? ''),
    explanation: String(x.explanation ?? ''),
  }));
}

export async function runCloudflareAnalysis(text: string, lang: 'fa' | 'en'): Promise<Fallacy[]> {
  const { accountId, apiToken } = getStoredCloudflareCredentials();
  if (!accountId || !apiToken) throw new Error('NO_CLOUDFLARE_CREDENTIALS');

  const response = await fetch(
    'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(accountId) + '/ai/run/' + encodeURIComponent(MODEL_ID),
    {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: buildPrompt(text, lang) }],
        max_tokens: 4096,
        temperature: 0,
      }),
    }
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    const message = payload?.errors?.map((e: any) => e.message).filter(Boolean).join('; ');
    if (response.status === 401 || response.status === 403) throw new Error('INVALID_CLOUDFLARE_TOKEN');
    if (response.status === 429) throw new Error('CLOUDFLARE_RATE_LIMITED');
    throw new Error(message || 'Cloudflare request failed (' + response.status + ')');
  }

  const raw = payload?.result?.response ?? payload?.result?.choices?.[0]?.message?.content;
  if (typeof raw !== 'string') throw new Error('Cloudflare returned an unexpected response format');
  return parseIssues(raw);
}
