# Mantech | منطک

**Logical Analyzer Tool | ابزار سنجش منطق**

English | فارسی

## About | دربارهٔ پروژه

Mantech (منطک) reads a piece of Persian or English text and points out logical
fallacies, absurdities, and reasoning errors — explaining *what* the issue is
and *why* it's a problem.

منطک متن فارسی یا انگلیسی شما را می‌خواند و مغالطات منطقی، تناقض‌ها و خطاهای
استدلالی را به شما نشان می‌دهد؛ همراه با توضیح اینکه چرا و کجای متن اشکال دارد.

## 100% Free, No Install Required | کاملاً رایگان و بدون نیاز به نصب

This version of Mantec runs **entirely in your browser**:

- **No required API key.** Works out of the box; a Groq key is optional and used only as a fallback if local WebGPU fails.
- **No backend server.** There is no server to host, pay for, or keep online.
- **No account, no login, no tracking.** Your text stays on your device during local WebGPU analysis
  (or goes straight to Groq's API if you add your own key — see below).
- **Nothing to install.** Everything runs in the browser tab; no separate
  app or background service is required.

The primary engine is **WebGPU + WebLLM**. The language model runs
inside the browser on the user's own GPU. The first run downloads model
weights; the browser can cache them for later sessions. The app chooses a
starting model based on the browser's approximate device-memory hint and
tries smaller compatible models if loading fails. Actual performance depends
on the browser, GPU, driver, and available memory.

An optional **Groq** fallback is available only if the user has entered
their own API key. It is attempted only when local WebGPU analysis fails.
When that fallback is used, the submitted text is sent directly from the
browser to Groq.

If you add a Groq key, it is stored in your browser's local storage and sent
directly to Groq only when the local engine cannot run.

No backend server is required. Local inference has no per-request API cost; optional Groq usage is subject to Groq's own limits.

## Running it locally | اجرای محلی

```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

No `.env` file, no API keys, and no environment variables are required for
any of these commands.

## Deploying | دپلوی

`npm run build` produces a fully static `dist/` folder. Upload it to any
static host (GitHub Pages — a ready-made workflow is included in
`.github/workflows/deploy.yml` — Netlify, Vercel, Cloudflare Pages, or a
plain file server) and it will work with zero backend configuration.

Copyright © 2026 Sobhan Ganji
