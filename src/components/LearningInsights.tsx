import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Stats {
  topic: string;
  percentage: number;
  timestamp: string;
}

interface LearningInsightsProps {
  stats: Stats[];
  lang: "ar" | "en";
}

export default function LearningInsights({ stats, lang }: LearningInsightsProps) {
  const isEn = lang === "en";
  
  // Prepare data for chart
  const data = stats.map(s => ({
    topic: s.topic,
    accuracy: s.percentage,
    date: s.timestamp.split(" - ")[0]
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-150 dark:border-slate-800 shadow-xl">
      <h3 className="text-xl font-black text-slate-850 dark:text-white mb-6">
        {isEn ? "Learning Insights" : "تحليلات التعلم"}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accuracy" name={isEn ? "Accuracy (%)" : "نسبة الدقة (%)"} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
