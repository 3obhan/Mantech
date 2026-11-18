# Mantech | منطک

**A bilingual Persian–English logical reasoning analyzer**  
**ابزار دوزبانهٔ تحلیل خطاهای استدلالی و مغالطات منطقی**

**Copyright © 2026 Sobhan Ganji**  
**All rights reserved. Proprietary software.**

---

## English

### 1. Overview

**Mantech (منطک)** is a browser-based application designed to examine Persian and English text for logical fallacies, contradictions, invalid inferences, category mistakes, and weaknesses in reasoning.

The application aims to help users inspect arguments more carefully by identifying questionable passages and explaining why a particular inference may be defective.

Mantech is an analytical and educational aid. Its output is not a substitute for independent reasoning, expert review, or professional legal, medical, financial, or other advice.

### 2. How it works

Mantech uses an in-browser AI architecture built around:

- **WebGPU:** provides access to compatible graphics hardware from a supported browser.
- **WebLLM:** loads and runs supported language models locally in the browser.
- **Device-aware model selection:** selects a starting model tier using the browser's approximate device-memory information, then attempts compatible alternatives if loading fails.
- **Optional Groq fallback:** if local WebGPU analysis fails, a user who has configured their own Groq API key may use Groq as an alternative.

The intended default is local inference. When WebGPU/WebLLM is used, the submitted text is processed on the user's device rather than sent to Mantech-operated AI servers.

### 3. Privacy and network behavior

- Mantech does not require a Mantech account or a Mantech-hosted AI key for local inference.
- On the first run, the browser downloads model files from the model distribution infrastructure. These files may be cached by the browser for subsequent use.
- Browser and hosting providers may independently process technical connection data under their own policies.
- If the user enables the optional Groq fallback by providing a personal API key, text submitted for that fallback is sent directly from the browser to Groq. Groq's terms and privacy policy then apply.
- A user should not submit confidential, sensitive, or regulated information unless they have assessed the relevant risks and service terms.

### 4. Browser and hardware requirements

Local inference requires a browser and device with working WebGPU support. Compatibility and performance vary with:

- browser version and operating system;
- GPU hardware and graphics drivers;
- available GPU and system memory;
- model size and browser resource limits.

A browser may expose WebGPU while the device still lacks a usable adapter or sufficient resources. Model downloads can be large, and the first launch may take time. A failed model load does not necessarily mean the application itself is broken.

Use a current version of a WebGPU-capable browser, such as a recent Chrome or Edge release, and enable hardware acceleration where supported.

### 5. Technology

- React
- TypeScript
- Vite
- WebGPU
- [MLC WebLLM](https://github.com/mlc-ai/web-llm)
- [Groq API](https://console.groq.com/) (optional user-provided key)
- jsPDF
- dom-to-image-more
- lucide-react

Third-party packages and model assets are not owned by Mantech's copyright holder. Their respective licenses and terms apply independently.

### 6. Run locally

You need a recent Node.js installation and npm.

```bash
git clone https://github.com/3obhan/Mantech.git
cd Mantech
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

Type-check the project:

```bash
npm run lint
```

The production output is generated in `dist/`.

**Important:** The source repository is publicly viewable, but the software is proprietary. Running, copying, modifying, deploying, or otherwise using it is not authorized by public access. See the LICENSE file and obtain written permission before any such use.

### 7. Deployment

The Vite build produces static frontend assets. The application may be technically deployable on static hosting platforms, but deployment or public operation by anyone other than the copyright owner or an authorized party is not permitted under the proprietary license.

### 8. Limitations

- AI-generated analysis can be incomplete, inaccurate, or mistaken.
- A statement may be controversial or unsupported without containing a formal logical fallacy.
- The absence of detected issues does not prove that an argument is valid or true.
- The quality of results depends on the selected model, language, prompt interpretation, and device capability.
- Optional third-party AI services are subject to their own availability, pricing, quotas, and terms.

### 9. Ownership and licensing

Mantech (منطک), including its original source code, application structure, prompts, documentation, and original brand assets, is proprietary.

**Exclusive rights holder:** Sobhan Ganji  
**License:** Proprietary — All Rights Reserved

No permission is granted to copy, modify, distribute, sublicense, host, deploy, sell, or commercially exploit this software. Written permission must be obtained in advance from the rights holder.

See [LICENSE](./LICENSE) for the full terms. Third-party components remain subject to their own licenses.

---

## فارسی

### ۱. معرفی

**منطک (Mantech)** ابزاری دوزبانه و مبتنی بر مرورگر برای بررسی متن‌های فارسی و انگلیسی از نظر مغالطات منطقی، تناقض‌ها، استنتاج‌های نامعتبر، خطاهای مقوله‌ای و ضعف‌های استدلالی است.

منطک تلاش می‌کند بخش‌های مسئله‌دار یک استدلال را مشخص کند و توضیح دهد که چرا یک نتیجه‌گیری یا شیوهٔ استدلال ممکن است از نظر منطقی اشکال داشته باشد.

این ابزار ماهیت آموزشی و تحلیلی دارد و نتیجهٔ آن جایگزین داوری مستقل، بررسی تخصصی یا مشاورهٔ حقوقی، پزشکی، مالی و سایر خدمات حرفه‌ای نیست.

### ۲. سازوکار عملکرد

معماری هوش مصنوعی منطک بر اجرای مدل درون مرورگر استوار است:

- **WebGPU:** دسترسی مرورگر به سخت‌افزار گرافیکی سازگار را فراهم می‌کند.
- **WebLLM:** مدل‌های زبانی پشتیبانی‌شده را مستقیماً در مرورگر بارگیری و اجرا می‌کند.
- **انتخاب مدل متناسب با دستگاه:** برنامه با استفاده از اطلاعات تقریبی حافظهٔ دستگاه، مدل اولیه را انتخاب می‌کند و در صورت شکست بارگیری، گزینه‌های سازگار دیگر را می‌آزماید.
- **پشتیبان اختیاری Groq:** اگر اجرای محلی WebGPU شکست بخورد، کاربری که کلید API شخصی Groq خود را وارد کرده باشد می‌تواند از آن به‌عنوان مسیر جایگزین استفاده کند.

روش اصلی تحلیل، اجرای محلی مدل است. در این حالت متن ارسالی برای تحلیل به سرور هوش مصنوعی متعلق به منطک فرستاده نمی‌شود و روی دستگاه کاربر پردازش می‌شود.

### ۳. حریم خصوصی و ارتباطات شبکه

- برای اجرای محلی، ساخت حساب کاربری در منطک یا دریافت کلید API از سرور منطک لازم نیست.
- در نخستین اجرا، فایل‌های مدل از زیرساخت توزیع مدل دریافت می‌شوند و ممکن است برای اجراهای بعدی در حافظهٔ مرورگر ذخیره شوند.
- ارائه‌دهندگان مرورگر و میزبان وب ممکن است مطابق سیاست‌های خود، اطلاعات فنی اتصال را پردازش کنند.
- اگر کاربر کلید شخصی Groq را وارد و مسیر پشتیبان را فعال کند، متن مورد تحلیل در آن مسیر مستقیماً از مرورگر به سرویس Groq ارسال می‌شود و تابع شرایط و سیاست حریم خصوصی آن سرویس خواهد بود.
- از ارسال اطلاعات محرمانه، حساس یا مشمول مقررات خاص خودداری کنید، مگر آنکه خطرات و شرایط سرویس‌های مربوط را بررسی کرده باشید.

### ۴. نیازمندی‌های مرورگر و سخت‌افزار

اجرای محلی به مرورگر و دستگاهی نیاز دارد که WebGPU در آن به‌درستی پشتیبانی شود. سازگاری و سرعت به نسخهٔ مرورگر، سیستم‌عامل، کارت گرافیک، درایورها، حافظهٔ آزاد و اندازهٔ مدل بستگی دارد.

وجود WebGPU در مرورگر لزوماً به معنای وجود آداپتور گرافیکی قابل استفاده یا حافظهٔ کافی نیست. دریافت نخستین نسخهٔ مدل ممکن است زمان‌بر و حجیم باشد.

استفاده از نسخهٔ جدید مرورگرهای سازگار مانند Chrome یا Edge و فعال‌بودن شتاب‌دهی سخت‌افزاری توصیه می‌شود.

### ۵. فناوری‌های به‌کاررفته

- React
- TypeScript
- Vite
- WebGPU
- WebLLM
- سرویس Groq به‌عنوان مسیر پشتیبان اختیاری
- jsPDF
- dom-to-image-more
- lucide-react

کتابخانه‌ها، مدل‌ها و اجزای متعلق به اشخاص یا پروژه‌های ثالث، دارایی منطک محسوب نمی‌شوند و تابع مجوزها و شرایط مستقل صاحبان خود هستند.

### ۶. اجرای محلی

برای اجرای پروژه به نسخهٔ جدید Node.js و npm نیاز دارید:

```bash
git clone https://github.com/3obhan/Mantech.git
cd Mantech
npm install
npm run dev
```

ساخت نسخهٔ نهایی:

```bash
npm run build
npm run preview
```

بررسی TypeScript:

```bash
npm run lint
```

خروجی نسخهٔ نهایی در پوشهٔ `dist/` ساخته می‌شود.

**توجه:** عمومی‌بودن مخزن صرفاً امکان مشاهدهٔ آن را فراهم می‌کند و به معنای اعطای مجوز استفاده از نرم‌افزار نیست. اجرای برنامه، کپی‌برداری، تغییر، انتشار، استقرار یا بهره‌برداری از آن بدون اجازهٔ کتبی صاحب حقوق مجاز نیست.

### ۷. محدودیت‌ها

- تحلیل تولیدشده توسط هوش مصنوعی ممکن است ناقص یا اشتباه باشد.
- هر گزارهٔ بحث‌برانگیز یا اثبات‌نشده الزاماً مغالطهٔ صوری یا غیرصوری نیست.
- پیدا نشدن خطا به معنای اثبات صحت یا اعتبار استدلال نیست.
- کیفیت خروجی به مدل انتخاب‌شده، زبان متن، تفسیر دستور و توان سخت‌افزاری دستگاه بستگی دارد.
- سرویس‌های هوش مصنوعی ثالث تابع محدودیت‌ها، هزینه‌ها و شرایط خود هستند.

### ۸. مالکیت و حقوق مادی و معنوی

تمام حقوق مادی و معنوی مربوط به **منطک (Mantech)**، از جمله کد منبع اصیل، ساختار برنامه، دستورهای اختصاصی مدل، مستندات و عناصر بصری اصیل برند، متعلق به:

**سبحان گنجی**  
**توسعه‌دهندهٔ برند «هاردو» (Hardo)**

است و کلیهٔ حقوق محفوظ است.

این مخزن تحت مجوز متن‌باز منتشر نشده است. هیچ مجوزی برای کپی، بازنشر، تغییر، ساخت اثر مشتق، توزیع، فروش، واگذاری، میزبانی، استقرار یا بهره‌برداری تجاری از نرم‌افزار اعطا نمی‌شود. هرگونه استفاده از این موارد منوط به دریافت اجازهٔ کتبی و قبلی از صاحب حقوق است.

متن کامل شرایط در فایل [LICENSE](./LICENSE) درج شده است. مجوز اجزای متعلق به اشخاص ثالث تابع شرایط مستقل همان اجزا خواهد بود.

---

**Mantech | منطک**  
Copyright © 2026 Sobhan Ganji. All rights reserved.  
**Proprietary Software — All Rights Reserved**
