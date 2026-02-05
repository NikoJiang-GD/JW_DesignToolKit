
export interface EmotionPoint {
  id: string;
  time: number; // Time in minutes or generic unit
  event: string;
  intensity: number; // -10 to 10
  emoji: string;
}

export interface AIAnalysis {
  summary: string;
  pacingFeedback: string;
  suggestions: string[];
}
