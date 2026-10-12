// Sample data shown when the live backends (Supabase / narratives API) are unreachable.
// All figures are illustrative placeholders, not real market or user data.
import type { NarrativeData } from "@/pages/NarrativesPage";
import type { ApiCoinSummary, ApiCoinDetail } from "@/hooks/use-suraj-data";

export const MOCK_STATS = { applicants: 2184, earlyUsers: 612, countries: 11 };

const now = new Date().toISOString();

const coin = (
  ticker: string, name: string, price: number, change_7d: number, mc: number, volume_24h: number,
  ath_distance: number, opportunity_score: number, one_liner: string, narrative: string[], mc_tier: string,
): ApiCoinSummary => ({
  ticker, name, price, change_7d, mc, volume_24h, ath_distance, opportunity_score,
  opportunity_flag: opportunity_score >= 75 ? "STRONG" : "WATCH",
  one_liner, narrative, mc_tier, last_updated: now,
});

export const MOCK_COINS: ApiCoinSummary[] = [
  coin("POL", "Polygon", 0.52, 6.8, 5_100_000_000, 210_000_000, -78.4, 84, "Ethereum scaling network founded in Bengaluru, powering India-built dApps and enterprise pilots.", ["India Web3 Builders", "Layer 2"], "Large"),
  coin("ETH", "Ethereum", 3150, 2.4, 378_000_000_000, 14_200_000_000, -35.1, 78, "Settlement layer for most Indian DeFi and tokenization experiments.", ["Layer 2", "DeFi"], "Mega"),
  coin("SOL", "Solana", 168, 9.1, 78_000_000_000, 3_100_000_000, -31.7, 81, "High-throughput chain with a fast-growing Indian developer community and payments pilots.", ["Payments & Stablecoins", "Layer 1"], "Mega"),
  coin("BTC", "Bitcoin", 64200, 1.2, 1_270_000_000_000, 28_500_000_000, -12.9, 72, "Digital store of value; largest share of Indian retail crypto volume.", ["Store of Value"], "Mega"),
  coin("BNB", "BNB", 585, -0.8, 85_000_000_000, 1_900_000_000, -18.4, 66, "Exchange token with deep INR on-ramp liquidity across Indian platforms.", ["Exchange Tokens"], "Mega"),
  coin("WRX", "WazirX Token", 0.11, 14.3, 42_000_000, 3_400_000, -97.2, 58, "Early Indian exchange token; high-risk, driven by recovery and restructuring news.", ["India Web3 Builders", "Exchange Tokens"], "Small"),
];

export function mockCoinDetail(ticker: string): ApiCoinDetail | null {
  const c = MOCK_COINS.find((x) => x.ticker === ticker.toUpperCase());
  if (!c) return null;
  return {
    ...c,
    what_it_is: c.one_liner,
    opportunity_flag_explanation: `${c.name} scores ${c.opportunity_score}/100 in this sample view, reflecting adoption among Indian builders and traders, liquidity depth and recent momentum.`,
    narrative_name: c.narrative[0],
    narrative_health: "Healthy",
    narrative_health_reason: "Sample data for demonstration purposes.",
    narrative_news: [
      { headline: "Indian developers ship record number of on-chain apps this quarter", source: "Sample Wire", date: now, url: "" },
    ],
    coin_news: [
      { headline: `${c.name} sees rising interest from Bengaluru and Hyderabad builder communities`, source: "Sample Wire", date: now, url: "" },
    ],
    similar_coins: MOCK_COINS.filter((x) => x.ticker !== c.ticker).slice(0, 3).map((x) => ({
      ticker: x.ticker, name: x.name, mc_tier: x.mc_tier, mc: x.mc, change_7d: x.change_7d,
    })),
  } as ApiCoinDetail;
}

export const MOCK_INDIA_NARRATIVES: NarrativeData[] = [
  {
    id: "india-web3", title: "India Web3 Builders", score: 86, tag: "Trending",
    summary: "Indian founders and developers are among the largest contributors to global Web3 repos. Hubs in Bengaluru, Hyderabad and Delhi NCR are producing infra, payments and consumer apps.",
    detailedReport: "India now has one of the largest pools of Web3 developers worldwide. Hackathons and accelerators in Bengaluru, Hyderabad and Delhi NCR are producing startups across infrastructure, payments and consumer apps. Regulatory clarity on taxation and reporting is still evolving, but builder activity and community events keep growing quarter over quarter. (Sample data.)",
    news: [
      { id: "in1", title: "Bengaluru hosts largest Web3 builder summit in South Asia", body: "Thousands of developers and founders attended a three-day summit focused on infrastructure, payments and onchain consumer apps.", time: "3h ago", importance: "major" },
      { id: "in2", title: "Hyderabad accelerator opens applications for 40 early-stage startups", body: "The cohort targets seed-stage teams building financial infrastructure and developer tooling.", time: "9h ago", importance: "minor" },
    ],
    coinsInSpace: [
      { id: "pol", symbol: "POL", name: "Polygon", price: "$0.52", change: "+6.8%", positive: true, quickInfo: "Ethereum scaling network founded in Bengaluru.", tokenMetrics: [{ label: "Market Cap", value: "$5.10B" }, { label: "24h Volume", value: "$210M" }, { label: "Price", value: "$0.52" }, { label: "7D Change", value: "+6.8%" }], personalView: "Strong India mindshare and enterprise partnerships. Sample commentary." },
      { id: "wrx", symbol: "WRX", name: "WazirX Token", price: "$0.11", change: "+14.3%", positive: true, quickInfo: "Early Indian exchange token; high risk.", tokenMetrics: [{ label: "Market Cap", value: "$42M" }, { label: "24h Volume", value: "$3.4M" }, { label: "Price", value: "$0.11" }, { label: "7D Change", value: "+14.3%" }], personalView: "Speculative and news-driven. Sample commentary." },
    ],
    upcomingCoins: [
      { id: "bhrt", symbol: "BHRT", name: "Bharat Rails", quickInfo: "INR-denominated payments rails on an L2", tkm: "$40M FDV · 18% TGE", launchDate: "Q1 2027" },
    ],
    aiSummary: "India Web3 Builders scores 86/100 in this sample view, driven by developer growth, active hackathons and rising founder interest across Bengaluru, Hyderabad and Delhi NCR.",
  },
  {
    id: "india-payments", title: "UPI & Stablecoin Payments", score: 79, tag: "Emerging",
    summary: "UPI processes billions of transactions a month, and builders are exploring how stablecoins and onchain rails can complement it for cross-border and remittance use cases.",
    detailedReport: "UPI has made instant payments ubiquitous in India. Startups are now exploring stablecoin settlement for cross-border remittances and merchant payouts, while regulators continue to define the boundaries. Interest is highest in remittance corridors from the Gulf and North America. (Sample data.)",
    news: [
      { id: "ip1", title: "Fintech startups pilot stablecoin settlement for Gulf–India remittances", body: "Pilots aim to cut settlement time from days to minutes while staying within current reporting norms.", time: "5h ago", importance: "major" },
      { id: "ip2", title: "Mumbai fintech meetup draws record founder attendance", body: "Founders compared notes on compliance, banking partners and onboarding flows.", time: "1d ago", importance: "minor" },
    ],
    coinsInSpace: [
      { id: "sol", symbol: "SOL", name: "Solana", price: "$168", change: "+9.1%", positive: true, quickInfo: "Fast, low-fee chain popular for payments pilots.", tokenMetrics: [{ label: "Market Cap", value: "$78.0B" }, { label: "24h Volume", value: "$3.10B" }, { label: "Price", value: "$168" }, { label: "7D Change", value: "+9.1%" }], personalView: "Payments throughput is a strength. Sample commentary." },
      { id: "eth", symbol: "ETH", name: "Ethereum", price: "$3,150", change: "+2.4%", positive: true, quickInfo: "Primary settlement layer for stablecoins.", tokenMetrics: [{ label: "Market Cap", value: "$378B" }, { label: "24h Volume", value: "$14.2B" }, { label: "Price", value: "$3,150" }, { label: "7D Change", value: "+2.4%" }], personalView: "Deepest stablecoin liquidity. Sample commentary." },
    ],
    upcomingCoins: [],
    aiSummary: "UPI & Stablecoin Payments scores 79/100 in this sample view. Demand is strongest in remittance corridors; regulatory clarity is the main swing factor.",
  },
];
