<div align="center">
<h1>Mantec | منطک</h1>
<p><b>Logical Analyzer Tool | ابزار سنجش منطق</b></p>
<p>English | فارسی</p>
</div>

## About | دربارهٔ پروژه

Mantec (منطک) reads a piece of Persian or English text and points out logical
fallacies, absurdities, and reasoning errors — explaining *what* the issue is
and *why* it's a problem.

منطک متن فارسی یا انگلیسی شما را می‌خواند و مغالطات منطقی، تناقض‌ها و خطاهای
استدلالی را به شما نشان می‌دهد؛ همراه با توضیح اینکه چرا و کجای متن اشکال دارد.

## 100% Free, No Install Required | کاملاً رایگان و بدون نیاز به نصب

This version of Mantec runs **entirely in your browser**:

- **No required API key.** Works out of the box; adding your own free
  Gemini key is optional, just for stronger results.
- **No backend server.** There is no server to host, pay for, or keep online.
- **No account, no login, no tracking.** Your text never leaves your device
  (or goes straight to Google's API if you add your own Gemini key — see
  below).
- **Nothing to install.** Everything runs in the browser tab; no separate
  app or background service is required.

All analysis is performed by a real language model, tried in this order:

1. **Groq** (recommended) — if you add your own free API key (get one at
   [console.groq.com/keys](https://console.groq.com/keys)), the app calls
   Groq's API directly from your browser
   ([`src/groqAnalyzer.ts`](./src/groqAnalyzer.ts)). Very fast responses,
   generous free tier, runs strong open-weight models.
2. **Gemini** — used if no Groq key is set (or Groq fails) and you've
   added a free Gemini key (get one at
   [aistudio.google.com/apikey](https://aistudio.google.com/apikey))
   ([`src/geminiAnalyzer.ts`](./src/geminiAnalyzer.ts)).
3. **In-browser AI (WebGPU)** — used automatically if neither key is set
   (or both fail), via
   [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm)
   ([`src/webllmAnalyzer.ts`](./src/webllmAnalyzer.ts)). Nothing to
   install, but support varies a lot by device/browser/GPU driver
   combination.

Each API key is stored only in your browser's local storage and sent
directly to that provider — never to us or any other server. Every user
has their own free-tier quota, so there's no shared limit and no cost to
anyone hosting this app.

Either way: no backend server to run, and no per-request cost to whoever
hosts this app.

## Running it locally | اجرای محلی

```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

No `.env` file, no API keys, and no environment variables are required for
any of these commands.

## Deploying | استقرار

`npm run build` produces a fully static `dist/` folder. Upload it to any
static host (GitHub Pages — a ready-made workflow is included in
`.github/workflows/deploy.yml` — Netlify, Vercel, Cloudflare Pages, or a
plain file server) and it will work with zero backend configuration.

## License

Copyright © 2026 Sobhan Ganji. Released under the [MIT License](./LICENSE) — free to use, modify, and share.
