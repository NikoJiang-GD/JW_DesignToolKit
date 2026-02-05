
import React, { useState } from 'react';
import { EmotionPoint } from '../types';
import { EMOTION_PRESETS } from '../constants';

interface ControlPanelProps {
  onAdd: (point: EmotionPoint) => void;
  onRemove: (id: string) => void;
  points: EmotionPoint[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onAdd, onRemove, points }) => {
  const [formData, setFormData] = useState({
    time: 0,
    event: '',
    intensity: 0,
    emoji: '😐'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event) return;
    
    onAdd({
      ...formData,
      id: Math.random().toString(36).substr(2, 9)
    });
    
    setFormData({ ...formData, event: '' });
  };

  const selectPreset = (preset: typeof EMOTION_PRESETS[0]) => {
    setFormData({ ...formData, intensity: preset.value, emoji: preset.emoji });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span>✨</span> Add Emotional Beat
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Time (Min)</label>
              <input
                type="number"
                step="0.5"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Intensity ({formData.intensity})</label>
              <input
                type="range"
                min="-10"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-4"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Game Event / Beat</label>
            <input
              type="text"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g. Boss Entrance, Hidden Loot Found"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Emotion Presets</label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => selectPreset(p)}
                  className={`flex flex-col items-center p-2 rounded-lg border transition-all text-sm ${
                    formData.intensity === p.value 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' 
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[10px] font-medium mt-1 uppercase">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            Add to Curve
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span>📋</span> Current Sequence
        </h2>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {[...points].sort((a,b) => a.time - b.time).map((p) => (
            <div key={p.id} className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-700">{p.event}</div>
                  <div className="text-xs text-slate-400">At {p.time}m • Intensity: {p.intensity}</div>
                </div>
              </div>
              <button 
                onClick={() => onRemove(p.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {points.length === 0 && (
            <div className="text-center py-8 text-slate-400 italic text-sm">
              No emotional beats added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
