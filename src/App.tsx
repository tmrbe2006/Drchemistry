import React, { useState, useEffect, useRef, Fragment } from "react";
import { SolvedProblem } from "./types";
import PeriodicTable from "./components/PeriodicTable";
import MoleCalculator from "./components/MoleCalculator";
import QuizSection from "./components/QuizSection";
import PronunciationSection from "./components/PronunciationSection";
import MolecularGeometryVisualizer from "./components/MolecularGeometryVisualizer";
import FlashcardsSection from "./components/FlashcardsSection";
import QuickReferenceModal from "./components/QuickReferenceModal";
import ExamGeneratorSection from "./components/ExamGeneratorSection";
import StudyPlanner from "./components/StudyPlanner";
import LecturesSection from "./components/LecturesSection";
import AboutSection from "./components/AboutSection";
import ImportantQuestionsSection from "./components/ImportantQuestionsSection";
import LatexHelpModal from "./components/LatexHelpModal";
import ChemistryChart from "./components/ChemistryChart";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { jsPDF } from "jspdf";
import { GLOSSARY_TERMS } from "./glossary";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Send,
  Trash2,
  History,
  Check,
  Loader2,
  FlaskConical,
  Atom,
  Award,
  FileText,
  AlertCircle,
  HelpCircle,
  GraduationCap,
  Languages,
  Mic,
  MicOff,
  Download,
  File,
  Sun,
  Moon,
  Contrast,
  Printer,
  Volume2,
  Share2,
  Bookmark,
  Sigma,
  Calendar,
  Video,
  Mail,
  MessageSquare,
  MessageSquareText,
  Star,
  Cpu,
  BarChart4
} from "lucide-react";

// Interactive Typewriter Markdown Component to simulate a living tutor
interface TypewriterMarkdownProps {
  content: string;
  lang: "ar" | "en";
  highlightGlossaryTerms: (text: string, lang: "ar" | "en", key?: any) => React.ReactNode;
  useKatex?: boolean;
}

export function TypewriterMarkdown({ content, lang, highlightGlossaryTerms, useKatex }: TypewriterMarkdownProps) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    if (!content) return;
    
    // Sanitize any mathematical delimiters ($ or $$) if katex is NOT used
    const sanitized = useKatex ? content : content.replace(/\$\$/g, "").replace(/\$/g, "");
    
    const words = sanitized.split(" ");
    let currentWordIndex = 0;
    
    const interval = setInterval(() => {
      if (currentWordIndex >= words.length) {
        clearInterval(interval);
        setDisplayedText(sanitized);
        return;
      }
      
      const nextText = words.slice(0, currentWordIndex + 1).join(" ");
      setDisplayedText(nextText);
      currentWordIndex++;
    }, 15); // Fast, premium word pacing
    
    return () => clearInterval(interval);
  }, [content, useKatex]);

  return (
    <div className="markdown-body transition-all duration-300">
      <Markdown
        remarkPlugins={useKatex ? [remarkMath, remarkGfm] : [remarkGfm]}
        rehypePlugins={useKatex ? [rehypeKatex] : []}
        components={{
          p: ({ children }) => {
            if (typeof children === "string") {
              return <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{highlightGlossaryTerms(children, lang)}</p>;
            }
            return <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{children}</p>;
          },
          li: ({ children }) => {
            if (typeof children === "string") {
              return <li className="mb-2 text-slate-700 dark:text-slate-300 font-semibold">{highlightGlossaryTerms(children, lang)}</li>;
            }
            return <li className="mb-2 text-slate-700 dark:text-slate-300 font-semibold">{children}</li>;
          },
        }}
      >
        {displayedText}
      </Markdown>
    </div>
  );
}

// Comprehensive bilingual question suggestions mapped by topic
const SUGGESTED_QUESTIONS_MAP_AR: Record<string, { topic: string; text: string }[]> = {
  general: [
    { topic: "بنية الذرة", text: "ما هو مبدأ البناء التصاعدي (أوفباو) وكيف يتم استخدامه لتحديد التوزيع الإلكتروني لعنصر الكروم (Cr-24)؟" },
    { topic: "الروابط الكيميائية", text: "قارن بين الرابطة الأيونية والرابطة التساهمية من حيث التوصيل الكهربائي ودرجة الانصهار مع ذكر أمثلة مبرهنة." },
    { topic: "نظريات الأحماض", text: "اشرح الفروق الجوهرية بين تعريفات الأحماض والقواعد طبقاً لنظريات: أرهينيوس، برونستد-لوري، ولويس." }
  ],
  organic: [
    { topic: "الألكينات", text: "ما هو ناتج إضافة حمض الهيدروكلوريك HCl إلى البروبين CH3-CH=CH2؟ اشرح قاعدة ماركوفنيكوف بالتفصيل وآلية التفاعل." },
    { topic: "البنزين العطري", text: "اشرح آلية تفاعل نيترة البنزين (مركب البنزين الحلقي مع خليط النيترة) مبيناً دور حمض الكبريتيك المركز كعامل حفاز." },
    { topic: "المجموعات الوظيفية", text: "كيف يمكن التمييز كيميائياً بين الإيثانول (كحول) وحمض الأسيتيك (حمض كربوكسيلي) مجهولي الهوية في المختبر المعملي؟" }
  ],
  stoichiometry: [
    { topic: "موازنة المعادلات", text: "زن المعادلة الكيميائية التالية واشرح خطوات الموازنة بالتفصيل: NH3 + O2 -> NO + H2O" },
    { topic: "المادة المحددة للتفاعل", text: "عند تفاعل 10 جرام من الهيدروجين H2 مع 80 جرام من الأكسجين O2 لتكوين الماء H2O، ما هي المادة المحددة للتفاعل؟ وما هي كتلة الماء الناتج؟" },
    { topic: "النسبة المئوية للناتج", text: "تفاعل 5 جرام من المغنيسيوم مع وفرة من حمض الهيدروكلوريك لإنتاج غاز الهيدروجين. إذا كان الناتج الفعلي للهيدروجين هو 0.35 جرام، احسب النسبة المئوية للناتج." }
  ],
  thermo: [
    { topic: "قانون هس", text: "احسب التغير في المحتوى الحراري (ΔH) لتفاعل تحويل الجرافيت إلى ماس باستخدام قيم احتراق الكربون التالية: C(graphite) + O2 -> CO2 (ΔH = -393.5 kJ), C(diamond) + O2 -> CO2 (ΔH = -395.4 kJ)." },
    { topic: "طاقة جيبس الحرة", text: "احسب درجة الحرارة التي يصبح عندها التفاعل تلقائياً إذا كانت قيمة التغير في المحتوى الحراري ΔH = +120 kJ/mol والتغير في الإنتروبيا ΔS = +150 J/mol.K." },
    { topic: "المسعر الحراري", text: "عند إذابة 5 جرام من ملح نيترات الأمونيوم NH4NO3 في 100 جرام من الماء داخل مسعر كوب القهوة، انخفضت درجة الحرارة من 23.0°C إلى 18.2°C. احسب حرارة الذوبان المولارية." }
  ],
  analytical: [
    { topic: "حسابات المعايرة", text: "أجريت معايرة لـ 25 مل من محلول هيدروكسيد الصوديوم NaOH مجهول التركيز باستخدام محلول قياسي من حمض الهيدروكلوريك HCl تركيزه 0.1 M. فإذا لزم 18.5 مل من الحمض للوصول لنقطة التعادل، احسب تركيز NaOH." },
    { topic: "حساب الـ pH", text: "احسب قيمة الأس الهيدروجيني (pH) لمحلول حمض الهيدروكلوريك HCl تركيزه 0.05 M، وقارنه بقيمة pH لمحلول حمض الأسيتيك CH3COOH الذي له نفس التركيز علماً بأن Ka = 1.8e-5." },
    { topic: "حساب الذوبانية Ksp", text: "إذا كانت قيمة حاصل الإذابة (Ksp) لملح كبريتات الباريوم BaSO4 هي 1.1e-10 عند 25°C، احسب ذوبانية الملح بالمول/لتر في الماء النقي." }
  ]
};

const SUGGESTED_QUESTIONS_MAP_EN: Record<string, { topic: string; text: string }[]> = {
  general: [
    { topic: "Atomic Structure", text: "What is the Aufbau principle and how is it used to determine the electron configuration of chromium (Cr-24) with its half-filled d-shell anomaly?" },
    { topic: "Chemical Bonding", text: "Compare ionic and covalent bonds in terms of electrical conductivity and melting points, providing real examples of each." },
    { topic: "Acid-Base Theories", text: "Explain the main differences between the acid-base definitions of Arrhenius, Brønsted-Lowry, and Lewis with specific examples." }
  ],
  organic: [
    { topic: "Alkenes", text: "What is the product of adding hydrochloric acid HCl to propene CH3-CH=CH2? Detail Markovnikov's rule and show the reaction mechanism." },
    { topic: "Benzene Reactions", text: "Show the reaction mechanism of benzene nitration with a nitrating mixture, highlighting the catalyst role of concentrated sulfuric acid." },
    { topic: "Functional Groups", text: "How can you chemically distinguish between ethanol (an alcohol) and acetic acid (a carboxylic acid) in a school laboratory?" }
  ],
  stoichiometry: [
    { topic: "Equation Balancing", text: "Balance the following chemical equation and explain the stoichiometric steps: NH3 + O2 -> NO + H2O" },
    { topic: "Limiting Reactant", text: "When 10g of H2 reacts with 80g of O2 to form water, which is the limiting reactant, and what is the exact mass of water produced?" },
    { topic: "Percent Yield", text: "5g of Magnesium reacts with excess HCl to produce hydrogen gas. If the actual yield of hydrogen is 0.35g, calculate the percent yield." }
  ],
  thermo: [
    { topic: "Hess's Law", text: "Calculate the enthalpy change (ΔH) for converting graphite to diamond using: C(graphite) + O2 -> CO2 (ΔH = -393.5 kJ) and C(diamond) + O2 -> CO2 (ΔH = -395.4 kJ)." },
    { topic: "Gibbs Free Energy", text: "At what temperature does a reaction become spontaneous if ΔH = +120 kJ/mol and ΔS = +150 J/mol·K?" },
    { topic: "Calorimetry", text: "When 5g of ammonium nitrate NH4NO3 is dissolved in 100g of water in a coffee-cup calorimeter, the temperature drops from 23.0°C to 18.2°C. Calculate the molar heat of solution." }
  ],
  analytical: [
    { topic: "Titration", text: "A 25.0 mL sample of unknown concentration NaOH is titrated with 0.100 M HCl. If 18.5 mL of acid is required to reach the equivalence point, calculate the molarity of the NaOH." },
    { topic: "pH Calculation", text: "Calculate the pH of 0.05 M hydrochloric acid HCl, and compare it to 0.05 M acetic acid CH3COOH given that Ka = 1.8e-5." },
    { topic: "Solubility Ksp", text: "If the solubility product constant (Ksp) of barium sulfate BaSO4 is 1.1e-10 at 25°C, calculate its molar solubility in pure water." }
  ]
};

const SUGGESTED_QUESTIONS_AR = [
  {
    topic: "موازنة المعادلات",
    text: "زن المعادلة التالية واشرح خطوات الموازنة بالتفصيل: Fe + O2 -> Fe2O3",
  },
  {
    topic: "الحساب الكيميائي",
    text: "احسب عدد مولات غاز CO2 الناتج عن احتراق 50 جرام من غاز الميثان CH4 احتراقاً تاماً في وفرة من الأكسجين.",
  },
  {
    topic: "الكيمياء العضوية",
    text: "ما هو ناتج تفاعل إضافة الماء (الهيدرة الحفزية) للإيثين C2H4؟ اشرح شروط التفاعل ونوع الناتج بالتفصيل.",
  }
];

const SUGGESTED_QUESTIONS_EN = [
  {
    topic: "Equation Balancing",
    text: "Balance the following chemical equation and explain the steps in detail: Fe + O2 -> Fe2O3",
  },
  {
    topic: "Stoichiometry",
    text: "Calculate the number of moles of CO2 gas produced by the complete combustion of 50 grams of methane gas CH4 in excess oxygen.",
  },
  {
    topic: "Organic Chemistry",
    text: "What is the product of the addition of water (catalytic hydration) to ethene C2H4? Explain the reaction conditions and the product details in full.",
  }
];

const TRANSLATIONS = {
  ar: {
    title: "منصة د. تامر مدبولي",
    subTitle: "مستشارك الأكاديمي المتقدم لحل وفهم المسائل الكيميائية بالذكاء الاصطناعي",
    badge: "الكيمياء الذكية",
    navSolver: "المعالج الذكي",
    navPeriodic: "الجدول الدوري",
    navMolar: "حساب الكتل والمولات",
    navQuiz: "اختبار المعرفة",
    navPronounce: "القاموس النطقي",
    navLectures: "محاضراتي",
    navImportant: "أسئلة هامة",
    navAbout: "عن د. تامر",
    bannerTitle: "أهلاً بك في المعمل الرقمي للأستاذ د. تامر مدبولي",
    bannerSub: "هنا ندمج متعة الكيمياء مع قوة الذكاء الاصطناعي الفائق. يمكنك رفع صور المعادلات الكيميائية، المخططات الجزيئية، أو الأسئلة النصية، لتلقي حل مبرهن ومفصل كلياً في ثوانٍ معدودة وبمنهجية علمية واضحة للغاية.",
    bannerBadge: "منصة علمية معتمدة",
    sensorBadge: "مستشعر الصور",
    aiBadge: "ذكاء اصطناعي",
    badgeActive: "مدعم بالكامل",
    badgePrecision: "دقيق ومجاني",
    formTitle: "طرح السؤال وتحليل الصورة",
    formLabelPrompt: "اكتب المسألة أو السؤال الكيميائي",
    formPlaceholderPrompt: "اكتب المعادلة أو السؤال هنا (مثال: احسب كتلة هيدروكسيد الصوديوم اللازمة للتعادل مع...) أو دع الخانة فارغة وارفع صورة للمسألة.",
    formLabelTopic: "موضوع المسألة (اختياري)",
    topicGeneral: "كيمياء عامة ومسائل عامة",
    topicOrganic: "كيمياء عضوية (تفاعلات وهياكل)",
    topicStoichiometry: "حساب كيميائي (مولات وكتل ومعادلات)",
    topicThermo: "كيمياء حرارية وطاقة",
    topicAnalytical: "كيمياء تحليلية ومعايرة",
    formLabelEngine: "مصدر المعالجة الذكية",
    engineDesc: "مستند إلى واجهة Gemini & Qwen الفائقة",
    formLabelImage: "إرفاق صورة المسألة (اختياري)",
    dropzoneText: "اسحب وأسقط صورة المسألة هنا",
    dropzoneSub: "يدعم صيغ PNG, JPG, JPEG مع إمكانية استخدام كاميرا الهاتف",
    deleteImage: "حذف الصورة",
    alertTitle: "تنبيه من النظام:",
    btnSolve: "حل المسألة الكيميائية مع د. تامر مدبولي",
    btnSolving: "جاري صياغة الحل المنهجي...",
    exampleTitle: "أمثلة مقترحة للتجربة السريعة:",
    loadingTitle: "جاري إعداد التفسير الكيميائي",
    loadingDesc: "عملية سريعة مدعمة بمحرك الذكاء الكيميائي الفائق Gemini 3.5",
    solutionTitle: "تفسير وحل المسألة الكيميائية المنهجي",
    solutionImageBadge: "مسألة مصورة",
    solutionPromptLabel: "المسألة المطروحة:",
    profileTitle: "الأستاذ د. تامر مدبولي",
    profileRole: "خبير واستشاري الكيمياء والفيزياء",
    profileBio: "أستاذ جامعي ومحاضر متميز في تقديم شروحات الكيمياء العضوية والتحليلية والفيزيائية للمدارس الثانوية والجامعات بمنهج علمي مبسط ومطور.",
    profileLectures: "المحاضرات",
    profileLecturesVal: "تفاعلية بالكامل",
    profileLevel: "المستوى",
    profileLevelVal: "ثانوي وجامعي",
    historyTitle: "سجل المسائل المحلولة",
    historyClear: "حذف السجل",
    historyEmpty: "لا يوجد مسائل محفوظة حالياً",
    historyEmptySub: "اطرح سؤالك الأول وسيتم الاحتفاظ به في سجل المتصفح للرجوع السريع.",
    quoteTitle: "رؤية د. تامر الكيميائية:",
    quoteText: '"الكيمياء ليست مجرد معادلات تُحفظ؛ بل هي لغة المادة، وفهم آليات التفاعل هو المفتاح الحقيقي للاستذكار السليم والتميز في هذا العلم العظيم."',
    footerTitle: "منصة د. تامر مدبولي للكيمياء المتقدمة",
    footerCopy: "جميع الحقوق محفوظة © {year} • المنصة الرقمية الذكية لدراسة الكيمياء",
    confirmClear: "هل أنت متأكد من رغبتك في حذف جميع المسائل المحفوظة في السجل؟",
    errorInput: "الرجاء كتابة مسألة كيميائية، رفع صورة، أو رفع مستند PDF لحلها.",
    errorFile: "الرجاء رفع ملف صورة أو مستند PDF فقط (PNG, JPG, JPEG, PDF).",
    dictationTooltip: "اضغط للإملاء الصوتي المباشر (تحدث الآن)",
    dictationListening: "جاري الاستماع... تحدث الآن لسؤال د. تامر",
    dictationStop: "إيقاف الاستماع",
    downloadPDF: "تحميل الحل كملف PDF المنسق المطور",
    pdfBadge: "مستند PDF",
    fileAttached: "تم إرفاق الملف كلياً"
  },
  en: {
    title: "Dr. Tamer Madbouly Platform",
    subTitle: "Your advanced academic consultant for solving and understanding chemistry via AI",
    badge: "Smart Chemistry",
    navSolver: "AI Solver",
    navPeriodic: "Periodic Table",
    navMolar: "Molar Mass Calc",
    navQuiz: "Quiz Mode",
    navPronounce: "Pronunciation",
    navLectures: "My Lectures",
    navImportant: "Important Qs",
    navAbout: "About Dr. Tamer",
    bannerTitle: "Welcome to the Digital Lab of Dr. Tamer Madbouly",
    bannerSub: "Here, we merge the joy of chemistry with the power of advanced AI. Upload chemical equations, molecular diagrams, or text-based questions to receive a fully proven and detailed methodology in seconds.",
    bannerBadge: "Accredited Academic Platform",
    sensorBadge: "Image Sensor",
    aiBadge: "Artificial Intel",
    badgeActive: "Fully Supported",
    badgePrecision: "Precise & Free",
    formTitle: "Submit Question & Image Analysis",
    formLabelPrompt: "Write your Chemistry Problem or Question",
    formPlaceholderPrompt: "Type your equation or question here (e.g., Calculate the mass of sodium hydroxide needed to neutralize...) or leave blank and upload an image.",
    formLabelTopic: "Problem Topic (Optional)",
    topicGeneral: "General Chemistry & Principles",
    topicOrganic: "Organic Chemistry (Reactions & Structures)",
    topicStoichiometry: "Stoichiometry (Moles, Masses & Equations)",
    topicThermo: "Thermochemistry & Energy",
    topicAnalytical: "Analytical Chemistry & Titrations",
    formLabelEngine: "Smart Engine Source",
    engineDesc: "Powered by advanced Gemini 3.5 Flash",
    formLabelImage: "Attach Problem Image (Optional)",
    dropzoneText: "Drag & drop your problem image here",
    dropzoneSub: "Supports PNG, JPG, JPEG; compatible with phone cameras",
    deleteImage: "Remove Image",
    alertTitle: "System Alert:",
    btnSolve: "Solve Problem with Dr. Tamer",
    btnSolving: "Formulating Systematic Solution...",
    exampleTitle: "Suggested Examples for Quick Trial:",
    loadingTitle: "Preparing Chemical Exposition",
    loadingDesc: "Rapid processing backed by Gemini 3.5 chemical intelligence",
    solutionTitle: "Systematic Exposition & Chemical Resolution",
    solutionImageBadge: "Illustrated Problem",
    solutionPromptLabel: "Submitted Problem:",
    profileTitle: "Prof. Dr. Tamer Madbouly",
    profileRole: "Chemistry & Biophysics Expert",
    profileBio: "Renowned university professor and lecturer, delivering outstanding interactive explanations of organic, analytical, and physical chemistry for secondary and higher education.",
    profileLectures: "Lectures",
    profileLecturesVal: "Fully Interactive",
    profileLevel: "Level",
    profileLevelVal: "High School & College",
    historyTitle: "Solved Problems History",
    historyClear: "Clear History",
    historyEmpty: "No saved problems yet",
    historyEmptySub: "Submit your first question and it will be stored locally in your browser for quick reference.",
    quoteTitle: "Dr. Tamer's Vision:",
    quoteText: '"Chemistry is not just formulas to memorize; it is the language of matter. Grasping reaction mechanisms is the true gateway to genuine learning and mastery of this grand science."',
    footerTitle: "Dr. Tamer Madbouly Advanced Chemistry Platform",
    footerCopy: "All rights reserved © {year} • Smart Digital Platform for Chemistry Studies",
    confirmClear: "Are you sure you want to delete all saved problems in the history?",
    errorInput: "Please write a chemistry question, upload an image, or upload a PDF document to solve.",
    errorFile: "Please upload an image or a PDF document only (PNG, JPG, JPEG, PDF).",
    dictationTooltip: "Click to dictate question using voice (Speak now)",
    dictationListening: "Listening... Speak your question for Dr. Tamer",
    dictationStop: "Stop Listening",
    downloadPDF: "Download Solution as Formatted PDF",
    pdfBadge: "PDF Document",
    fileAttached: "File fully attached"
  }
};

const loadingMessagesAr = [
  "جاري استلام المسألة وفحص المكونات بالذكاء الاصطناعي...",
  "د. تامر مدبولي يقوم بموازنة المعادلات وربط الكتل المولية بالأساس العلمي...",
  "جاري كتابة الحل المنهجي بالتفصيل وإعداد النصائح التعليمية الذهبية...",
  "اللمسات النهائية... جاري عرض الحل والشرح المنهجي الآن."
];

const loadingMessagesEn = [
  "Receiving problem and analyzing compounds using chemical AI...",
  "Dr. Tamer is balancing equations and linking molar masses to scientific foundations...",
  "Drafting systematic solution step-by-step and tailoring study tips...",
  "Applying final touches... Rendering your complete chemical analysis now."
];

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null); // base64 string
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [topic, setTopic] = useState("general");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [highContrast, setHighContrast] = useState(false);
  const [useKatex, setUseKatex] = useState(false);
  const [showQuickReference, setShowQuickReference] = useState(false);
  const [showLatexHelp, setShowLatexHelp] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"gemini-2.0-flash" | "gemini-1.5-pro">("gemini-2.0-flash");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Solved history
  const [history, setHistory] = useState<SolvedProblem[]>([]);
  const [currentSolution, setCurrentSolution] = useState<SolvedProblem | null>(null);
  
  // Caching mechanism: Load from local storage on mount
  useEffect(() => {
    const cached = localStorage.getItem("chemistry_solver_cache");
    if (cached) {
      setHistory(JSON.parse(cached));
    }
  }, []);

  // Save to cache whenever history updates
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("chemistry_solver_cache", JSON.stringify(history));
    }
  }, [history]);
  const [activeTab, setActiveTab] = useState<"ai-solver" | "periodic-table" | "molar-calc" | "quiz" | "pronunciation" | "flashcards" | "study-planner" | "exam-generator" | "lectures" | "important" | "about">("ai-solver");

  // Follow-up chat state
  const [followUpPrompt, setFollowUpPrompt] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);

  // Load and apply theme and contrast on start
  useEffect(() => {
    const savedTheme = localStorage.getItem("dr_tamer_theme") as "light" | "dark" | null;
    const savedContrast = localStorage.getItem("dr_tamer_high_contrast") === "true";
    const savedKatex = localStorage.getItem("dr_tamer_use_katex") === "true";
    const savedPrompt = localStorage.getItem("dr_tamer_saved_prompt");
    
    setHighContrast(savedContrast);
    setUseKatex(savedKatex);
    if (savedContrast) document.documentElement.classList.add("high-contrast");
    if (savedPrompt) setPrompt(savedPrompt);

    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Auto-save prompt
  useEffect(() => {
    if (prompt) {
      localStorage.setItem("dr_tamer_saved_prompt", prompt);
    } else {
      localStorage.removeItem("dr_tamer_saved_prompt");
    }
  }, [prompt]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("dr_tamer_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleHighContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem("dr_tamer_high_contrast", newContrast.toString());
    if (newContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleKatex = () => {
    const newKatex = !useKatex;
    setUseKatex(newKatex);
    localStorage.setItem("dr_tamer_use_katex", newKatex.toString());
  };

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setPrompt((prev) => prev ? prev + " " + text : text);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(lang === "en" ? "Speech recognition is not supported in your browser." : "ميزة الإملاء الصوتي غير مدعومة في متصفحك الحالي.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = lang === "ar" ? "ar-EG" : "en-US";
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Highlights chemistry glossary terms and displays interactive tooltips with definitions
  const highlightGlossaryTerms = (text: string, currentLang: "ar" | "en", key?: any) => {
    if (!text) return text;
    const isEn = currentLang === "en";

    // Sort terms by length descending to match longer terms first (preventing sub-term replacement bugs)
    const sortedTerms = [...GLOSSARY_TERMS].sort((a, b) => {
      const termA = isEn ? a.termEn : a.termAr;
      const termB = isEn ? b.termEn : b.termAr;
      return termB.length - termA.length;
    });

    // Create a regex to match any of the terms
    const termPatterns = sortedTerms.map((t) => {
      const val = isEn ? t.termEn : t.termAr;
      // Escape regex special characters
      return val.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    });

    if (termPatterns.length === 0) return text;

    // Join with OR patterns
    const regex = new RegExp(`\\b(${termPatterns.join("|")})\\b`, "gi");

    // Let's split and replace with hoverable elements
    const parts = text.split(regex);
    return (
      <Fragment key={key}>
        {parts.map((part, idx) => {
          const matchedTerm = sortedTerms.find((t) => {
            const termVal = isEn ? t.termEn : t.termAr;
            return termVal.toLowerCase() === part.toLowerCase();
          });

          if (matchedTerm) {
            const def = isEn ? matchedTerm.defEn : matchedTerm.defAr;
            const category = isEn ? matchedTerm.categoryEn : matchedTerm.categoryAr;
            
            return (
              <span 
                key={idx} 
                className="relative group inline text-indigo-700 font-extrabold border-b-2 border-dashed border-indigo-300 cursor-help bg-indigo-50/50 px-1 rounded hover:bg-indigo-100/70 transition-colors"
                title={`${isEn ? matchedTerm.termEn : matchedTerm.termAr} (${category}): ${def}`}
              >
                {part}
                {/* Custom Interactive Tooltip */}
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 text-right leading-relaxed font-semibold">
                  <span className="block font-black text-[10px] text-indigo-300 uppercase tracking-wider mb-1">
                    {category}
                  </span>
                  <span className="block font-black text-xs text-white mb-1">
                    {isEn ? matchedTerm.termEn : matchedTerm.termAr}
                  </span>
                  <span className="block text-slate-200 font-medium text-[11px] leading-relaxed">
                    {def}
                  </span>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></span>
                </span>
              </span>
            );
          }
          return part;
        })}
      </Fragment>
    );
  };

  const handleDownloadPDF = () => {
    if (!currentSolution) return;

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const title = currentSolution.prompt;
      const content = currentSolution.solution;
      const timestamp = currentSolution.timestamp;

      doc.setFont("helvetica", "normal");
      
      // Title Block Banner
      doc.setFillColor(30, 41, 59); // Premium Slate/Obsidian Banner
      doc.rect(0, 0, 210, 32, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text(lang === "en" ? "Dr. Tamer Madbouly - Smart Chemistry Platform" : "منصة د. تامر مدبولي - التفسير والحل الكيميائي الذكي", 15, 12);
      
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text(`${lang === "en" ? "Timestamp: " : "تاريخ إصدار الحل: "}${timestamp}`, 15, 22);

      // Body Content
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.setFontSize(11);

      let yPos = 42;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229); // Indigo Accent
      doc.text(lang === "en" ? "SUBMITTED QUESTION:" : "المسألة والطلب المقدم:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      
      yPos += 7;
      const promptLines = doc.splitTextToSize(title, 180);
      doc.text(promptLines, 15, yPos);
      yPos += (promptLines.length * 6) + 10;

      // Divider line
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.line(15, yPos, 195, yPos);
      yPos += 10;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229); // Indigo Accent
      doc.text(lang === "en" ? "DETAILED CHEMICAL EXPOSITION & SOLUTION:" : "التفسير الكيميائي التفصيلي المبرهن:", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      yPos += 8;

      // Strip markdown and mathematical symbols for premium PDF readability
      const cleanContent = content
        .replace(/\$\$/g, "")
        .replace(/\$/g, "")
        .replace(/[\#\*\_`]/g, "") 
        .replace(/\n\s*\n/g, "\n\n");
      
      const contentLines = doc.splitTextToSize(cleanContent, 180);
      
      for (const line of contentLines) {
        if (yPos > 275) {
          doc.addPage();
          yPos = 20;
        }
        
        if (line.includes("🔬") || line.includes("📝") || line.includes("🧪") || line.includes("🎯") || line.includes("💡")) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(79, 70, 229); // Indigo
          doc.text(line, 15, yPos);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(15, 23, 42);
        } else {
          doc.text(line, 15, yPos);
        }
        yPos += 6;
      }

      // Footer
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      yPos += 10;
      doc.setDrawColor(241, 245, 249);
      doc.line(15, yPos, 195, yPos);
      yPos += 6;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text(
        lang === "en" 
          ? "Generated by Dr. Tamer Madbouly AI Chemistry Consultant Engine • All Rights Reserved." 
          : "تم التوليد ذكياً عبر محرك د. تامر مدبولي للذكاء الاصطناعي والاستشارات الكيميائية والفيزيائية.", 
        15, 
        yPos
      );

      doc.save(`dr-tamer-chemistry-${currentSolution.id}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert(lang === "en" ? "Could not generate PDF. Please try again." : "فشل توليد ملف PDF. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleShareSolution = async () => {
    if (!currentSolution) return;
    
    // Clean $$ and markdown symbols for beautiful pure-text sharing
    const cleanSolution = currentSolution.solution
      .replace(/\$\$/g, "")
      .replace(/\$/g, "")
      .replace(/[\#\*\_`]/g, "");

    const textToShare = `${lang === "en" ? "Chemistry Solution" : "تفسير وحل المسألة الكيميائية"} - ${currentSolution.prompt}\n\n${cleanSolution.substring(0, 300)}...\n\n${lang === "en" ? "Shared via Dr. Tamer Madbouly Smart Chemistry Platform" : "تمت المشاركة عبر منصة د. تامر مدبولي للكيمياء الذكية"}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: lang === "en" ? "Dr. Tamer Chemistry Solution" : "حل كيميائي من د. تامر مدبولي",
          text: textToShare,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Web Share failed:", err);
      }
    } else {
      // Fallback: Construct WhatsApp Link
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${lang === "en" ? "Check out this Chemistry Solution from Dr. Tamer Madbouly platform:" : "شاهد هذا التفسير والحل الكيميائي المميز من منصة د. تامر مدبولي:"}\n\n*${currentSolution.prompt}*\n\n${cleanSolution.substring(0, 300)}...\n\n`
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const t = TRANSLATIONS[lang];
  const isRtl = lang === "ar";
  const suggestedQuestions = lang === "en" ? SUGGESTED_QUESTIONS_EN : SUGGESTED_QUESTIONS_AR;
  const loadingMessages = lang === "en" ? loadingMessagesEn : loadingMessagesAr;

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dr_tamer_chem_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentSolution(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load chemistry history:", e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newProblem: SolvedProblem) => {
    const updated = [newProblem, ...history.filter(h => h.id !== newProblem.id)].slice(0, 20); // Keep last 20
    setHistory(updated);
    setCurrentSolution(newProblem);
    try {
      localStorage.setItem("dr_tamer_chem_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save chemistry history:", e);
    }
  };

  const toggleHistoryItemBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.map(item => {
      if (item.id === id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    });
    setHistory(updated);
    try {
      localStorage.setItem("dr_tamer_chem_history", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem("dr_tamer_chem_history", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (currentSolution?.id === id) {
      setCurrentSolution(updated.length > 0 ? updated[0] : null);
    }
  };

  const [customQuizQuestions, setCustomQuizQuestions] = useState<any[] | null>(null);

  // Feature: Create Quiz from current solution
  const handleCreateQuizFromSolution = async () => {
    if (!currentSolution) return;
    
    setLoading(true);
    setLoadingStep(0);
    setActiveTab("quiz"); // Switch to quiz tab to show progress
    
    try {
      const p = `Generate 3 high-quality multiple-choice questions about these specific chemistry concepts: ${currentSolution.solution.substring(0, 500)}.
      The questions must be bilingual (English and Arabic).
      Return ONLY a raw JSON array.
      Schema: [{id:1, questionEn:"", questionAr:"", optionsEn:["","","",""], optionsAr:["","","",""], answerIndex:0, explanationEn:"", explanationAr:""}]`;

      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, language: lang }),
      });

      if (!response.ok) throw new Error("Failed to generate quiz");
      const data = await response.json();
      
      const cleanedText = data.solution.replace(/```json/gi, "").replace(/```/g, "").trim();
      const quizQuestions = JSON.parse(cleanedText);
      setCustomQuizQuestions(quizQuestions);
    } catch (err: any) {
      console.error("Quiz generation error:", err);
      setError(lang === "en" ? "Failed to generate quiz from this solution." : "فشل إنشاء اختبار من هذا الحل.");
      setActiveTab("ai-solver");
    } finally {
      setLoading(false);
    }
  };

  // Feature: Consult Dr. Tamer (Follow-up)
  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpPrompt.trim() || !currentSolution || isConsulting) return;

    const userMsg = followUpPrompt.trim();
    setFollowUpPrompt("");
    setIsConsulting(true);

    try {
      const fullPrompt = `The student is asking a follow-up question about a previous solution you provided.
      
      CONTEXT:
      QUESTION: ${currentSolution.prompt}
      SOLUTION: ${currentSolution.solution}
      
      STUDENT'S NEW QUESTION: ${userMsg}
      
      Please provide a clear, helpful response as Dr. Tamer Madbouly.`;

      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, language: lang }),
      });

      if (!response.ok) throw new Error("Consultation failed");
      const data = await response.json();

      const updatedSolution = {
        ...currentSolution,
        followUps: [
          ...(currentSolution.followUps || []),
          { role: "user", text: userMsg },
          { role: "assistant", text: data.solution }
        ]
      } as any;
      
      setCurrentSolution(updatedSolution);
      setHistory(history.map(h => h.id === currentSolution.id ? updatedSolution : h));
    } catch (err: any) {
      console.error("Consultation error:", err);
      alert(lang === "en" ? "Failed to get a response from Dr. Tamer." : "فشل الحصول على رد من د. تامر.");
    } finally {
      setIsConsulting(false);
    }
  };

  // Feature: Email Sharing
  const handleEmailShare = () => {
    if (!currentSolution) return;
    const cleanSolution = currentSolution.solution.replace(/[#*`]/g, "");
    const subject = encodeURIComponent(lang === "en" ? `Chemistry Solution from Dr. Tamer` : `حل كيميائي من منصة د. تامر مدبولي`);
    const body = encodeURIComponent(
      (lang === "en" ? "Problem:\n" : "المسألة:\n") + currentSolution.prompt + "\n\n" +
      (lang === "en" ? "Solution:\n" : "الحل:\n") + cleanSolution
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const clearAllHistory = () => {
    if (confirm(t.confirmClear)) {
      setHistory([]);
      setCurrentSolution(null);
      localStorage.removeItem("dr_tamer_chem_history");
    }
  };

  // Drag and Drop files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError(t.errorFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = (event.target.result as string).split(",")[1];
        setImage(base64String);
        setMimeType(file.type);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedImage = () => {
    setImage(null);
    setMimeType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Solve request trigger
  const handleSolve = async () => {
    if (!prompt && !image) {
      setError(t.errorInput);
      return;
    }

    // --- CACHING LAYER ---
    const cacheKey = (prompt?.trim() || "") + (image ? image.substring(0, 100) : "") + selectedModel;
    const cachedItem = history.find(h => ((h.prompt?.trim() || "") + (h.image ? h.image.substring(0, 100) : "") + (h.model || "gemini-2.0-flash")) === cacheKey);
    
    if (cachedItem && !image) { 
       setCurrentSolution(cachedItem);
       setPrompt("");
       return;
    }
    // ---------------------

    setLoading(true);
    setError(null);
    setLoadingStep(0);

    // Simulation steps for loading feedback
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2500);

    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          image,
          mimeType,
          topic,
          language: lang,
          model: selectedModel
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to process request.");
      }

      const data = await response.json();

      // Parse chart data if present
      let chartData = null;
      let cleanedSolution = data.solution;
      const chartMatch = data.solution.match(/\[CHART_DATA\]:\s*(\{.*\})/);
      if (chartMatch) {
        try {
          chartData = JSON.parse(chartMatch[1]);
          cleanedSolution = data.solution.replace(/\[CHART_DATA\]:\s*\{.*\}/, "").trim();
        } catch (e) {
          console.error("Failed to parse chart data", e);
        }
      }

      const newProblem: SolvedProblem = {
        id: Date.now().toString(),
        prompt: prompt || (mimeType === "application/pdf" ? (lang === "en" ? "Attached PDF Document" : "مستند PDF مرفق") : (lang === "en" ? "Illustrated Chemical Problem" : "مسألة كيميائية مصورة")),
        image: image || undefined,
        mimeType: mimeType || undefined,
        solution: cleanedSolution,
        timestamp: new Date().toLocaleTimeString(lang === "en" ? "en-US" : "ar-EG", { hour: "2-digit", minute: "2-digit" }) + " - " + new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-EG"),
        topic: topic,
        chartData,
        model: selectedModel,
        isBookmarked: false
      };

      saveToHistory(newProblem);
      
      // Clear inputs upon successful solution so they can type another
      setPrompt("");
      setImage(null);
      setMimeType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "An unexpected error occurred while contacting Dr. Tamer's server.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    );
    setHistory(updatedHistory);
    if (currentSolution && currentSolution.id === id) {
      setCurrentSolution({ ...currentSolution, isBookmarked: !currentSolution.isBookmarked });
    }
  };

  // Pre-fill suggested question and auto solve
  const selectSuggestion = (questionText: string, topicKey: string) => {
    setPrompt(questionText);
    setTopic(topicKey);
    setError(null);
    setActiveTab("ai-solver");
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300" 
      id="app-root-container"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      
      {/* Upper Navigation & Brand Banner */}
      <header className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 shadow-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-100 relative overflow-hidden shrink-0">
              <FlaskConical className="w-6 h-6 relative z-10 animate-pulse" />
              <div className="absolute inset-0 bg-linear-to-tr from-teal-800 to-emerald-600 opacity-20"></div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-850 tracking-tight flex items-center gap-2">
                {t.title}
                <span className="text-teal-700 text-xs font-black bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 hidden sm:inline-block">
                  {t.badge}
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-bold truncate max-w-[280px] sm:max-w-md">
                {t.subTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-850 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-700 transition-all shadow-2xs cursor-pointer no-print"
              title={lang === "ar" ? "تبديل المظهر" : "Toggle Theme"}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-slate-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
              )}
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-850 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-700 transition-all shadow-2xs cursor-pointer no-print ${highContrast ? "ring-2 ring-teal-500" : ""}`}
              title={lang === "ar" ? "تبديل التباين العالي" : "Toggle High Contrast"}
            >
              <Contrast className={`w-4 h-4 ${highContrast ? "text-teal-600" : "text-slate-600"}`} />
            </button>

            {/* KaTeX Toggle */}
            <button
              onClick={toggleKatex}
              className={`flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-850 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl border border-slate-200/50 dark:border-slate-700 transition-all shadow-2xs cursor-pointer no-print ${useKatex ? "ring-2 ring-teal-500" : ""}`}
              title={lang === "ar" ? "تبديل وضع الرياضيات (KaTeX)" : "Toggle Math Mode (KaTeX)"}
            >
              <Sigma className={`w-4 h-4 ${useKatex ? "text-teal-600" : "text-slate-600"}`} />
            </button>

            {/* Language Selection Switcher */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-850 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl text-xs font-black border border-slate-200/50 dark:border-slate-700 transition-all shadow-2xs cursor-pointer no-print"
            >
              <Languages className="w-4 h-4 text-teal-600" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Enhanced Mobile-Friendly Navigation Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-1 px-1 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/60 dark:border-slate-750 no-print">
              <button
                onClick={() => setActiveTab("ai-solver")}
                className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "ai-solver"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-650 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                }`}
              >
                <Atom className="w-4 h-4" />
                <span className="hidden sm:inline">{t.navSolver}</span>
              </button>
              
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-650 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">{t.navQuiz}</span>
              </button>

              <button
                onClick={() => setActiveTab("lectures")}
                className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "lectures"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-650 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                }`}
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">{t.navLectures}</span>
              </button>

              <button
                onClick={() => setActiveTab("important")}
                className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "important"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-650 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                }`}
              >
                <MessageSquareText className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">{t.navImportant}</span>
              </button>

              <button
                onClick={() => setActiveTab("periodic-table")}
                className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "periodic-table"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-650 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                }`}
              >
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">{t.navPeriodic}</span>
              </button>

              <button
                onClick={() => setActiveTab("flashcards")}
                className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "flashcards"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-650 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">{lang === "en" ? "Cards" : "البطاقات"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8 flex-grow">
        
        {/* Academic Card Intro */}
        <div className="bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
            <Atom className="w-64 h-64 text-teal-400 rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-6 h-6 text-teal-400" />
                <span className="text-teal-400 font-bold tracking-wider text-xs uppercase">{t.bannerBadge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug">
                {t.bannerTitle}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2.5 leading-relaxed font-medium">
                {t.bannerSub}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold">{t.sensorBadge}</span>
                  <span className="text-sm font-black text-slate-200">{t.badgeActive}</span>
                </div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold">{t.aiBadge}</span>
                  <span className="text-sm font-black text-slate-200">{t.badgePrecision}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection Renderer */}
        {activeTab === "ai-solver" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* SOLVER WORKSPACE: Left Panel (Qwen AI Style Integrated Form & Inputs) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150/80 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-850 flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-indigo-600 shrink-0" />
                    {t.formTitle}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/50">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Qwen-3.5 Quantum Resolve Enabled
                  </div>
                </div>

                {/* Integrated Qwen AI style Input Box Container */}
                <div className="border border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100/70 focus-within:border-indigo-400 transition-all duration-300 p-1.5 mb-6 relative shadow-xs">
                  {/* Borderless Textarea */}
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t.formPlaceholderPrompt}
                    rows={4}
                    className="w-full px-4 py-3 bg-transparent border-none outline-hidden focus:ring-0 text-slate-800 placeholder-slate-400 text-sm leading-relaxed resize-y min-h-[90px]"
                  />

                  {/* Compact File Attachment preview chip */}
                  {image && (
                    <div className="mx-3 my-2.5 flex items-center gap-3 bg-white/90 rounded-2xl border border-slate-200/80 p-2.5 shadow-2xs max-w-sm relative group animate-fade-in animate-duration-300">
                      {mimeType === "application/pdf" ? (
                        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                          <File className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl border border-slate-150 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
                          <img
                            src={`data:${mimeType || "image/jpeg"};base64,${image}`}
                            alt="Uploaded document thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-grow">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                          {mimeType === "application/pdf" ? t.pdfBadge : t.solutionImageBadge}
                        </span>
                        <span className="text-xs font-bold text-slate-700 truncate block">
                          {t.fileAttached}
                        </span>
                      </div>
                      <button
                        onClick={removeSelectedImage}
                        type="button"
                        className="w-6.5 h-6.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all hover:scale-105"
                        title={t.deleteImage}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Action Toolbar Row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2 gap-3 border-t border-slate-100 bg-white/60 rounded-b-[20px] backdrop-blur-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Hidden input element */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*, application/pdf"
                        className="hidden"
                      />

                      {/* Attachment Button */}
                      <button
                        onClick={triggerFileSelect}
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all cursor-pointer shadow-3xs hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                        title={lang === "en" ? "Attach chemical image or PDF" : "إرفاق صورة مسألة أو ملف PDF"}
                      >
                        <Upload className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === "en" ? "Attach Image / PDF" : "إرفاق صورة / PDF"}</span>
                      </button>

                      {/* Microphone Voice Dictation Button */}
                      <button
                        onClick={toggleListening}
                        type="button"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-3xs border ${
                          isListening
                            ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-500 animate-pulse"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                        }`}
                        title={isListening ? t.dictationStop : t.dictationTooltip}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>{t.dictationStop}</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{lang === "en" ? "Dictate (Voice)" : "إملاء صوتي"}</span>
                          </>
                        )}
                      </button>

                      {/* LaTeX Syntax Help Button */}
                      <button
                        onClick={() => setShowLatexHelp(true)}
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-3xs border"
                        title={lang === "en" ? "LaTeX Syntax Guide" : "دليل رموز LaTeX"}
                      >
                        <Sigma className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === "en" ? "LaTeX Syntax" : "رموز LaTeX"}</span>
                      </button>

                      {/* Model Selector Toggle */}
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 shadow-3xs">
                        <button
                          onClick={() => setSelectedModel("gemini-2.0-flash")}
                          type="button"
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            selectedModel === "gemini-2.0-flash" 
                              ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-xs ring-1 ring-slate-200/50" 
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Flash 2.0</span>
                        </button>
                        <button
                          onClick={() => setSelectedModel("gemini-1.5-pro")}
                          type="button"
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            selectedModel === "gemini-1.5-pro" 
                              ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-xs ring-1 ring-slate-200/50" 
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          }`}
                        >
                          <Cpu className="w-3 h-3" />
                          <span>Pro 1.5</span>
                        </button>
                      </div>

                      {/* Topic Selector */}
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="px-2.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 font-black focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-3xs"
                      >
                        <option value="general">{t.topicGeneral}</option>
                        <option value="organic">{t.topicOrganic}</option>
                        <option value="stoichiometry">{t.topicStoichiometry}</option>
                        <option value="thermo">{t.topicThermo}</option>
                        <option value="analytical">{t.topicAnalytical}</option>
                      </select>
                    </div>

                    {/* Solve Submit Button */}
                    <button
                      onClick={handleSolve}
                      disabled={loading}
                      type="button"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100 hover:shadow-lg cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{t.btnSolving}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{t.btnSolve}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Box */}
                {error && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 text-rose-800 text-sm mb-4 font-bold">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span>{t.alertTitle}</span>
                      <p className="text-xs text-rose-700 mt-1 font-semibold">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Suggestions Helper Section based on Category/Topic */}
              <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 sm:p-8 border border-slate-150/85 dark:border-slate-800 shadow-lg mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {lang === "en" ? `Suggested Chemistry Problems: ${t[`topic${topic.charAt(0).toUpperCase() + topic.slice(1)}`] || topic}` : `مسائل وتطبيقات كيميائية مقترحة: ${t[`topic${topic.charAt(0).toUpperCase() + topic.slice(1)}`] || topic}`}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {((lang === "en" ? SUGGESTED_QUESTIONS_MAP_EN[topic] : SUGGESTED_QUESTIONS_MAP_AR[topic]) || []).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(question.text, topic)}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-900 dark:hover:bg-indigo-950/40 border border-slate-150 hover:border-indigo-200 dark:border-slate-800 dark:hover:border-indigo-900 text-right transition-all duration-350 cursor-pointer flex flex-col justify-between h-full group hover:scale-[1.02] hover:shadow-xs"
                      style={{ direction: isRtl ? "rtl" : "ltr" }}
                    >
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest block mb-2">
                        {question.topic}
                      </span>
                      <p className="text-xs font-semibold text-slate-650 dark:text-slate-300 leading-relaxed line-clamp-3 group-hover:text-indigo-950 dark:group-hover:text-white">
                        {question.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* RESOLVED SOLUTION BOARD */}
              {currentSolution && !loading && (
                  <div 
                    className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl overflow-hidden mt-6 transition-all duration-500 printable-card" 
                    id="printable-solution-board"
                  >
                    {/* Professional Printable Header (Print Only) */}
                    <div className="print-only mb-8 border-b-4 border-slate-900 pb-6 text-center">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-right">
                          <h2 className="text-2xl font-black text-slate-900">د. تامر مدبولي</h2>
                          <p className="text-sm font-bold text-slate-600">منصة الحلول الكيميائية الذكية</p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                           <FlaskConical className="w-10 h-10" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-black text-slate-900">Dr. Tamer Madbouly</h2>
                          <p className="text-sm font-bold text-slate-600">Smart Chemistry Solutions</p>
                        </div>
                      </div>
                      <div className="bg-slate-100 py-2 rounded-lg">
                        <h1 className="text-xl font-black uppercase tracking-widest text-slate-800">Chemistry Lab Report / تقرير معمل الكيمياء</h1>
                      </div>
                    </div>

                    {/* Title of active item with elegant Slate-Indigo theme */}
                  <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                        <FlaskConical className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm sm:text-base">{t.solutionTitle}</h4>
                        <span className="text-[11px] text-slate-300 block font-bold mt-0.5">{currentSolution.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 no-print">
                      {currentSolution.mimeType === "application/pdf" ? (
                        <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold">
                          <File className="w-3.5 h-3.5" /> {lang === "en" ? "PDF Document" : "مستند PDF"}
                        </span>
                      ) : currentSolution.image ? (
                        <span className="bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" /> {t.solutionImageBadge}
                        </span>
                      ) : null}

                      {/* Print & PDF Export Button (Browser handled for perfect Arabic support) */}
                      <button
                        onClick={() => window.print()}
                        type="button"
                        className="bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs py-2 px-4 rounded-xl transition-all shadow-lg flex items-center gap-1.5 font-black cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{lang === "en" ? "Print / Save PDF" : "طباعة / حفظ PDF"}</span>
                      </button>

                      {/* Share via Email */}
                      <button
                        onClick={handleEmailShare}
                        type="button"
                        className="bg-white hover:bg-slate-50 text-slate-900 text-xs py-2 px-3.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-black cursor-pointer border border-slate-200"
                      >
                        <Mail className="w-3.5 h-3.5 text-teal-600" />
                        <span>{lang === "en" ? "Email" : "بريد"}</span>
                      </button>

                      {/* Create Quiz from this */}
                      <button
                        onClick={handleCreateQuizFromSolution}
                        type="button"
                        className="bg-white hover:bg-slate-50 text-slate-900 text-xs py-2 px-3.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-black cursor-pointer border border-slate-200"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                        <span>{lang === "en" ? "Quiz Me" : "اختبرني"}</span>
                      </button>

                      {/* Share Solution Button */}
                      <button
                        onClick={handleShareSolution}
                        type="button"
                        className="bg-white hover:bg-slate-50 text-slate-900 text-xs py-2 px-3.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-black cursor-pointer border border-slate-200"
                      >
                        <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === "en" ? "Share" : "مشاركة"}</span>
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(currentSolution.id)}
                        type="button"
                        className={`text-xs py-2 px-3.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-black cursor-pointer border ${
                          currentSolution.isBookmarked 
                            ? "bg-amber-50 border-amber-200 text-amber-600" 
                            : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${currentSolution.isBookmarked ? "fill-amber-500" : ""}`} />
                        <span>{lang === "en" ? "Favorite" : "تفضيل"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* Prompt reference */}
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-6">
                      <span className="text-xs text-slate-400 block font-black uppercase tracking-wider mb-1.5">
                        {t.solutionPromptLabel}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base font-bold leading-relaxed">{currentSolution.prompt}</p>
                      {currentSolution.image && (
                        <div className="mt-4 flex justify-start">
                          {currentSolution.mimeType === "application/pdf" ? (
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold text-slate-650 dark:text-slate-350">
                              <File className="w-5 h-5 text-rose-600" />
                              <span>{lang === "en" ? "Attached PDF Document reference" : "مرجع مستند PDF المرفق"}</span>
                            </div>
                          ) : (
                            <img
                              src={`data:image/jpeg;base64,${currentSolution.image}`}
                              alt="Problem reference"
                              className="max-h-36 rounded-xl border border-slate-200 dark:border-slate-700 object-contain shadow-xs bg-white p-1"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Markdown Typewriter Renderer formatted beautifully with tailored classes */}
                    <div className="markdown-content text-slate-800 dark:text-slate-100 leading-relaxed text-sm">
                      <TypewriterMarkdown
                        content={currentSolution.solution}
                        lang={lang}
                        highlightGlossaryTerms={highlightGlossaryTerms}
                        useKatex={useKatex}
                      />
                    </div>

                    {/* Dynamic Chart Rendering */}
                    {currentSolution.chartData && (
                      <div className="mt-8">
                        <ChemistryChart chartData={currentSolution.chartData} lang={lang} />
                      </div>
                    )}

                    {/* Follow-up Chat History */}
                    {currentSolution.followUps && currentSolution.followUps.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                        <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-teal-600" />
                          {lang === "en" ? "Discussion with Dr. Tamer" : "نقاش مع د. تامر"}
                        </h4>
                        {currentSolution.followUps.map((msg: any, idx: number) => (
                          <div 
                            key={idx} 
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <div className={`max-w-[90%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                              msg.role === 'user' 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800 rounded-br-none' 
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                            }`}>
                              <TypewriterMarkdown 
                                content={msg.text} 
                                lang={lang} 
                                highlightGlossaryTerms={highlightGlossaryTerms}
                                useKatex={useKatex}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Consult Dr. Tamer Follow-up Input */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 no-print">
                      <form onSubmit={handleFollowUp} className="relative">
                        <input
                          type="text"
                          value={followUpPrompt}
                          onChange={(e) => setFollowUpPrompt(e.target.value)}
                          placeholder={lang === "en" ? "Ask a follow-up question to Dr. Tamer..." : "اسأل د. تامر سؤالاً توضيحياً..."}
                          disabled={isConsulting}
                          className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-teal-500 outline-hidden transition-all text-sm font-bold disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          disabled={!followUpPrompt.trim() || isConsulting}
                          className="absolute right-2 top-2 bottom-2 px-4 bg-teal-600 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center"
                        >
                          {isConsulting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </form>
                      <p className="text-[10px] text-slate-400 mt-2 px-2 font-bold flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        {lang === "en" ? "Need more clarification? Ask Dr. Tamer directly above." : "هل تحتاج لمزيد من التوضيح؟ اسأل د. تامر مباشرة أعلاه."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Molecular Geometry Visualizer Tool */}
              <MolecularGeometryVisualizer
                promptText={currentSolution ? currentSolution.prompt : prompt}
                lang={lang}
              />
            </div>

            {/* HISTORY BOARD: Right Panel */}
            <div className="space-y-6">
              
              {/* Profile Card of Dr Tamer */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-r from-teal-600 to-cyan-600 opacity-10"></div>
                
                {/* Visual Avatar representation */}
                <div className="w-24 h-24 rounded-full border-4 border-white bg-linear-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-teal-100 mt-6 relative overflow-hidden shrink-0">
                  {lang === "ar" ? "ت.م" : "T.M"}
                  <div className="absolute inset-0 bg-linear-to-tr from-teal-800 to-cyan-600 opacity-20"></div>
                </div>

                <h4 className="text-lg font-black text-slate-850 mt-4">{t.profileTitle}</h4>
                <span className="text-[11px] font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 mt-1.5">
                  {t.profileRole}
                </span>
                
                <p className="text-xs text-slate-500 mt-4 leading-relaxed font-bold">
                  {t.profileBio}
                </p>

                <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-slate-100">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t.profileLectures}</span>
                    <span className="font-black text-xs text-slate-700">{t.profileLecturesVal}</span>
                  </div>
                  <div className="text-center border-r border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{t.profileLevel}</span>
                    <span className="font-black text-xs text-slate-700">{t.profileLevelVal}</span>
                  </div>
                </div>
              </div>

              {/* Solved Problems Log Drawer */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <History className="w-4 h-4 text-teal-600" />
                      {t.historyTitle} ({history.length})
                    </h3>
                    <button
                      onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                      className={`p-1.5 rounded-lg transition-all ${
                        showOnlyFavorites 
                          ? "bg-amber-100 text-amber-600 shadow-3xs" 
                          : "text-slate-300 hover:text-slate-500"
                      }`}
                      title={lang === "en" ? "Show Favorites" : "عرض المفضلة فقط"}
                    >
                      <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? "fill-amber-500" : ""}`} />
                    </button>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={clearAllHistory}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold transition-colors"
                    >
                      {t.historyClear}
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {history
                      .filter(item => !showOnlyFavorites || item.isBookmarked)
                      .map((item) => {
                      const isActive = currentSolution?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setCurrentSolution(item);
                            setActiveTab("ai-solver");
                          }}
                          className={`p-3.5 rounded-2xl border text-right transition-all duration-300 cursor-pointer flex justify-between items-center gap-2 ${
                            isActive
                              ? "bg-teal-50 border-teal-200 ring-1 ring-teal-200"
                              : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                          }`}
                          style={{ direction: isRtl ? "rtl" : "ltr" }}
                        >
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400 block font-bold">{item.timestamp}</span>
                              {item.isBookmarked && <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />}
                            </div>
                            <p className="text-xs font-bold text-slate-700 truncate mt-1">
                              {item.prompt}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.chartData && (
                              <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-indigo-400" title="Contains chart">
                                <BarChart4 className="w-3 h-3" />
                              </span>
                            )}
                            {item.image && (
                              <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400" title="Contains image">
                                <ImageIcon className="w-3 h-3" />
                              </span>
                            )}
                            <button
                              onClick={(e) => deleteHistoryItem(item.id, e)}
                              className="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {history.filter(item => !showOnlyFavorites || item.isBookmarked).length === 0 && showOnlyFavorites && (
                      <div className="text-center py-10">
                        <Star className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-[10px] text-slate-400 font-bold">{lang === "en" ? "No favorites found" : "لا توجد عناصر مفضلة"}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-center">
                    <FlaskConical className="w-10 h-10 text-slate-300 stroke-1 mb-2" />
                    <p className="text-xs font-bold">{t.historyEmpty}</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] font-semibold">{t.historyEmptySub}</p>
                  </div>
                )}
              </div>

              {/* Scientific Tips Box */}
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 border border-teal-850 shadow-lg text-white relative overflow-hidden">
                <div className="absolute -bottom-6 -left-6 opacity-5 pointer-events-none">
                  <Atom className="w-24 h-24 text-white" />
                </div>
                <h4 className="font-black text-sm text-teal-400 flex items-center gap-1.5 mb-3">
                  <GraduationCap className="w-5 h-5 text-teal-400" />
                  {t.quoteTitle}
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-bold italic">
                  {t.quoteText}
                </p>
              </div>

            </div>

          </div>
        ) : activeTab === "periodic-table" ? (
          <div className="space-y-6">
            <PeriodicTable lang={lang} />
          </div>
        ) : activeTab === "molar-calc" ? (
          <div className="space-y-6">
            <MoleCalculator lang={lang} />
          </div>
        ) : activeTab === "pronunciation" ? (
          <div className="space-y-6">
            <PronunciationSection lang={lang} />
          </div>
        ) : activeTab === "flashcards" ? (
          <div className="space-y-6">
            <FlashcardsSection lang={lang} />
          </div>
        ) : activeTab === "study-planner" ? (
          <div className="space-y-6">
            <StudyPlanner lang={lang} />
          </div>
        ) : activeTab === "exam-generator" ? (
          <div className="space-y-6">
            <ExamGeneratorSection lang={lang} />
          </div>
        ) : activeTab === "lectures" ? (
          <div className="space-y-6">
            <LecturesSection lang={lang} />
          </div>
        ) : activeTab === "important" ? (
          <div className="space-y-6">
            <ImportantQuestionsSection lang={lang} />
          </div>
        ) : activeTab === "about" ? (
          <div className="space-y-6">
            <AboutSection lang={lang} />
          </div>
        ) : (
          <div className="space-y-6">
            <QuizSection 
              lang={lang} 
              topic={topic} 
              customQuestions={customQuizQuestions} 
              onResetCustom={() => setCustomQuizQuestions(null)}
            />
          </div>
        )}

      </main>

      <LatexHelpModal 
        isOpen={showLatexHelp}
        onClose={() => setShowLatexHelp(false)}
        lang={lang}
      />

      {/* Modern High-End Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-10 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white text-[11px] font-black shadow-md shrink-0">
              {lang === "ar" ? "ت.م" : "T.M"}
            </div>
            <span className="font-black text-slate-200 text-sm">{t.footerTitle}</span>
          </div>
          <div className="font-bold text-slate-500">
            {t.footerCopy.replace("{year}", new Date().getFullYear().toString())}
          </div>
          <div className="flex gap-4 font-black">
            <button onClick={() => setActiveTab("ai-solver")} className="hover:text-white transition-colors cursor-pointer">{t.navSolver}</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setActiveTab("periodic-table")} className="hover:text-white transition-colors cursor-pointer">{t.navPeriodic}</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setActiveTab("molar-calc")} className="hover:text-white transition-colors cursor-pointer">{t.navMolar}</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setActiveTab("pronunciation")} className="hover:text-white transition-colors cursor-pointer">{t.navPronounce}</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setActiveTab("quiz")} className="hover:text-white transition-colors cursor-pointer">{t.navQuiz}</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
