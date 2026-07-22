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
  CalendarDays
} from "lucide-react";
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

    </div>
  );
}
