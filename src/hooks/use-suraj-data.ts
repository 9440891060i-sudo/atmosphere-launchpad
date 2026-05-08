import { useState, useEffect } from "react";
import type { NarrativeData, NewsItem, CoinCard } from "@/pages/NarrativesPage";

const BASE = "/api";

/* ─── Helpers ─── */
const fmt = {
  price: (p: number) => p >= 1 ? `$${p.toLocaleString("en", { maximumFractionDigits: 2 })}` : `$${p.toFixed(4)}`,
  change: (c: number) => (c >= 0 ? `+${c.toFixed(1)}%` : `${c.toFixed(1)}%`),
  mc: (n: number) => n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(0)}M` : `$${n.toLocaleString()}`,
  date: (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const h = diff / 3.6e6;
    if (h < 1) return "just now";
    if (h < 24) return `${Math.floor(h)}h ago`;
    const days = Math.floor(h / 24);
    return days === 1 ? "1d ago" : `${days}d ago`;
  },
  tag: (s: string) => {
    const map: Record<string, string> = { HOT: "Hot", EMERGING: "Emerging", STABLE: "Stable", RECOVERING: "Recovering", BEARISH: "Bearish" };
    return map[s?.toUpperCase()] ?? s ?? "Stable";
  },
};

/* ─── News mapper ─── */
function mapNews(items: { headline: string; source?: string; date?: string; url?: string }[], importance: "major" | "minor"): NewsItem[] {
  return (items ?? []).map((n, i) => ({
    id: `${importance}-${i}`,
    title: n.headline,
    body: n.source ? `Source: ${n.source}` : "",
    time: n.date ? fmt.date(n.date) : "",
    url: n.url,
    importance,
  }));
}

/* ─── API types ─── */
interface ApiNarrative {
  id: string;
  name: string;
  signal_strength: number;
  status: string;
  summary: string;
  why_trending: string;
  top_news: { headline: string; source: string; date: string; url: string }[];
  x_pulse?: { volume: string; sentiment: string; top_accounts_talking: string[] };
  coins_in_narrative: string[];
  big_players_moving?: string[];
  last_updated: string;
}

interface ApiCoinSummary {
  ticker: string;
  name: string;
  price: number;
  change_7d: number;
  mc: number;
  volume_24h: number;
  ath_distance: number;
  opportunity_score: number;
  opportunity_flag: string;
  one_liner: string;
  narrative: string[];
  mc_tier: string;
  last_updated: string;
}

export interface ApiCoinDetail extends ApiCoinSummary {
  what_it_is: string;
  opportunity_flag_explanation: string;
  narrative_name: string;
  narrative_health: string;
  narrative_health_reason: string;
  narrative_news: { headline: string; source: string; date: string; url: string }[];
  coin_news: { headline: string; source: string; date: string; url: string }[];
  similar_coins: { ticker: string; name: string; mc_tier: string; mc: number; change_7d: number }[];
}

/* ─── Narrative mapper ─── */
function mapNarrative(n: ApiNarrative, coinsMap: Record<string, ApiCoinSummary>): NarrativeData {
  const coinsInSpace: CoinCard[] = (n.coins_in_narrative ?? [])
    .map((ticker) => {
      const c = coinsMap[ticker];
      if (!c) return null;
      return {
        id: ticker.toLowerCase(),
        symbol: ticker,
        name: c.name,
        price: fmt.price(c.price),
        change: fmt.change(c.change_7d),
        positive: c.change_7d >= 0,
        quickInfo: c.one_liner,
        tokenMetrics: [
          { label: "Market Cap", value: fmt.mc(c.mc) },
          { label: "24h Volume", value: fmt.mc(c.volume_24h) },
          { label: "Price", value: fmt.price(c.price) },
          { label: "7D Change", value: fmt.change(c.change_7d) },
        ],
        personalView: `Opportunity: ${(c.opportunity_flag ?? "").replace(/_/g, " ").toLowerCase()}. Score ${c.opportunity_score}/100.`,
      } as CoinCard;
    })
    .filter(Boolean) as CoinCard[];

  const news: NewsItem[] = mapNews(n.top_news ?? [], "major");

  return {
    id: n.id,
    title: n.name,
    score: n.signal_strength,
    tag: fmt.tag(n.status),
    summary: n.summary,
    detailedReport: n.why_trending,
    coinsInSpace,
    upcomingCoins: [],
    news,
    aiSummary: [
      n.why_trending,
      n.big_players_moving?.length ? `Big players moving: ${n.big_players_moving.join(", ")}.` : "",
      n.x_pulse ? `X sentiment: ${n.x_pulse.sentiment} (volume: ${n.x_pulse.volume}).` : "",
    ].filter(Boolean).join(" "),
  };
}

/* ─── Coin detail mapper ─── */
export interface MappedCoinDetail {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  positive: boolean;
  description: string;
  tokenMetrics: { label: string; value: string }[];
  news: NewsItem[];
  socialActivity: { platform: string; metric: string; value: string; trend: string; positive: boolean }[];
  similarCoinIds: string[];
  aiSummary: string;
  aiScore: number;
}

function mapCoinDetail(c: ApiCoinDetail): MappedCoinDetail {
  const news: NewsItem[] = [
    ...mapNews(c.coin_news ?? [], "major"),
    ...mapNews(c.narrative_news ?? [], "minor"),
  ];

  const socialActivity = c.x_pulse
    ? [
        { platform: "X (Twitter)", metric: "Volume", value: (c as any).x_pulse?.volume ?? "—", trend: "", positive: true },
        { platform: "X (Twitter)", metric: "Sentiment", value: (c as any).x_pulse?.sentiment ?? "—", trend: "", positive: true },
      ]
    : [];

  return {
    id: c.ticker.toLowerCase(),
    symbol: c.ticker,
    name: c.name,
    price: fmt.price(c.price),
    change24h: fmt.change(c.change_7d),
    positive: c.change_7d >= 0,
    description: c.what_it_is ?? c.one_liner,
    tokenMetrics: [
      { label: "Market Cap", value: fmt.mc(c.mc) },
      { label: "24h Volume", value: fmt.mc(c.volume_24h) },
      { label: "Price", value: fmt.price(c.price) },
      { label: "7D Change", value: fmt.change(c.change_7d) },
      { label: "From ATH", value: `${c.ath_distance?.toFixed(1)}%` },
      { label: "MC Tier", value: c.mc_tier ?? "—" },
      { label: "Narrative", value: (c.narrative ?? []).join(", ") },
      { label: "Status", value: c.product_status ?? "Live" },
    ],
    news,
    socialActivity,
    similarCoinIds: (c.similar_coins ?? []).map((s) => s.ticker.toLowerCase()),
    aiSummary: c.opportunity_flag_explanation ?? "",
    aiScore: c.opportunity_score,
  };
}

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */

export function useNarratives() {
  const [narratives, setNarratives] = useState<NarrativeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/narratives`).then((r) => r.json()),
      fetch(`${BASE}/coins`).then((r) => r.json()),
    ])
      .then(([narrativesRaw, coinsRaw]: [ApiNarrative[], ApiCoinSummary[]]) => {
        const coinsMap = Object.fromEntries((coinsRaw ?? []).map((c) => [c.ticker, c]));
        setNarratives(narrativesRaw.map((n) => mapNarrative(n, coinsMap)));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { narratives, loading, error };
}

export function useCoins() {
  const [coins, setCoins] = useState<ApiCoinSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/coins`)
      .then((r) => r.json())
      .then(setCoins)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { coins, loading };
}

export function useCoinDetail(ticker: string | null) {
  const [coin, setCoin] = useState<MappedCoinDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setCoin(null);
    fetch(`${BASE}/coins/${ticker.toUpperCase()}`)
      .then((r) => r.json())
      .then((c: ApiCoinDetail) => setCoin(mapCoinDetail(c)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ticker]);

  return { coin, loading };
}

export { fmt };
