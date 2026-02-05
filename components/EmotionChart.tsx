
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList
} from 'recharts';
import { EmotionPoint } from '../types';

interface EmotionChartProps {
  points: EmotionPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
        <p className="font-bold text-slate-800 text-sm">Time: {data.time}m</p>
        <p className="text-indigo-600 font-medium">
          {data.emoji} {data.event}
        </p>
        <p className="text-xs text-slate-500 mt-1">Intensity: {data.intensity}</p>
      </div>
    );
  }
  return null;
};

const EmotionChart: React.FC<EmotionChartProps> = ({ points }) => {
  const sortedData = [...points].sort((a, b) => a.time - b.time);

  return (
    <div className="w-full h-[400px] bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sortedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            type="number"
            label={{ value: 'Time (minutes)', position: 'insideBottomRight', offset: -10, className: "text-xs fill-slate-400" }}
            stroke="#94a3b8"
          />
          <YAxis 
            domain={[-10, 10]} 
            ticks={[-10, -5, 0, 5, 10]}
            stroke="#94a3b8"
            label={{ value: 'Intensity', angle: -90, position: 'insideLeft', className: "text-xs fill-slate-400" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIntensity)"
            animationDuration={1000}
          >
            <LabelList 
               dataKey="emoji" 
               position="top" 
               offset={10} 
               className="text-lg"
               content={(props: any) => {
                 const { x, y, value } = props;
                 return <text x={x} y={y - 5} fill="#6366f1" fontSize={20} textAnchor="middle">{value}</text>;
               }}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionChart;
