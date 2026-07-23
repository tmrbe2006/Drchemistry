import React, { useState, useEffect } from "react";
import { 
  BarChart2, 
  Users, 
  Tv, 
  Download, 
  HelpCircle, 
  Bot, 
  Zap, 
  Award, 
  FileText, 
  BookOpen, 
  Play, 
  RefreshCw, 
  Sparkles,
  Layers,
  Clock,
  MapPin,
  CalendarDays,
  Pin,
  Beaker,
  FlaskConical,
  Trash2,
  Folder,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChemicalFormulaBadge, 
  normalizeFormula, 
  calculateMolecularWeight, 
  getMoleculeDataByFormula,
  ATOMIC_WEIGHTS,
  estimateChemicalProperties
} from "../App";
import { MOLECULES } from "./MolecularGeometryVisualizer";
import { 
  getAnalyticsStats, 
  simulateTraffic, 
  resetAnalyticsStats, 
  AnalyticsStats 
} from "../utils/analytics";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";

interface AnalyticsDashboardProps {
  lang: "ar" | "en";
}

export default function AnalyticsDashboard({ lang }: AnalyticsDashboardProps) {
  const isEn = lang === "en";
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [activeChartMetric, setActiveChartMetric] = useState<"visits" | "videoViews" | "downloads" | "quizzes" | "aiQueries">("visits");
  const [simulationActive, setSimulationActive] = useState(false);

  const [pinned, setPinned] = useState<string[]>([]);
  const [availableFormulas, setAvailableFormulas] = useState<string[]>([]);
  const [formulaA, setFormulaA] = useState("H2O");
  const [formulaB, setFormulaB] = useState("CO2");

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [pinnedCategories, setPinnedCategories] = useState<Record<string, string>>({});
  const [newCatInput, setNewCatInput] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [pinnedSearchQuery, setPinnedSearchQuery] = useState("");

  // Load pinned formulas and available formulas
  useEffect(() => {
    const loadPinned = () => {
      const cached = localStorage.getItem("dr_tamer_pinned_formulas");
      setPinned(cached ? JSON.parse(cached) : []);
    };

    const loadCategories = () => {
      const cachedCats = localStorage.getItem("dr_tamer_custom_categories");
      if (cachedCats) {
        setCustomCategories(JSON.parse(cachedCats));
      } else {
        const defaults = lang === "en" 
          ? ["General", "Acids", "Organic", "Solvents"] 
          : ["عام", "أحماض", "مركبات عضوية", "مذيبات"];
        setCustomCategories(defaults);
        localStorage.setItem("dr_tamer_custom_categories", JSON.stringify(defaults));
      }

      const cachedPinned = localStorage.getItem("dr_tamer_pinned_categories");
      setPinnedCategories(cachedPinned ? JSON.parse(cachedPinned) : {});
    };

    const scanFormulas = () => {
      const presets = ["H2O", "CO2", "CH4", "NH3", "BF3", "SF6", "BeCl2"];
      const historyCached = localStorage.getItem("dr_tamer_chem_history");
      const list = [...presets];
      if (historyCached) {
        try {
          const historyItems: any[] = JSON.parse(historyCached);
          const extract = (txt: string) => {
            if (!txt) return [];
            const parts = txt.split(/([A-Z][A-Za-z0-9()]*)/g);
            return parts.filter(p => {
              if (!p || p.length < 2) return false;
              const blacklist = new Set([
                "IN", "BY", "ON", "IF", "IS", "US", "SO", "NO", "HE", "AM", "AT", "AN", "OR", "TO", "UP", "WE", "ME", "MY", "GO", "DO", "AS"
              ]);
              if (blacklist.has(p.toUpperCase())) return false;
              
              let i = 0;
              let elementCount = 0;
              let hasSubscript = false;
              const COMMON_ELEMENTS = [
                "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ag", "I", "Pt", "Au", "Hg", "Pb", "U"
              ];
              while (i < p.length) {
                const char = p[i];
                if (char === "(" || char === ")") {
                  i++;
                  continue;
                }
                if (/\d/.test(char)) {
                  hasSubscript = true;
                  i++;
                  continue;
                }
                let found = false;
                for (const el of COMMON_ELEMENTS) {
                  if (p.startsWith(el, i)) {
                    elementCount++;
                    i += el.length;
                    found = true;
                    break;
                  }
                }
                if (!found) return false;
              }
              return elementCount > 1 || (elementCount === 1 && hasSubscript);
            });
          };

          historyItems.forEach(item => {
            const detected = [...extract(item.prompt || ""), ...extract(item.solution || "")];
            detected.forEach(f => {
              const subscriptMap: Record<string, string> = {
                "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
                "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9"
              };
              let norm = f;
              for (const [sub, num] of Object.entries(subscriptMap)) {
                norm = norm.replaceAll(sub, num);
              }
              norm = norm.replace(/\s+/g, "");
              if (norm && !list.includes(norm)) {
                list.push(norm);
              }
            });
          });
        } catch (e) {
          console.error(e);
        }
      }
      setAvailableFormulas(list);
    };

    loadPinned();
    loadCategories();
    scanFormulas();

    window.addEventListener("pinned-formulas-updated", loadPinned);
    window.addEventListener("pinned-formulas-updated", loadCategories);
    window.addEventListener("pinned-formulas-updated", scanFormulas);
    return () => {
      window.removeEventListener("pinned-formulas-updated", loadPinned);
      window.removeEventListener("pinned-formulas-updated", loadCategories);
      window.removeEventListener("pinned-formulas-updated", scanFormulas);
    };
  }, [lang]);

  const handleAddCat = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (customCategories.includes(trimmed)) return;
    const updated = [...customCategories, trimmed];
    setCustomCategories(updated);
    localStorage.setItem("dr_tamer_custom_categories", JSON.stringify(updated));
    setNewCatInput("");
    window.dispatchEvent(new Event("pinned-formulas-updated"));
  };

  const handleDeleteCat = (e: React.MouseEvent, categoryName: string) => {
    e.stopPropagation();
    const isDefault = categoryName === "General" || categoryName === "عام";
    if (isDefault) return;

    const updatedCats = customCategories.filter(c => c !== categoryName);
    setCustomCategories(updatedCats);
    localStorage.setItem("dr_tamer_custom_categories", JSON.stringify(updatedCats));

    const defaultCat = lang === "en" ? "General" : "عام";
    const updatedPinnedCats = { ...pinnedCategories };
    Object.keys(updatedPinnedCats).forEach(formula => {
      if (updatedPinnedCats[formula] === categoryName) {
        updatedPinnedCats[formula] = defaultCat;
      }
    });
    setPinnedCategories(updatedPinnedCats);
    localStorage.setItem("dr_tamer_pinned_categories", JSON.stringify(updatedPinnedCats));
    window.dispatchEvent(new Event("pinned-formulas-updated"));
  };

  const assignCategoryToFormula = (formula: string, categoryName: string) => {
    const updated = { ...pinnedCategories, [formula]: categoryName };
    setPinnedCategories(updated);
    localStorage.setItem("dr_tamer_pinned_categories", JSON.stringify(updated));
    window.dispatchEvent(new Event("pinned-formulas-updated"));
  };

  const toggleCategoryCollapse = (categoryName: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleUnpin = (formula: string) => {
    const cached = localStorage.getItem("dr_tamer_pinned_formulas");
    let list: string[] = cached ? JSON.parse(cached) : [];
    list = list.filter(f => f !== formula);
    localStorage.setItem("dr_tamer_pinned_formulas", JSON.stringify(list));
    window.dispatchEvent(new Event("pinned-formulas-updated"));
  };

  const handleDownloadCSV = () => {
    if (pinned.length === 0) return;

    // CSV Headers
    const headers = [
      isEn ? "Formula" : "الصيغة الكيميائية",
      isEn ? "Category" : "التصنيف",
      isEn ? "Molecular Weight (g/mol)" : "الوزن الجزيئي (غ/مول)",
      isEn ? "Elemental Composition" : "التركيب العنصري",
      isEn ? "Estimated pH" : "الرقم الهيدروجيني المقدر pH",
      isEn ? "Reactivity Score (0-10)" : "درجة التفاعل المقدرة (0-10)",
      isEn ? "Reactivity Category" : "فئة التفاعل"
    ];

    const rows = pinned.map(formula => {
      const { weight, composition } = calculateMolecularWeight(formula);
      const { pH, reactivity, reactivityCategory } = estimateChemicalProperties(formula);
      
      // Get category
      const defaultCatName = isEn ? "General" : "عام";
      let cat = pinnedCategories[formula];
      if (!cat || !customCategories.includes(cat)) {
        cat = defaultCatName;
      }

      // Format elemental composition (e.g., "H: 2, O: 1")
      const compStr = Object.entries(composition)
        .map(([el, count]) => `${el}: ${count}`)
        .join(", ");

      // Escape fields for CSV if they contain commas or quotes
      const escapeCSV = (val: string | number) => {
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const reactivityCatLabel = isEn 
        ? reactivityCategory.toUpperCase() 
        : (reactivityCategory === "inert" ? "خامل" : reactivityCategory === "low" ? "منخفض" : reactivityCategory === "moderate" ? "متوسط" : "عالي");

      return [
        escapeCSV(formula),
        escapeCSV(cat),
        escapeCSV(weight),
        escapeCSV(compStr),
        escapeCSV(pH.toFixed(1)),
        escapeCSV(reactivity),
        escapeCSV(reactivityCatLabel)
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // Create blob and download link
    // Use BOM (Byte Order Mark) for UTF-8 so Excel opens Arabic correctly
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pinned_formulas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load stats initially
  useEffect(() => {
    setStats(getAnalyticsStats());
  }, []);

  if (!stats) return null;

  // Handle traffic simulation
  const handleSimulate = () => {
    setSimulationActive(true);
    const updated = simulateTraffic();
    setStats(updated);
    setTimeout(() => setSimulationActive(false), 500);
  };

  // Handle reset
  const handleReset = () => {
    const confirmMsg = isEn 
      ? "Are you sure you want to reset all analytics statistics to zero?" 
      : "هل أنت متأكد من رغبتك في تصفير وإعادة تعيين كافة إحصائيات المنصة؟";
    if (window.confirm(confirmMsg)) {
      const cleared = resetAnalyticsStats();
      setStats(cleared);
    }
  };

  // Sort and convert object stats to array for top lists
  const sortedVideos = Object.entries(stats.videoDetails)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const sortedDownloads = Object.entries(stats.downloadDetails)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Translate metric names for labels
  const metricLabels: Record<string, { ar: string, en: string, color: string }> = {
    visits: { ar: "زيارات الدخول", en: "Page Visits", color: "#0d9488" },
    videoViews: { ar: "مشاهدة الفيديوهات", en: "Video Views", color: "#e11d48" },
    downloads: { ar: "تنزيل الملخصات", en: "Downloads", color: "#0284c7" },
    quizzes: { ar: "الاختبارات المحلولة", en: "Quizzes Completed", color: "#d97706" },
    aiQueries: { ar: "حلول الذكاء الاصطناعي", en: "AI Solved", color: "#8b5cf6" }
  };

  return (
    <div className="space-y-8 animate-fade-in" style={{ direction: isEn ? "ltr" : "rtl" }}>
      
      {/* Title & Top Bar Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-teal-600 animate-pulse" />
            {isEn ? "Platform Analytics Dashboard" : "لوحة إحصائيات وتقارير المنصة"}
          </h2>
          <p className="text-slate-500 font-bold mt-1 text-xs sm:text-sm">
            {isEn 
              ? "Comprehensive real-time tracking for visits, videos, downloads, and interactive exercises" 
              : "تتبع شامل فوري لزيارات الموقع، مشاهدات الفيديوهات، تنزيلات الملفات، وحلول التدريبات التفاعلية"}
          </p>
        </div>

        {/* Administration Actions */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <button
            onClick={handleSimulate}
            disabled={simulationActive}
            className="flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${simulationActive ? "animate-spin" : ""}`} />
            {isEn ? "Simulate Traffic" : "محاكاة زيارات وتفاعل"}
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer"
            title={isEn ? "Reset Stats" : "إعادة تعيين الإحصائيات"}
          >
            <RefreshCw className="w-4 h-4" />
            {isEn ? "Reset" : "تصفير"}
          </button>
        </div>
      </div>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Page Entry KPI */}
        <div 
          onClick={() => setActiveChartMetric("visits")}
          className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeChartMetric === "visits" 
              ? "bg-teal-50/50 dark:bg-teal-950/20 border-teal-500/30 ring-2 ring-teal-500/10 shadow-lg" 
              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-800 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isEn ? "Page Visits" : "دخول الصفحة"}
            </span>
            <div className={`p-2.5 rounded-xl shrink-0 ${activeChartMetric === "visits" ? "bg-teal-600 text-white" : "bg-teal-50 dark:bg-teal-950/30 text-teal-600"}`}>
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white block mt-1 tracking-tight">
            {stats.totalVisits.toLocaleString()}
          </span>
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            {isEn ? "+14% This Week" : "+14% هذا الأسبوع"}
          </span>
        </div>

        {/* Video Views KPI */}
        <div 
          onClick={() => setActiveChartMetric("videoViews")}
          className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeChartMetric === "videoViews" 
              ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30 ring-2 ring-rose-500/10 shadow-lg" 
              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-800 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isEn ? "Video Views" : "مشاهدة الفيديو"}
            </span>
            <div className={`p-2.5 rounded-xl shrink-0 ${activeChartMetric === "videoViews" ? "bg-rose-600 text-white" : "bg-rose-50 dark:bg-rose-950/30 text-rose-600"}`}>
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white block mt-1 tracking-tight">
            {stats.totalVideoViews.toLocaleString()}
          </span>
          <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            {isEn ? "+22% This Week" : "+22% هذا الأسبوع"}
          </span>
        </div>

        {/* Downloads KPI */}
        <div 
          onClick={() => setActiveChartMetric("downloads")}
          className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeChartMetric === "downloads" 
              ? "bg-sky-50/50 dark:bg-sky-950/20 border-sky-500/30 ring-2 ring-sky-500/10 shadow-lg" 
              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-800 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isEn ? "Downloads" : "تنزيل الملخصات"}
            </span>
            <div className={`p-2.5 rounded-xl shrink-0 ${activeChartMetric === "downloads" ? "bg-sky-600 text-white" : "bg-sky-50 dark:bg-sky-950/30 text-sky-600"}`}>
              <Download className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white block mt-1 tracking-tight">
            {stats.totalDownloads.toLocaleString()}
          </span>
          <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 mt-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            {isEn ? "+8% This Week" : "+8% هذا الأسبوع"}
          </span>
        </div>

        {/* Quizzes Attempted KPI */}
        <div 
          onClick={() => setActiveChartMetric("quizzes")}
          className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeChartMetric === "quizzes" 
              ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/30 ring-2 ring-amber-500/10 shadow-lg" 
              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-800 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isEn ? "Quizzes Taken" : "الاختبارات المحلولة"}
            </span>
            <div className={`p-2.5 rounded-xl shrink-0 ${activeChartMetric === "quizzes" ? "bg-amber-600 text-white" : "bg-amber-50 dark:bg-amber-950/30 text-amber-600"}`}>
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white block mt-1 tracking-tight">
            {stats.totalQuizzes.toLocaleString()}
          </span>
          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            {isEn ? "+19% This Week" : "+19% هذا الأسبوع"}
          </span>
        </div>

        {/* AI Solver Queries KPI */}
        <div 
          onClick={() => setActiveChartMetric("aiQueries")}
          className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeChartMetric === "aiQueries" 
              ? "bg-violet-50/50 dark:bg-violet-950/20 border-violet-500/30 ring-2 ring-violet-500/10 shadow-lg" 
              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-800 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isEn ? "AI Solutions" : "حلول الذكاء الاصطناعي"}
            </span>
            <div className={`p-2.5 rounded-xl shrink-0 ${activeChartMetric === "aiQueries" ? "bg-violet-600 text-white" : "bg-violet-50 dark:bg-violet-950/30 text-violet-600"}`}>
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white block mt-1 tracking-tight">
            {stats.totalAiQueries.toLocaleString()}
          </span>
          <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 mt-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            {isEn ? "+31% This Week" : "+31% هذا الأسبوع"}
          </span>
        </div>

      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-teal-600" />
              {isEn ? "7-Day Historical Engagement" : "معدلات التفاعل والنشاط اليومي (آخر 7 أيام)"}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-0.5">
              {isEn ? "Comparing interactive behaviors and visit volume" : "مقارنة السلوك التفاعلي وحجم الدخول اليومي لطلابك"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
            {Object.keys(metricLabels).map((metricKey) => {
              const isActive = activeChartMetric === metricKey;
              return (
                <button
                  key={metricKey}
                  onClick={() => setActiveChartMetric(metricKey as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                    isActive 
                      ? "bg-teal-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                  }`}
                >
                  {isEn ? metricLabels[metricKey].en : metricLabels[metricKey].ar}
                </button>
              );
            })}
          </div>
        </div>

        {/* Area/Line Trend Graph */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats.dailyTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricLabels[activeChartMetric].color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={metricLabels[activeChartMetric].color} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={lang === "ar" ? "#f1f5f9" : "#e2e8f0"} className="opacity-40" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(tick) => {
                  const parts = tick.split("-");
                  return parts.length > 2 ? `${parts[1]}/${parts[2]}` : tick;
                }}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '16px', 
                  border: 'none', 
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '11px',
                  direction: isEn ? "ltr" : "rtl"
                }}
                labelFormatter={(label) => `${isEn ? "Date: " : "التاريخ: "} ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey={activeChartMetric} 
                stroke={metricLabels[activeChartMetric].color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMetric)" 
                name={isEn ? metricLabels[activeChartMetric].en : metricLabels[activeChartMetric].ar}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Split details layout: Top Watched Videos and PDF Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Video Lectures */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="font-black text-slate-850 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                <Play className="w-5 h-5 text-rose-500 shrink-0" />
                {isEn ? "Most Watched Videos" : "الفيديوهات والمحاضرات الأكثر مشاهدة"}
              </h3>
              <p className="text-slate-400 text-[10px] sm:text-xs font-bold mt-0.5">
                {isEn ? "Ranked by interactive play triggers" : "ترتيب المحاضرات وفقاً لمرات النقر وبدء التشغيل"}
              </p>
            </div>
            <span className="text-[10px] font-black bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 px-3 py-1 rounded-full">
              {isEn ? "Youtube Links" : "روابط يوتيوب"}
            </span>
          </div>

          <div className="space-y-4">
            {sortedVideos.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-bold text-xs">
                {isEn ? "No video stats logged yet" : "لا يوجد مشاهدات مسجلة بعد"}
              </p>
            ) : (
              sortedVideos.map((video, idx) => {
                const maxCount = Math.max(...sortedVideos.map(v => v.count), 1);
                const percent = Math.min(100, Math.floor((video.count / maxCount) * 100));
                return (
                  <div key={video.title} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 line-clamp-1 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 border border-slate-100 dark:border-slate-750">
                          {idx + 1}
                        </span>
                        {video.title}
                      </span>
                      <span className="font-black text-slate-800 dark:text-slate-100 shrink-0">
                        {video.count} {isEn ? "views" : "مشاهدة"}
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                      <div 
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top File Downloads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="font-black text-slate-850 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                <FileText className="w-5 h-5 text-sky-500 shrink-0" />
                {isEn ? "Top PDF Downloads" : "الملخصات والمذكرات الأكثر تنزيلاً"}
              </h3>
              <p className="text-slate-400 text-[10px] sm:text-xs font-bold mt-0.5">
                {isEn ? "Files and summaries downloaded to local devices" : "الملفات والمذكرات التي تم تنزيلها أو تصديرها من قبل الطلاب"}
              </p>
            </div>
            <span className="text-[10px] font-black bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400 px-3 py-1 rounded-full">
              {isEn ? "PDF Documents" : "ملفات PDF"}
            </span>
          </div>

          <div className="space-y-4">
            {sortedDownloads.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-bold text-xs">
                {isEn ? "No download stats logged yet" : "لا يوجد تنزيلات مسجلة بعد"}
              </p>
            ) : (
              sortedDownloads.map((doc, idx) => {
                const maxCount = Math.max(...sortedDownloads.map(d => d.count), 1);
                const percent = Math.min(100, Math.floor((doc.count / maxCount) * 100));
                return (
                  <div key={doc.title} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 line-clamp-1 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 border border-slate-100 dark:border-slate-750">
                          {idx + 1}
                        </span>
                        {doc.title}
                      </span>
                      <span className="font-black text-slate-800 dark:text-slate-100 shrink-0">
                        {doc.count} {isEn ? "downloads" : "تنزيل"}
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                      <div 
                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Additional Minor Engagement Channels */}
      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl">
        <h3 className="font-black text-slate-800 dark:text-white mb-5 text-sm sm:text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          {isEn ? "Other Activity & Feature engagement statistics" : "إحصائيات تفاعل ومؤشرات تفصيلية أخرى"}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Periodic Table detail views */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 block mb-1">
              {isEn ? "Periodic Table Views" : "نقرات عناصر الجدول الدوري"}
            </span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-base font-black text-slate-800 dark:text-slate-200">
                {stats.totalPeriodicClicks.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pronunciations played */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 block mb-1">
              {isEn ? "Pronunciations Heard" : "استماع لمصطلحات القاموس"}
            </span>
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="text-base font-black text-slate-800 dark:text-slate-200">
                {stats.totalPronunciations.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Exams generated */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 block mb-1">
              {isEn ? "Exams Generated" : "امتحانات منشأة بالذكاء"}
            </span>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-base font-black text-slate-800 dark:text-slate-200">
                {stats.totalExamsGenerated.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Study plans created */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 block mb-1">
              {isEn ? "Study Plans Saved" : "خطط وجداول دراسية تم إعدادها"}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="text-base font-black text-slate-800 dark:text-slate-200">
                {stats.totalStudyPlans.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Pinned Formulas & Chemical Formula Comparison Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 no-print">
        {/* Pinned Formulas Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-800 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <Pin className="w-4 h-4 text-indigo-500 fill-indigo-500" />
              {isEn ? "Pinned Formulas" : "الصيغ الكيميائية المثبتة"}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              {pinned.length > 0 && (
                <button
                  onClick={handleDownloadCSV}
                  className="text-[10px] font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60 px-2.5 py-1 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-3xs"
                  title={isEn ? "Download CSV" : "تحميل ملف CSV"}
                >
                  <Download className="w-3 h-3" />
                  <span>{isEn ? "Export" : "تصدير"}</span>
                </button>
              )}
              <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-xl shadow-3xs">
                {pinned.length}
              </span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
            {isEn 
              ? "Hover over chemical formulas in solved problems & click the pin icon to save them here for quick-access comparison."
              : "مرر الماوس فوق أي صيغة كيميائية في المسائل المحلولة واضغط على زر التثبيت لحفظها هنا للمقارنة السريعة."}
          </p>

          {/* Search Input */}
          {pinned.length > 0 && (
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={pinnedSearchQuery}
                onChange={(e) => setPinnedSearchQuery(e.target.value)}
                placeholder={isEn ? "Search by name or formula..." : "البحث بالاسم أو الصيغة..."}
                className="w-full pl-9 pr-8 py-2 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-hidden focus:border-indigo-500 font-bold text-slate-700 dark:text-slate-200 shadow-3xs"
              />
              {pinnedSearchQuery && (
                <button
                  onClick={() => setPinnedSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Add Custom Category Input */}
          <div className="flex gap-1.5 mb-4">
            <input 
              type="text"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { handleAddCat(); } }}
              placeholder={isEn ? "Add custom category..." : "إضافة تصنيف مخصص..."}
              className="flex-grow px-2.5 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-hidden focus:border-indigo-500 font-bold text-slate-700 dark:text-slate-200 shadow-3xs"
            />
            <button
              onClick={handleAddCat}
              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              title={isEn ? "Add Category" : "إضافة تصنيف"}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 flex-grow max-h-[420px] overflow-y-auto pr-1">
            {pinned.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/20 text-center relative overflow-hidden">
                {/* Gentle Animated SVG Illustration */}
                <div className="relative w-28 h-28 mb-3 flex items-center justify-center">
                  {/* Floating bubbles/atoms around */}
                  <motion.div 
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="absolute top-2 left-4 w-2.5 h-2.5 rounded-full bg-indigo-400/30 dark:bg-indigo-500/30 blur-2xs"
                  />
                  <motion.div 
                    animate={{ 
                      y: [0, -12, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      delay: 1,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="absolute bottom-6 right-4 w-3.5 h-3.5 rounded-full bg-emerald-400/20 dark:bg-emerald-500/20 blur-2xs"
                  />
                  <motion.div 
                    animate={{ 
                      y: [0, -6, 0],
                      x: [0, 4, -4, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      delay: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="absolute top-1/2 right-4 w-2 h-2 rounded-full bg-violet-400/30 dark:bg-violet-500/30"
                  />
                  
                  {/* Central Flask Illustration */}
                  <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500 dark:text-indigo-400 drop-shadow-md">
                    {/* Liquid in Flask */}
                    <motion.path
                      d="M32 64 C 40 61, 60 67, 68 64 L 75 80 L 25 80 Z"
                      fill="currentColor"
                      fillOpacity="0.15"
                      animate={{
                        d: [
                          "M32 64 C 40 61, 60 67, 68 64 L 75 80 L 25 80 Z",
                          "M32 64 C 42 66, 58 60, 68 64 L 75 80 L 25 80 Z",
                          "M32 64 C 40 61, 60 67, 68 64 L 75 80 L 25 80 Z"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Liquid bubbles */}
                    <circle cx="45" cy="72" r="2" fill="currentColor" fillOpacity="0.4" />
                    <circle cx="55" cy="75" r="1" fill="currentColor" fillOpacity="0.4" />
                    <circle cx="38" cy="76" r="1.5" fill="currentColor" fillOpacity="0.4" />
                    
                    {/* Flask Outline */}
                    <path
                      d="M42 20 H58 V35 L78 78 C80 82, 77 86, 72 86 H28 C23 86, 20 82, 22 78 L42 35 V20 Z"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Measurement marks */}
                    <line x1="45" y1="52" x2="52" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
                    <line x1="45" y1="62" x2="55" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
                    <line x1="45" y1="72" x2="52" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
                  </svg>

                  {/* Floating Science Icon over it */}
                  <motion.div 
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: 360
                    }}
                    transition={{ 
                      y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" }
                    }}
                    className="absolute top-1 right-2 p-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </motion.div>
                  
                  {/* Floating Pin Icon over it */}
                  <motion.div 
                    animate={{ 
                      y: [0, -6, 0],
                      rotate: [12, -12, 12]
                    }}
                    transition={{ 
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                    }}
                    className="absolute bottom-1.5 left-2 p-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-xl shadow-xs"
                  >
                    <Pin className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                  </motion.div>
                </div>
                
                <h4 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 mb-1">
                  {isEn ? "Your Chemical Workbench" : "مختبرك الكيميائي الخاص"}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold max-w-[240px] leading-relaxed">
                  {isEn 
                    ? "No pinned formulas yet. Hover over formulas in your solved history on the left, and click the pin icon to build your quick-access workspace!"
                    : "لا توجد صيغ كيميائية مثبتة حالياً. مرر الماوس فوق أي صيغة في سجل حلولك واضغط على أيقونة التثبيت لإنشاء مختبرك السريع!"}
                </p>
              </div>
            ) : (() => {
              // Group formulas for rendering with search filtering
              const filteredPinned = pinned.filter(formula => {
                if (!pinnedSearchQuery.trim()) return true;
                const query = pinnedSearchQuery.toLowerCase().trim();
                
                // Match formula symbol
                if (formula.toLowerCase().includes(query)) return true;
                
                // Match name or geometry details
                const molData = getMoleculeDataByFormula(formula);
                if (molData) {
                  if (molData.nameEn?.toLowerCase().includes(query)) return true;
                  if (molData.nameAr?.includes(query)) return true;
                  if (molData.geometryEn?.toLowerCase().includes(query)) return true;
                  if (molData.geometryAr?.includes(query)) return true;
                }
                return false;
              });

              if (filteredPinned.length === 0 && pinnedSearchQuery.trim() !== "") {
                return (
                  <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 text-center">
                    <Search className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
                    <h5 className="text-[11px] font-black text-slate-700 dark:text-slate-300 mb-0.5">
                      {isEn ? "No results found" : "لم يتم العثور على نتائج"}
                    </h5>
                    <p className="text-[9px] text-slate-400 font-bold max-w-[200px]">
                      {isEn 
                        ? `No pinned formulas match "${pinnedSearchQuery}"`
                        : `لا توجد صيغ كيميائية تطابق "${pinnedSearchQuery}"`}
                    </p>
                  </div>
                );
              }

              const groupedFormulas: Record<string, string[]> = {};
              const defaultCatName = isEn ? "General" : "عام";
              
              customCategories.forEach(cat => {
                groupedFormulas[cat] = [];
              });
              
              if (!groupedFormulas[defaultCatName]) {
                groupedFormulas[defaultCatName] = [];
              }

              filteredPinned.forEach(formula => {
                let cat = pinnedCategories[formula];
                if (!cat || !customCategories.includes(cat)) {
                  cat = defaultCatName;
                }
                groupedFormulas[cat].push(formula);
              });

              return (
                <div className="space-y-3">
                  {customCategories.map((category) => {
                    const formulas = groupedFormulas[category] || [];
                    const isCollapsed = collapsedCategories[category];
                    const isDefault = category === "General" || category === "عام";
                    
                    return (
                      <div key={category} className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/20 dark:bg-slate-950/10">
                        {/* Category Header */}
                        <div 
                          onClick={() => toggleCategoryCollapse(category)}
                          className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-850 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-all select-none"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Folder className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">
                              {category}
                            </span>
                            <span className="text-[10px] font-black bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md shrink-0">
                              {formulas.length}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isDefault && (
                              <button
                                onClick={(e) => handleDeleteCat(e, category)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                                title={isEn ? "Delete Category" : "حذف التصنيف"}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                            {isCollapsed ? (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Category Items Accordion */}
                        {!isCollapsed && (
                          <div className="p-2 space-y-2 bg-white/50 dark:bg-slate-900/30">
                            {formulas.length === 0 ? (
                              <p className="text-[9px] text-slate-400/80 font-bold text-center py-2.5 italic">
                                {isEn ? "Empty category" : "تصنيف فارغ"}
                              </p>
                            ) : (
                              <AnimatePresence mode="popLayout">
                                {formulas.map((formula) => {
                                  const wt = calculateMolecularWeight(formula).weight;
                                  return (
                                    <motion.div 
                                      key={formula}
                                      layout
                                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                      animate={{ 
                                        opacity: 1, 
                                        scale: [0.98, 1.03, 0.99, 1], // Gentle pulse effect
                                        y: 0,
                                        boxShadow: [
                                          "0px 0px 0px rgba(99,102,241,0)", 
                                          "0px 0px 8px rgba(99,102,241,0.3)", 
                                          "0px 0px 0px rgba(99,102,241,0)"
                                        ]
                                      }}
                                      exit={{ 
                                        opacity: 0, 
                                        scale: 0.9, 
                                        y: -5,
                                        transition: { duration: 0.15 } 
                                      }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                      className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:scale-[1.03] hover:shadow-md dark:hover:shadow-indigo-950/30 transition-all duration-300 ease-out group/pinned cursor-default"
                                    >
                                      <div className="flex flex-col gap-1 max-w-[65%]">
                                        <ChemicalFormulaBadge formula={formula} lang={lang} />
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                          <span className="text-[9px] font-bold text-slate-400 font-mono">
                                            {wt > 0 ? `${wt} g/mol` : "N/A"}
                                          </span>
                                          <span className="text-slate-300 dark:text-slate-700 text-[8px]">•</span>
                                          <select
                                            value={pinnedCategories[formula] || defaultCatName}
                                            onChange={(e) => assignCategoryToFormula(formula, e.target.value)}
                                            className="text-[9px] font-bold bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-150 dark:border-slate-800 rounded-md cursor-pointer focus:outline-hidden py-0.5 px-1 max-w-[85px] truncate font-sans shadow-3xs"
                                            title={isEn ? "Move to Category" : "نقل إلى تصنيف"}
                                          >
                                            {customCategories.map(c => (
                                              <option key={c} value={c}>{c}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-1 opacity-0 group-hover/pinned:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => setFormulaA(formula)}
                                          className="text-[9px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60 px-1.5 py-0.5 rounded-md transition-all active:scale-95 cursor-pointer font-sans"
                                          title={isEn ? "Compare as Formula A" : "مقارنة كصيغة أ"}
                                        >
                                          A
                                        </button>
                                        <button
                                          onClick={() => setFormulaB(formula)}
                                          className="text-[9px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60 px-1.5 py-0.5 rounded-md transition-all active:scale-95 cursor-pointer font-sans"
                                          title={isEn ? "Compare as Formula B" : "مقارنة كصيغة ب"}
                                        >
                                          B
                                        </button>
                                        <button
                                          onClick={() => handleUnpin(formula)}
                                          className="text-[9px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 p-1 rounded-md transition-all active:scale-95 cursor-pointer"
                                          title={isEn ? "Unpin" : "إلغاء التثبيت"}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </AnimatePresence>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()
          }
          </div>
        </div>

        {/* Formula Comparison Tool (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-5 h-5 text-indigo-500" />
            <h3 className="font-black text-slate-800 dark:text-white text-sm sm:text-base">
              {isEn ? "Chemical Formula Comparison Tool" : "أداة مقارنة الصيغ الكيميائية"}
            </h3>
          </div>

          <p className="text-[10px] text-slate-400 font-semibold mb-5 leading-relaxed">
            {isEn 
              ? "Select any two chemical formulas from your revision history or common chemistry presets to analyze and compare their structural, elemental, and physical traits side-by-side."
              : "اختر صيغتين كيميائيتين من سجل مراجعاتك أو من المركبات الشائعة لتحليل ومقارنة خصائصها البنيوية والعنصرية والفيزيائية جنباً إلى جنب."}
          </p>

          {/* Formula Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Formula A Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {isEn ? "Formula A" : "الصيغة أ"}
              </label>
              <select
                value={formulaA}
                onChange={(e) => setFormulaA(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-3xs"
              >
                {availableFormulas.map((f, idx) => (
                  <option key={idx} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Formula B Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {isEn ? "Formula B" : "الصيغة ب"}
              </label>
              <select
                value={formulaB}
                onChange={(e) => setFormulaB(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer shadow-3xs"
              >
                {availableFormulas.map((f, idx) => (
                  <option key={idx} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          {(() => {
            const dataA = getMoleculeDataByFormula(formulaA);
            const dataB = getMoleculeDataByFormula(formulaB);
            const weightA = calculateMolecularWeight(formulaA);
            const weightB = calculateMolecularWeight(formulaB);

            return (
              <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden shadow-3xs flex-grow">
                {/* Table Header */}
                <div className="bg-slate-50 dark:bg-slate-950/50 py-3 px-4 text-xs font-black text-slate-500 grid grid-cols-12 gap-2 border-b border-slate-100 dark:border-slate-850">
                  <div className="col-span-4">{isEn ? "PROPERTY" : "الخاصية"}</div>
                  <div className="col-span-4 text-indigo-600 dark:text-indigo-400">{isEn ? "FORMULA A" : "الصيغة أ"}</div>
                  <div className="col-span-4 text-emerald-600 dark:text-emerald-400">{isEn ? "FORMULA B" : "الصيغة ب"}</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-100 dark:divide-slate-850 px-4">
                  {/* Badge */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-bold">
                    <div className="col-span-4 text-slate-400 font-extrabold">{isEn ? "Structure Badge" : "شارة الصيغة"}</div>
                    <div className="col-span-4"><ChemicalFormulaBadge formula={formulaA} lang={lang} /></div>
                    <div className="col-span-4"><ChemicalFormulaBadge formula={formulaB} lang={lang} /></div>
                  </div>

                  {/* Common Name */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-bold text-slate-700 dark:text-slate-300">
                    <div className="col-span-4 text-slate-400 font-extrabold">{isEn ? "Common Name" : "الاسم الشائع"}</div>
                    <div className="col-span-4">{dataA ? (isEn ? dataA.nameEn : dataA.nameAr) : (isEn ? "Compound" : "مركب")}</div>
                    <div className="col-span-4">{dataB ? (isEn ? dataB.nameEn : dataB.nameAr) : (isEn ? "Compound" : "مركب")}</div>
                  </div>

                  {/* Molecular Mass */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    <div className="col-span-4 text-slate-400 font-sans font-extrabold">{isEn ? "Molecular Weight" : "الكتلة المولية"}</div>
                    <div className="col-span-4 text-indigo-600 dark:text-indigo-400">{weightA.weight > 0 ? `${weightA.weight} g/mol` : "N/A"}</div>
                    <div className="col-span-4 text-emerald-600 dark:text-emerald-400">{weightB.weight > 0 ? `${weightB.weight} g/mol` : "N/A"}</div>
                  </div>

                  {/* Elemental Composition */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-bold text-slate-700 dark:text-slate-300">
                    <div className="col-span-4 text-slate-400 font-extrabold">{isEn ? "Elemental Composition" : "التركيب العنصري"}</div>
                    <div className="col-span-4 text-[10px] leading-relaxed">
                      {Object.entries(weightA.composition).map(([el, cnt]) => (
                        <span key={el} className="inline-block bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-md mr-1 mb-1 text-[9px] font-extrabold">
                          {el} ({cnt})
                        </span>
                      ))}
                    </div>
                    <div className="col-span-4 text-[10px] leading-relaxed">
                      {Object.entries(weightB.composition).map(([el, cnt]) => (
                        <span key={el} className="inline-block bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md mr-1 mb-1 text-[9px] font-extrabold">
                          {el} ({cnt})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* VSEPR Shape */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-bold text-slate-700 dark:text-slate-300">
                    <div className="col-span-4 text-slate-400 font-extrabold">{isEn ? "Molecular Geometry" : "الهندسة الفراغية"}</div>
                    <div className="col-span-4">{dataA ? (isEn ? dataA.geometryEn : dataA.geometryAr) : (isEn ? "Dynamic Geometry" : "بنية ديناميكية")}</div>
                    <div className="col-span-4">{dataB ? (isEn ? dataB.geometryEn : dataB.geometryAr) : (isEn ? "Dynamic Geometry" : "بنية ديناميكية")}</div>
                  </div>

                  {/* Hybridization */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    <div className="col-span-4 text-slate-400 font-sans font-extrabold">{isEn ? "Hybridization" : "التهجين"}</div>
                    <div className="col-span-4">{dataA ? dataA.hybridization : "N/A"}</div>
                    <div className="col-span-4">{dataB ? dataB.hybridization : "N/A"}</div>
                  </div>

                  {/* Bond Angle */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-bold text-slate-700 dark:text-slate-300">
                    <div className="col-span-4 text-slate-400 font-extrabold">{isEn ? "Bond Angle" : "زاوية الرابطة"}</div>
                    <div className="col-span-4">{dataA && dataA.bondAngle ? `${dataA.bondAngle}°` : "N/A"}</div>
                    <div className="col-span-4">{dataB && dataB.bondAngle ? `${dataB.bondAngle}°` : "N/A"}</div>
                  </div>

                  {/* Polarity */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs items-center font-bold text-slate-700 dark:text-slate-300">
                    <div className="col-span-4 text-slate-400 font-extrabold">{isEn ? "Polarity" : "القطبية"}</div>
                    <div className="col-span-4">{dataA ? (isEn ? dataA.polarityEn : dataA.polarityAr) : "N/A"}</div>
                    <div className="col-span-4">{dataB ? (isEn ? dataB.polarityEn : dataB.polarityAr) : "N/A"}</div>
                  </div>

                  {/* Description / Summary */}
                  <div className="grid grid-cols-12 gap-2 py-3 text-[10px] items-start text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    <div className="col-span-4 text-slate-400 font-sans font-extrabold text-xs">{isEn ? "Properties Overview" : "نظرة عامة على الخصائص"}</div>
                    <div className="col-span-4">{dataA ? (isEn ? dataA.descriptionEn : dataA.descriptionAr) : (isEn ? "Properties calculated dynamically based on elemental mass constants." : "خصائص تم حسابها ديناميكياً بناءً على ثوابت الكتل الذرية للعناصر.")}</div>
                    <div className="col-span-4">{dataB ? (isEn ? dataB.descriptionEn : dataB.descriptionAr) : (isEn ? "Properties calculated dynamically based on elemental mass constants." : "خصائص تم حسابها ديناميكياً بناءً على ثوابت الكتل الذرية للعناصر.")}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
}
