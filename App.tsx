
import React, { useState, useCallback } from 'react';
import EmotionChart from './components/EmotionChart';
import ControlPanel from './components/ControlPanel';
import { EmotionPoint, AIAnalysis } from './types';
import { analyzeEmotionCurve } from './services/geminiService';

const App: React.FC = () => {
  const [points, setPoints] = useState<EmotionPoint[]>([
    { id: '1', time: 0, event: 'Tutorial Starts', intensity: 2, emoji: '🤔' },
    { id: '2', time: 5, event: 'First Enemy Encounter', intensity: 6, emoji: '😱' },
    { id: '3', time: 10, event: 'Loot Box Opened', intensity: 8, emoji: '💎' },
    { id: '4', time: 15, event: 'Minor Twist', intensity: -2, emoji: '🤨' },
  ]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addPoint = (point: EmotionPoint) => {
    setPoints(prev => [...prev, point]);
  };

  const removePoint = (id: string) => {
    setPoints(prev => prev.filter(p => p.id !== id));
  };

  const handleAnalyze = async () => {
    if (points.length < 2) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeEmotionCurve(points);
      setAnalysis(result);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">EmotionCurve</h1>
              <p className="text-xs text-slate-500 font-medium">Professional Game Design Tool</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(points));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href",     dataStr);
                downloadAnchorNode.setAttribute("download", "emotion_curve.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Export JSON
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || points.length < 2}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                isAnalyzing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : (
                <>
                  <span className="text-lg">🤖</span> AI Review
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Visualization and Analysis */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Visual Journey</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Player Experience
              </div>
            </div>
            <EmotionChart points={points} />
          </section>

          {/* AI Analysis Panel */}
          {analysis && (
            <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">Designer AI Feedback</h3>
                  <p className="text-xs text-indigo-700 opacity-70">Generated using Gemini Flash</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Overall Summary</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-indigo-100">
                      {analysis.summary}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Pacing & Flow</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-indigo-100">
                      {analysis.pacingFeedback}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Improvement Suggestions</h4>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-3 bg-white p-3 rounded-xl border border-indigo-100 text-sm text-slate-700 shadow-sm">
                        <span className="text-indigo-400 font-bold">#{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {!analysis && !isAnalyzing && (
            <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3">
              <span className="text-4xl opacity-50">📉</span>
              <p className="text-sm font-medium">Add some emotional beats and click "AI Review" for professional feedback.</p>
            </div>
          )}
        </div>

        {/* Right: Controls and List */}
        <div className="lg:col-span-4">
          <ControlPanel 
            onAdd={addPoint} 
            onRemove={removePoint} 
            points={points} 
          />
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-xs">
        &copy; 2024 GameDesign EmotionTool. Built for high-fidelity narrative design.
      </footer>
    </div>
  );
};

export default App;
