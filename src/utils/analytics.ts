export interface DailyStats {
  date: string; // YYYY-MM-DD
  visits: number;
  videoViews: number;
  downloads: number;
  quizzes: number;
  aiQueries: number;
  flashcards: number;
}

export interface AnalyticsStats {
  totalVisits: number;
  totalVideoViews: number;
  totalDownloads: number;
  totalQuizzes: number;
  totalAiQueries: number;
  totalFlashcards: number;
  totalPeriodicClicks: number;
  totalPronunciations: number;
  totalExamsGenerated: number;
  totalStudyPlans: number;
  dailyTrend: DailyStats[];
  videoDetails: Record<string, number>; // title -> play count
  downloadDetails: Record<string, number>; // title -> download count
}

const STORAGE_KEY = "dr_tamer_analytics_v1";

// Helper to get formatted date string
const getTodayString = (): string => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

// Generate realistic mock data for the last 7 days as baseline
const generateBaselineStats = (): AnalyticsStats => {
  const dailyTrend: DailyStats[] = [];
  const today = new Date();
  
  // Create last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    
    // Some random but structured realistic numbers
    const visits = Math.floor(120 + Math.sin(i) * 40 + Math.random() * 30);
    const videoViews = Math.floor(45 + Math.cos(i) * 15 + Math.random() * 10);
    const downloads = Math.floor(20 + Math.sin(i * 1.5) * 8 + Math.random() * 5);
    const quizzes = Math.floor(30 + Math.cos(i * 1.2) * 12 + Math.random() * 8);
    const aiQueries = Math.floor(75 + Math.sin(i * 2) * 25 + Math.random() * 15);
    const flashcards = Math.floor(50 + Math.cos(i) * 20 + Math.random() * 12);

    dailyTrend.push({
      date: dateStr,
      visits,
      videoViews,
      downloads,
      quizzes,
      aiQueries,
      flashcards
    });
  }

  // Aggregate totals
  const totalVisits = dailyTrend.reduce((sum, item) => sum + item.visits, 0) + 1450; // Add pre-existing historical base
  const totalVideoViews = dailyTrend.reduce((sum, item) => sum + item.videoViews, 0) + 480;
  const totalDownloads = dailyTrend.reduce((sum, item) => sum + item.downloads, 0) + 210;
  const totalQuizzes = dailyTrend.reduce((sum, item) => sum + item.quizzes, 0) + 310;
  const totalAiQueries = dailyTrend.reduce((sum, item) => sum + item.aiQueries, 0) + 790;
  const totalFlashcards = dailyTrend.reduce((sum, item) => sum + item.flashcards, 0) + 640;

  return {
    totalVisits,
    totalVideoViews,
    totalDownloads,
    totalQuizzes,
    totalAiQueries,
    totalFlashcards,
    totalPeriodicClicks: 320,
    totalPronunciations: 180,
    totalExamsGenerated: 95,
    totalStudyPlans: 42,
    dailyTrend,
    videoDetails: {
      "مقدمة في الكيمياء العضوية": 142,
      "تفاعلات الأكسدة والاختزال": 98,
      "حساب ثابت الاتزان Kc": 85,
      "قوانين الغازات المثالية": 76,
      "معايرة الأحماض والقواعد": 112,
      "Welcome to Chemistry": 47
    },
    downloadDetails: {
      "ملخص القوانين الكيميائية الباب الأول.pdf": 92,
      "كتيب تسمية المركبات العضوية.pdf": 68,
      "أوراق مراجعة ليلة الامتحان 2026.pdf": 115,
      "جدول الكتل المولية للعناصر الشائعة.pdf": 54
    }
  };
};

// Safely get or initialize stats
export const getAnalyticsStats = (): AnalyticsStats => {
  if (typeof window === "undefined") return generateBaselineStats();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading analytics", e);
    }
  }
  const baseline = generateBaselineStats();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(baseline));
  return baseline;
};

// Save stats
export const saveAnalyticsStats = (stats: AnalyticsStats): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

// Update active day's trend record
const updateTodayTrend = (stats: AnalyticsStats, field: keyof DailyStats, amount = 1) => {
  const todayStr = getTodayString();
  let todayRecord = stats.dailyTrend.find(item => item.date === todayStr);
  
  if (!todayRecord) {
    // If today doesn't exist, create a new record and trim trend list to max 14 days
    todayRecord = {
      date: todayStr,
      visits: 0,
      videoViews: 0,
      downloads: 0,
      quizzes: 0,
      aiQueries: 0,
      flashcards: 0
    };
    stats.dailyTrend.push(todayRecord);
    if (stats.dailyTrend.length > 14) {
      stats.dailyTrend.shift();
    }
  }
  
  // Safely update today's trend
  if (field !== "date") {
    (todayRecord[field] as number) += amount;
  }
};

// Tracking actions
export const trackPageVisit = (): void => {
  const stats = getAnalyticsStats();
  stats.totalVisits += 1;
  updateTodayTrend(stats, "visits");
  saveAnalyticsStats(stats);
};

export const trackVideoView = (title = "فيديو غير محدد"): void => {
  const stats = getAnalyticsStats();
  stats.totalVideoViews += 1;
  stats.videoDetails[title] = (stats.videoDetails[title] || 0) + 1;
  updateTodayTrend(stats, "videoViews");
  saveAnalyticsStats(stats);
};

export const trackDownload = (title = "ملخص كيميائي"): void => {
  const stats = getAnalyticsStats();
  stats.totalDownloads += 1;
  stats.downloadDetails[title] = (stats.downloadDetails[title] || 0) + 1;
  updateTodayTrend(stats, "downloads");
  saveAnalyticsStats(stats);
};

export const trackQuizAttempt = (): void => {
  const stats = getAnalyticsStats();
  stats.totalQuizzes += 1;
  updateTodayTrend(stats, "quizzes");
  saveAnalyticsStats(stats);
};

export const trackAISolved = (): void => {
  const stats = getAnalyticsStats();
  stats.totalAiQueries += 1;
  updateTodayTrend(stats, "aiQueries");
  saveAnalyticsStats(stats);
};

export const trackFlashcardView = (): void => {
  const stats = getAnalyticsStats();
  stats.totalFlashcards += 1;
  updateTodayTrend(stats, "flashcards");
  saveAnalyticsStats(stats);
};

export const trackPeriodicClick = (): void => {
  const stats = getAnalyticsStats();
  stats.totalPeriodicClicks += 1;
  saveAnalyticsStats(stats);
};

export const trackPronunciationPlay = (): void => {
  const stats = getAnalyticsStats();
  stats.totalPronunciations += 1;
  saveAnalyticsStats(stats);
};

export const trackExamGenerated = (): void => {
  const stats = getAnalyticsStats();
  stats.totalExamsGenerated += 1;
  saveAnalyticsStats(stats);
};

export const trackStudyPlanCreated = (): void => {
  const stats = getAnalyticsStats();
  stats.totalStudyPlans += 1;
  saveAnalyticsStats(stats);
};

// Simulate random stats increase
export const simulateTraffic = (): AnalyticsStats => {
  const stats = getAnalyticsStats();
  
  // Add some random increments
  const visits = Math.floor(10 + Math.random() * 20);
  const videos = Math.floor(3 + Math.random() * 8);
  const downloads = Math.floor(1 + Math.random() * 4);
  const quizzes = Math.floor(2 + Math.random() * 5);
  const aiQueries = Math.floor(5 + Math.random() * 10);
  const flashcards = Math.floor(4 + Math.random() * 8);

  stats.totalVisits += visits;
  stats.totalVideoViews += videos;
  stats.totalDownloads += downloads;
  stats.totalQuizzes += quizzes;
  stats.totalAiQueries += aiQueries;
  stats.totalFlashcards += flashcards;
  stats.totalPeriodicClicks += Math.floor(Math.random() * 5);
  stats.totalPronunciations += Math.floor(Math.random() * 4);
  stats.totalExamsGenerated += Math.floor(Math.random() * 2);
  stats.totalStudyPlans += Math.floor(Math.random() * 1);

  // Update details with random picks
  const videoKeys = Object.keys(stats.videoDetails);
  if (videoKeys.length > 0) {
    const randomVideo = videoKeys[Math.floor(Math.random() * videoKeys.length)];
    stats.videoDetails[randomVideo] += videos;
  }
  
  const downloadKeys = Object.keys(stats.downloadDetails);
  if (downloadKeys.length > 0) {
    const randomDownload = downloadKeys[Math.floor(Math.random() * downloadKeys.length)];
    stats.downloadDetails[randomDownload] += downloads;
  }

  updateTodayTrend(stats, "visits", visits);
  updateTodayTrend(stats, "videoViews", videos);
  updateTodayTrend(stats, "downloads", downloads);
  updateTodayTrend(stats, "quizzes", quizzes);
  updateTodayTrend(stats, "aiQueries", aiQueries);
  updateTodayTrend(stats, "flashcards", flashcards);

  saveAnalyticsStats(stats);
  return stats;
};

// Reset stats back to zero (excluding the baseline generators)
export const resetAnalyticsStats = (): AnalyticsStats => {
  const cleared: AnalyticsStats = {
    totalVisits: 0,
    totalVideoViews: 0,
    totalDownloads: 0,
    totalQuizzes: 0,
    totalAiQueries: 0,
    totalFlashcards: 0,
    totalPeriodicClicks: 0,
    totalPronunciations: 0,
    totalExamsGenerated: 0,
    totalStudyPlans: 0,
    dailyTrend: [
      {
        date: getTodayString(),
        visits: 0,
        videoViews: 0,
        downloads: 0,
        quizzes: 0,
        aiQueries: 0,
        flashcards: 0
      }
    ],
    videoDetails: {},
    downloadDetails: {}
  };
  saveAnalyticsStats(cleared);
  return cleared;
};
