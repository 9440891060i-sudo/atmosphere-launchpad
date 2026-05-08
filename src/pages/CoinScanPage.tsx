import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  ExpandableNewsItem, scoreColor,
  type TimeFilter, type NewsImportance, type NewsItem,
} from "./NarrativesPage";

/* ══════════════════════════════════════════
   COIN DATA
══════════════════════════════════════════ */
interface CoinFull {
  id: string; symbol: string; name: string;
  price: string; change24h: string; positive: boolean;
  description: string;
  tokenMetrics: { label: string; value: string }[];
  news: NewsItem[];
  socialActivity: { platform: string; metric: string; value: string; trend: string; positive: boolean }[];
  similarCoinIds: string[];
  aiSummary: string;
  aiScore: number;
}

const coins: Record<string, CoinFull> = {
  ondo: {
    id: "ondo", symbol: "ONDO", name: "Ondo Finance",
    price: "$1.24", change24h: "+4.2%", positive: true,
    description: "Ondo Finance is a decentralized protocol specialising in the tokenization of real-world assets (RWAs). It bridges institutional-grade financial instruments — including US Treasury bonds and money market funds — onto public blockchains. By integrating zero-knowledge proof technology, ONDO enables privacy-preserving institutional transactions without sacrificing regulatory compliance.",
    tokenMetrics: [
      { label: "Market Cap", value: "$1.24B" }, { label: "Fully Diluted Val", value: "$12.4B" },
      { label: "24h Volume", value: "$89.4M" }, { label: "Circulating Supply", value: "1.0B ONDO" },
      { label: "Total Supply", value: "10.0B ONDO" }, { label: "ATH", value: "$2.14" },
      { label: "ATL", value: "$0.08" }, { label: "Launch Date", value: "Jan 2024" },
    ],
    news: [
      { id: "o1", title: "ONDO Finance integrates ZK-proof layer for institutional clients", body: "ONDO Finance announced a partnership with StarkWare to bring zero-knowledge proof capabilities to its tokenized asset platform, enabling institutional investors to transact privately while maintaining regulatory compliance.", time: "2h ago", importance: "major" },
      { id: "o2", title: "BlackRock expands BUIDL fund allocation via Ondo", body: "BlackRock's tokenized money market fund BUIDL has expanded its distribution through Ondo Finance's OUSG product, signaling growing institutional confidence in RWA tokenization infrastructure.", time: "6h ago", importance: "major" },
      { id: "o3", title: "ONDO lists on three new centralized exchanges", body: "ONDO token has been listed on Bybit, OKX, and HTX, significantly expanding retail access and daily trading volume.", time: "2d ago", importance: "minor" },
      { id: "o4", title: "Ondo DAO votes to expand supported asset types", body: "Community governance approved a proposal to extend supported asset classes to include investment-grade corporate bonds and infrastructure debt instruments.", time: "3d ago", importance: "minor" },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "14,200", trend: "+38%", positive: true },
      { platform: "X (Twitter)", metric: "Sentiment", value: "72% Positive", trend: "+8%", positive: true },
      { platform: "Telegram", metric: "Group Growth", value: "+1,240 members", trend: "7D", positive: true },
      { platform: "Discord", metric: "Active Users", value: "8,400 / day", trend: "+12%", positive: true },
      { platform: "Reddit", metric: "Upvote Ratio", value: "91%", trend: "Stable", positive: true },
      { platform: "GitHub", metric: "Commits 30D", value: "142 commits", trend: "+23%", positive: true },
    ],
    similarCoinIds: ["scrt", "zen", "aave"],
    aiSummary: "ONDO scores 83/100. The protocol sits at the intersection of RWA and Privacy — two dominant 2026 narratives. BlackRock's BUIDL backing provides institutional credibility and the ZK-proof integration roadmap creates a defensible technical moat. Key risk: FDV is 10× current market cap. Near-term catalysts: ZK layer mainnet, additional TradFi partnerships. 6-month price target range: $1.80–$2.40.",
    aiScore: 83,
  },
  scrt: {
    id: "scrt", symbol: "SCRT", name: "Secret Network",
    price: "$0.43", change24h: "+2.8%", positive: true,
    description: "Secret Network is the first blockchain with default privacy for smart contracts and transactions. Unlike other blockchains, Secret's 'secret contracts' keep data encrypted while still being verifiable, enabling confidential computation on sensitive data without compromising on security or decentralization.",
    tokenMetrics: [
      { label: "Market Cap", value: "$142M" }, { label: "Fully Diluted Val", value: "$215M" },
      { label: "24h Volume", value: "$8.7M" }, { label: "Circulating Supply", value: "330M SCRT" },
      { label: "Total Supply", value: "500M SCRT" }, { label: "ATH", value: "$10.20" },
      { label: "ATL", value: "$0.09" }, { label: "Launch Date", value: "Feb 2020" },
    ],
    news: [
      { id: "s1", title: "Secret Network v2 upgrade enables cross-chain privacy", body: "The latest mainnet upgrade introduces IBC privacy relays, allowing encrypted transfers between Cosmos ecosystem chains for the first time.", time: "4h ago", importance: "major" },
      { id: "s2", title: "SecretSwap v3 launches with private order books", body: "The upgraded DEX features fully encrypted liquidity pools and concealed order sizes, setting a new standard for privacy-preserving decentralized trading.", time: "1d ago", importance: "major" },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "3,800", trend: "+15%", positive: true },
      { platform: "Telegram", metric: "Group Growth", value: "+380 members", trend: "7D", positive: true },
      { platform: "GitHub", metric: "Commits 30D", value: "89 commits", trend: "+8%", positive: true },
    ],
    similarCoinIds: ["ondo", "zen", "torn"],
    aiSummary: "SCRT scores 71/100. Secret Network has the strongest privacy-native tech stack but faces adoption headwinds from UI complexity and ecosystem size. High developer activity and upcoming v2 cross-chain features are strong catalysts. Significantly undervalued relative to technical capability.",
    aiScore: 71,
  },
  zen: {
    id: "zen", symbol: "ZEN", name: "Horizen",
    price: "$9.87", change24h: "-1.1%", positive: false,
    description: "Horizen is a scalable sidechain platform with optional privacy. Its EON EVM-compatible sidechain allows developers to build privacy-optional dApps while inheriting Horizen's proof-of-work security model, bridging enterprise adoption and the privacy crypto ecosystem.",
    tokenMetrics: [
      { label: "Market Cap", value: "$187M" }, { label: "Fully Diluted Val", value: "$210M" },
      { label: "24h Volume", value: "$12.1M" }, { label: "Circulating Supply", value: "18.9M ZEN" },
      { label: "Total Supply", value: "21.0M ZEN" }, { label: "ATH", value: "$167.00" },
      { label: "ATL", value: "$3.20" }, { label: "Launch Date", value: "Jun 2017" },
    ],
    news: [
      { id: "z1", title: "Horizen EON sidechain hosts 12 new privacy dApps", body: "New applications include healthcare data management and private voting systems built on the EON EVM sidechain.", time: "1d ago", importance: "major" },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "1,200", trend: "+5%", positive: true },
      { platform: "Telegram", metric: "Group Growth", value: "+90 members", trend: "7D", positive: true },
    ],
    similarCoinIds: ["scrt", "ondo", "torn"],
    aiSummary: "ZEN scores 68/100. Consolidating after recent gains. Optional privacy is a double-edged sword — less compelling than full-privacy chains for narrative purposes, but more enterprise-friendly. Watch for new sidechain launches as a near-term catalyst.",
    aiScore: 68,
  },
  aave: {
    id: "aave", symbol: "AAVE", name: "Aave",
    price: "$192.40", change24h: "+3.1%", positive: true,
    description: "Aave is the leading decentralised lending and borrowing protocol. Users can supply assets to earn yield or borrow against collateral. Aave v4 introduces improved risk isolation and a redesigned safety module, cementing its position as the blue-chip DeFi lending primitive.",
    tokenMetrics: [
      { label: "Market Cap", value: "$2.1B" }, { label: "Fully Diluted Val", value: "$2.8B" },
      { label: "24h Volume", value: "$180M" }, { label: "Circulating Supply", value: "15.1M AAVE" },
      { label: "Total Supply", value: "16.0M AAVE" }, { label: "ATH", value: "$661.00" },
      { label: "ATL", value: "$26.02" }, { label: "Launch Date", value: "Oct 2020" },
    ],
    news: [
      { id: "aa1", title: "Aave v4 launches with new risk isolation module", body: "The fourth major version introduces granular risk isolation, limiting contagion from new asset listings to isolated pools.", time: "3h ago", importance: "major" },
      { id: "aa2", title: "Aave integrates Chainlink CCIP for cross-chain lending", body: "Users can now supply collateral on one chain and borrow on another, dramatically expanding capital efficiency.", time: "1d ago", importance: "minor" },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "9,400", trend: "+22%", positive: true },
      { platform: "Discord", metric: "Active Users", value: "12,000 / day", trend: "+8%", positive: true },
      { platform: "GitHub", metric: "Commits 30D", value: "201 commits", trend: "+31%", positive: true },
    ],
    similarCoinIds: ["uni", "ondo"],
    aiSummary: "AAVE scores 79/100. Blue-chip DeFi with sustainable revenue. v4 reduces systemic risk significantly. Fee switch activation could drive substantial token value accrual. Safe core holding for DeFi exposure with limited downside at current valuations.",
    aiScore: 79,
  },
  torn: {
    id: "torn", symbol: "TORN", name: "Tornado Cash",
    price: "$5.12", change24h: "-3.3%", positive: false,
    description: "Tornado Cash is a decentralised, non-custodial privacy protocol on Ethereum. It improves transaction privacy by breaking the on-chain link between source and destination addresses using zero-knowledge proofs. TORN is the governance token for the protocol.",
    tokenMetrics: [
      { label: "Market Cap", value: "$56M" }, { label: "Fully Diluted Val", value: "$102M" },
      { label: "24h Volume", value: "$3.4M" }, { label: "Circulating Supply", value: "10.9M TORN" },
      { label: "Total Supply", value: "20.0M TORN" }, { label: "ATH", value: "$420.00" },
      { label: "ATL", value: "$2.80" }, { label: "Launch Date", value: "Dec 2021" },
    ],
    news: [
      { id: "t1", title: "Tornado Cash governance votes to implement compliance mode", body: "TORN holders voted to implement an optional compliance mode allowing users to generate cryptographic proofs of transaction history for regulatory purposes.", time: "1d ago", importance: "major" },
    ],
    socialActivity: [
      { platform: "X (Twitter)", metric: "Mentions 24h", value: "2,100", trend: "-8%", positive: false },
      { platform: "Telegram", metric: "Group Activity", value: "Moderate", trend: "Stable", positive: true },
    ],
    similarCoinIds: ["scrt", "zen"],
    aiSummary: "TORN scores 52/100. High risk/reward. Regulatory overhang from OFAC sanctions is the primary risk. Protocol activity is recovering and the governance compliance vote may reduce legal exposure. Speculative position only.",
    aiScore: 52,
  },
};

const allCoins = Object.values(coins);

/* ══════════════════════════════════════════
   COIN DETAIL CONTENT
══════════════════════════════════════════ */
export const CoinDetail = ({
  coinId, onOpenCoin,
}: {
  coinId: string;
  onOpenCoin: (id: string) => void;
}) => {
  const coin = coins[coinId];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [importance, setImportance] = useState<NewsImportance>("major");

  if (!coin) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-[#333] text-sm">Coin data coming soon.</p>
    </div>
  );

  const filteredNews = coin.news.filter((n) => n.importance === importance);
  const similar = coin.similarCoinIds.map((id) => coins[id]).filter(Boolean);

  return (
    <div className="h-full overflow-y-auto">
      {/* Coin header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-semibold text-[#888]">{coin.symbol.slice(0,2)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[#e8e8e8] text-lg font-semibold">{coin.symbol}</h2>
              <span className="text-[#444] text-sm">{coin.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#e8e8e8] text-sm font-medium tabular-nums">{coin.price}</span>
              <span className={`text-xs font-medium tabular-nums ${coin.positive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                {coin.change24h} (24h)
              </span>
            </div>
          </div>
        </div>
        <span className="text-sm font-semibold tabular-nums" style={{ color: scoreColor(coin.aiScore) }}>
          {coin.aiScore}/100
        </span>
      </div>

      <div className="py-5 space-y-6">
        {/* Description */}
        <section>
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">Description</p>
          <p className="text-[#888] text-sm leading-relaxed">{coin.description}</p>
        </section>

        {/* Token Metrics */}
        <section>
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">Token Metrics</p>
          <div className="border border-[#1a1a1a] rounded-lg overflow-hidden bg-[#0a0a0a]">
            {coin.tokenMetrics.map((m, i) => (
              <div key={m.label}
                className={`flex items-center justify-between px-4 py-2.5 ${i < coin.tokenMetrics.length - 1 ? "border-b border-[#141414]" : ""}`}
              >
                <span className="text-[#555] text-xs">{m.label}</span>
                <span className="text-[#cccccc] text-sm font-medium tabular-nums">{m.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* News */}
        <section>
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">News</p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {(["1D","7D","1m","1y"] as TimeFilter[]).map((f) => (
                <button key={f} onClick={() => setTimeFilter(f)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    timeFilter === f ? "bg-[#1e1e1e] text-[#e8e8e8]" : "text-[#444] hover:text-[#888]"
                  }`}>{f}</button>
              ))}
            </div>
            <div className="flex border border-[#1e1e1e] rounded overflow-hidden">
              {(["major","minor"] as NewsImportance[]).map((i) => (
                <button key={i} onClick={() => setImportance(i)}
                  className={`px-3 py-1 text-[11px] capitalize transition-all ${
                    importance === i ? "bg-[#1e1e1e] text-[#e8e8e8]" : "text-[#444] hover:text-[#888]"
                  }`}>{i}</button>
              ))}
            </div>
          </div>
          <div className="border border-[#1a1a1a] rounded-lg overflow-hidden bg-[#0a0a0a]">
            {filteredNews.length > 0
              ? filteredNews.map((item) => <ExpandableNewsItem key={item.id} item={item} />)
              : <p className="text-[#333] text-xs text-center py-5">No {importance} news for this period.</p>
            }
          </div>
        </section>

        {/* Social Media */}
        <section>
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">Social Activity</p>
          <div className="border border-[#1a1a1a] rounded-lg overflow-hidden bg-[#0a0a0a]">
            {coin.socialActivity.map((item, i) => (
              <div key={i}
                className={`flex items-center justify-between px-4 py-2.5 ${i < coin.socialActivity.length - 1 ? "border-b border-[#141414]" : ""}`}
              >
                <div>
                  <p className="text-[#888] text-xs font-medium">{item.platform}</p>
                  <p className="text-[#444] text-[10px]">{item.metric}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#cccccc] text-sm font-medium tabular-nums">{item.value}</p>
                  <p className={`text-[10px] tabular-nums ${item.positive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {item.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Similar Coins */}
        {similar.length > 0 && (
          <section>
            <p className="text-[#444] text-[10px] tracking-widests uppercase mb-2">Similar Coins</p>
            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
              {similar.map((c) => (
                <button key={c.id} onClick={() => onOpenCoin(c.id)}
                  className="flex-shrink-0 w-32 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 text-left hover:border-[#2a2a2a] hover:bg-[#111] transition-all active:scale-[0.98]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-2">
                    <span className="text-[9px] font-semibold text-[#666]">{c.symbol.slice(0,2)}</span>
                  </div>
                  <p className="text-[#e8e8e8] text-sm font-semibold">{c.symbol}</p>
                  <p className="text-[#444] text-[10px] truncate">{c.name}</p>
                  <p className="text-[#aaa] text-xs mt-1 tabular-nums">{c.price}</p>
                  <p className={`text-[10px] font-medium tabular-nums ${c.positive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {c.change24h}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* AI Summary */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#444] text-[10px] tracking-widest uppercase">AI Summary</p>
            <span className="text-xs font-semibold tabular-nums" style={{ color: scoreColor(coin.aiScore) }}>
              Score {coin.aiScore}/100
            </span>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
            <p className="text-[#888] text-sm leading-relaxed">{coin.aiSummary}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   COIN SCAN PAGE
══════════════════════════════════════════ */
const CoinScanPage = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = allCoins.filter(
    (c) =>
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="px-5 pt-5">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#333]" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#e8e8e8] placeholder-[#333] focus:outline-none focus:border-[#2a2a2a] transition-colors"
          />
        </div>

        {/* Coin list */}
        <div className="border border-[#1a1a1a] rounded-lg overflow-hidden bg-[#0a0a0a]">
          {filtered.map((coin, i) => (
            <button key={coin.id} onClick={() => setSelectedId(coin.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#0f0f0f] transition-colors ${
                i < filtered.length - 1 ? "border-b border-[#141414]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-semibold text-[#666]">{coin.symbol.slice(0,2)}</span>
                </div>
                <div className="text-left">
                  <p className="text-[#e8e8e8] text-sm font-medium">{coin.symbol}</p>
                  <p className="text-[#444] text-[11px]">{coin.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#e8e8e8] text-sm font-medium tabular-nums">{coin.price}</p>
                <div className="flex items-center gap-2 justify-end">
                  <p className={`text-[11px] font-medium tabular-nums ${coin.positive ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    {coin.change24h}
                  </p>
                  <span className="text-[#333] text-[10px] tabular-nums" style={{ color: scoreColor(coin.aiScore) }}>
                    {coin.aiScore}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coin detail sheet */}
      <Sheet open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:w-[480px] max-w-full border-l border-[#1a1a1a] p-0 bg-[#090909] overflow-hidden"
        >
          <div className="h-full px-6 pt-10 pb-6">
            {selectedId && (
              <CoinDetail
                coinId={selectedId}
                onOpenCoin={(id) => setSelectedId(id)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CoinScanPage;
export { coins };
