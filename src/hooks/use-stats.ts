import { useState, useCallback, useEffect } from "react";

const STATS_KEY = "atmosphere_stats";

interface Stats {
  applicants: number;
  earlyUsers: number;
  countries: number;
}

const defaultStats: Stats = { applicants: 2400, earlyUsers: 580, countries: 12 };

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultStats;
}

function saveStats(stats: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(loadStats);

  useEffect(() => { saveStats(stats); }, [stats]);

  const incrementApplicants = useCallback(() => {
    setStats(s => ({ ...s, applicants: s.applicants + 1 }));
  }, []);

  const updateStats = useCallback((partial: Partial<Stats>) => {
    setStats(s => ({ ...s, ...partial }));
  }, []);

  return { stats, incrementApplicants, updateStats };
}
