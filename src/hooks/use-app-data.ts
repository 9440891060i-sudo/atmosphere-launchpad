import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { narratives as mockNarratives, type NarrativeData } from "@/pages/NarrativesPage";
import { allCoins as mockCoins } from "@/pages/CoinScanPage";

/* ─── Narrative shape from DB ─── */
interface DbNarrative {
  id: string;
  title: string;
  score: number;
  tag: string;
  summary: string;
  detailed_report: string;
  coins_in_space: NarrativeData["coinsInSpace"];
  upcoming_coins: NarrativeData["upcomingCoins"];
  news: NarrativeData["news"];
  ai_summary: string;
}

function mapNarrative(r: DbNarrative): NarrativeData {
  return {
    id: r.id,
    title: r.title,
    score: r.score,
    tag: r.tag,
    summary: r.summary,
    detailedReport: r.detailed_report,
    coinsInSpace: r.coins_in_space ?? [],
    upcomingCoins: r.upcoming_coins ?? [],
    news: r.news ?? [],
    aiSummary: r.ai_summary,
  };
}

/* ─── Coin shape from DB ─── */
interface DbCoin {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change_24h: string;
  positive: boolean;
  description: string;
  token_metrics: { label: string; value: string }[];
  news: NarrativeData["news"];
  social_activity: { platform: string; metric: string; value: string; trend: string; positive: boolean }[];
  similar_coin_ids: string[];
  ai_summary: string;
  ai_score: number;
}

export interface CoinData {
  id: string; symbol: string; name: string;
  price: string; change24h: string; positive: boolean;
  description: string;
  tokenMetrics: { label: string; value: string }[];
  news: NarrativeData["news"];
  socialActivity: { platform: string; metric: string; value: string; trend: string; positive: boolean }[];
  similarCoinIds: string[];
  aiSummary: string;
  aiScore: number;
}

function mapCoin(r: DbCoin): CoinData {
  return {
    id: r.id,
    symbol: r.symbol,
    name: r.name,
    price: r.price,
    change24h: r.change_24h,
    positive: r.positive,
    description: r.description,
    tokenMetrics: r.token_metrics ?? [],
    news: r.news ?? [],
    socialActivity: r.social_activity ?? [],
    similarCoinIds: r.similar_coin_ids ?? [],
    aiSummary: r.ai_summary,
    aiScore: r.ai_score,
  };
}

/* ─── Narratives hook ─── */
export function useNarratives() {
  const [data, setData] = useState<NarrativeData[]>(mockNarratives);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("narratives" as never)
      .select("*")
      .order("score", { ascending: false })
      .then(({ data: rows, error }) => {
        if (!error && rows && (rows as DbNarrative[]).length > 0) {
          setData((rows as DbNarrative[]).map(mapNarrative));
        }
        setLoading(false);
      });
  }, []);

  return { narratives: data, loading };
}

/* ─── Coins hook ─── */
export function useCoins() {
  const [data, setData] = useState<CoinData[]>(
    mockCoins.map((c) => ({
      id: c.id, symbol: c.symbol, name: c.name,
      price: c.price, change24h: c.change24h, positive: c.positive,
      description: "", tokenMetrics: [], news: [], socialActivity: [],
      similarCoinIds: [], aiSummary: "", aiScore: c.aiScore ?? 0,
    }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("coins" as never)
      .select("*")
      .order("ai_score", { ascending: false })
      .then(({ data: rows, error }) => {
        if (!error && rows && (rows as DbCoin[]).length > 0) {
          setData((rows as DbCoin[]).map(mapCoin));
        }
        setLoading(false);
      });
  }, []);

  return { coins: data, loading };
}
