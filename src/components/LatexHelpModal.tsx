import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sigma, FlaskConical, Info, CheckCircle2 } from "lucide-react";

interface LatexHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
}

export default function LatexHelpModal({ isOpen, onClose, lang }: LatexHelpModalProps) {
  const isEn = lang === "en";

  const examples = [
    {
      title: isEn ? "Chemical Formulas" : "الصيغ الكيميائية",
      latex: "H_{2}SO_{4}",
      description: isEn ? "Use underscores for subscripts" : "استخدم الخط السفلي (_) للأرقام السفلية"
    },
    {
      title: isEn ? "Ionic Charges" : "الشحنات الأيونية",
      latex: "Ca^{2+}",
      description: isEn ? "Use carets for superscripts" : "استخدم علامة (^) للأرقام العلوية (الشحنات)"
    },
    {
      title: isEn ? "Chemical Equilibrium" : "الاتزان الكيميائي",
      latex: "A \rightleftharpoons B",
      description: isEn ? "Use \\rightleftharpoons for reversible reactions" : "استخدم \\rightleftharpoons للتفاعلات الانعكاسية"
    },
    {
      title: isEn ? "Reaction Arrows" : "سهم التفاعل",
      latex: "C + O_{2} \rightarrow CO_{2}",
      description: isEn ? "Use \\rightarrow for standard reactions" : "استخدم \\rightarrow لسهم التفاعل العادي"
    },
    {
      title: isEn ? "Mathematical Fractions" : "الكسور الرياضية",
      latex: "\frac{n}{V} = M",
      description: isEn ? "Use \\frac{numerator}{denominator}" : "استخدم \\frac{البسط}{المقام} للكسور"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-indigo-600 to-teal-600 p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    <Sigma className="w-7 h-7" />
                    {isEn ? "LaTeX Syntax Guide" : "دليل رموز LaTeX"}
                  </h3>
                  <p className="text-indigo-100 font-bold mt-1">
                    {isEn ? "How to input formulas for better AI accuracy" : "كيفية إدخال الصيغ لزيادة دقة الذكاء الاصطناعي"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex gap-3">
                   <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                   <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 leading-relaxed">
                     {isEn 
                       ? "The AI understands standard text, but using LaTeX symbols ensures precise mathematical and chemical interpretation."
                       : "يفهم الذكاء الاصطناعي النص العادي، لكن استخدام رموز LaTeX يضمن التفسير الدقيق للمعادلات الكيميائية والرياضية."}
                   </p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-800 flex gap-3">
                   <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-1" />
                   <p className="text-xs font-bold text-teal-900 dark:text-teal-300 leading-relaxed">
                     {isEn 
                       ? "Wrap complex formulas in single $ for inline or double $$ for block equations."
                       : "ضع الصيغ المعقدة بين علامتي $ للمعادلات السطرية أو $$ للمعادلات المنفصلة."}
                   </p>
                </div>
              </div>

              <div className="space-y-4">
                {examples.map((ex, idx) => (
                  <div key={idx} className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-300 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{ex.title}</span>
                      <FlaskConical className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <code className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl text-indigo-600 dark:text-indigo-400 font-mono text-sm border border-slate-100 dark:border-slate-800">
                        {ex.latex}
                      </code>
                      <p className="text-xs font-bold text-slate-500 text-right">
                        {ex.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-center">
                 <p className="text-white font-black text-sm mb-4">
                   {isEn ? "Ready to solve your problem?" : "هل أنت مستعد لحل مسألتك؟"}
                 </p>
                 <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20"
                 >
                   {isEn ? "Start Solving" : "ابدأ الحل الآن"}
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
