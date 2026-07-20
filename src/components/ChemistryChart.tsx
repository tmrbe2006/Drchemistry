import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

interface ChartData {
  type: "line" | "scatter";
  data: any[];
  xAxisLabel: string;
  yAxisLabel: string;
}

interface ChemistryChartProps {
  chartData: ChartData;
  lang: "ar" | "en";
}

export default function ChemistryChart({ chartData, lang }: ChemistryChartProps) {
  const isEn = lang === "en";

  return (
    <div className="w-full h-[350px] mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2 flex justify-between items-center">
        <span>{isEn ? "Data Visualization" : "تمثيل بياني للبيانات"}</span>
        <span className="text-indigo-500">{chartData.type === 'line' ? (isEn ? 'Reaction Curve' : 'منحنى التفاعل') : (isEn ? 'Scatter Plot' : 'مخطط تشتت')}</span>
      </h4>
      
      <ResponsiveContainer width="100%" height="100%">
        {chartData.type === "line" ? (
          <LineChart data={chartData.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="x" 
              label={{ value: chartData.xAxisLabel, position: 'insideBottomRight', offset: -10, fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              label={{ value: chartData.yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line 
              type="monotone" 
              dataKey="y" 
              name={chartData.yAxisLabel}
              stroke="#6366f1" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              animationDuration={2000}
            />
          </LineChart>
        ) : (
          <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={chartData.xAxisLabel} 
              label={{ value: chartData.xAxisLabel, position: 'insideBottomRight', offset: -10, fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={chartData.yAxisLabel} 
              label={{ value: chartData.yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <ZAxis type="number" range={[64, 144]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Legend verticalAlign="top" height={36}/>
            <Scatter 
              name={chartData.yAxisLabel} 
              data={chartData.data} 
              fill="#14b8a6" 
              animationDuration={2000}
            />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
