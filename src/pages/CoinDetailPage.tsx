import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { AppTabBar } from "./NarrativesPage";
import atmosphereLogo from "@/assets/atmosphere-logo.png";

/* ─── Types ─── */
type TimeFilter = "1D" | "7D" | "1m" | "1y";
type NewsImportance = "major" | "minor";

/* ─── Mock Coin Data ─── */
const coinData: Record<
  string,
  {
    symbol: string;
    name: string;
    price: string;
    change24h: string;
    positive: boolean;
    description: string;
    tokenMetrics: { label: string; value: string }[];
    news: { id: string; title: string; body: string; time: string; importance: NewsImportance }[];
    socialActivity: { platform: string; metric: string; value: string; trend: string; positive: boolean }[];
    similarCoins: { id: string; symbol: string; name: string; price: string; change: string; positive: boolean }[];
    aiSummary: string;
    aiScore: number;
  }
> = {
  ondo: {
    symbol: "ONDO",
    name: "Ondo Finance",
    price: "$1.24",
    change24h: "+4.2%",
    positive: true,
    description:
      "Ondo Finance is a decentralized finance protocol specializing in the tokenization of real-world assets (RWAs). It bridges institutional-grade financial instruments — including US Treasury bonds and money market funds — onto public blockchains. By integrating zero-knowledge proof technology, ONDO enables privacy-preserving institutional transactions without sacrificing regulatory compliance.",
    tokenMetrics: [
      { label: "Market Cap", value: "$1.24B" },
      { label: "Fully Diluted Val", value: "$12.4B" },
      { label: "24h Volume", value: "$89.4M" },
      { label: "Circulating Supply", value: "1.0B ONDO" },
      { label: "Total Supply", value: "10.0B ONDO" },
      { label: "ATH", value: "$2.14 (+72%)" },
      { label: "ATL", value: "$0.08 (-93%)" },
      { label: "Launch Date", value: "Jan 2024" },
    ],
    news: [
      {
        id: "o1",
        title: "ONDO Finance integrates ZK-proof layer for institutional clients",
        body:
          "ONDO Finance announced a strategic partnership with StarkWare to bring zero-knowledge proof capabilities to its tokenized asset platform. The integration enables institutional investors to transact with full privacy while maintaining the cryptographic audit trail required by regulators.",
        time: "2h ago",
        importance: "major",
      },
      {
        id: "o2",
        title: "BlackRock expands BUIDL fund allocation via Ondo",
        body:
          "BlackRock's tokenized money market fund BUIDL has expanded its distribution through Ondo Finance's OUSG product, signaling growing institutional confidence in RWA tokenization infrastructure.",
        time: "6h ago",
        importance: "major",
      },
      {
        id: "o3",
        title: "ONDO lists on three new centralized exchanges",
        body:
          "ONDO token has been listed on Bybit, OKX, and HTX, significantly expanding retail access and daily trading volume.",
        time: "2d ago",
        importance: "minor",
      },
      {
        id: "o4",
        title: "Ondo DAO votes to expand supported asset types",
        body:
          "Community governance approved a proposal to extend the protocol's supported asset classes to include investment-grade corporate bonds and infrastructure debt instruments.",
        time: "3d ago",
        importance: "minor",
      },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "14,200", trend: "+38%", positive: true },
      { platform: "X (Twitter)", metric: "Sentiment", value: "72% Positive", trend: "+8%", positive: true },
      { platform: "Telegram", metric: "Group Growth", value: "+1,240 members", trend: "7D", positive: true },
      { platform: "Discord", metric: "Active Users", value: "8,400/day", trend: "+12%", positive: true },
      { platform: "Reddit", metric: "Upvote Ratio", value: "91%", trend: "Stable", positive: true },
      { platform: "GitHub", metric: "Commits 30D", value: "142 commits", trend: "+23%", positive: true },
    ],
    similarCoins: [
      { id: "scrt", symbol: "SCRT", name: "Secret Network", price: "$0.43", change: "+2.8%", positive: true },
      { id: "zen", symbol: "ZEN", name: "Horizen", price: "$9.87", change: "-1.1%", positive: false },
      { id: "cfg", symbol: "CFG", name: "Centrifuge", price: "$0.31", change: "+5.4%", positive: true },
      { id: "mpl", symbol: "MPL", name: "Maple Finance", price: "$14.20", change: "+3.1%", positive: true },
    ],
    aiSummary:
      "ONDO Finance scores 83/100 in this Coin Scan analysis. The protocol occupies a defensible position at the intersection of two dominant narratives: Real World Assets (RWA) and Privacy. Institutional backing from BlackRock's BUIDL fund provides significant credibility, while the ZK-proof integration roadmap creates a strong technical moat. Key risks include regulatory uncertainty around tokenized securities and high fully-diluted valuation representing a 10× premium to current market cap. Near-term bullish catalysts: ZK layer mainnet launch, additional TradFi partnerships, and potential inclusion in RWA index products. Price target range: $1.80–$2.40 over 6 months under base-case macro conditions.",
    aiScore: 83,
  },
  scrt: {
    symbol: "SCRT",
    name: "Secret Network",
    price: "$0.43",
    change24h: "+2.8%",
    positive: true,
    description:
      "Secret Network is the first blockchain with default privacy for smart contracts and transactions. Unlike other blockchains, Secret's 'secret contracts' keep data encrypted while still being verifiable, enabling confidential computation on sensitive data without compromising on security or decentralization.",
    tokenMetrics: [
      { label: "Market Cap", value: "$142M" },
      { label: "Fully Diluted Val", value: "$215M" },
      { label: "24h Volume", value: "$8.7M" },
      { label: "Circulating Supply", value: "330M SCRT" },
      { label: "Total Supply", value: "500M SCRT" },
      { label: "ATH", value: "$10.20 (+2274%)" },
      { label: "ATL", value: "$0.09 (-78%)" },
      { label: "Launch Date", value: "Feb 2020" },
    ],
    news: [
      {
        id: "s1",
        title: "Secret Network v2 upgrade enables cross-chain privacy",
        body:
          "The latest mainnet upgrade introduces IBC privacy relays, allowing encrypted transfers between Cosmos ecosystem chains for the first time.",
        time: "4h ago",
        importance: "major",
      },
      {
        id: "s2",
        title: "SecretSwap v3 launches with private order books",
        body:
          "The upgraded DEX features fully encrypted liquidity pools and concealed order sizes, setting a new standard for privacy-preserving decentralized trading.",
        time: "1d ago",
        importance: "major",
      },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "3,800", trend: "+15%", positive: true },
      { platform: "Telegram", metric: "Group Growth", value: "+380 members", trend: "7D", positive: true },
      { platform: "GitHub", metric: "Commits 30D", value: "89 commits", trend: "+8%", positive: true },
    ],
    similarCoins: [
      { id: "ondo", symbol: "ONDO", name: "Ondo Finance", price: "$1.24", change: "+4.2%", positive: true },
      { id: "zen", symbol: "ZEN", name: "Horizen", price: "$9.87", change: "-1.1%", positive: false },
      { id: "torn", symbol: "TORN", name: "Tornado Cash", price: "$5.12", change: "-3.3%", positive: false },
      { id: "rose", symbol: "ROSE", name: "Oasis Network", price: "$0.08", change: "+1.2%", positive: true },
    ],
    aiSummary:
      "SCRT scores 71/100. Secret Network has the strongest privacy-native technology stack but faces adoption headwinds due to UI complexity and ecosystem size. High developer activity and upcoming v2 cross-chain features are strong catalysts. Undervalued relative to technical capability.",
    aiScore: 71,
  },
};

// Default fallback
const defaultCoin = coinData["ondo"];

/* ─── Expandable News Item ─── */
const NewsItem = ({
  item,
}: {
  item: { id: string; title: string; body: string; time: string; importance: NewsImportance };
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex-1">
          <p className="text-white/80 text-sm leading-snug">{item.title}</p>
          <p className="text-white/30 text-[11px] mt-1">{item.time}</p>
        </div>
        <div className="flex-shrink-0 mt-0.5 text-white/30">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3">
          <p className="text-white/50 text-xs leading-relaxed">{item.body}</p>
        </div>
      )}
    </div>
  );
};

/* ─── Similar Coin Card ─── */
const SimilarCoinCard = ({
  coin,
  onClick,
}: {
  coin: { id: string; symbol: string; name: string; price: string; change: string; positive: boolean };
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex-shrink-0 w-32 rounded-2xl border border-white/10 bg-white/5 p-3 text-left hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center mb-2">
      <span className="text-[10px] font-bold text-white/80">{coin.symbol.slice(0, 2)}</span>
    </div>
    <p className="text-white text-sm font-semibold">{coin.symbol}</p>
    <p className="text-white/40 text-[10px] truncate">{coin.name}</p>
    <p className="text-white text-xs mt-1 font-medium">{coin.price}</p>
    <p className={`text-[11px] font-medium ${coin.positive ? "text-emerald-400" : "text-red-400"}`}>
      {coin.change}
    </p>
  </button>
);

/* ─── Coin Scan List Page ─── */
export const CoinScanListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const allCoins = Object.values(coinData).map((c) => ({
    id: Object.keys(coinData).find((k) => coinData[k].symbol === c.symbol) ?? "",
    symbol: c.symbol,
    name: c.name,
    price: c.price,
    change: c.change24h,
    positive: c.positive,
    aiScore: c.aiScore,
  }));

  const filtered = allCoins.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <img src={atmosphereLogo} alt="Atmosphere" className="h-6 w-auto opacity-80" />
          <AppTabBar
            activeTab="coin-scan"
            onTabChange={(tab) => navigate(tab === "narratives" ? "/narratives" : "/coin-scan")}
          />
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10">
        {/* Search */}
        <div className="pt-5 pb-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
        </div>

        {/* Coin list */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {filtered.map((coin) => (
            <button
              key={coin.id}
              onClick={() => navigate(`/coin-scan/${coin.id}`)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-white/80">{coin.symbol.slice(0, 2)}</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">{coin.symbol}</p>
                  <p className="text-white/40 text-[11px]">{coin.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium">{coin.price}</p>
                <div className="flex items-center gap-2 justify-end">
                  <p className={`text-[11px] font-medium ${coin.positive ? "text-emerald-400" : "text-red-400"}`}>
                    {coin.change}
                  </p>
                  <span className="text-white/30 text-[10px]">AI: {coin.aiScore}/100</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Coin Detail Page ─── */
const CoinDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [newsImportance, setNewsImportance] = useState<NewsImportance>("major");

  const coin = (id && coinData[id]) ? coinData[id] : defaultCoin;
  const timeFilters: TimeFilter[] = ["1D", "7D", "1m", "1y"];
  const scoreColor =
    coin.aiScore >= 85 ? "text-emerald-400" : coin.aiScore >= 70 ? "text-amber-400" : "text-red-400";

  const filteredNews = coin.news.filter((n) => n.importance === newsImportance);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate("/coin-scan")}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div className="flex-1 flex justify-center">
            <AppTabBar
              activeTab="coin-scan"
              onTabChange={(tab) => navigate(tab === "narratives" ? "/narratives" : "/coin-scan")}
            />
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-16 px-4">
        {/* Coin Header */}
        <div className="pt-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/15 flex items-center justify-center">
              <span className="text-sm font-bold text-white/90">{coin.symbol.slice(0, 2)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extralight text-white">{coin.symbol}</h1>
                <span className="text-white/40 text-sm">{coin.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-light">{coin.price}</span>
                <span className={`text-sm font-medium ${coin.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {coin.change24h} (24h)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Description */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Description</p>
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <p className="text-white/65 text-sm leading-relaxed">{coin.description}</p>
          </div>
        </section>

        {/* Token Metrics (TKM) */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">
            Token Metrics <span className="text-white/20 normal-case">(TKM)</span>
          </p>
          <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
            {coin.tokenMetrics.map((metric, i) => (
              <div
                key={metric.label}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < coin.tokenMetrics.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <span className="text-white/40 text-xs">{metric.label}</span>
                <span className="text-white/80 text-sm font-medium">{metric.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* News (specific to coin) */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">
            News <span className="text-white/20 normal-case">(specific to {coin.symbol})</span>
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1.5">
              {timeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                    timeFilter === f
                      ? "bg-white text-black"
                      : "border border-white/15 text-white/50 hover:text-white hover:border-white/30"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex rounded-full border border-white/15 overflow-hidden">
              {(["major", "minor"] as NewsImportance[]).map((imp) => (
                <button
                  key={imp}
                  onClick={() => setNewsImportance(imp)}
                  className={`px-3 py-1 text-[11px] font-medium transition-all capitalize ${
                    newsImportance === imp ? "bg-white/20 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  {imp}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => <NewsItem key={item.id} item={item} />)
            ) : (
              <p className="text-white/30 text-sm text-center py-6">
                No {newsImportance} news for this period.
              </p>
            )}
          </div>
        </section>

        {/* Social Media Activity */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Social Media Activity</p>
          <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
            {coin.socialActivity.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < coin.socialActivity.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div>
                  <p className="text-white/60 text-xs font-medium">{item.platform}</p>
                  <p className="text-white/35 text-[10px]">{item.metric}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm font-medium">{item.value}</p>
                  <p className={`text-[10px] ${item.positive ? "text-emerald-400/80" : "text-red-400/80"}`}>
                    {item.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Similar Coins */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Similar Coins</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
            {coin.similarCoins.map((c) => (
              <SimilarCoinCard
                key={c.id}
                coin={c}
                onClick={() => navigate(`/coin-scan/${c.id}`)}
              />
            ))}
          </div>
        </section>

        {/* AI Summary */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 text-[10px] tracking-widest uppercase">AI Summary</p>
            <span className={`text-sm font-semibold ${scoreColor}`}>[{coin.aiScore}/100]</span>
          </div>
          <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-transparent p-5">
            <p className="text-white/60 text-sm leading-relaxed">{coin.aiSummary}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoinDetailPage;
