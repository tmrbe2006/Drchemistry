import { useState } from "react";
import { X, BookOpenText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function QuickReferenceModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <BookOpenText className="w-5 h-5 text-teal-600" />
            Quick Reference
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 text-sm font-semibold">
          <p><strong>Avogadro's constant:</strong> 6.022 × 10²³ mol⁻¹</p>
          <p><strong>Ideal Gas Law:</strong> PV = nRT</p>
          <p><strong>Speed of light:</strong> 3.00 × 10⁸ m/s</p>
          <p><strong>Planck's constant:</strong> 6.626 × 10⁻³⁴ J·s</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
