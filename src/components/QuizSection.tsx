import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Award, RefreshCw, AlertCircle, HelpCircle, ArrowRight, Sparkles, Loader2, BarChart2, Trash2, Download, History } from "lucide-react";
import LearningInsights from "./LearningInsights";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  id: number;
  questionEn: string;
  questionAr: string;
  optionsEn: string[];
  optionsAr: string[];
  answerIndex: number;
  explanationEn: string;
  explanationAr: string;
}

interface QuizSectionProps {
  lang: "ar" | "en";
  topic: string; // general, organic, stoichiometry, thermo, analytical
  customQuestions?: Question[] | null;
  onResetCustom?: () => void;
  selectedModel?: string;
}

// Complete pre-configured bilingual chemistry quiz questions bank (5 per topic)
const QUIZ_BANK: Record<string, Question[]> = {
  general: [
    {
      id: 1,
      questionEn: "What is the principal quantum number (n) of the first electron shell?",
      questionAr: "ما هو عدد الكم الرئيسي (n) لغلاف الإلكترونات الأول؟",
      optionsEn: ["n = 0", "n = 1", "n = 2", "n = 3"],
      optionsAr: ["n = 0", "n = 1", "n = 2", "n = 3"],
      answerIndex: 1,
      explanationEn: "The principal quantum number (n) starts at 1 for the innermost energy level (K shell).",
      explanationAr: "يبدأ عدد الكم الرئيسي (n) من القيمة 1 لأقرب مستويات الطاقة إلى النواة (الغلاف K)."
    },
    {
      id: 2,
      questionEn: "Which type of chemical bond involves the sharing of electron pairs between atoms?",
      questionAr: "أي نوع من الروابط الكيميائية يتضمن مشاركة أزواج الإلكترونات بين الذرات؟",
      optionsEn: ["Ionic Bond", "Covalent Bond", "Hydrogen Bond", "Metallic Bond"],
      optionsAr: ["رابطة أيونية", "رابطة تساهمية", "رابطة هيدروجينية", "رابطة فلزية"],
      answerIndex: 1,
      explanationEn: "Covalent bonds are formed when two atoms share electrons to achieve stable electronic configurations.",
      explanationAr: "تتشكل الروابط التساهمية عندما تتشارك ذرتان الإلكترونات للوصول إلى توزيع إلكتروني مستقر."
    },
    {
      id: 3,
      questionEn: "What is the pH of a neutral aqueous solution at 25°C?",
      questionAr: "ما هو الأس الهيدروجيني (pH) لمحلول مائي متعادل عند درجة حرارة 25 مئوية؟",
      optionsEn: ["0", "1", "7", "14"],
      optionsAr: ["0", "1", "7", "14"],
      answerIndex: 2,
      explanationEn: "A neutral solution has equal concentrations of hydrogen ions and hydroxide ions, resulting in a pH of 7.",
      explanationAr: "يحتوي المحلول المتعادل على تركيزات متساوية من أيونات الهيدروجين وأيونات الهيدروكسيد، مما يؤدي إلى pH يساوي 7."
    },
    {
      id: 4,
      questionEn: "According to Dalton's atomic theory, atoms are...",
      questionAr: "وفقًا لنظرية دالتون الذرية، فإن الذرات هي...",
      optionsEn: ["Divisible and complex", "Indivisible and indestructible", "Formed by nuclear fusion", "Composed of quarks"],
      optionsAr: ["قابلة للانقسام ومعقدة", "غير قابلة للانقسام ولا تفنى كيميائياً", "تتشكل بالاندماج النووي", "تتكون من الكواركات"],
      answerIndex: 1,
      explanationEn: "Dalton proposed that elements consist of indivisible, tiny particles called atoms.",
      explanationAr: "اقترح دالتون أن العناصر تتكون من جسيمات صغيرة غير قابلة للانقسام تسمى ذرات."
    },
    {
      id: 5,
      questionEn: "Which subatomic particle carries a negative electric charge?",
      questionAr: "أي من الجسيمات دون الذرية يحمل شحنة كهربائية سالبة؟",
      optionsEn: ["Proton", "Neutron", "Electron", "Positron"],
      optionsAr: ["البروتون", "النيوترون", "الإلكترون", "البوزيترون"],
      answerIndex: 2,
      explanationEn: "Electrons carry a negative charge (-1), protons carry a positive charge (+1), and neutrons are neutral.",
      explanationAr: "تحمل الإلكترونات شحنة سالبة (-1)، والبروتونات شحنة موجبة (+1)، بينما النيوترونات متعادلة الشحنة."
    }
  ],
  organic: [
    {
      id: 1,
      questionEn: "What is the IUPAC name for CH3-CH2-OH?",
      questionAr: "ما هو الاسم النظامي (IUPAC) للمركب CH3-CH2-OH؟",
      optionsEn: ["Methanol", "Ethanol", "Propanol", "Acetic acid"],
      optionsAr: ["ميثانول", "إيثانول", "بروبانول", "حمض الأسيتيك"],
      answerIndex: 1,
      explanationEn: "The molecule contains two carbons and an alcohol (-OH) functional group, making it ethanol.",
      explanationAr: "يحتوي الجزيء على ذرتي كربون ومجموعة الهيدروكسيل (-OH) الكحولية، وهو ما يطابق الإيثانول."
    },
    {
      id: 2,
      questionEn: "What is the hybridization state of carbon atoms in benzene?",
      questionAr: "ما هي حالة التهجين لذرات الكربون في جزيء البنزين الحلقي؟",
      optionsEn: ["sp", "sp2", "sp3", "dsp2"],
      optionsAr: ["sp", "sp2", "sp3", "dsp2"],
      answerIndex: 1,
      explanationEn: "Each carbon atom in benzene is bonded to three other atoms (two carbons and one hydrogen) with no lone pairs, so it is sp2 hybridized.",
      explanationAr: "ترتبط كل ذرة كربون في البنزين بثلاث ذرات أخرى (ذرتي كربون وهيدروجين) دون وجود أزواج حرة، لذا فإن تهجينها هو sp2."
    },
    {
      id: 3,
      questionEn: "Which of the following is a primary functional group of carboxylic acids?",
      questionAr: "أي مما يلي هو المجموعة الوظيفية الأساسية للأحماض الكربوكسيلية؟",
      optionsEn: ["-CHO", "-CO-", "-COOH", "-COO-"],
      optionsAr: ["-CHO (ألديهيد)", "-CO- (كيتون)", "-COOH (كربوكسيل)", "-COO- (إستر)"],
      answerIndex: 2,
      explanationEn: "Carboxylic acids are characterized by the carboxyl functional group (-COOH).",
      explanationAr: "تتميز الأحماض الكربوكسيلية بوجود مجموعة الكربوكسيل (-COOH)."
    },
    {
      id: 4,
      questionEn: "Alkene molecules are characterized by having...",
      questionAr: "تتميز جزيئات الألكينات باحتوائها على...",
      optionsEn: ["Single carbon-carbon bonds only", "At least one double carbon-carbon bond", "At least one triple carbon-carbon bond", "A cyclic aromatic ring"],
      optionsAr: ["روابط كربون-كربون أحادية فقط", "رابطة ثنائية واحدة على الأقل بين ذرتي كربون", "رابطة ثلاثية واحدة على الأقل بين ذرتي كربون", "حلقة أروماتية عطرية"],
      answerIndex: 1,
      explanationEn: "Alkenes are unsaturated hydrocarbons that contain at least one carbon-carbon double bond (C=C).",
      explanationAr: "الألكينات هي هيدروكربونات غير مشبعة تحتوي على رابطة ثنائية واحدة على الأقل بين ذرتي كربون (C=C)."
    },
    {
      id: 5,
      questionEn: "Which reaction mechanism is characteristic of saturated alkanes undergoing reaction with halogens in sunlight?",
      questionAr: "ما هي آلية التفاعل المميزة للألكانات المشبعة عند تفاعلها مع الهالوجينات في ضوء الشمس؟",
      optionsEn: ["Electrophilic Addition", "Nucleophilic Substitution", "Free Radical Substitution", "Elimination"],
      optionsAr: ["إضافة إلكتروفيلية", "استبدال نيوكليوفيلي", "استبدال بالجذور الحرة", "انتزاع / حذف"],
      answerIndex: 2,
      explanationEn: "Alkanes undergo free radical substitution when reacting with halogens (like chlorine) under ultraviolet light or sunlight.",
      explanationAr: "تخضع الألكانات لتفاعلات استبدال بالجذور الحرة عند تفاعلها مع الهالوجينات في وجود الأشعة فوق البنفسجية أو ضوء الشمس."
    }
  ],
  stoichiometry: [
    {
      id: 1,
      questionEn: "How many particles are contained in exactly one mole of any substance?",
      questionAr: "كم عدد الجسيمات الموجودة في مول واحد بالضبط من أي مادة؟",
      optionsEn: ["1.00 x 10^23", "6.022 x 10^23", "3.00 x 10^8", "9.81 x 10^2"],
      optionsAr: ["1.00 x 10^23", "6.022 x 10^23 (عدد أفوغادرو)", "3.00 x 10^8", "9.81 x 10^2"],
      answerIndex: 1,
      explanationEn: "One mole of any substance contains exactly Avogadro's number of particles, which is approximately 6.022 x 10^23.",
      explanationAr: "يحتوي المول الواحد من أي مادة على عدد أفوغادرو من الجسيمات، وهو ما يقرب من 6.022 × 10^23 جسيم."
    },
    {
      id: 2,
      questionEn: "What volume does one mole of an ideal gas occupy at STP (Standard Temperature and Pressure)?",
      questionAr: "ما الحجم الذي يشغله مول واحد من الغاز المثالي في الظروف القياسية (STP)؟",
      optionsEn: ["1.0 Liter", "22.4 Liters", "44.8 Liters", "24.0 Liters"],
      optionsAr: ["1.0 لتر", "22.4 لتر", "44.8 لتر", "24.0 لتر"],
      answerIndex: 1,
      explanationEn: "At STP (0°C and 1 atm), one mole of any ideal gas occupies a molar volume of 22.4 liters.",
      explanationAr: "في الظروف القياسية من الضغط ودرجة الحرارة (STP)، يشغل مول واحد من الغاز المثالي حجماً مقداره 22.4 لتر."
    },
    {
      id: 3,
      questionEn: "If 2 moles of H2 react completely with 1 mole of O2 to form H2O, how many moles of water are produced?",
      questionAr: "إذا تفاعل 2 مول من H2 تماماً مع 1 مول من O2 لتكوين H2O، فكم مولاً من الماء ينتج؟",
      optionsEn: ["1 mole", "2 moles", "3 moles", "4 moles"],
      optionsAr: ["1 مول", "2 مول", "3 مول", "4 مول"],
      answerIndex: 1,
      explanationEn: "The balanced equation is 2H2 + O2 -> 2H2O. Therefore, 2 moles of H2 produce exactly 2 moles of H2O.",
      explanationAr: "المعادلة الموزونة هي 2H2 + O2 -> 2H2O. وبالتالي ينتج 2 مول من الهيدروجين تفاعلاً تاماً 2 مول من الماء."
    },
    {
      id: 4,
      questionEn: "What is the molar mass of Carbon Dioxide (CO2)? (C = 12, O = 16 g/mol)",
      questionAr: "ما هي الكتلة المولية لغاز ثاني أكسيد الكربون (CO2)؟ (علماً بأن C = 12، O = 16)",
      optionsEn: ["28 g/mol", "32 g/mol", "44 g/mol", "56 g/mol"],
      optionsAr: ["28 جم/مول", "32 جم/مول", "44 جم/مول", "56 جم/مول"],
      answerIndex: 2,
      explanationEn: "Molar mass of CO2 = 12 + (16 * 2) = 44 g/mol.",
      explanationAr: "الكتلة المولية لـ CO2 = 12 + (16 * 2) = 44 جم/مول."
    },
    {
      id: 5,
      questionEn: "The reactant that is completely consumed first in a chemical reaction is called the:",
      questionAr: "المتفاعل الذي يستهلك تماماً أولاً في التفاعل الكيميائي يسمى:",
      optionsEn: ["Excess Reactant", "Catalytic Reactant", "Limiting Reactant", "Theoretical Yield"],
      optionsAr: ["المادة الزائدة", "المادة الحافزة", "المادة المحددة للتفاعل", "الناتج النظري"],
      answerIndex: 2,
      explanationEn: "The limiting reactant is fully consumed first, which halts the reaction and determines the maximum product yield.",
      explanationAr: "المادة المحددة للتفاعل هي التي تستهلك بالكامل أولاً، وتتسبب في توقف التفاعل وتحدد كمية الناتج القصوى."
    }
  ],
  thermo: [
    {
      id: 1,
      questionEn: "Which thermodynamic quantity represents the total heat content of a system at constant pressure?",
      questionAr: "أي كمية ديناميكية حرارية تمثل المحتوى الحراري الإجمالي للنظام عند ضغط ثابت؟",
      optionsEn: ["Entropy (S)", "Gibbs Free Energy (G)", "Enthalpy (H)", "Internal Energy (U)"],
      optionsAr: ["الإنتروبيا (العشوائية S)", "طاقة جيبس الحرة (G)", "المحتوى الحراري (الإنثالبي H)", "الطاقة الداخلية (U)"],
      answerIndex: 2,
      explanationEn: "Enthalpy (H) is defined as the thermal energy content of a thermodynamic system at constant pressure.",
      explanationAr: "الإنثالبي أو المحتوى الحراري (H) هو مقياس لمجموع الطاقة الحرارية في النظام عند ضغط ثابت."
    },
    {
      id: 2,
      questionEn: "If delta H (ΔH) of a chemical reaction is negative, the reaction is:",
      questionAr: "إذا كانت قيمة التغير في المحتوى الحراري (ΔH) لتفاعل كيميائي سالبة، فإن التفاعل يكون:",
      optionsEn: ["Endothermic", "Exothermic", "Isothermal", "Reversible Only"],
      optionsAr: ["ماص للحرارة", "طارد للحرارة", "متساوي الحرارة", "عكسي فقط"],
      answerIndex: 1,
      explanationEn: "A negative ΔH means heat is released to the surroundings, which characterizes an exothermic process.",
      explanationAr: "تعني القيمة السالبة لـ ΔH أن التفاعل يطلق طاقة حرارية إلى الوسط المحيط، وهو ما يسمى تفاعلاً طارداً للحرارة."
    },
    {
      id: 3,
      questionEn: "Which law states that energy cannot be created or destroyed, only transformed?",
      questionAr: "أي قانون ينص على أن الطاقة لا تفنى ولا تستحدث من العدم، بل تتحول من شكل لآخر؟",
      optionsEn: ["Zeroth Law of Thermodynamics", "First Law of Thermodynamics", "Second Law of Thermodynamics", "Third Law of Thermodynamics"],
      optionsAr: ["القانون الصفر للديناميكا الحرارية", "القانون الأول للديناميكا الحرارية", "القانون الثاني للديناميكا الحرارية", "القانون الثالث للديناميكا الحرارية"],
      answerIndex: 1,
      explanationEn: "The First Law of Thermodynamics is the law of conservation of energy applied to thermal systems.",
      explanationAr: "القانون الأول للديناميكا الحرارية هو تطبيق لقانون حفظ الطاقة في الأنظمة الحرارية."
    },
    {
      id: 4,
      questionEn: "A process is always spontaneous at all temperatures if:",
      questionAr: "يكون التفاعل تلقائياً دائماً عند جميع درجات الحرارة إذا كان:",
      optionsEn: ["ΔH is positive, ΔS is negative", "ΔH is negative, ΔS is positive", "Both ΔH and ΔS are positive", "Both ΔH and ΔS are negative"],
      optionsAr: ["ΔH موجب، ΔS سالب", "ΔH سالب، ΔS موجب", "كلاهما ΔH و ΔS موجب", "كلاهما ΔH و ΔS سالب"],
      answerIndex: 1,
      explanationEn: "According to ΔG = ΔH - TΔS, a negative ΔH and a positive ΔS guarantee a negative ΔG (spontaneous) regardless of temperature.",
      explanationAr: "وفقاً لعلاقة جيبس ΔG = ΔH - TΔS، فإن ΔH سالبة و ΔS موجبة تضمن دائماً قيمة سالبة لـ ΔG (تلقائي) عند أي درجة حرارة."
    },
    {
      id: 5,
      questionEn: "Entropy (S) is a measure of a system's...",
      questionAr: "تعتبر الإنتروبيا (S) مقياساً لـ...",
      optionsEn: ["Total heat content", "Stored chemical potential", "Disorder or molecular randomness", "Activation barrier"],
      optionsAr: ["المحتوى الحراري الكلي", "الطاقة الكيميائية الكامنة", "العشوائية أو الفوضى الجزيئية", "طاقة التنشيط"],
      answerIndex: 2,
      explanationEn: "Entropy is a state function that measures the degree of disorder, randomness, or microstates in a physical system.",
      explanationAr: "الإنتروبيا هي دالة حالة تقيس درجة الفوضى أو العشوائية وتوزع الطاقة في النظام الكيميائي."
    }
  ],
  analytical: [
    {
      id: 1,
      questionEn: "Which indicator is commonly used in acid-base titrations and turns pink in basic solutions?",
      questionAr: "ما هو الكاشف الشائع استخدامه في معايرات الأحماض والقواعد والذي يتحول للون الوردي في الوسط القاعدي؟",
      optionsEn: ["Methyl Orange", "Bromothymol Blue", "Phenolphthalein", "Lithmus Paper"],
      optionsAr: ["الميثيل البرتقالي", "بروموثيمول الأزرق", "الفينول فثالين", "ورقة عباد الشمس"],
      answerIndex: 2,
      explanationEn: "Phenolphthalein is colorless in acidic and neutral solutions (pH < 8.2) but turns deep fuchsia/pink in basic environments.",
      explanationAr: "يكون الفينول فثالين عديم اللون في الوسط الحمضي والمتعادل، لكنه يتحول إلى اللون الوردي/الأرجواني في الوسط القاعدي."
    },
    {
      id: 2,
      questionEn: "What analytical technique separates mixtures based on their partition between a stationary phase and a mobile phase?",
      questionAr: "ما هي التقنية التحليلية التي تفصل مكونات خليط بناءً على توزعها بين طور ساكن وطور متحرك؟",
      optionsEn: ["Spectrophotometry", "Chromatography", "Gravimetry", "Voltammetry"],
      optionsAr: ["المطيافية الضوئية", "الكروماتوجرافيا (التفريق اللوني)", "التحليل الوزني", "الفولتامتري"],
      answerIndex: 1,
      explanationEn: "Chromatography separates chemicals in a mixture by passing the mixture in a mobile phase through a stationary phase.",
      explanationAr: "الكروماتوجرافيا (الكتابة الملونة) هي تقنية تفصل المواد بناءً على اختلاف سرعة مرورها في الطور المتحرك عبر الطور الساكن."
    },
    {
      id: 3,
      questionEn: "Beer-Lambert Law relates the light absorbance of a chemical solution directly to its:",
      questionAr: "يربط قانون بير-لامبرت امتصاص الضوء لمحلول كيميائي مباشرة بـ:",
      optionsEn: ["Temperature", "Volume", "Concentration and Path Length", "Molar Mass"],
      optionsAr: ["درجة الحرارة", "الحجم الكلي", "التركيز وطول ممر الضوء (العرض)", "الكتلة المولية"],
      answerIndex: 2,
      explanationEn: "Beer's Law states that Absorbance (A) = molar absorptivity (ε) * path length (b) * concentration (c).",
      explanationAr: "ينص قانون بير-لامبرت على أن الامتصاصية تتناسب طردياً مع تركيز المحلول وسمك الخلية التي يمر بها الضوء."
    },
    {
      id: 4,
      questionEn: "A solution with a known exact concentration used in a titration is called a:",
      questionAr: "يسمى المحلول معلوم التركيز بدقة والمستخدم في عملية المعايرة بـ:",
      optionsEn: ["Analyte", "Standard Solution", "Indicator", "Buffer Solution"],
      optionsAr: ["المادة المحللة", "المحلول القياسي", "الكاشف (المشعر)", "المحلول المنظم"],
      answerIndex: 1,
      explanationEn: "A standard solution is a highly pure solution of precisely known concentration used as a reference reactant.",
      explanationAr: "المحلول القياسي هو محلول معلوم التركيز بدقة متناهية ويستخدم كمادة مرجعية في تقدير عينات مجهولة."
    },
    {
      id: 5,
      questionEn: "Which technique is based on measuring the mass of a precipitate to determine the concentration of an analyte?",
      questionAr: "أي تقنية تعتمد على قياس كتلة الراسب المتكون لتحديد تركيز المادة المراد تحليلها؟",
      optionsEn: ["Volumetric Titration", "Gravimetric Analysis", "Potentiometry", "Conductometry"],
      optionsAr: ["المعايرة الحجمية", "التحليل الوزني (Gravimetric)", "البوتنشومتري", "الكونداكتومتري"],
      answerIndex: 1,
      explanationEn: "Gravimetric analysis involves converting the analyte into a stable solid precipitate, filtering, drying, and weighing it.",
      explanationAr: "التحليل الوزني يعتمد على ترسيب المادة المراد تقديرها كيميائياً بصورة نقية ثم ترشيحها وتجفيفها ووزنها لحساب الكتلة بدقة."
    }
  ]
};

const TAMER_TIPS: Record<string, { en: string; ar: string }> = {
  general: {
    en: "Tip: Remember the Aufbau principle for electron configuration, always fill lower energy orbitals first!",
    ar: "نصيحة: تذكر مبدأ البناء التصاعدي لتوزيع الإلكترونات، ابدأ دائماً بملء المدارات الأقل طاقة!"
  },
  organic: {
    en: "Tip: Mastering reaction mechanisms is key to understanding organic chemistry - watch those electron flows!",
    ar: "نصيحة: إتقان آليات التفاعل هو المفتاح لفهم الكيمياء العضوية - انتبه لحركة الإلكترونات!"
  },
  stoichiometry: {
    en: "Tip: Always balance the equation before doing any molar calculations. It's the most common mistake!",
    ar: "نصيحة: وازن المعادلة دائماً قبل إجراء أي حسابات مولارية. هذا هو الخطأ الأكثر شيوعاً!"
  },
  thermo: {
    en: "Tip: ΔH = H(products) - H(reactants). Watch the signs, they are crucial in thermo calculations!",
    ar: "نصيحة: التغير في المحتوى الحراري ΔH = المحتوى الحراري للنواتج - المتفاعلات. انتبه للإشارات، فهي حاسمة في الحسابات الحرارية!"
  },
  analytical: {
    en: "Tip: Titration is all about precision. Watch for the color change carefully!",
    ar: "نصيحة: المعايرة تعتمد بالكامل على الدقة. راقب تغير اللون بعناية!"
  }
};

export default function QuizSection({ lang, topic, customQuestions, onResetCustom, selectedModel }: QuizSectionProps) {
  const isEn = lang === "en";
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(() => {
    try {
      const savedQuestions = localStorage.getItem("dr_tamer_active_quiz_questions");
      if (savedQuestions) {
        return JSON.parse(savedQuestions);
      }
    } catch (e) {
      console.error(e);
    }
    const selectedTopic = QUIZ_BANK[topic] ? topic : "general";
    return QUIZ_BANK[selectedTopic];
  });
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [showHistory, setShowHistory] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const savedIndex = localStorage.getItem("dr_tamer_active_quiz_index");
      if (savedIndex) {
        return parseInt(savedIndex, 10);
      }
    } catch (e) {}
    return 0;
  });

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
    try {
      const savedAnswers = localStorage.getItem("dr_tamer_active_quiz_answers");
      if (savedAnswers) {
        return JSON.parse(savedAnswers);
      }
    } catch (e) {}
    return {};
  });

  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(() => {
    try {
      const savedSubmitted = localStorage.getItem("dr_tamer_active_quiz_submitted");
      if (savedSubmitted) {
        return JSON.parse(savedSubmitted);
      }
    } catch (e) {}
    return false;
  });

  const [showTip, setShowTip] = useState(false);

  const [aiGenerating, setAiGenerating] = useState(false);
  const [customQuizActive, setCustomQuizActive] = useState<boolean>(() => {
    try {
      const savedCustom = localStorage.getItem("dr_tamer_active_quiz_custom");
      if (savedCustom) {
        return JSON.parse(savedCustom);
      }
    } catch (e) {}
    return false;
  });

  // Support for questions passed via props
  useEffect(() => {
    if (customQuestions && customQuestions.length > 0) {
      setCurrentQuestions(customQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setCustomQuizActive(true);
    }
  }, [customQuestions]);

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem("dr_tamer_active_quiz_questions", JSON.stringify(currentQuestions));
  }, [currentQuestions]);

  useEffect(() => {
    localStorage.setItem("dr_tamer_active_quiz_index", currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    localStorage.setItem("dr_tamer_active_quiz_answers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  useEffect(() => {
    localStorage.setItem("dr_tamer_active_quiz_submitted", JSON.stringify(quizSubmitted));
  }, [quizSubmitted]);

  useEffect(() => {
    localStorage.setItem("dr_tamer_active_quiz_custom", JSON.stringify(customQuizActive));
  }, [customQuizActive]);

  // Topic changed handler: Only reset to standard if we are NOT in the middle of an active custom AI quiz
  useEffect(() => {
    if (!customQuizActive) {
      const selectedTopic = QUIZ_BANK[topic] ? topic : "general";
      setCurrentQuestions(QUIZ_BANK[selectedTopic]);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setQuizSubmitted(false);
    }
  }, [topic]);

  const [statsHistory, setStatsHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("quiz_stats_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleClearStats = () => {
    const confirmMsg = isEn 
      ? "Are you sure you want to reset all quiz progress stats?" 
      : "هل أنت متأكد من رغبتك في إعادة تعيين كافة إحصائيات التقدم والدرجات؟";
    if (window.confirm(confirmMsg)) {
      localStorage.removeItem("quiz_stats_history");
      setStatsHistory([]);
    }
  };

  const handleDownloadQuizPDF = () => {
    if (statsHistory.length === 0) return;

    try {
      const doc = new jsPDF();
      
      // Top header band (slate-900 style)
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 32, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("DR. TAMER MADBOULY SMART CHEMISTRY PLATFORM", 15, 14);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(191, 219, 254); // Light blue tint
      doc.text(isEn ? "Academic Progress Tracker - Quiz Results Report" : "لوحة متابعة التقدم الأكاديمي - تقرير نتائج التقييمات والأداء", 15, 20);
      
      const today = new Date().toLocaleDateString(isEn ? "en-US" : "ar-EG") + " " + new Date().toLocaleTimeString(isEn ? "en-US" : "ar-EG", { hour: "2-digit", minute: "2-digit" });
      doc.text(`${isEn ? "Generated on" : "تم الإنشاء في"}: ${today}`, 15, 26);

      // Section 1: Metrics
      let yPos = 45;
      doc.setTextColor(79, 70, 229); // Indigo Accent
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(isEn ? "ACADEMIC SUMMARY METRICS" : "مؤشرات التقييم العام والأداء الأكاديمي", 15, yPos);
      
      yPos += 6;
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setFillColor(248, 250, 252); // Slate 50
      doc.rect(15, yPos, 180, 22, "FD");

      doc.setTextColor(15, 23, 42); // Slate 900
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text(isEn ? "Total Quizzes Completed:" : "عدد الاختبارات المكتملة:", 20, yPos + 9);
      doc.setFont("helvetica", "normal");
      doc.text(`${statsHistory.length}`, 80, yPos + 9);

      const avgAccuracy = Math.round(statsHistory.reduce((acc, c) => acc + c.percentage, 0) / statsHistory.length);
      doc.setFont("helvetica", "bold");
      doc.text(isEn ? "Average Performance Accuracy:" : "متوسط نسبة الدقة والإجابة:", 20, yPos + 15);
      doc.setFont("helvetica", "normal");
      doc.text(`${avgAccuracy}%`, 80, yPos + 15);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text(isEn ? "Academic Status:" : "التقدير الأكاديمي:", 120, yPos + 9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      
      let statusStr = "";
      if (avgAccuracy >= 85) {
        statusStr = isEn ? "Excellent (A - Outstanding Mastery)" : "ممتاز (أ - تفوق أكاديمي)";
      } else if (avgAccuracy >= 70) {
        statusStr = isEn ? "Very Good (B - Solid Foundations)" : "جيد جداً (ب - تمكن مفاهيمي متين)";
      } else if (avgAccuracy >= 50) {
        statusStr = isEn ? "Satisfactory (C - Practice Recommended)" : "مقبول (ج - يتطلب تدريب إضافي)";
      } else {
        statusStr = isEn ? "Needs Revision (D - Review Core Glossary)" : "ضعيف (د - ينصح بمراجعة القاموس)";
      }
      doc.text(statusStr, 120, yPos + 15);

      // Section 2: Detailed Table
      yPos += 32;
      doc.setTextColor(79, 70, 229);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(isEn ? "DETAILED PERFORMANCE LOG" : "سجل نتائج الاختبارات المفصل والدرجات", 15, yPos);

      yPos += 6;
      doc.setFillColor(79, 70, 229); // Table header colored banner
      doc.rect(15, yPos, 180, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(isEn ? "Topic" : "الموضوع الكيميائي", 20, yPos + 5.5);
      doc.text(isEn ? "Score" : "الدرجة", 100, yPos + 5.5);
      doc.text(isEn ? "Accuracy" : "النسبة", 130, yPos + 5.5);
      doc.text(isEn ? "Date & Time" : "التاريخ والوقت", 155, yPos + 5.5);

      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);

      statsHistory.forEach((stat, idx) => {
        if (yPos > 265) {
          doc.addPage();
          yPos = 20;
          doc.setFillColor(79, 70, 229);
          doc.rect(15, yPos, 180, 8, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text(isEn ? "Topic" : "الموضوع الكيميائي", 20, yPos + 5.5);
          doc.text(isEn ? "Score" : "الدرجة", 100, yPos + 5.5);
          doc.text(isEn ? "Accuracy" : "النسبة", 130, yPos + 5.5);
          doc.text(isEn ? "Date & Time" : "التاريخ والوقت", 155, yPos + 5.5);
          yPos += 8;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(15, 23, 42);
        }

        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, yPos, 180, 7, "F");
        }

        doc.setFontSize(8.5);
        let topicTrans = stat.topic || "general";
        if (topicTrans === "general") topicTrans = isEn ? "General Chemistry" : "الكيمياء العامة";
        else if (topicTrans === "organic") topicTrans = isEn ? "Organic Chemistry" : "الكيمياء العضوية";
        else if (topicTrans === "stoichiometry") topicTrans = isEn ? "Stoichiometry" : "الحسابات الكيميائية";
        else if (topicTrans === "thermo") topicTrans = isEn ? "Thermochemistry" : "الكيمياء الحرارية";
        else if (topicTrans === "analytical") topicTrans = isEn ? "Analytical Chemistry" : "الكيمياء التحليلية";

        doc.text(topicTrans, 20, yPos + 4.5);
        doc.text(`${stat.correctCount} / ${stat.totalQuestions}`, 100, yPos + 4.5);
        doc.text(`${stat.percentage}%`, 130, yPos + 4.5);
        doc.text(stat.timestamp, 155, yPos + 4.5);

        yPos += 7;
      });

      // Section 3: Official Endorsement
      yPos += 14;
      if (yPos > 255) {
        doc.addPage();
        yPos = 20;
      }

      doc.setDrawColor(226, 232, 240);
      doc.line(15, yPos, 195, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(isEn ? "OFFICIAL ACADEMIC ENDORSEMENT:" : "التوجيه الأكاديمي والاعتماد المنهجي:", 15, yPos);
      
      yPos += 5.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      
      let endorsement = "";
      if (avgAccuracy >= 85) {
        endorsement = isEn 
          ? "Outstanding performance! You have displayed rigorous analytical capability and excellent comprehension of chemical core principles. Keep pushing boundaries."
          : "أداء متميز للغاية ومثير للإعجاب! لقد أظهرت قدرة تحليلية صارمة وفهماً ممتازاً للمبادئ الأساسية للكيمياء. استمر في تفوقك.";
      } else if (avgAccuracy >= 70) {
        endorsement = isEn
          ? "Strong chemistry fundamentals demonstrated. Focus on complex stoichiometry calculations and carbon organic compounds to reach absolute mastery."
          : "أساسيات كيميائية متينة وقوية. نوصي بالتركيز الإضافي على مسائل الحسابات الكيميائية وتفاعلات المركبات العضوية للوصول للدرجة النهائية.";
      } else {
        endorsement = isEn
          ? "Good baseline effort. We recommend reviewing Dr. Tamer's interactive periodic table and practicing additional quizzes to strengthen formula tracking."
          : "محاولة طيبة وبداية مبشرة. ننصحك بمراجعة جدول العناصر الكيميائية التفاعلي لـ د. تامر والتدرب مجدداً لتعزيز تمكنك من الصيغ الكيميائية.";
      }
      
      const endLines = doc.splitTextToSize(endorsement, 180);
      doc.text(endLines, 15, yPos);
      
      yPos += (endLines.length * 5) + 12;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Dr. Tamer Madbouly Smart Chemistry Platform - Evaluation Report Engine", 15, yPos);

      doc.save(`chemistry_quiz_progress_report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF Report:", err);
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCustomQuizActive(false);
    if (onResetCustom) onResetCustom();
    const selectedTopic = QUIZ_BANK[topic] ? topic : "general";
    setCurrentQuestions(QUIZ_BANK[selectedTopic]);
  };

  // Select option
  const handleSelectOption = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    const correct = currentQuestions.reduce((acc, q, idx) => {
      return selectedAnswers[idx] === q.answerIndex ? acc + 1 : acc;
    }, 0);
    const total = currentQuestions.length;
    const pct = Math.round((correct / total) * 100);

    try {
      const savedStats = localStorage.getItem("quiz_stats_history");
      const currentStats = savedStats ? JSON.parse(savedStats) : [];
      
      const detailedResults = currentQuestions.map((q, idx) => ({
        question: isEn ? q.questionEn : q.questionAr,
        userAnswer: isEn ? q.optionsEn[selectedAnswers[idx]] : q.optionsAr[selectedAnswers[idx]],
        correctAnswer: isEn ? q.optionsEn[q.answerIndex] : q.optionsAr[q.answerIndex],
        explanation: isEn ? q.explanationEn : q.explanationAr,
        isCorrect: selectedAnswers[idx] === q.answerIndex
      }));

      const newStat = {
        id: Date.now().toString(),
        topic: topic,
        correctCount: correct,
        totalQuestions: total,
        percentage: pct,
        timestamp: new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-EG") + " - " + new Date().toLocaleTimeString(lang === "en" ? "en-US" : "ar-EG", { hour: "2-digit", minute: "2-digit" }),
        results: detailedResults
      };
      const updatedStats = [newStat, ...currentStats];
      localStorage.setItem("quiz_stats_history", JSON.stringify(updatedStats));
      setStatsHistory(updatedStats);
    } catch (e) {
      console.error("Failed to save quiz results:", e);
    }

    setQuizSubmitted(true);
    setShowTip(true);
  };

  // Dynamic AI Quiz Generation using Gemini API
  const handleGenerateAIQuiz = async () => {
    setAiGenerating(true);
    try {
      const randomSeed = Math.random().toString(36).substring(7);
      const timestamp = Date.now();
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate 5 completely brand-new, fresh, and unique multiple-choice questions about the chemistry topic: ${topic} with a ${difficulty} difficulty level.
          Make sure these questions are completely different from any previous ones.
          Each question must have exactly 4 options. Mark the correct answer (0-indexed). 
          Provide detailed explanations for the correct answer.
          Your response must be a strict JSON array of objects with the exact schema:
          [{
            "id": number,
            "questionEn": "string",
            "questionAr": "string",
            "optionsEn": ["string", "string", "string", "string"],
            "optionsAr": ["string", "string", "string", "string"],
            "answerIndex": number (0 to 3),
            "explanationEn": "string",
            "explanationAr": "string"
          }]
          Random Seed: ${randomSeed}-${timestamp}.
          Return ONLY this raw JSON array and nothing else. No markdown syntax like \`\`\`json.`,
          topic: topic,
          difficulty: difficulty,
          language: lang,
          model: selectedModel || "gemini-2.0-flash",
        }),
      });

      if (!response.ok) throw new Error("Failed to contact API");
      const data = await response.json();
      
      // Clean potential $ or formatting errors
      const cleanedText = data.solution.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsedQuiz = JSON.parse(cleanedText);
      if (Array.isArray(parsedQuiz) && parsedQuiz.length === 5) {
        setCurrentQuestions(parsedQuiz);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setCustomQuizActive(true);
      } else {
        throw new Error("Invalid structure returned");
      }
    } catch (e) {
      console.error("Failed to generate AI quiz:", e);
      alert(isEn 
        ? "Failed to generate dynamic AI quiz. Reverting to standard academic quiz bank." 
        : "فشل توليد الاختبار التفاعلي الذكي. جاري تشغيل بنك الأسئلة الأكاديمي القياسي."
      );
      handleRestart();
    } finally {
      setAiGenerating(false);
    }
  };

  const currentQuestion = currentQuestions[currentIndex];
  const totalQuestions = currentQuestions.length;
  
  // Calculate score
  const correctCount = currentQuestions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.answerIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Translating UI texts
  const t = {
    title: isEn ? "Knowledge Test & Chemistry Quiz" : "اختبار المعرفة والتقييم الذاتي",
    desc: isEn 
      ? `Verify your understanding of ${topic.toUpperCase()} chemistry with standard educational boards.`
      : `اختبر معلوماتك الكيميائية في قسم ${topic === "organic" ? "الكيمياء العضوية" : topic === "stoichiometry" ? "الحسابات الكيميائية" : topic === "thermo" ? "الديناميكا الحرارية" : topic === "analytical" ? "الكيمياء التحليلية" : "الكيمياء العامة"} مع بنك الأسئلة المعتمد.`,
    score: isEn ? "Your Score" : "درجتك النهائية",
    passed: isEn ? "Excellent work! You have mastered this chemistry topic." : "عمل ممتاز! لقد أتقنت هذا الموضوع الكيميائي بنجاح.",
    failed: isEn ? "Keep practicing. Chemistry requires consistent study and equations tracking." : "استمر في المحاولة. يحتاج علم الكيمياء للمزيد من المذاكرة ومتابعة المعادلات.",
    btnRestart: isEn ? "Restart Quiz" : "إعادة الاختبار",
    btnSubmit: isEn ? "Submit Quiz" : "إنهاء وتسليم الإجابات",
    btnNext: isEn ? "Next Question" : "السؤال التالي",
    btnPrev: isEn ? "Previous Question" : "السؤال السابق",
    aiBtn: isEn ? "Generate AI Custom Quiz" : "توليد اختبار ذكي جديد بالذكاء الاصطناعي",
    aiBadge: isEn ? "AI Custom Generated" : "تم التوليد ذكياً بالكامل",
    explanation: isEn ? "Dr. Tamer's Scientific Explanation:" : "التفسير المنهجي المعتمد لـ د. تامر:",
    questionLabel: isEn ? "Question" : "السؤال",
    of: isEn ? "of" : "من أصل",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-8 border border-slate-150 dark:border-slate-800 shadow-xl" id="quiz-section-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-lg md:text-xl font-black text-slate-850 dark:text-white">{t.title}</h3>
            {customQuizActive && (
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-extrabold px-2 py-0.5 rounded border border-indigo-100/50 flex items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                {t.aiBadge}
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.desc}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
          <select 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="p-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold"
          >
            <option value="beginner">{isEn ? "Beginner" : "مبتدئ"}</option>
            <option value="intermediate">{isEn ? "Intermediate" : "متوسط"}</option>
            <option value="advanced">{isEn ? "Advanced" : "متقدم"}</option>
          </select>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl"
          >
            <History className="w-3.5 h-3.5" />
            {isEn ? "History" : "السجل"}
          </button>

          {/* Generate with AI Button */}
          <button
            onClick={handleGenerateAIQuiz}
            disabled={aiGenerating}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 rounded-xl transition-all shadow-3xs cursor-pointer disabled:opacity-50"
          >
            {aiGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.aiBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showHistory ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-850 dark:text-white">
              {isEn ? "Exam History & Insights" : "سجل الامتحانات والتحليلات"}
            </h3>
            <button 
              onClick={() => setShowHistory(false)}
              className="text-xs font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 p-2 px-4 rounded-xl text-slate-600 dark:text-slate-400"
            >
              {isEn ? "Back to Quiz" : "العودة للاختبار"}
            </button>
          </div>
          <LearningInsights stats={statsHistory} lang={lang} />
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-150 dark:border-slate-800 shadow-xl">
            <h3 className="text-xl font-black text-slate-850 dark:text-white mb-6">
              {isEn ? "Exam History" : "سجل الامتحانات"}
            </h3>
            {statsHistory.length === 0 ? (
              <p className="text-slate-500">{isEn ? "No exam history yet." : "لا يوجد سجل امتحانات بعد."}</p>
            ) : (
              <div className="space-y-4">
                {statsHistory.map((stat, idx) => (
                  <div key={idx} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{stat.topic}</p>
                        <p className="text-xs text-slate-500">{stat.timestamp}</p>
                      </div>
                      <span className="font-black text-xl text-indigo-600 dark:text-indigo-400">{stat.percentage}%</span>
                    </div>
                    
                    {stat.results && (
                      <div className="space-y-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          {isEn ? "Detailed Results" : "النتائج التفصيلية"}
                        </p>
                        {stat.results.map((res: any, rIdx: number) => (
                          <div key={rIdx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-start gap-2 mb-2">
                              {res.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                              )}
                              <p className="text-sm font-bold text-slate-800 dark:text-white">{res.question}</p>
                            </div>
                            <div className="ml-6 space-y-1">
                              <p className="text-xs">
                                <span className="font-black text-slate-400">{isEn ? "Your Answer: " : "إجابتك: "}</span>
                                <span className={res.isCorrect ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>{res.userAnswer}</span>
                              </p>
                              {!res.isCorrect && (
                                <p className="text-xs">
                                  <span className="font-black text-slate-400">{isEn ? "Correct Answer: " : "الإجابة الصحيحة: "}</span>
                                  <span className="text-emerald-600 font-bold">{res.correctAnswer}</span>
                                </p>
                              )}
                              <p className="text-xs text-slate-500 italic mt-1">{res.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Quiz Progress Dashboard */}
          <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6" id="progress-dashboard">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/10 shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
              {isEn ? "Academic Progress Tracker" : "لوحة تقدم الاختبارات"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              {isEn 
                ? "Your persistent chemistry quiz performance history" 
                : "سجل نتائجك ومستوى أدائك العام المحفوظ محلياً"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-grow md:flex-grow-0 md:w-80 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-850 p-3.5 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
              {isEn ? "Completed" : "الاختبارات المنتهية"}
            </span>
            <span className="text-lg font-black text-slate-800 dark:text-white mt-1">
              {statsHistory.length}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150/80 dark:border-slate-850 p-3.5 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold block">
              {isEn ? "Avg Accuracy" : "متوسط الدقة"}
            </span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {statsHistory.length > 0 
                ? `${Math.round(statsHistory.reduce((acc, c) => acc + c.percentage, 0) / statsHistory.length)}%`
                : "0%"}
            </span>
          </div>
        </div>

        {statsHistory.length > 0 && (
          <div className="flex flex-row sm:flex-col lg:flex-row gap-2 shrink-0 self-start md:self-center w-full sm:w-auto">
            <button
              onClick={handleDownloadQuizPDF}
              type="button"
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title={isEn ? "Download PDF Report" : "تحميل تقرير الأداء (PDF)"}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? "PDF Report" : "تقرير الأداء PDF"}</span>
            </button>
            <button
              onClick={handleClearStats}
              type="button"
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-rose-200 hover:border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-extrabold transition-all flex items-center justify-center gap-1 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer"
              title={isEn ? "Reset Stats" : "تصفير الإحصائيات"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isEn ? "Reset" : "تصفير"}</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {quizSubmitted ? (
          /* Result Score Board */
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center py-10 space-y-6"
          >
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border-4 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-black text-3xl">
              {percentage}%
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-xl font-black text-slate-800 dark:text-white">
                {t.score}: {correctCount} / {totalQuestions}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {percentage >= 60 ? t.passed : t.failed}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleRestart}
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                {t.btnRestart}
              </button>
            </div>

            {/* Tamer's Tip Section */}
            <AnimatePresence>
              {showTip && TAMER_TIPS[topic] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 shadow-sm"
                >
                  <h5 className="font-black text-indigo-800 dark:text-indigo-200 text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    {isEn ? "Dr. Tamer's Contextual Tip:" : "نصيحة د. تامر المنهجية:"}
                  </h5>
                  <p className="text-sm text-indigo-900 dark:text-indigo-100 font-bold leading-relaxed">
                    {isEn ? TAMER_TIPS[topic].en : TAMER_TIPS[topic].ar}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show review of answers */}
            <div className="text-right mt-12 space-y-6 max-w-3xl mx-auto border-t border-slate-100 dark:border-slate-800 pt-8" style={{ direction: isEn ? "ltr" : "rtl" }}>
              <h5 className="font-black text-slate-800 dark:text-white text-md mb-4 flex items-center gap-2 justify-start">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                {isEn ? "Review Exam Solutions" : "مراجعة إجابات الاختبار التفصيلية"}
              </h5>
              {currentQuestions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.answerIndex;
                return (
                  <div key={q.id} className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-right" style={{ direction: isEn ? "ltr" : "rtl" }}>
                    <div className="flex justify-between items-center gap-3 mb-3">
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-black">
                        {t.questionLabel} {idx + 1}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                          <CheckCircle className="w-4 h-4" />
                          {isEn ? "Correct Answer" : "إجابة صحيحة"}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600 font-black text-xs">
                          <XCircle className="w-4 h-4" />
                          {isEn ? "Incorrect Answer" : "إجابة خاطئة"}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-4 leading-relaxed text-right" style={{ textAlign: isEn ? "left" : "right" }}>
                      {isEn ? q.questionEn : q.questionAr}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {(isEn ? q.optionsEn : q.optionsAr).map((opt, oIdx) => {
                        const isChosen = userAns === oIdx;
                        const isCorrectOpt = q.answerIndex === oIdx;
                        let badgeStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300";
                        if (isChosen) badgeStyle = "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-400";
                        if (isCorrectOpt) badgeStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400";
                        return (
                          <div key={oIdx} className={`px-4 py-2.5 rounded-xl border text-xs font-black ${badgeStyle} text-right`} style={{ textAlign: isEn ? "left" : "right" }}>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {/* Educational Explanation */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-3.5 rounded-xl text-xs space-y-1">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 text-right justify-start">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {t.explanation}
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 font-bold text-right leading-relaxed" style={{ textAlign: isEn ? "left" : "right" }}>
                        {isEn ? q.explanationEn : q.explanationAr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Active quiz screen */
          <motion.div 
            key="active-quiz"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>
                {t.questionLabel} <span className="font-black text-slate-800 dark:text-white">{currentIndex + 1}</span> {t.of} {totalQuestions}
              </span>
              <div className="w-32 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-indigo-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Text sliding slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="space-y-4"
              >
                <p className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-relaxed text-right" style={{ direction: isEn ? "ltr" : "rtl", textAlign: isEn ? "left" : "right" }}>
                  {isEn ? currentQuestion.questionEn : currentQuestion.questionAr}
                </p>

                {/* Options selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {(isEn ? currentQuestion.optionsEn : currentQuestion.optionsAr).map((option, idx) => {
                    const isSelected = selectedAnswers[currentIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        type="button"
                        className={`px-5 py-4 rounded-2xl border text-right font-black text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 text-indigo-700 dark:text-indigo-300 scale-[1.01] shadow-sm"
                            : "bg-slate-50/40 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                        style={{ direction: isEn ? "ltr" : "rtl" }}
                      >
                        <span>{option}</span>
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-slate-350 dark:border-slate-700"
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls Bar */}
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-5 mt-6">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                type="button"
                className="px-4 py-2 text-xs font-black border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 cursor-pointer"
              >
                {t.btnPrev}
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  type="button"
                  className="px-5 py-2.5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {t.btnSubmit}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  type="button"
                  className="px-5 py-2.5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t.btnNext}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
