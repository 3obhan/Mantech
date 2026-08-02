import type * as webllm from '@mlc-ai/web-llm';
import { Fallacy } from './types';

/**
 * Mantec Browser AI Engine
 * ---------------------------------------------------------------
 * Runs a real instruction-tuned language model 100% inside the
 * user's own browser via WebGPU (using @mlc-ai/web-llm / MLC-LLM).
 *
 * Why this is free forever, for any number of users:
 *  - All inference happens on the user's own device (GPU), not on
 *    any server you run or pay for.
 *  - The model weights are fetched once (and cached by the browser)
 *    from MLC's public, free model CDN — no API key, no account,
 *    no per-request cost, no rate limit imposed by you.
 *
 * Requirements: a WebGPU-capable browser (recent Chrome/Edge, and
 * increasingly Safari/Firefox). This is currently the app's only analysis
 * engine — if this fails, the caller shows the error to the user directly.
 */

// Tried in order: strongest/largest first, falling back to smaller models
// if the device doesn't have enough GPU memory or fails to load one.
//
// We deliberately always use the "f32" quantized variants here, not the
// smaller/faster "f16" ones. The f16 variants need the optional WebGPU
// "shader-f16" GPU feature, which many GPUs/drivers (especially older or
// integrated ones) don't expose — that caused hard failures like
// "Unable to find a compatible GPU" on those devices. f32 models are a bit
// larger and slightly slower, but work on any WebGPU-capable device without
// needing any capability detection or runtime branching.
export const MODEL_TIERS = [
  'Llama-3.1-8B-Instruct-q4f32_1-MLC',   // strongest — ~8B params, needs a capable GPU
  'Qwen2.5-7B-Instruct-q4f32_1-MLC',     // strong, good multilingual (incl. Persian)
  'Qwen2.5-3B-Instruct-q4f32_1-MLC',     // solid mid-tier
  'Qwen2.5-1.5B-Instruct-q4f32_1-MLC',   // light, for low-memory devices
];

export type LoadProgress = {
  progress: number; // 0..1
  text: string;
};

let engine: webllm.MLCEngineInterface | null = null;
let activeModelId: string | null = null;
let loadingPromise: Promise<webllm.MLCEngineInterface> | null = null;

export async function isWebGPUSupported(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !(navigator as any).gpu) return false;
  try {
    // navigator.gpu can exist even when there is no usable GPU behind it
    // (common on remote desktops, some VMs, certain integrated-GPU + driver
    // combos, or headless setups). Actually requesting an adapter is the
    // only reliable way to know before we commit to a multi-GB download.
    const adapter = await (navigator as any).gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

export function getActiveModelId(): string | null {
  return activeModelId;
}

export async function getEngine(
  onProgress?: (p: LoadProgress) => void
): Promise<webllm.MLCEngineInterface> {
  if (engine) return engine;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const mod = await import('@mlc-ai/web-llm');
    const cb: webllm.InitProgressCallback = (report) => {
      onProgress?.({ progress: report.progress ?? 0, text: report.text ?? '' });
    };

    let lastErr: unknown = null;

    for (const modelId of MODEL_TIERS) {
      try {
        const e = await mod.CreateMLCEngine(modelId, { initProgressCallback: cb });
        activeModelId = modelId;
        engine = e;
        return e;
      } catch (err) {
        console.warn(`Failed to load ${modelId}, trying next smaller model:`, err);
        lastErr = err;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('All model tiers failed to load');
  })().catch((err) => {
    // Reset so a later retry can try again instead of being stuck on a rejected promise forever.
    loadingPromise = null;
    throw err;
  });

  return loadingPromise;
}

function buildPrompt(text: string, isPersian: boolean): string {
  return `You are an exceptionally rigorous, academic-grade pure logic analyzer and logical fallacy expert ("منطق‌سنج").
Your mandate is to perform a dual-layered evaluation of the user's text with absolute conceptual precision:

LAYER 1 — PURE RATIONALITY & SYSTEMATIC ERRORS: category mistakes, logical absurdities/contradictions, invalid syllogisms / non-sequiturs.

LAYER 2 — FORMAL & INFORMAL FALLACIES: strawman, ad hominem, circular reasoning / begging the question, hasty generalization, false dilemma, appeal to popularity, false cause / post hoc, slippery slope, appeal to emotion, appeal to false authority, equivocation, poisoning the well, and any other standard fallacy that applies.

RULES:
- Be rigorous but fair: do not flag artistic language, metaphor, or opinion as a logical error unless it is presented as a literal logical claim.
- Find EVERY distinct issue you can, do not stop after the first one.
- If there are no errors at all, return an empty "issues" array.
- Respond with a single JSON object of exactly this shape, and nothing else:
{"issues": [{"quote": "<exact flawed segment from the text, in the original language>", "errorName": "<name of the fallacy/error, in ${isPersian ? 'Persian' : 'English'}>", "explanation": "<clear, friendly, educational explanation of why it's flawed, in ${isPersian ? 'Persian' : 'English'}>"}]}

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
      if (parsed && Array.isArray(parsed.analysis)) return parsed.analysis;
      if (parsed && Array.isArray(parsed.fallacies)) return parsed.fallacies;
    } catch {
      /* fall through */
    }
    return null;
  };

  // 1) Try parsing as-is (works when response_format:json_object succeeded).
  let result = tryParse(s);
  if (result) return result;

  // 2) Try isolating the outermost {...} object.
  const objStart = s.indexOf('{');
  const objEnd = s.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    result = tryParse(s.slice(objStart, objEnd + 1));
    if (result) return result;
  }

  // 3) Try isolating the outermost [...] array (in case the model ignored the schema).
  const arrStart = s.indexOf('[');
  const arrEnd = s.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd > arrStart) {
    result = tryParse(s.slice(arrStart, arrEnd + 1));
    if (result) return result;
  }

  throw new Error('Model did not return valid, parseable JSON');
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
    }, ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

export function resetEngine() {
  engine = null;
  activeModelId = null;
  loadingPromise = null;
}

async function generateOnce(
  eng: webllm.MLCEngineInterface,
  text: string,
  isPersian: boolean
) {
  return withTimeout(
    eng.chat.completions.create({
      messages: [{ role: 'user', content: buildPrompt(text, isPersian) }],
      temperature: 0,
      max_tokens: 2000,
    }),
    6 * 60 * 1000,
    'AI generation'
  );
}

export async function runBrowserAIAnalysis(
  text: string,
  lang: 'fa' | 'en',
  onProgress?: (p: LoadProgress) => void
): Promise<Fallacy[]> {
  let eng = await withTimeout(getEngine(onProgress), 10 * 60 * 1000, 'Model loading');
  const isPersian = lang === 'fa';

  // NOTE: deliberately NOT using response_format:{type:'json_object'} here.
  // That mode forces grammar-constrained decoding, which on some GPUs
  // (notably several AMD/WebGPU combinations) can hang indefinitely right
  // after model loading finishes while it compiles the JSON grammar.
  // Instead we rely on strict prompting + robust parsing below, wrapped
  // in a hard timeout so a stuck generation always recovers to the
  // local rule engine instead of spinning forever.
  let reply;
  try {
    reply = await generateOnce(eng, text, isPersian);
  } catch (err: any) {
    const msg = String(err?.message || err);
    const isDisposed = /disposed/i.test(msg);
    const isNotLoaded = /model not loaded/i.test(msg);

    if (isDisposed) {
      // The cached GPU/WASM engine instance was torn down underneath us
      // (e.g. tab was backgrounded and the browser reclaimed the GPU
      // context, or a previous call left it in a bad state). The old
      // instance is unusable — throw it away and build a brand new one
      // from scratch, then retry once.
      resetEngine();
      try {
        eng = await withTimeout(getEngine(onProgress), 10 * 60 * 1000, 'Model loading');
        reply = await generateOnce(eng, text, isPersian);
      } catch (retryErr) {
        resetEngine();
        throw retryErr;
      }
    } else if (isNotLoaded && activeModelId) {
      // Known WebLLM race: CreateMLCEngine can resolve before the engine's
      // internal "model loaded" flag is actually set. Force a reload of the
      // same model on the same engine instance, then retry once.
      try {
        await withTimeout(eng.reload(activeModelId), 5 * 60 * 1000, 'Model reload');
        reply = await generateOnce(eng, text, isPersian);
      } catch (retryErr) {
        // Give up on this cached engine entirely so the next attempt starts clean.
        resetEngine();
        throw retryErr;
      }
    } else {
      throw err;
    }
  }

  const content = reply.choices?.[0]?.message?.content ?? '{"issues":[]}';
  const parsed = extractIssues(content);

  return parsed
    .filter((item: any) => item && (item.quote || item.errorName))
    .map((item: any) => ({
      quote: String(item.quote ?? ''),
      errorName: String(item.errorName ?? ''),
      explanation: String(item.explanation ?? ''),
    }));
}
