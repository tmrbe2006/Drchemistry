import React, { useState, useEffect } from "react";
import { MessageSquareText, Plus, Trash2, HelpCircle, Lock, Unlock, ChevronDown, ChevronUp, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QAPair {
  id: string;
  question: string;
  answer: string;
  image?: string;
  timestamp: string;
}

interface ImportantQuestionsSectionProps {
  lang: "ar" | "en";
}

export default function ImportantQuestionsSection({ lang }: ImportantQuestionsSectionProps) {
  const isEn = lang === "en";
  const [qaList, setQaList] = useState<QAPair[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is already logged in (shared session with lectures)
    const adminSession = localStorage.getItem("dr_tamer_admin_active");
    if (adminSession === "true") setIsAdmin(true);

    const saved = localStorage.getItem("dr_tamer_important_questions");
    if (saved) {
      setQaList(JSON.parse(saved));
    } else {
      const defaults = [
        {
          id: "1",
          question: isEn ? "What is the difference between molarity and molality?" : "ما الفرق بين المولارية والمولالية؟",
          answer: isEn ? "Molarity is moles per liter of solution, while molality is moles per kilogram of solvent." : "المولارية هي عدد المولات لكل لتر من المحلول، بينما المولالية هي عدد المولات لكل كيلوغرام من المذيب.",
          timestamp: new Date().toISOString()
        }
      ];
      setQaList(defaults);
      localStorage.setItem("dr_tamer_important_questions", JSON.stringify(defaults));
    }
  }, [isEn]);

  const handleAddQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newItem: QAPair = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      image: newImage || undefined,
      timestamp: new Date().toISOString()
    };

    const updated = [newItem, ...qaList];
    setQaList(updated);
    localStorage.setItem("dr_tamer_important_questions", JSON.stringify(updated));
    setNewQuestion("");
    setNewAnswer("");
    setNewImage(null);
    setIsAdding(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    if (!confirm(isEn ? "Are you sure you want to delete this question?" : "هل أنت متأكد من حذف هذا السؤال؟")) return;
    const updated = qaList.filter(item => item.id !== id);
    setQaList(updated);
    localStorage.setItem("dr_tamer_important_questions", JSON.stringify(updated));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "dr_tamer_2026") {
      setIsAdmin(true);
      localStorage.setItem("dr_tamer_admin_active", "true");
      setShowAdminPrompt(false);
      setAdminPassword("");
    } else {
      alert(isEn ? "Incorrect Password" : "كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("dr_tamer_admin_active");
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white flex items-center gap-3">
            <MessageSquareText className="w-7 h-7 md:w-8 md:h-8 text-amber-500" />
            {isEn ? "Important Q&A" : "أسئلة وإجابات هامة"}
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-bold mt-1">
            {isEn ? "Curated chemistry questions by Dr. Tamer" : "أسئلة مختارة في الكيمياء بواسطة د. تامر"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isAdmin ? (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95 text-sm"
              >
                {isAdding ? (isEn ? "Cancel" : "إلغاء") : (
                  <>
                    <Plus className="w-5 h-5" />
                    {isEn ? "Add New" : "إضافة سؤال"}
                  </>
                )}
              </button>
              <button 
                onClick={handleLogout}
                className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:text-rose-500 transition-all shadow-sm"
              >
                <Unlock className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAdminPrompt(true)}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-teal-600 font-bold transition-all text-xs"
            >
              <Lock className="w-4 h-4" />
              <span className="uppercase tracking-widest">{isEn ? "Admin Access" : "دخول الأدمن"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <h3 className="text-2xl font-black text-slate-850 dark:text-white mb-2 text-center">
                {isEn ? "Admin Login" : "تسجيل دخول الأدمن"}
              </h3>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="password"
                  autoFocus
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={isEn ? "Password" : "كلمة المرور"}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-teal-500 outline-hidden font-bold"
                />
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black shadow-lg">
                    {isEn ? "Unlock" : "فتح"}
                  </button>
                  <button type="button" onClick={() => setShowAdminPrompt(false)} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black">
                    {isEn ? "Back" : "رجوع"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add QA Form */}
      <AnimatePresence>
        {isAdmin && isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleAddQA} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-dashed border-amber-200 dark:border-amber-900 shadow-xl space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{isEn ? "Question" : "السؤال"}</label>
                <textarea 
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-amber-500 outline-hidden transition-all font-bold min-h-[100px]"
                  placeholder={isEn ? "Enter the question..." : "أدخل السؤال هنا..."}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{isEn ? "Image (Optional)" : "صورة (اختياري)"}</label>
                <div className="flex flex-col gap-4">
                  {!newImage ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-400">{isEn ? "Click to upload image" : "اضغط لرفع صورة"}</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  ) : (
                    <div className="relative w-full max-w-xs mx-auto">
                      <img src={newImage} alt="Preview" className="w-full h-auto rounded-2xl shadow-lg border-4 border-white dark:border-slate-800" />
                      <button 
                        type="button"
                        onClick={() => setNewImage(null)}
                        className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">{isEn ? "Answer" : "الإجابة"}</label>
                <textarea 
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-teal-500 outline-hidden transition-all font-bold min-h-[150px]"
                  placeholder={isEn ? "Enter the answer..." : "أدخل الإجابة هنا..."}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black shadow-xl hover:shadow-amber-200 transition-all active:scale-[0.98]"
              >
                {isEn ? "Save Question" : "حفظ السؤال"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions List */}
      <div className="space-y-6">
        {qaList.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">{isEn ? "No questions added yet." : "لم يتم إضافة أسئلة بعد."}</p>
          </div>
        ) : (
          qaList.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden ${expandedId === item.id ? 'ring-2 ring-amber-500/20' : ''}`}
            >
              <div 
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="p-6 flex items-start justify-between gap-4 cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight group-hover:text-amber-600 transition-colors">
                    {item.question}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  {expandedId === item.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
              </div>

              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 ml-14">
                      {item.image && (
                        <div className="mb-6 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl max-w-lg">
                          <img src={item.image} alt="Question Diagram" className="w-full h-auto" />
                        </div>
                      )}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-slate-700 dark:text-slate-300 font-bold whitespace-pre-wrap leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
                         <span>{isEn ? "Official Answer" : "إجابة معتمدة"}</span>
                         <span>{new Date(item.timestamp).toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
