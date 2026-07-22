import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Timer, Award, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackExamGenerated } from "../utils/analytics";

interface ExamGeneratorProps {
  lang: "ar" | "en";
  selectedModel?: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function ExamGeneratorSection({ lang, selectedModel }: ExamGeneratorProps) {
  const [topic, setTopic] = useState("general");
  const [difficulty, setDifficulty] = useState("beginner");
  const [generating, setGenerating] = useState(false);
  const [exam, setExam] = useState<Question[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [examSubmitted, setExamSubmitted] = useState(false);

  const isEn = lang === "en";

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timerActive && timeLeft === 0) {
      handleSubmit();
    }
  }, [timerActive, timeLeft]);

  const handleGenerate = async () => {
    setGenerating(true);
    setExam(null);
    setScore(null);
    setExamSubmitted(false);
    setUserAnswers({});
    
    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a formal chemistry exam with 10 questions. 
          Topic: ${topic}. Difficulty: ${difficulty}.
          The language of the exam must be ${isEn ? "English" : "Arabic"}.
          Return a strict JSON array of objects:
          [{ "id": number, "question": "string", "options": ["string", "string", "string", "string"], "answerIndex": number, "explanation": "string" }]
          Return ONLY the JSON array.`,
          topic,
          difficulty,
          language: lang,
          model: selectedModel || "gemini-2.0-flash"
        })
      });

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      const cleanedText = data.solution.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedText);
      
      setExam(parsed);
      trackExamGenerated();
      setTimeLeft(600); // 10 minutes
      setTimerActive(true);
    } catch (e) {
      console.error(e);
      alert(isEn ? "Failed to generate exam" : "فشل توليد الامتحان");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = () => {
    setTimerActive(false);
    setExamSubmitted(true);
    if (!exam) return;

    let correct = 0;
    exam.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) correct++;
    });
    const finalScore = Math.round((correct / exam.length) * 100);
    setScore(finalScore);

    // Save to history
    try {
      const savedStats = localStorage.getItem("quiz_stats_history");
      const currentStats = savedStats ? JSON.parse(savedStats) : [];
      
      const detailedResults = exam.map((q, idx) => ({
        question: q.question,
        userAnswer: q.options[userAnswers[idx]] || (isEn ? "Not Answered" : "لم يتم الحل"),
        correctAnswer: q.options[q.answerIndex],
        explanation: q.explanation,
        isCorrect: userAnswers[idx] === q.answerIndex
      }));

      const newStat = {
        id: Date.now().toString(),
        topic: `${isEn ? "Exam:" : "امتحان:"} ${topic} (${difficulty})`,
        correctCount: correct,
        totalQuestions: exam.length,
        percentage: finalScore,
        timestamp: new Date().toLocaleDateString(lang === "en" ? "en-US" : "ar-EG") + " - " + new Date().toLocaleTimeString(lang === "en" ? "en-US" : "ar-EG", { hour: "2-digit", minute: "2-digit" }),
        results: detailedResults
      };
      localStorage.setItem("quiz_stats_history", JSON.stringify([newStat, ...currentStats]));
    } catch (e) {
      console.error("Failed to save exam history:", e);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-150 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white flex items-center gap-2">
            <Sparkles className="text-teal-500" />
            {isEn ? "AI Exam Generator" : "مولد الامتحانات الذكي"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEn ? "DeepSeek-powered chemistry assessment" : "تقييم كيميائي مدعوم بالذكاء الاصطناعي"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            className="p-2 text-xs font-bold border rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="general">{isEn ? "General Chemistry" : "كيمياء عامة"}</option>
            <option value="organic">{isEn ? "Organic Chemistry" : "كيمياء عضوية"}</option>
            <option value="inorganic">{isEn ? "Inorganic Chemistry" : "كيمياء غير عضوية"}</option>
            <option value="analytical">{isEn ? "Analytical Chemistry" : "كيمياء تحليلية"}</option>
          </select>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)} 
            className="p-2 text-xs font-bold border rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="beginner">{isEn ? "Beginner" : "مبتدئ"}</option>
            <option value="intermediate">{isEn ? "Intermediate" : "متوسط"}</option>
            <option value="advanced">{isEn ? "Advanced" : "متقدم"}</option>
          </select>
          <button 
            onClick={handleGenerate} 
            disabled={generating}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isEn ? "Start Exam" : "بدء الامتحان"}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {timerActive && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6 p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl font-black border border-rose-100 dark:border-rose-900/50"
          >
            <Timer className="w-5 h-5" />
            <span className="text-xl tabular-nums">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </motion.div>
        )}

        {exam && !examSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {exam.map((q, idx) => (
                <div key={idx} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-950/20">
                  <p className="font-bold text-slate-800 dark:text-white mb-4 flex items-start gap-3">
                    <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs mt-1">Q{idx + 1}</span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                        className={`p-3 rounded-xl border text-sm font-bold text-right transition-all ${
                          userAnswers[idx] === oIdx
                            ? "bg-teal-50 dark:bg-teal-950/30 border-teal-500 text-teal-700 dark:text-teal-400"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleSubmit}
              className="w-full bg-slate-800 dark:bg-slate-700 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all"
            >
              {isEn ? "Submit Exam" : "تسليم الامتحان"}
            </button>
          </motion.div>
        )}

        {examSubmitted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-teal-50/30 dark:bg-teal-950/10 rounded-3xl border border-teal-100 dark:border-teal-900/30"
          >
            <div className="inline-flex p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg mb-6">
              <Award className="w-16 h-16 text-teal-500" />
            </div>
            <h3 className="text-4xl font-black text-slate-850 dark:text-white mb-2">
              {score}%
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">
              {isEn ? "Your Final Exam Score" : "نتيجتك النهائية في الامتحان"}
            </p>
            
            <div className="max-w-2xl mx-auto space-y-4 px-4 text-right">
              {exam?.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.answerIndex;
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'} dark:bg-slate-900 dark:border-slate-800`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                      {isCorrect ? <CheckCircle className="text-emerald-500 w-4 h-4" /> : <XCircle className="text-rose-500 w-4 h-4" />}
                      <span className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {isEn ? `Question ${idx + 1}` : `السؤال ${idx + 1}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => { setExam(null); setExamSubmitted(false); }}
              className="mt-10 px-8 py-3 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 transition-all"
            >
              {isEn ? "Generate New Exam" : "توليد امتحان جديد"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
