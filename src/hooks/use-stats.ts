import { useState, useCallback, useEffect } from "react";
import { supabase, supabaseConfigured } from "@/integrations/supabase/client";

interface Stats {
  applicants: number;
  earlyUsers: number;
  countries: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!supabaseConfigured) { setLoading(false); return; }
    const [statsResult, { count: profileCount }] = await Promise.all([
      supabase
        .from("platform_stats")
        .select("applicants, countries")
        .eq("id", 1)
        .single(),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),
    ]);

    const { data, error } = statsResult;

    // If row exists and has data, use it
    if (data && !error) {
      setStats({
        applicants: data.applicants ?? profileCount ?? 0,
        earlyUsers: profileCount ?? 0,
        countries:  data.countries ?? 0,
      });
    } else {
      // Row missing — still show real profile count, zeros for the rest
      setStats({
        applicants: profileCount ?? 0,
        earlyUsers: profileCount ?? 0,
        countries:  0,
      });

      // Try to seed the row so future loads work
      await supabase
        .from("platform_stats")
        .upsert({ id: 1, applicants: profileCount ?? 0, early_users: profileCount ?? 0, countries: 0 }, { onConflict: "id" });
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
