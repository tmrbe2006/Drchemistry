import { useState } from "react";
import { ChemicalElement } from "../types";
import { Info, Sparkles, BookOpen, Search, Filter, X } from "lucide-react";
import { GLOSSARY_TERMS } from "../glossary";
import { trackPeriodicClick } from "../utils/analytics";

interface PeriodicTableProps {
  lang: "ar" | "en";
}

import { ALL_118_ELEMENTS as ELEMENTS } from "../data/elements_data";

const CATEGORIES_INFO_AR: Record<string, { label: string; color: string; bg: string; text: string }> = {
  nonmetal: { label: "اللافلزات النشطة", color: "bg-emerald-500", bg: "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-400" },
  noble: { label: "الغازات الخاملة", color: "bg-indigo-500", bg: "bg-indigo-50/70 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40", text: "text-indigo-800 dark:text-indigo-400" },
  alkali: { label: "الفلزات القلوية", color: "bg-rose-500", bg: "bg-rose-50/70 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 hover:bg-rose-100/80 dark:hover:bg-rose-900/40", text: "text-rose-800 dark:text-rose-400" },
  "alkaline-earth": { label: "القلوية الترابية", color: "bg-amber-500", bg: "bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 hover:bg-amber-100/80 dark:hover:bg-amber-900/40", text: "text-amber-800 dark:text-amber-400" },
  metalloid: { label: "أشباه الفلزات", color: "bg-teal-500", bg: "bg-teal-50/70 border-teal-200 dark:bg-teal-950/20 dark:border-teal-900 hover:bg-teal-100/80 dark:hover:bg-teal-900/40", text: "text-teal-800 dark:text-teal-400" },
  "post-transition": { label: "فلزات ضعيفة", color: "bg-sky-500", bg: "bg-sky-50/70 border-sky-200 dark:bg-sky-950/20 dark:border-sky-900 hover:bg-sky-100/80 dark:hover:bg-sky-900/40", text: "text-sky-800 dark:text-sky-400" },
  transition: { label: "الفلزات الانتقالية", color: "bg-cyan-600", bg: "bg-cyan-50/70 border-cyan-200 dark:bg-cyan-950/20 dark:border-cyan-900 hover:bg-cyan-100/80 dark:hover:bg-cyan-900/40", text: "text-cyan-800 dark:text-cyan-400" },
  halogen: { label: "الهالوجينات", color: "bg-violet-500", bg: "bg-violet-50/70 border-violet-200 dark:bg-violet-950/20 dark:border-violet-900 hover:bg-violet-100/80 dark:hover:bg-violet-900/40", text: "text-violet-800 dark:text-violet-400" },
  lanthanide: { label: "اللانثانيدات", color: "bg-purple-500", bg: "bg-purple-50/70 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900 hover:bg-purple-100/80 dark:hover:bg-purple-900/40", text: "text-purple-800 dark:text-purple-400" },
  actinide: { label: "الأكتينيدات", color: "bg-pink-500", bg: "bg-pink-50/70 border-pink-200 dark:bg-pink-950/20 dark:border-pink-900 hover:bg-pink-100/80 dark:hover:bg-pink-900/40", text: "text-pink-800 dark:text-pink-400" }
};

const CATEGORIES_INFO_EN: Record<string, { label: string; color: string; bg: string; text: string }> = {
  nonmetal: { label: "Reactive Nonmetals", color: "bg-emerald-500", bg: "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-400" },
  noble: { label: "Noble Gases", color: "bg-indigo-500", bg: "bg-indigo-50/70 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40", text: "text-indigo-800 dark:text-indigo-400" },
  alkali: { label: "Alkali Metals", color: "bg-rose-500", bg: "bg-rose-50/70 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 hover:bg-rose-100/80 dark:hover:bg-rose-900/40", text: "text-rose-800 dark:text-rose-400" },
  "alkaline-earth": { label: "Alkaline Earth", color: "bg-amber-500", bg: "bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 hover:bg-amber-100/80 dark:hover:bg-amber-900/40", text: "text-amber-800 dark:text-amber-400" },
  metalloid: { label: "Metalloids", color: "bg-teal-500", bg: "bg-teal-50/70 border-teal-200 dark:bg-teal-950/20 dark:border-teal-900 hover:bg-teal-100/80 dark:hover:bg-teal-900/40", text: "text-teal-800 dark:text-teal-400" },
  "post-transition": { label: "Post-Transition", color: "bg-sky-500", bg: "bg-sky-50/70 border-sky-200 dark:bg-sky-950/20 dark:border-sky-900 hover:bg-sky-100/80 dark:hover:bg-sky-900/40", text: "text-sky-800 dark:text-sky-400" },
  transition: { label: "Transition Metals", color: "bg-cyan-600", bg: "bg-cyan-50/70 border-cyan-200 dark:bg-cyan-950/20 dark:border-cyan-900 hover:bg-cyan-100/80 dark:hover:bg-cyan-900/40", text: "text-cyan-800 dark:text-cyan-400" },
  halogen: { label: "Halogens", color: "bg-violet-500", bg: "bg-violet-50/70 border-violet-200 dark:bg-violet-950/20 dark:border-violet-900 hover:bg-violet-100/80 dark:hover:bg-violet-900/40", text: "text-violet-800 dark:text-violet-400" },
  lanthanide: { label: "Lanthanides", color: "bg-purple-500", bg: "bg-purple-50/70 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900 hover:bg-purple-100/80 dark:hover:bg-purple-900/40", text: "text-purple-800 dark:text-purple-400" },
  actinide: { label: "Actinides", color: "bg-pink-500", bg: "bg-pink-50/70 border-pink-200 dark:bg-pink-950/20 dark:border-pink-900 hover:bg-pink-100/80 dark:hover:bg-pink-900/40", text: "text-pink-800 dark:text-pink-400" }
};

export default function PeriodicTable({ lang }: PeriodicTableProps) {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(ELEMENTS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEn = lang === "en";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = Array.from(
    new Set(GLOSSARY_TERMS.map((t) => (isEn ? t.categoryEn : t.categoryAr)))
  );

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const term = isEn ? t.termEn : t.termAr;
    const def = isEn ? t.defEn : t.defAr;
    const cat = isEn ? t.categoryEn : t.categoryAr;
    const matchesSearch =
      term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" || cat === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const CATEGORIES_INFO = isEn ? CATEGORIES_INFO_EN : CATEGORIES_INFO_AR;

  // Filter elements by search term or category
  const filteredElements = ELEMENTS.filter((el) => {
    const elName = isEn ? el.name : el.nameAr;
    const matchesQuery = 
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.number.toString() === searchTerm;
    const matchesCat = selectedCategory === "all" || el.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl" id="periodic-table-section">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex-grow w-full lg:w-auto">
          <h3 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-600 shrink-0" />
            {isEn ? "Interactive Chemical Elements Explorer" : "مستكشف العناصر الكيميائية التفاعلي"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isEn 
              ? "Click any element to read its fascinating properties, atomic configuration, and approved mass."
              : "اضغط على أي عنصر لقراءة خواصه الممتعة، وتوزيعه الإلكتروني، وكتلته الذرية المعتمدة."}
          </p>
          
          {/* Search Bar */}
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? "Search element name, symbol, or atomic number..." : "البحث عن اسم العنصر، الرمز، أو العدد الذري..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-teal-500 outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Categories Legend */}
        <div className="flex flex-wrap gap-2 text-[11px] max-w-xl">
          {Object.entries(CATEGORIES_INFO).map(([key, info]) => (
            <div key={key} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className={`w-2.5 h-2.5 rounded-full ${info.color}`}></span>
              <span className="text-slate-650 dark:text-slate-300 font-bold">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* The interactive grid - Render a standard 18-column grid on desktop! */}
        <div className="lg:col-span-2 overflow-x-auto">
          <div className="min-w-[650px] lg:min-w-0 grid grid-cols-18 gap-1.5 auto-rows-[45px] lg:auto-rows-[55px]" id="periodic-table-grid">
            {ELEMENTS.map((el) => {
              const info = CATEGORIES_INFO[el.category] || { color: "bg-slate-400", bg: "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700", text: "text-slate-700 dark:text-slate-300" };
              const isSelected = selectedElement?.number === el.number;
              
              // Map standard group & period to grid coordinates (Lanthanides/Actinides placed elegantly at the bottom)
              let gridCol = el.group;
              let gridRow = el.period;
              if (el.category === "lanthanide") {
                gridRow = 9;
                gridCol = el.number - 57 + 4; // placed from group 4 to 18 on row 9
              } else if (el.category === "actinide") {
                gridRow = 10;
                gridCol = el.number - 89 + 4; // placed from group 4 to 18 on row 10
              }

              return (
                <button
                  key={el.number}
                  onClick={() => {
                    setSelectedElement(el);
                    setIsModalOpen(true);
                    trackPeriodicClick();
                  }}
                  id={`elem-btn-${el.symbol.toLowerCase()}`}
                  style={{ gridColumn: gridCol, gridRow: gridRow, direction: "ltr" }}
                  className={`relative p-1 rounded-lg border transition-all duration-300 flex flex-col justify-between h-full ${info.bg} ${
                    isSelected 
                      ? "ring-4 ring-teal-600/10 border-teal-500 scale-[1.05] shadow-lg z-10" 
                      : "shadow-2xs hover:scale-[1.02] hover:border-slate-400 dark:hover:border-slate-600"
                  }`}
                >
                  <span className="text-[7px] lg:text-[9px] font-mono text-slate-400 font-bold self-start leading-none">
                    {el.number}
                  </span>
                  <span className="text-xs lg:text-sm font-extrabold font-mono tracking-tight text-slate-800 dark:text-white self-center leading-none">
                    {el.symbol}
                  </span>
                  <span className="text-[6px] lg:text-[8px] text-slate-500 dark:text-slate-400 truncate w-full text-center leading-none font-medium">
                    {isEn ? el.name : el.nameAr}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-5 italic">
            {isEn 
              ? "* This table displays the complete periodic grid with accurate educational summaries for critical chemical elements."
              : "* يعرض هذا الجدول الشبكة الدورية الكاملة مع ملخصات أكاديمية معتمدة لأهم العناصر الكيميائية في المناهج."}
          </p>
        </div>

        {/* Element Detail Panel */}
        <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-between min-h-[350px]">
          {selectedElement ? (
            <div className="h-full flex flex-col justify-between animate-fade-in">
              <div>
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-teal-100 dark:border-teal-900">
                      Z = {selectedElement.number}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      {CATEGORIES_INFO[selectedElement.category]?.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold hidden sm:inline">
                      {isEn 
                        ? `Period ${selectedElement.period} | Group ${selectedElement.group}`
                        : `الدورة ${selectedElement.period} | المجموعة ${selectedElement.group}`}
                    </span>
                    
                    {/* Prominent Red Close Button */}
                    <button
                      onClick={() => {
                        setSelectedElement(null);
                        setIsModalOpen(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-900/40 dark:hover:bg-rose-900/60 dark:text-rose-300 rounded-xl transition-all cursor-pointer font-black text-xs border border-rose-500/10 hover:scale-105 active:scale-95 shadow-xs"
                      title={isEn ? "Close Details" : "إغلاق التفاصيل"}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{isEn ? "Close" : "إغلاق"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl font-mono text-slate-800 dark:text-white border ${CATEGORIES_INFO[selectedElement.category]?.bg} shadow-md`}>
                    {selectedElement.symbol}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-850 dark:text-white">
                      {isEn ? selectedElement.name : selectedElement.nameAr}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider font-bold">
                      {selectedElement.name} ({selectedElement.symbol})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-3xs">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold mb-0.5">
                      {isEn ? "Standard Atomic Mass" : "الكتلة المولية الذرية"}
                    </span>
                    <span className="font-extrabold font-mono text-sm text-slate-750 dark:text-slate-200">
                      {selectedElement.mass.toFixed(4)}{" "}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">g/mol</span>
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-3xs">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold mb-0.5">
                      {isEn ? "Electron Config" : "التوزيع الإلكتروني"}
                    </span>
                    <span className="font-extrabold font-mono text-xs text-slate-750 dark:text-slate-200">
                      {selectedElement.electronConfig}
                    </span>
                  </div>
                </div>

                <div className="bg-teal-50/60 dark:bg-teal-950/20 p-4 rounded-xl border border-teal-50 dark:border-teal-900/40 text-slate-700 dark:text-slate-300 text-sm leading-relaxed relative overflow-hidden">
                  <Sparkles className="w-12 h-12 text-teal-100/80 dark:text-teal-900/30 absolute -bottom-2 -left-2 rotate-12" />
                  <span className="font-extrabold text-teal-800 dark:text-teal-400 text-xs block mb-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> {isEn ? "Did you know?" : "هل تعلم؟"}
                  </span>
                  <p className="relative z-10 font-medium text-slate-700 dark:text-slate-300">
                    {isEn ? selectedElement.summaryEn : selectedElement.summaryAr}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800 font-bold">
                {isEn 
                  ? "Smart Chemistry Explorer • Under supervision of Dr. Tamer"
                  : "مكتبة الكيمياء الذكية • تحت إشراف د. تامر مدبولي"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-12">
              <BookOpen className="w-12 h-12 stroke-1 mb-2 text-slate-300 dark:text-slate-700 animate-pulse" />
              <p className="text-sm font-bold">
                {isEn ? "Select an element to view details" : "اختر عنصراً كيميائياً لعرض التفاصيل"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Glossary Section */}
      <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800" id="glossary-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h4 className="text-lg font-black text-slate-850 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              {isEn ? "Chemistry Quick Glossary" : "القاموس الكيميائي السريع"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isEn
                ? "Browse core chemical terms, reaction mechanisms, and foundational principles."
                : "تصفح أهم المصطلحات الكيميائية وآليات التفاعل والمبادئ التأسيسية."}
            </p>
          </div>

          {/* Search bar inside glossary */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isEn ? "Search chemical terms..." : "البحث في المصطلحات..."}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950/40 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-bold"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-slate-50 border border-slate-200/60 text-slate-600 hover:bg-slate-100/50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50"
            }`}
          >
            {isEn ? "All Categories" : "جميع الأقسام"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200/60 text-slate-600 hover:bg-slate-100/50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term) => (
            <div
              key={term.key}
              className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h5 className="font-black text-sm text-slate-850 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                    {isEn ? term.termEn : term.termAr}
                  </h5>
                  <span className="text-[10px] text-teal-700 bg-teal-50 border border-teal-100/60 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-400 px-2 py-0.5 rounded-md font-bold shrink-0">
                    {isEn ? term.categoryEn : term.categoryAr}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {isEn ? term.defEn : term.defAr}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{isEn ? `En: ${term.termEn}` : `Ar: ${term.termAr}`}</span>
                <span className="opacity-0 group-hover:opacity-100 text-teal-600 dark:text-teal-400 font-bold transition-opacity">
                  {isEn ? "Learn More" : "تصفح المصطلح"}
                </span>
              </div>
            </div>
          ))}
          {filteredTerms.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
              <p className="text-xs font-bold">
                {isEn ? "No glossary terms match your search." : "لم يتم العثور على مصطلحات تطابق بحثك."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Element Detail Overlay Modal */}
      {isModalOpen && selectedElement && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[150] flex items-center justify-center p-4 no-print animate-fade-in"
        >
          {/* Floating Close Button at the Top of the Viewport */}
          <button
            onClick={() => {
              setIsModalOpen(false);
              setSelectedElement(null);
            }}
            className="fixed top-4 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-2xl shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2 z-[160] border border-rose-500 font-black text-sm"
            style={{
              top: "1.5rem",
              [lang === "ar" ? "left" : "right"]: "1.5rem"
            }}
          >
            <X className="w-4 h-4 shrink-0 stroke-[3]" />
            <span>{lang === "ar" ? "إغلاق النافذة ×" : "Close Window ×"}</span>
          </button>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-scale-up"
          >
            {/* Header styled with the category color */}
            <div className={`p-6 text-white ${CATEGORIES_INFO[selectedElement.category]?.color || "bg-teal-600"} relative`}>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedElement(null);
                }}
                className="absolute top-4 text-white hover:bg-white/20 px-3 py-1.5 rounded-full transition-all cursor-pointer z-50 flex items-center gap-1.5 bg-black/25 hover:scale-105 font-black text-xs border border-white/10 shadow-xs"
                style={lang === "ar" ? { left: "1rem", right: "auto" } : { right: "1rem", left: "auto" }}
                title={isEn ? "Close" : "إغلاق"}
              >
                <X className="w-4 h-4 shrink-0" />
                <span>{isEn ? "Close" : "إغلاق"}</span>
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 backdrop-blur-xs text-white font-mono text-xs font-black px-2.5 py-1 rounded-lg border border-white/20">
                  Z = {selectedElement.number}
                </span>
                <span className="text-xs font-black bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  {CATEGORIES_INFO[selectedElement.category]?.label}
                </span>
              </div>

              <div className="flex items-end gap-4 mt-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-3xl font-mono">
                  {selectedElement.symbol}
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight">
                    {isEn ? selectedElement.name : selectedElement.nameAr}
                  </h4>
                  <p className="text-xs text-white/70 font-mono font-bold uppercase tracking-wider">
                    {selectedElement.name} ({selectedElement.symbol})
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* POSITION / LOCATION IN PERIODIC TABLE */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-800 shadow-3xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-black uppercase tracking-wider mb-2">
                  {isEn ? "Element Position in Periodic Table" : "موقع العنصر في الجدول الدوري"}
                </span>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold">
                      {isEn ? "Period Number" : "رقم الدورة"}
                    </span>
                    <span className="font-black text-base text-teal-600 dark:text-teal-400">
                      {selectedElement.period}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold">
                      {isEn ? "Group Number" : "رقم المجموعة"}
                    </span>
                    <span className="font-black text-base text-indigo-600 dark:text-indigo-400">
                      {selectedElement.group}
                    </span>
                  </div>
                </div>
              </div>

              {/* ELECTRON CONFIGURATION */}
              <div className="bg-teal-50/50 dark:bg-teal-950/15 p-4 rounded-2xl border border-teal-100/50 dark:border-teal-900/40 shadow-3xs">
                <span className="text-[10px] text-teal-700 dark:text-teal-400 block font-black uppercase tracking-wider mb-1">
                  {isEn ? "Electron Configuration" : "التركيب الإلكتروني (التوزيع)"}
                </span>
                <p className="font-black font-mono text-base text-slate-800 dark:text-teal-350 leading-relaxed tracking-wide">
                  {selectedElement.electronConfig}
                </p>
              </div>

              {/* ATOMIC MASS */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-150/60 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {isEn ? "Standard Atomic Mass" : "الكتلة المولية الذرية"}
                  </span>
                  <span className="font-extrabold font-mono text-sm text-slate-850 dark:text-slate-200">
                    {selectedElement.mass.toFixed(4)} g/mol
                  </span>
                </div>
              </div>

              {/* DID YOU KNOW */}
              <div className="bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-slate-700 dark:text-slate-300 text-xs leading-relaxed relative overflow-hidden">
                <Sparkles className="w-8 h-8 text-amber-500/20 absolute -bottom-1 -left-1 rotate-12" />
                <span className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1 flex items-center gap-1">
                  {isEn ? "Properties & Fun Fact" : "الخواص وحقيقة علمية"}
                </span>
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  {isEn ? selectedElement.summaryEn : selectedElement.summaryAr}
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isEn ? "Close Window" : "إغلاق النافذة"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
