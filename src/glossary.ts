export interface GlossaryTerm {
  key: string;
  termAr: string;
  termEn: string;
  defAr: string;
  defEn: string;
  categoryAr: string;
  categoryEn: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    key: "molar_mass",
    termAr: "الكتلة المولية",
    termEn: "Molar Mass",
    defAr: "كتلة مول واحد من المادة الكيميائية (وتساوي مجموع الكتل الذرية للعناصر المكونة لها بالجرام لكل مول g/mol).",
    defEn: "The mass of one mole of a chemical substance, equal to the sum of the atomic masses of its constituent elements in g/mol.",
    categoryAr: "الحساب الكيميائي",
    categoryEn: "Stoichiometry"
  },
  {
    key: "stoichiometry",
    termAr: "الحساب الكيميائي",
    termEn: "Stoichiometry",
    defAr: "دراسة العلاقات الكمية بين المواد المتفاعلة والناتجة في التفاعل الكيميائي بناءً على معادلات موزونة وقوانين حفظ الكتلة.",
    defEn: "The study of quantitative relationships between reactants and products in a chemical reaction based on balanced equations.",
    categoryAr: "الكيمياء العامة",
    categoryEn: "General Chemistry"
  },
  {
    key: "covalent_bond",
    termAr: "الرابطة التساهمية",
    termEn: "Covalent Bond",
    defAr: "رابطة كيميائية قوية تنشأ بين لافلزات وتعتمد على تشارك زوج أو أكثر من الإلكترونات لتحقيق الاستقرار الإلكتروني.",
    defEn: "A chemical bond formed when two nonmetal atoms share one or more pairs of electrons to achieve a stable electronic configuration.",
    categoryAr: "الروابط الكيميائية",
    categoryEn: "Chemical Bonding"
  },
  {
    key: "catalytic_hydration",
    termAr: "الهيدرة الحفزية",
    termEn: "Catalytic Hydration",
    defAr: "تفاعل إضافة جزيء ماء إلى مركب غير مشبع (مثل الإيثين) في وجود عامل حفاز حمضي (مثل حمض الكبريتيك المخفف) لتكوين الكحول.",
    defEn: "A reaction where water is added to an unsaturated compound (like alkene) in the presence of an acid catalyst to produce an alcohol.",
    categoryAr: "الكيمياء العضوية",
    categoryEn: "Organic Chemistry"
  },
  {
    key: "combustion",
    termAr: "تفاعل الاحتراق",
    termEn: "Combustion",
    defAr: "تفاعل كيميائي سريع وطارد للحرارة يحدث بين المادة والأكسجين، وينتج عنه طاقة، وثاني أكسيد الكربون، وبخار الماء غالباً.",
    defEn: "A rapid, highly exothermic chemical reaction between a substance and oxygen, producing heat, light, carbon dioxide, and water.",
    categoryAr: "التفاعلات الكيميائية",
    categoryEn: "Chemical Reactions"
  },
  {
    key: "organic_chemistry",
    termAr: "الكيمياء العضوية",
    termEn: "Organic Chemistry",
    defAr: "فرع من علم الكيمياء يختص بدراسة بنية وخواص وتفاعلات المركبات التي تحتوي على الكربون كمكون أساسي.",
    defEn: "The branch of chemistry concerned with the structure, properties, composition, and reactions of carbon-containing compounds.",
    categoryAr: "فروع الكيمياء",
    categoryEn: "Branches of Chemistry"
  },
  {
    key: "noble_gas",
    termAr: "غاز خامل",
    termEn: "Noble Gas",
    defAr: "عناصر المجموعة 18 في الجدول الدوري، تتميز بامتلاء مستويات طاقتها الخارجية بالإلكترونات مما يجعلها غير نشطة كيميائياً.",
    defEn: "Elements belonging to Group 18 of the periodic table, characterized by fully filled outer electron shells making them chemically inert.",
    categoryAr: "الجدول الدوري",
    categoryEn: "Periodic Table"
  },
  {
    key: "redox",
    termAr: "الأكسدة والاختزال",
    termEn: "Redox",
    defAr: "تفاعلات كيميائية تشتمل على انتقال الإلكترونات؛ حيث تفقد مادة الإلكترونات (أكسدة) وتكتسب الأخرى الإلكترونات (اختزال).",
    defEn: "Chemical reactions that involve a transfer of electrons between species, consisting of oxidation (loss) and reduction (gain).",
    categoryAr: "التفاعلات الكيميائية",
    categoryEn: "Chemical Reactions"
  },
  {
    key: "exothermic",
    termAr: "طارد للحرارة",
    termEn: "Exothermic",
    defAr: "تفاعل أو تغير كيميائي يطلق طاقة حرارية إلى الوسط المحيط، مما يؤدي إلى ارتفاع درجة حرارة البيئة المجاورة.",
    defEn: "A chemical reaction or physical change that releases heat energy to its surroundings, increasing the ambient temperature.",
    categoryAr: "الكيمياء الحرارية",
    categoryEn: "Thermochemistry"
  },
  {
    key: "endothermic",
    termAr: "ماص للحرارة",
    termEn: "Endothermic",
    defAr: "تفاعل كيميائي يمتص طاقة حرارية من الوسط المحيط، مما يتسبب في انخفاض درجة حرارة البيئة المجاورة.",
    defEn: "A chemical reaction or physical change that absorbs heat energy from its surroundings, cooling the surrounding environment.",
    categoryAr: "الكيمياء الحرارية",
    categoryEn: "Thermochemistry"
  },
  {
    key: "valence_electrons",
    termAr: "إلكترونات التكافؤ",
    termEn: "Valence Electrons",
    defAr: "الإلكترونات الموجودة في الغلاف الخارجي للذرة، وهي المسؤولة عن تكوين الروابط والمشاركة في التفاعلات الكيميائية.",
    defEn: "The electrons situated in the outermost energy level of an atom, which participate directly in forming chemical bonds.",
    categoryAr: "البنية الذرية",
    categoryEn: "Atomic Structure"
  }
];
