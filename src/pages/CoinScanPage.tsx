import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TabBar, ExpandableNewsItem, type TimeFilter, type NewsImportance, type NewsItem } from "./NarrativesPage";

/* ══════════════════════════════════════════
   COIN DATA
══════════════════════════════════════════ */

interface CoinFullData {
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

const coins: Record<string, CoinFullData> = {
  ondo: {
    id: "ondo", symbol: "ONDO", name: "Ondo Finance",
    price: "$1.24", change24h: "+4.2%", positive: true,
    description:
      "Ondo Finance is a decentralized protocol specializing in the tokenization of real-world assets (RWAs). It bridges institutional-grade financial instruments — including US Treasury bonds and money market funds — onto public blockchains. By integrating zero-knowledge proof technology, ONDO enables privacy-preserving institutional transactions without sacrificing regulatory compliance.",
    tokenMetrics: [
      { label: "Market Cap", value: "$1.24B" },
      { label: "Fully Diluted Val", value: "$12.4B" },
      { label: "24h Volume", value: "$89.4M" },
      { label: "Circulating Supply", value: "1.0B ONDO" },
      { label: "Total Supply", value: "10.0B ONDO" },
      { label: "ATH", value: "$2.14" },
      { label: "ATL", value: "$0.08" },
      { label: "Launch Date", value: "Jan 2024" },
    ],
    news: [
      {
        id: "o1", title: "ONDO Finance integrates ZK-proof layer for institutional clients",
        body: "ONDO Finance announced a partnership with StarkWare to bring zero-knowledge proof capabilities to its tokenized asset platform, enabling private transactions with regulatory compliance.",
        time: "2h ago", importance: "major",
      },
      {
        id: "o2", title: "BlackRock expands BUIDL fund allocation via Ondo",
        body: "BlackRock's tokenized money market fund BUIDL has expanded its distribution through Ondo Finance's OUSG product.",
        time: "6h ago", importance: "major",
      },
      {
        id: "o3", title: "ONDO lists on three new centralized exchanges",
        body: "ONDO token has been listed on Bybit, OKX, and HTX, expanding retail access and daily trading volume.",
        time: "2d ago", importance: "minor",
      },
      {
        id: "o4", title: "Ondo DAO votes to expand supported asset types",
        body: "Community governance approved a proposal to extend supported asset classes to investment-grade corporate bonds.",
        time: "3d ago", importance: "minor",
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
    similarCoinIds: ["scrt", "zen", "aave", "cfg"],
    aiSummary:
      "ONDO scores 83/100. The protocol occupies a defensible position at the intersection of RWA and Privacy narratives. Institutional backing from BlackRock provides significant credibility, while the ZK-proof integration roadmap creates a strong technical moat. Key risks: high FDV at 10× current market cap. Catalysts: ZK layer mainnet launch, additional TradFi partnerships. Target range: $1.80–$2.40 over 6 months.",
    aiScore: 83,
  },
  scrt: {
    id: "scrt", symbol: "SCRT", name: "Secret Network",
    price: "$0.43", change24h: "+2.8%", positive: true,
    description:
      "Secret Network is the first blockchain with default privacy for smart contracts and transactions. Unlike other blockchains, Secret's 'secret contracts' keep data encrypted while still being verifiable, enabling confidential computation on sensitive data without compromising security or decentralization.",
    tokenMetrics: [
      { label: "Market Cap", value: "$142M" },
      { label: "Fully Diluted Val", value: "$215M" },
      { label: "24h Volume", value: "$8.7M" },
      { label: "Circulating Supply", value: "330M SCRT" },
      { label: "Total Supply", value: "500M SCRT" },
      { label: "ATH", value: "$10.20" },
      { label: "ATL", value: "$0.09" },
      { label: "Launch Date", value: "Feb 2020" },
    ],
    news: [
      {
        id: "s1", title: "Secret Network v2 upgrade enables cross-chain privacy",
        body: "The latest mainnet upgrade introduces IBC privacy relays, allowing encrypted transfers between Cosmos ecosystem chains.",
        time: "4h ago", importance: "major",
      },
      {
        id: "s2", title: "SecretSwap v3 launches with private order books",
        body: "The upgraded DEX features fully encrypted liquidity pools and concealed order sizes.",
        time: "1d ago", importance: "major",
      },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "3,800", trend: "+15%", positive: true },
      { platform: "Telegram", metric: "Group Growth", value: "+380 members", trend: "7D", positive: true },
      { platform: "GitHub", metric: "Commits 30D", value: "89 commits", trend: "+8%", positive: true },
    ],
    similarCoinIds: ["ondo", "zen", "torn", "rose"],
    aiSummary:
      "SCRT scores 71/100. Secret Network has the strongest privacy-native tech stack but faces adoption headwinds from UI complexity. High developer activity and v2 cross-chain features are strong catalysts. Undervalued relative to technical capability.",
    aiScore: 71,
  },
  zen: {
    id: "zen", symbol: "ZEN", name: "Horizen",
    price: "$9.87", change24h: "-1.1%", positive: false,
    description:
      "Horizen is a scalable sidechain platform with optional privacy. Its EON EVM-compatible sidechain allows developers to build privacy-optional dApps while inheriting Horizen's proof-of-work security. The protocol bridges enterprise adoption and the privacy crypto ecosystem.",
    tokenMetrics: [
      { label: "Market Cap", value: "$187M" },
      { label: "Fully Diluted Val", value: "$210M" },
      { label: "24h Volume", value: "$12.1M" },
      { label: "Circulating Supply", value: "18.9M ZEN" },
      { label: "Total Supply", value: "21.0M ZEN" },
      { label: "ATH", value: "$167.00" },
      { label: "ATL", value: "$3.20" },
      { label: "Launch Date", value: "Jun 2017" },
    ],
    news: [
      {
        id: "z1", title: "Horizen EON sidechain hosts 12 new privacy dApps",
        body: "New applications include healthcare data management and private voting systems built on the EON EVM sidechain.",
        time: "1d ago", importance: "major",
      },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "1,200", trend: "+5%", positive: true },
      { platform: "Telegram", metric: "Group Growth", value: "+90 members", trend: "7D", positive: true },
    ],
    similarCoinIds: ["scrt", "ondo", "torn"],
    aiSummary:
      "ZEN scores 68/100. Consolidating after recent gains. Strong tech with optional privacy is a double-edged sword — less compelling than full-privacy chains for narrative purposes, but more enterprise-friendly. Watch for new sidechain launches as catalyst.",
    aiScore: 68,
  },
  aave: {
    id: "aave", symbol: "AAVE", name: "Aave",
    price: "$192.40", change24h: "+3.1%", positive: true,
    description:
      "Aave is the leading decentralized lending and borrowing protocol. Users can supply assets to earn yield or borrow against collateral. Aave v4 introduces improved risk isolation and a new safety module architecture, cementing its position as the blue-chip DeFi lending protocol.",
    tokenMetrics: [
      { label: "Market Cap", value: "$2.1B" },
      { label: "Fully Diluted Val", value: "$2.8B" },
      { label: "24h Volume", value: "$180M" },
      { label: "Circulating Supply", value: "15.1M AAVE" },
      { label: "Total Supply", value: "16.0M AAVE" },
      { label: "ATH", value: "$661.00" },
      { label: "ATL", value: "$26.02" },
      { label: "Launch Date", value: "Oct 2020" },
    ],
    news: [
      {
        id: "aa1", title: "Aave v4 launches with new risk isolation module",
        body: "The fourth major version introduces granular risk isolation, limiting contagion from new asset listings.",
        time: "3h ago", importance: "major",
      },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "9,400", trend: "+22%", positive: true },
      { platform: "Discord", metric: "Active Users", value: "12,000/day", trend: "+8%", positive: true },
      { platform: "GitHub", metric: "Commits 30D", value: "201 commits", trend: "+31%", positive: true },
    ],
    similarCoinIds: ["uni", "comp", "mkr"],
    aiSummary:
      "AAVE scores 79/100. Blue-chip DeFi with sustainable revenue. v4 improvements reduce systemic risk significantly. Fee switch activation could drive substantial token value accrual. Safe core holding for DeFi exposure.",
    aiScore: 79,
  },
};

// Placeholder for coins not in our full dataset
const getCoins = (ids: string[]) =>
  ids.map((id) => coins[id] ?? { id, symbol: id.toUpperCase(), name: id, price: "—", change24h: "—", positive: true });

/* ══════════════════════════════════════════
   COIN DETAIL SHEET CONTENT
══════════════════════════════════════════ */

export const CoinDetail = ({ coinId, onOpenCoin }: { coinId: string; onOpenCoin: (id: string) => void }) => {
  const coin = coins[coinId];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [importance, setImportance] = useState<NewsImportance>("major");

  if (!coin) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-white/30 text-sm">Coin data coming soon.</p>
    </div>
  );

  const scoreColor =
    coin.aiScore >= 85 ? "text-emerald-400" : coin.aiScore >= 70 ? "text-amber-400" : "text-red-400";
  const filteredNews = coin.news.filter((n) => n.importance === importance);
  const similar = getCoins(coin.similarCoinIds);

  return (
    <div className="overflow-y-auto h-full pb-10">
      {/* Coin header */}
      <div className="flex items-center gap-3 pt-2 pb-6">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/15 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white/90">{coin.symbol.slice(0, 2)}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extralight text-white">{coin.symbol}</h2>
            <span className="text-white/40 text-sm">{coin.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-base font-light">{coin.price}</span>
            <span className={`text-sm font-medium ${coin.positive ? "text-emerald-400" : "text-red-400"}`}>
              {coin.change24h} (24h)
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">Description</p>
        <div className="rounded-xl border border-white/8 bg-white/3 p-4">
          <p className="text-white/60 text-sm leading-relaxed">{coin.description}</p>
        </div>
      </section>

      {/* Token Metrics */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">
          Token Metrics <span className="text-white/20 normal-case text-[9px]">(TKM)</span>
        </p>
        <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
          {coin.tokenMetrics.map((m, i) => (
            <div
              key={m.label}
              className={`flex items-center justify-between px-4 py-2.5 ${
                i < coin.tokenMetrics.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <span className="text-white/40 text-xs">{m.label}</span>
              <span className="text-white/80 text-sm font-medium">{m.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">
          News <span className="text-white/20 normal-case text-[9px]">(specific to {coin.symbol})</span>
        </p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1.5">
            {(["1D", "7D", "1m", "1y"] as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                  timeFilter === f ? "bg-white text-black" : "border border-white/15 text-white/40 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex rounded-full border border-white/15 overflow-hidden text-[11px]">
            {(["major", "minor"] as NewsImportance[]).map((i) => (
              <button
                key={i}
                onClick={() => setImportance(i)}
                className={`px-3 py-1 capitalize transition-all ${
                  importance === i ? "bg-white/20 text-white" : "text-white/35 hover:text-white"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => <ExpandableNewsItem key={item.id} item={item} />)
          ) : (
            <p className="text-white/30 text-sm text-center py-5">No {importance} news for this period.</p>
          )}
        </div>
      </section>

      {/* Social Media Activity */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widests uppercase mb-2">Social Media Activity</p>
        <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
          {coin.socialActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-2.5 ${
                i < coin.socialActivity.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div>
                <p className="text-white/55 text-xs font-medium">{item.platform}</p>
                <p className="text-white/30 text-[10px]">{item.metric}</p>
              </div>
              <div className="text-right">
                <p className="text-white/75 text-sm font-medium">{item.value}</p>
                <p className={`text-[10px] ${item.positive ? "text-emerald-400/80" : "text-red-400/80"}`}>
                  {item.trend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Coins */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">Similar Coins</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6">
          {similar.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpenCoin(c.id)}
              className="flex-shrink-0 w-28 rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center mb-2">
                <span className="text-[9px] font-bold text-white/80">{c.symbol.slice(0, 2)}</span>
              </div>
              <p className="text-white text-sm font-semibold">{c.symbol}</p>
              <p className="text-white/40 text-[10px] truncate">{c.name}</p>
              <p className="text-white text-xs mt-1">{c.price}</p>
              <p className={`text-[10px] font-medium ${c.positive ? "text-emerald-400" : "text-red-400"}`}>
                {c.change24h}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* AI Summary */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/35 text-[10px] tracking-widest uppercase">AI Summary</p>
          <span className={`text-sm font-semibold ${scoreColor}`}>[{coin.aiScore}/100]</span>
        </div>
        <div className="rounded-xl border border-white/8 bg-gradient-to-br from-white/5 to-transparent p-4">
          <p className="text-white/60 text-sm leading-relaxed">{coin.aiSummary}</p>
        </div>
      </section>
    </div>
  );
};

/* ══════════════════════════════════════════
   COIN SCAN PAGE
══════════════════════════════════════════ */

const CoinScanPage = ({ onTabChange }: { onTabChange: (t: "narratives" | "coin-scan") => void }) => {
  const [search, setSearch] = useState("");
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const coinList = Object.values(coins);
  const filtered = coinList.filter(
    (c) =>
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="px-4 pt-5 pb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>
      </div>

      {/* Coin list */}
      <div className="px-4">
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {filtered.map((coin, i) => {
            const scoreColor =
              coin.aiScore >= 85 ? "text-emerald-400" : coin.aiScore >= 70 ? "text-amber-400" : "text-red-400";
            return (
              <button
                key={coin.id}
                onClick={() => setSelectedCoinId(coin.id)}
                className={`w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors ${
                  i < filtered.length - 1 ? "border-b border-white/5" : ""
                }`}
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
                      {coin.change24h}
                    </p>
                    <span className={`text-[10px] ${scoreColor}`}>AI {coin.aiScore}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coin detail sheet */}
      <Sheet open={!!selectedCoinId} onOpenChange={(o) => !o && setSelectedCoinId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-full md:max-w-xl bg-background border-l border-white/10 p-6 overflow-hidden"
        >
          {selectedCoinId && (
            <CoinDetail
              coinId={selectedCoinId}
              onOpenCoin={(id) => setSelectedCoinId(id)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CoinScanPage;
export { coins };
