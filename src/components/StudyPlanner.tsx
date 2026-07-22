import { useState } from "react";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { trackStudyPlanCreated } from "../utils/analytics";

export default function StudyPlanner({ lang }: { lang: "ar" | "en" }) {
  const [sessions, setSessions] = useState<{ id: number; topic: string; date: string }[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [newDate, setNewDate] = useState("");

  const addSession = () => {
    if (newTopic && newDate) {
      setSessions([...sessions, { id: Date.now(), topic: newTopic, date: newDate }]);
      setNewTopic("");
      setNewDate("");
      trackStudyPlanCreated();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        {lang === "en" ? "Study Planner" : "مخطط الدراسة"}
      </h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder={lang === "en" ? "Topic" : "الموضوع"}
          className="flex-grow p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <input
          type="date"
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <button
          onClick={addSession}
          className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {sessions.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
          >
            <div>
              <p className="font-bold">{s.topic}</p>
              <p className="text-xs text-slate-500">{s.date}</p>
            </div>
            <button
              onClick={() => setSessions(sessions.filter((ses) => ses.id !== s.id))}
              className="text-rose-500 hover:text-rose-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
