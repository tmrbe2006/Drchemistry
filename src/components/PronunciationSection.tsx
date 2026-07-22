import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, RotateCcw, Sparkles, BookOpen, Clock, Trash2, HelpCircle } from "lucide-react";
import { trackPronunciationPlay } from "../utils/analytics";

interface PronunciationSectionProps {
  lang: "ar" | "en";
}

interface SavedWord {
  text: string;
  timestamp: string;
}

const CHEMICAL_TERMS_SUGGESTIONS = [
  { term: "Stoichiometry", translation: "الحسابات الكيميائية", category: "General" },
  { term: "Thermodynamics", translation: "الديناميكا الحرارية", category: "Physical" },
  { term: "Chromatography", translation: "التحليل الكروماتوغرافي", category: "Analytical" },
  { term: "Covalent bond", translation: "رابطة تساهمية", category: "General" },
  { term: "Spectroscopy", translation: "المطيافية", category: "Analytical" },
  { term: "Electronegativity", translation: "السالبية الكهربائية", category: "Periodic Table" },
  { term: "Isomerism", translation: "التشكل (الأيزوميرية)", category: "Organic" },
  { term: "Catalyst", translation: "العامل الحفاز", category: "Kinetics" },
  { term: "Endothermic", translation: "ماص للحرارة", category: "Physical" },
  { term: "Exothermic", translation: "طارد للحرارة", category: "Physical" },
  { term: "Anhydrous", translation: "لامائي", category: "Inorganic" },
  { term: "Hydrocarbon", translation: "هيدروكربون", category: "Organic" }
];

export default function PronunciationSection({ lang }: PronunciationSectionProps) {
  const isEn = lang === "en";
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [rate, setRate] = useState(0.9); // Speed
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<SavedWord[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filter english voices
        const englishVoices = availableVoices.filter(v => v.lang.startsWith("en"));
        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
        
        if (englishVoices.length > 0 && !selectedVoiceName) {
          // Default to a premium Google or natural sounding voice if available
          const defaultVoice = englishVoices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || englishVoices[0];
          setSelectedVoiceName(defaultVoice.name);
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setErrorMsg(
        isEn
          ? "Text-to-Speech is not supported in this browser. Please open the app in a new tab."
          : "ميزة نطق الكلمات غير مدعومة في هذا المتصفح. يرجى فتح التطبيق في علامة تبويب جديدة."
      );
    }

    // Load pronunciation history
    try {
      const saved = localStorage.getItem("pronunciation_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isEn]);

  const handleSpeak = (textToSpeak: string = text) => {
    if (!synthRef.current) return;
    if (!textToSpeak.trim()) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Find selected voice
    if (selectedVoiceName) {
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
    trackPronunciationPlay();

    // Save to history if it's the main input
    if (textToSpeak === text) {
      saveToHistory(textToSpeak);
    }
  };

  const saveToHistory = (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    
    setHistory(prev => {
      const filtered = prev.filter(h => h.text.toLowerCase() !== trimmed.toLowerCase());
      const updated = [
        { text: trimmed, timestamp: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" }) },
        ...filtered
      ].slice(0, 15); // limit to 15 items

      try {
        localStorage.setItem("pronunciation_history", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("pronunciation_history");
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  const t = {
    title: isEn ? "English Term Pronunciation & TTS" : "القاموس الصوتي ونطق المصطلحات الإنجليزية",
    desc: isEn 
      ? "Enter any chemistry term or general English word to hear its correct academic pronunciation."
      : "أدخل أي مصطلح كيميائي أو كلمة باللغة الإنجليزية لتستمع إلى نطقها الأكاديمي السليم بلهجات متعددة.",
    inputPlaceholder: isEn ? "Type an English word or phrase (e.g., Stoichiometry)..." : "اكتب الكلمة أو العبارة الإنجليزية هنا (مثال: Stoichiometry)...",
    btnSpeak: isEn ? "Pronounce" : "انطق الكلمة",
    btnStop: isEn ? "Stop" : "إيقاف",
    voiceLabel: isEn ? "Select Accent / Voice" : "اختر اللهجة / الصوت المفضل",
    speedLabel: isEn ? "Speech Speed (Rate)" : "سرعة النطق (التدفق)",
    pitchLabel: isEn ? "Voice Pitch" : "طبقة الصوت (الحدة)",
    suggestionsTitle: isEn ? "Common Chemistry Terms Pronunciation" : "نطق المصطلحات الكيميائية الشائعة",
    suggestionsDesc: isEn ? "Click on any term to hear its correct pronunciation and see its Arabic meaning:" : "اضغط على أي مصطلح كيميائي للاستماع لنطقه والتعرف على معناه باللغة العربية:",
    historyTitle: isEn ? "Pronunciation History" : "سجل الكلمات المنطوقة حديثاً",
    btnClear: isEn ? "Clear History" : "مسح السجل",
    iframeWarning: isEn 
      ? "Note: If the audio doesn't play, please open the app in a new tab by clicking 'Open in new tab' on top." 
      : "ملاحظة: إذا لم يعمل الصوت تلقائياً، يرجى فتح التطبيق في علامة تبويب مستقلة عبر زر 'افتح في نافذة جديدة' بالأعلى."
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-150 dark:border-slate-800 shadow-xl" id="pronunciation-section-container">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-850 dark:text-white">{t.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.desc}</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex gap-3 text-xs mb-6 font-bold">
          <HelpCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Main Pronunciation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input & Control Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.inputPlaceholder}
              rows={3}
              style={{ direction: "ltr" }}
              className="w-full px-5 py-4 text-sm font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none"
            />
            
            <div className="flex gap-3 justify-end">
              {isPlaying ? (
                <button
                  onClick={handleStop}
                  type="button"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>{t.btnStop}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSpeak()}
                  disabled={!text.trim()}
                  type="button"
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-400 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-white" />
                  <span>{t.btnSpeak}</span>
                </button>
              )}
            </div>
          </div>

          {/* Pronunciation Controls */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-150/80 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              {isEn ? "Pronunciation Preferences" : "تفضيلات وإعدادات الصوت"}
            </h4>

            {/* Voice Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
                {t.voiceLabel}
              </label>
              {voices.length > 0 ? (
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 font-bold focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  style={{ direction: "ltr" }}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[11px] text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl font-bold">
                  {isEn ? "Loading system voices..." : "جاري تحميل محركات الصوت للنظام..."}
                </div>
              )}
            </div>

            {/* Speed & Pitch sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  <span>{t.speedLabel}</span>
                  <span className="font-mono font-black">{rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  <span>{t.pitchLabel}</span>
                  <span className="font-mono font-black">{pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-teal-50/50 dark:bg-teal-950/10 border border-teal-100/60 dark:border-teal-900/40 rounded-2xl p-4 text-xs font-bold text-teal-850 dark:text-teal-400 leading-relaxed">
            {t.iframeWarning}
          </div>
        </div>

        {/* Right Suggestions Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Scientific Suggestions Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              {t.suggestionsTitle}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              {t.suggestionsDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {CHEMICAL_TERMS_SUGGESTIONS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setText(item.term);
                    handleSpeak(item.term);
                  }}
                  type="button"
                  className="p-3 bg-slate-50 hover:bg-teal-50/40 dark:bg-slate-950/40 dark:hover:bg-teal-950/20 border border-slate-150 hover:border-teal-300 dark:border-slate-800 dark:hover:border-teal-900/60 rounded-xl text-right transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <span className="text-[11px] font-black text-slate-800 dark:text-white font-mono group-hover:text-teal-600 transition-colors">
                    {item.term}
                  </span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold mt-1">
                    {item.translation}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pronunciation History */}
          <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-150/85 dark:border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {t.historyTitle}
              </h4>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.btnClear}</span>
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3.5 py-2 rounded-xl"
                  >
                    <button
                      onClick={() => handleSpeak(item.text)}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-mono text-left cursor-pointer truncate max-w-[180px]"
                      title="Click to replay pronunciation"
                    >
                      {item.text}
                    </button>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center py-4 font-bold">
                {isEn ? "No recently pronounced terms" : "سجل النطق فارغ حالياً"}
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
