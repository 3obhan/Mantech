import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Cpu, ShieldCheck, Scale, AlertTriangle } from 'lucide-react';
import { useAppState } from '../store';

export const About = () => {
  const { lang } = useAppState();
  const fa = lang === 'fa';

  const sections = fa ? [
    {
      icon: BookOpen,
      title: 'منطک چیست؟',
      body: 'منطک ابزاری آموزشی و تحلیلی برای بررسی استدلال‌ها و متن‌های فارسی و انگلیسی است. هدف آن کمک به تشخیص ضعف‌های استدلالی، تناقض‌ها، استنتاج‌های نامعتبر و مغالطات احتمالی و توضیح روشن‌تر آن‌هاست.'
    },
    {
      icon: Cpu,
      title: 'چگونه کار می‌کند؟',
      body: 'منطک در حالت اصلی از مدل زبانی اجراشده در مرورگر استفاده می‌کند. فناوری WebGPU ارتباط با سخت‌افزار گرافیکی سازگار را فراهم می‌کند و WebLLM مدل را روی دستگاه شما اجرا می‌کند. متن برای این تحلیل محلی به سرور هوش مصنوعی منطک فرستاده نمی‌شود. در نخستین اجرا، فایل‌های مدل دریافت می‌شوند و ممکن است برای دفعات بعد در حافظه مرورگر باقی بمانند.'
    },
    {
      icon: Scale,
      title: 'مبنای تحلیل',
      body: 'مدل تلاش می‌کند ادعاها، مقدمات و نتیجه‌گیری‌های متن را از هم تفکیک کند؛ سپس ارتباط میان آن‌ها را از نظر سازگاری، پیوستگی، کفایت دلیل و احتمال وجود مغالطه بررسی کند. خروجی، توضیحی درباره موارد مشکوک و چرایی آن‌هاست؛ نه حکم قطعی درباره حقیقت یا درستی یک دیدگاه.'
    },
    {
      icon: ShieldCheck,
      title: 'حریم خصوصی و مسیر جایگزین',
      body: 'روش اصلی، پردازش محلی روی دستگاه است. اگر اجرای محلی در دسترس نباشد، تنها در صورتی که خودتان کلید API شخصی Groq را تنظیم کرده باشید، امکان استفاده از آن به‌عنوان مسیر جایگزین وجود دارد؛ در آن حالت متن برای پردازش به سرویس Groq ارسال می‌شود و شرایط حریم خصوصی آن سرویس اعمال خواهد شد.'
    },
    {
      icon: AlertTriangle,
      title: 'محدودیت‌ها',
      body: 'تحلیل هوش مصنوعی ممکن است ناقص یا نادرست باشد. تشخیص‌ندادن مغالطه، اعتبار یا حقیقت یک استدلال را ثابت نمی‌کند؛ همچنین هر ادعای بحث‌برانگیز یا نادرست الزاماً مغالطه نیست. نتیجه را نقطه شروعی برای بازبینی و تفکر مستقل بدانید، نه جایگزین آن.'
    }
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
      body: 'The model attempts to distinguish claims, premises, and conclusions, then examine their relationships for consistency, coherence, supporting evidence, and possible fallacies. Its output explains potentially problematic points and why they may be problematic; it is not a definitive ruling on truth or correctness.'
    },
    {
      icon: ShieldCheck,
      title: 'Privacy and fallback',
      body: 'The primary method is on-device processing. If local execution is unavailable, Groq can be used as an optional fallback only when you have configured your own Groq API key. In that case, the text is sent to Groq for processing and that service’s privacy terms apply.'
    },
    {
      icon: AlertTriangle,
      title: 'Limitations',
      body: 'AI analysis can be incomplete or incorrect. Failing to detect a fallacy does not prove that an argument is valid or true; likewise, a controversial or false claim is not automatically a logical fallacy. Treat the result as a starting point for review and independent thought, not a replacement for them.'
    }
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
