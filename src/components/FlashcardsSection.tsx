import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw } from "lucide-react";
import { trackFlashcardView } from "../utils/analytics";

const FLASHCARDS = [
  { front: "H", back: "Hydrogen", category: "Element" },
  { front: "He", back: "Helium", category: "Element" },
  { front: "H2O", back: "Water", category: "Compound" },
  { front: "CO2", back: "Carbon Dioxide", category: "Compound" },
  { front: "NaCl", back: "Sodium Chloride", category: "Compound" },
];

export default function FlashcardsSection({ lang }: { lang: "ar" | "en" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = FLASHCARDS[currentIndex];

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS.length);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        {lang === "en" ? "Chemical Flashcards" : "بطاقات الكيمياء التعليمية"}
      </h2>
      
      <motion.div
        className="w-full max-w-sm h-64 cursor-pointer relative"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => {
          setFlipped(!flipped);
          trackFlashcardView();
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-teal-600 text-white text-4xl font-bold rounded-2xl shadow-lg backface-hidden">
          {card.front}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 text-white text-2xl font-bold rounded-2xl shadow-lg backface-hidden" style={{ transform: "rotateY(180deg)" }}>
          {card.back}
        </div>
      </motion.div>

      <button
        onClick={nextCard}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
      >
        <RefreshCw className="w-5 h-5" />
        {lang === "en" ? "Next Card" : "البطاقة التالية"}
      </button>
    </div>
  );
}
