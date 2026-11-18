import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Cpu, ShieldCheck, Scale } from 'lucide-react';
import { useAppState } from '../store';

export const About = () => {
  const { lang } = useAppState();
  const fa = lang === 'fa';

  const sections = fa ? [
    {
      icon: BookOpen,
      title: 'منطک چیست؟',
      body: 'منطک سامانه‌ای برای واکاوی ساختار عقلانی متن و استدلال است؛ از تناقض‌های آشکار و پنهان و ناسازگاری مفهومی تا خطاهای استنتاج، مغالطات صوری و غیرصوری، ابهام‌های معنایی، پیش‌فرض‌های پنهان و گسست میان مقدمات و نتیجه. هدف، صرفاً نام‌گذاری خطاها نیست؛ منطک می‌کوشد محل دقیق ایراد، سازوکار شکل‌گیری آن و نسبتش با کل استدلال را روشن کند.'
    },
    {
      icon: Cpu,
      title: 'چگونه کار می‌کند؟',
      body: 'منطک در حالت اصلی از مدل زبانی اجراشده در مرورگر استفاده می‌کند. فناوری WebGPU ارتباط با سخت‌افزار گرافیکی سازگار را فراهم می‌کند و WebLLM مدل را روی دستگاه شما اجرا می‌کند. متن برای این تحلیل محلی به سرور هوش مصنوعی منطک فرستاده نمی‌شود. در نخستین اجرا، فایل‌های مدل دریافت می‌شوند و ممکن است برای دفعات بعد در حافظه مرورگر باقی بمانند.'
    },
    {
      icon: Scale,
      title: 'مبنای تحلیل',
      body: 'منطک ادعاها، مقدمات، مفروضات و نتیجه‌گیری‌ها را از هم تفکیک می‌کند؛ پیوندهای میان آن‌ها را می‌سنجد و متن را از نظر سازگاری درونی، اعتبار صورت استدلال، ارتباط دلیل با نتیجه، کفایت شواهد، دقت مفهومی و انواع مغالطه بررسی می‌کند. هر یافته باید تا حد امکان با نقل بخش مربوط از متن و توضیح روشنِ چرایی تشخیص همراه باشد.'
    },
    {
      icon: ShieldCheck,
      title: 'حریم خصوصی و مسیر جایگزین',
      body: 'در روش محلی، مدل در مرورگر و روی سخت‌افزار دستگاه شما اجرا می‌شود و متن برای تحلیل به سرور منطک فرستاده نمی‌شود. فایل مدل در نخستین اجرا دریافت و برای استفاده‌های بعدی ذخیره می‌شود. مسیر جایگزین Groq نیز فقط با کلید APIای که خودتان وارد کرده‌اید فعال می‌شود؛ در این حالت متن برای پردازش به سرویس Groq ارسال خواهد شد.'
    },
  ] : [
    {
      icon: BookOpen,
      title: 'What is Mantech?',
      body: 'Mantech is an educational and analytical tool for examining Persian and English arguments and texts. It aims to help identify possible reasoning weaknesses, contradictions, invalid inferences, and logical fallacies, and to explain them clearly.'
    },
    {
      icon: Cpu,
      title: 'How does it work?',
      body: 'By default, Mantech uses a language model running inside your browser. WebGPU provides access to compatible graphics hardware, while WebLLM runs the model on your device. In this local mode, your text is not sent to a Mantech AI server for analysis. Model files are downloaded on first use and may remain cached by your browser.'
    },
    {
      icon: Scale,
      title: 'The basis of analysis',
      body: 'Mantech examines the structure of reasoning across a broad range of issues: explicit and hidden contradictions, conceptual inconsistencies, invalid inferences, formal and informal fallacies, semantic ambiguity, hidden assumptions, and gaps between premises and conclusions. Its aim is not merely to label errors, but to locate them, explain how they arise, and show how they affect the wider argument.'
    },
    {
      icon: ShieldCheck,
      title: 'Privacy and fallback',
      body: 'In local mode, the model runs in your browser on your own hardware, and your text is not sent to a Mantech server for analysis. Model files are downloaded on first use and cached for later sessions. The optional Groq fallback is available only if you enter your own API key; in that mode, the text is sent to Groq for processing.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in py-2 sm:py-6 font-sans">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black">{fa ? 'درباره' : 'About'}</h1>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 border-2 border-[#1A1A1A] bg-white px-3 py-2 sm:px-5 sm:py-3 font-bold hover:bg-[#1A1A1A] hover:text-white transition-colors">
          {fa ? 'بازگشت' : 'Back'}
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white border-2 sm:border-4 border-[#1A1A1A] shadow-[5px_5px_0px_0px_rgba(26,26,26,1)] sm:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] p-5 sm:p-8 mb-6">
        <p className="text-base sm:text-lg leading-8 sm:leading-9 font-medium">
          {fa
            ? 'منطک می‌کوشد به جای داوری شتاب‌زده درباره نتیجه یک بحث، ساختار استدلال را بررسی کند: چه چیزی ادعا شده، چه دلیلی ارائه شده و آیا نتیجه واقعاً از مقدمات به دست می‌آید؟'
            : 'Rather than rushing to judge the conclusion of a discussion, Mantech focuses on the structure of reasoning: what is claimed, what evidence is offered, and whether the conclusion actually follows from the premises.'}
        </p>
      </div>

      <div className="space-y-4">
        {sections.map(({ icon: Icon, title, body }) => (
          <section key={title} className="bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 flex gap-4 sm:gap-5">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black mb-2">{title}</h2>
              <p className="text-sm sm:text-base leading-7 opacity-80">{body}</p>
            </div>
          </section>
        ))}
      </div>

      <p className="text-center text-xs font-bold opacity-50 mt-8">Mantech · Pure Logical Reasoner</p>
    </div>
  );
};
