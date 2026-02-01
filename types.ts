
export type Language = 'uz' | 'ru' | 'en';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO string (YYYY-MM-DD)
  timeEstimation?: string; // Light timeboxing from PDF
  tags: string[]; // For #goal tracking
}

export interface DailySummary {
  date: string;
  completedCount: number;
  totalCount: number;
  aiInsight?: string;
}

export interface Recommendation {
  title: string;
  content: string;
  type: 'productivity' | 'wellness' | 'focus';
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}
