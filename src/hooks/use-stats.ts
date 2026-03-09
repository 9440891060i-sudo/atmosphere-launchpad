import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  applicants: number;
  earlyUsers: number;
  countries: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const { data, error } = await supabase
      .from("platform_stats")
      .select("applicants, early_users, countries")
      .eq("id", 1)
      .single();
    if (data && !error) {
      setStats({
        applicants: data.applicants,
        earlyUsers: data.early_users,
        countries: data.countries,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const incrementApplicants = useCallback(async () => {
    const { data } = await supabase
      .from("platform_stats")
      .select("applicants")
      .eq("id", 1)
      .single();
    if (data) {
      await supabase
        .from("platform_stats")
        .update({ applicants: data.applicants + 1 })
        .eq("id", 1);
      fetchStats();
    }
  }, [fetchStats]);

  const updateStats = useCallback(async (partial: Partial<Stats>) => {
    const updateData: Record<string, number> = {};
    if (partial.applicants !== undefined) updateData.applicants = partial.applicants;
    if (partial.earlyUsers !== undefined) updateData.early_users = partial.earlyUsers;
    if (partial.countries !== undefined) updateData.countries = partial.countries;
    
    await supabase
      .from("platform_stats")
      .update(updateData)
      .eq("id", 1);
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, incrementApplicants, updateStats, refreshStats: fetchStats };
}
