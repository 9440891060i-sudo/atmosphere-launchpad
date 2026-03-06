import { useState, useCallback, useEffect } from "react";

const STATS_KEY = "atmosphere_stats";
const STATS_UPDATED_EVENT = "atmosphere_stats_updated";

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

  // Sync across tabs, same-tab custom events, and re-focus
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STATS_KEY && e.newValue) {
        try { setStats(JSON.parse(e.newValue)); } catch {}
      }
    };
    const refresh = () => setStats(loadStats());
    window.addEventListener("storage", onStorage);
    window.addEventListener(STATS_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(STATS_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const incrementApplicants = useCallback(() => {
    setStats(s => {
      const next = { ...s, applicants: s.applicants + 1 };
      saveStats(next);
      window.dispatchEvent(new Event(STATS_UPDATED_EVENT));
      return next;
    });
  }, []);

  const updateStats = useCallback((partial: Partial<Stats>) => {
    setStats(s => {
      const next = { ...s, ...partial };
      saveStats(next);
      window.dispatchEvent(new Event(STATS_UPDATED_EVENT));
      return next;
    });
  }, []);

  return { stats, incrementApplicants, updateStats };
}
