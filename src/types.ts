export interface SolvedProblem {
  id: string;
  prompt: string;
  image?: string; // base64 representation
  mimeType?: string; // image/jpeg, application/pdf, etc.
  solution: string;
  timestamp: string;
  topic?: string;
  isBookmarked?: boolean;
  followUps?: { role: "user" | "assistant"; text: string }[];
  chartData?: any;
  model?: string;
}

export interface Exam {
  id: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  date: string;
  score: number;
  questions: { question: string; answer: string; feedback: string }[];
}

export interface QuizResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

export interface Stats {
  id: string;
  topic: string;
  percentage: number;
  timestamp: string;
  results?: QuizResult[];
}

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  nameAr: string;
  mass: number;
  category: string; // alkali, transition, noble, nonmetal, etc.
  group: number;
  period: number;
  electronConfig: string;
  summaryAr: string;
  summaryEn: string;
}
