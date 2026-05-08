import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export type TimeFilter = "1D" | "7D" | "1m" | "1y";
export type NewsImportance = "major" | "minor";

export interface NewsItem {
  id: string; title: string; body: string; time: string; importance: NewsImportance;
}
export interface CoinCard {
  id: string; symbol: string; name: string;
  quickInfo: string;
  tokenMetrics: { label: string; value: string }[];
  personalView: string;
}
export interface UpcomingCoin {
  id: string; symbol: string; name: string;
  quickInfo: string; tkm: string; launchDate: string;
}
export interface NarrativeData {
  id: string; title: string; score: number;
  tag: string; summary: string;
  detailedReport: string;
  news: NewsItem[];
  coinsInSpace: CoinCard[];
  upcomingCoins: UpcomingCoin[];
  aiSummary: string;
}

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
export const narratives: NarrativeData[] = [
  {
    id: "privacy", title: "Privacy", score: 93, tag: "Trending",
    summary: "Privacy-preserving protocols gaining momentum as regulatory pressure mounts on transparent chains.",
    detailedReport: "Privacy-focused blockchain protocols are experiencing a renaissance as regulators tighten scrutiny on transparent on-chain activity. Zero-knowledge proof systems have matured significantly, enabling both compliance and confidentiality. Institutional adoption is accelerating driven by demand for private asset transfers without sacrificing auditability. Network activity across major privacy coins has increased 34% month-over-month.",
    news: [
      { id: "n1", title: "ONDO Finance integrates ZK-proof layer for institutional clients", body: "ONDO Finance announced a partnership with StarkWare to bring zero-knowledge proof capabilities to its tokenized asset platform, enabling institutional investors to transact privately while maintaining regulatory compliance.", time: "2h ago", importance: "major" },
      { id: "n2", title: "Secret Network TVL surges 28% after new DEX launch", body: "Secret Network's total value locked surged following the launch of SecretSwap v3, which introduced private liquidity pools and encrypted order books for the first time on any major DEX.", time: "5h ago", importance: "major" },
      { id: "n3", title: "Horizen expands sidechain ecosystem with new privacy dApps", body: "Horizen's EON EVM-compatible sidechain now hosts 12 new privacy-focused decentralized applications targeting healthcare data and private voting systems.", time: "1d ago", importance: "minor" },
      { id: "n4", title: "Tornado Cash governance votes to implement compliance mode", body: "TORN holders voted to implement an optional compliance mode allowing users to generate cryptographic proofs of transaction history for regulatory purposes.", time: "1d ago", importance: "minor" },
    ],
    coinsInSpace: [
      { id: "ondo", symbol: "ONDO", name: "Ondo Finance", quickInfo: "Tokenized real-world assets with privacy layer integration. Market leader in institutional DeFi.", tokenMetrics: [{ label: "Market Cap", value: "$1.24B" }, { label: "24h Volume", value: "$89.4M" }, { label: "Price", value: "$1.24" }, { label: "7D Change", value: "+12.4%" }], personalView: "Strong fundamentals with growing institutional adoption. Privacy features are a key differentiator in the RWA space." },
      { id: "scrt", symbol: "SCRT", name: "Secret Network", quickInfo: "The original privacy-preserving smart contract platform. Encrypted state for all contracts.", tokenMetrics: [{ label: "Market Cap", value: "$142M" }, { label: "24h Volume", value: "$8.7M" }, { label: "Price", value: "$0.43" }, { label: "7D Change", value: "+18.2%" }], personalView: "Undervalued relative to narrative strength. High developer activity and growing ecosystem." },
      { id: "zen", symbol: "ZEN", name: "Horizen", quickInfo: "Scalable sidechain protocol with optional privacy. Bridges enterprise and privacy crypto.", tokenMetrics: [{ label: "Market Cap", value: "$187M" }, { label: "24h Volume", value: "$12.1M" }, { label: "Price", value: "$9.87" }, { label: "7D Change", value: "-1.1%" }], personalView: "Consolidating after recent gains. Watch for new sidechain launches as potential catalyst." },
      { id: "torn", symbol: "TORN", name: "Tornado Cash", quickInfo: "Decentralized mixing protocol. Governance token for the world's largest Ethereum mixer.", tokenMetrics: [{ label: "Market Cap", value: "$56M" }, { label: "24h Volume", value: "$3.4M" }, { label: "Price", value: "$5.12" }, { label: "7D Change", value: "-3.3%" }], personalView: "High risk/reward. Regulatory uncertainty remains but protocol activity is recovering." },
    ],
    upcomingCoins: [
      { id: "qntm", symbol: "QNTM", name: "Quantum Shield", quickInfo: "Post-quantum cryptography layer for EVM chains", tkm: "$50M FDV · 20% TGE unlock", launchDate: "Q3 2026" },
      { id: "prvx", symbol: "PRVX", name: "PrivaX", quickInfo: "Privacy middleware for institutional DeFi", tkm: "$120M FDV · 15% TGE", launchDate: "Q4 2026" },
      { id: "zkid", symbol: "ZKID", name: "ZK Identity", quickInfo: "Decentralized identity with zero-knowledge proofs", tkm: "$85M FDV · 25% TGE", launchDate: "Q4 2026" },
    ],
    aiSummary: "Privacy scores 93/100 — among the strongest in the current cycle. Key drivers: accelerating institutional demand for confidential transactions, maturation of ZK-proof systems enabling compliance-friendly privacy, and regulatory pressure pushing users toward privacy-preserving alternatives. Near-term catalysts: ONDO's ZK layer launch (Q3 2026), Secret Network v2 upgrade, potential ETF applications including privacy coin exposure.",
  },
  {
    id: "defi", title: "DeFi", score: 78, tag: "Stable",
    summary: "Decentralized finance seeing renewed interest amid traditional finance integration.",
    detailedReport: "Decentralized finance is in a structural maturation phase. While speculative fervor has cooled, TVL is recovering driven by real yield protocols and institutional integrations. Layer 2 deployments have significantly reduced transaction costs, making DeFi accessible to a broader audience.",
    news: [
      { id: "d1", title: "Aave v4 launches with new risk isolation module", body: "Aave's fourth major version introduces granular risk isolation, allowing protocol governance to limit contagion from new asset listings.", time: "3h ago", importance: "major" },
      { id: "d2", title: "Uniswap v4 hooks ecosystem growing rapidly", body: "Over 200 custom hooks have been deployed on Uniswap v4 testnets, signaling strong developer interest in the customizable AMM architecture.", time: "8h ago", importance: "minor" },
    ],
    coinsInSpace: [
      { id: "aave", symbol: "AAVE", name: "Aave", quickInfo: "Leading decentralized lending protocol with $10B+ TVL.", tokenMetrics: [{ label: "Market Cap", value: "$2.1B" }, { label: "24h Volume", value: "$180M" }, { label: "Price", value: "$192.4" }, { label: "7D Change", value: "+5.2%" }], personalView: "Blue chip DeFi. Safety module and governance make it a cornerstone holding." },
      { id: "uni", symbol: "UNI", name: "Uniswap", quickInfo: "The largest AMM DEX by volume. v4 hooks enable infinite customization.", tokenMetrics: [{ label: "Market Cap", value: "$4.3B" }, { label: "24h Volume", value: "$210M" }, { label: "Price", value: "$7.21" }, { label: "7D Change", value: "+2.1%" }], personalView: "Dominant position. Fee switch activation could be a major catalyst." },
    ],
    upcomingCoins: [
      { id: "yld", symbol: "YLD", name: "Yield Protocol", quickInfo: "Fixed-rate DeFi lending with term structure", tkm: "$200M FDV · 10% TGE", launchDate: "Q3 2026" },
    ],
    aiSummary: "DeFi scores 78/100 — solid but lagging privacy and AI narratives this cycle. Real yield is the key theme separating winners from losers. Focus on protocols with sustainable revenue models and clear fee-accrual mechanisms.",
  },
  {
    id: "ai-ml", title: "AI & ML", score: 85, tag: "Hot",
    summary: "AI tokens surging as large language model integrations drive on-chain activity and utility.",
    detailedReport: "AI tokens are leading this market cycle driven by real-world adoption of decentralized compute and data marketplaces. The convergence of AI and blockchain is creating genuine utility with several protocols now generating sustainable revenue.",
    news: [
      { id: "a1", title: "Fetch.AI merges with SingularityNET and Ocean Protocol", body: "The Artificial Superintelligence Alliance merger is complete, creating the largest AI token by market cap.", time: "6h ago", importance: "major" },
      { id: "a2", title: "Bittensor TAO staking rewards hit record high", body: "Network participants earn record yield as demand for decentralized ML subnet compute surges.", time: "12h ago", importance: "major" },
    ],
    coinsInSpace: [
      { id: "fet", symbol: "FET", name: "Fetch.AI", quickInfo: "Autonomous AI agents for DeFi, logistics, and smart cities.", tokenMetrics: [{ label: "Market Cap", value: "$2.4B" }, { label: "24h Volume", value: "$195M" }, { label: "Price", value: "$2.31" }, { label: "7D Change", value: "+7.6%" }], personalView: "ASI merger is transformative. Dominant position in AI agent narrative." },
      { id: "tao", symbol: "TAO", name: "Bittensor", quickInfo: "Decentralized ML network rewarding intelligence contributions.", tokenMetrics: [{ label: "Market Cap", value: "$3.1B" }, { label: "24h Volume", value: "$88M" }, { label: "Price", value: "$412.00" }, { label: "7D Change", value: "+11.2%" }], personalView: "Highest conviction AI play. Subnet expansion creating compounding network effects." },
    ],
    upcomingCoins: [
      { id: "agno", symbol: "AGNO", name: "Agnostic AI", quickInfo: "Cross-chain AI inference marketplace", tkm: "$300M FDV · 12% TGE", launchDate: "Q3 2026" },
    ],
    aiSummary: "AI & ML scores 85/100. This is the dominant narrative of 2026 with real revenue backing the hype. TAO and FET lead but valuations are stretched. New entrants with novel architectures represent asymmetric opportunities.",
  },
  {
    id: "layer2", title: "Layer 2", score: 88, tag: "Strong",
    summary: "L2 scaling solutions leading adoption with record transaction volumes and low fee environments.",
    detailedReport: "Layer 2 scaling solutions have achieved mainstream adoption milestones. Combined L2 transaction volume now exceeds Ethereum mainnet by 8×, and average transaction fees across major L2s are under $0.01. The narrative is shifting from infrastructure speculation to real user activity.",
    news: [
      { id: "l1", title: "Arbitrum One processes record 4.2M transactions in 24 hours", body: "Driven by a major DeFi protocol launch, Arbitrum hit its highest-ever daily transaction count.", time: "4h ago", importance: "major" },
      { id: "l2", title: "Base surpasses 2M daily active addresses", body: "Coinbase's L2 continues its rapid growth, now ranking second among all L2s by daily active users.", time: "9h ago", importance: "major" },
    ],
    coinsInSpace: [
      { id: "arb", symbol: "ARB", name: "Arbitrum", quickInfo: "Largest L2 by TVL. Dominant DeFi ecosystem with $8B+ locked.", tokenMetrics: [{ label: "Market Cap", value: "$1.1B" }, { label: "24h Volume", value: "$110M" }, { label: "Price", value: "$0.87" }, { label: "7D Change", value: "+1.4%" }], personalView: "Solid infrastructure play. Undervalued relative to ecosystem size and daily activity." },
      { id: "op", symbol: "OP", name: "Optimism", quickInfo: "Superchain vision — hundreds of OP Stack chains sharing security.", tokenMetrics: [{ label: "Market Cap", value: "$900M" }, { label: "24h Volume", value: "$89M" }, { label: "Price", value: "$1.10" }, { label: "7D Change", value: "+3.8%" }], personalView: "Superchain thesis is compelling. Coinbase Base success validates the OP Stack approach." },
    ],
    upcomingCoins: [],
    aiSummary: "Layer 2 scores 88/100. Infrastructure is mature and adoption is real. Price action may lag due to unlock schedules but 12-month outlook is strongly bullish as sequencer revenue decentralization unlocks token value accrual.",
  },
  {
    id: "gaming", title: "Gaming", score: 71, tag: "Recovering",
    summary: "Blockchain gaming expanding with major publisher partnerships announced this quarter.",
    detailedReport: "The blockchain gaming sector is pivoting from pure speculation toward genuine player acquisition. Several AAA studios have announced token integrations and daily active users across major gaming chains reached all-time highs this month.",
    news: [
      { id: "g1", title: "Immutable X partners with major AAA studio for NFT integration", body: "A top-10 game publisher will integrate Immutable X for in-game asset ownership across their flagship franchise.", time: "1d ago", importance: "major" },
    ],
    coinsInSpace: [
      { id: "imx", symbol: "IMX", name: "Immutable X", quickInfo: "Leading L2 for gaming NFTs. Near-zero gas fees for in-game transactions.", tokenMetrics: [{ label: "Market Cap", value: "$1.1B" }, { label: "24h Volume", value: "$62M" }, { label: "Price", value: "$0.92" }, { label: "7D Change", value: "+8.7%" }], personalView: "Best positioned to capture AAA gaming adoption. Strong ecosystem and developer tooling." },
      { id: "axs", symbol: "AXS", name: "Axie Infinity", quickInfo: "Pioneer play-to-earn game. Rebuilding with Axie Origins.", tokenMetrics: [{ label: "Market Cap", value: "$530M" }, { label: "24h Volume", value: "$28M" }, { label: "Price", value: "$4.81" }, { label: "7D Change", value: "+3.2%" }], personalView: "Recovery narrative in play. Watch for Origins Season 3 announcement." },
    ],
    upcomingCoins: [],
    aiSummary: "Gaming scores 71/100. The sector is pivoting from speculation to real player acquisition. IMX is the strongest infrastructure play. Risk: most games still lack fun gameplay that competes with traditional titles.",
  },
];

/* ══════════════════════════════════════════
   SCORE COLOR HELPER
══════════════════════════════════════════ */
export const scoreColor = (s: number) =>
  s >= 85 ? "#4ade80" : s >= 70 ? "#f59e0b" : "#f87171";

/* ══════════════════════════════════════════
   TAB BAR
══════════════════════════════════════════ */
export const TabBar = ({
  active, onChange,
}: {
  active: "narratives" | "coin-scan";
  onChange: (t: "narratives" | "coin-scan") => void;
}) => (
  <div className="flex items-center gap-1 bg-[#111111] border border-[#1e1e1e] rounded-lg p-0.5">
    {(["narratives", "coin-scan"] as const).map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
          active === tab
            ? "bg-[#1e1e1e] text-[#e8e8e8]"
            : "text-[#555] hover:text-[#888]"
        }`}
      >
        {tab === "coin-scan" ? "Coin Scan" : "Narratives"}
      </button>
    ))}
  </div>
);

/* ══════════════════════════════════════════
   EXPANDABLE NEWS ITEM
══════════════════════════════════════════ */
export const ExpandableNewsItem = ({ item }: { item: NewsItem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1a1a1a] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-[#111111] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[#cccccc] text-sm leading-snug">{item.title}</p>
          <p className="text-[#444] text-[11px] mt-1">{item.time}</p>
        </div>
        <span className="text-[#333] flex-shrink-0 mt-0.5">
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3">
          <p className="text-[#666] text-xs leading-relaxed">{item.body}</p>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   NARRATIVE DETAIL (sheet content)
══════════════════════════════════════════ */
const NarrativeDetail = ({
  narrative, onOpenCoin,
}: {
  narrative: NarrativeData;
  onOpenCoin: (id: string) => void;
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [importance, setImportance] = useState<NewsImportance>("major");
  const filtered = narrative.news.filter((n) => n.importance === importance);

  return (
    <div className="h-full overflow-y-auto">
      {/* Title row */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1a1a1a]">
        <h2 className="text-[#e8e8e8] text-xl font-semibold">{narrative.title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#555] font-medium">{narrative.tag}</span>
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: scoreColor(narrative.score) }}
          >
            {narrative.score}/100
          </span>
        </div>
      </div>

      <div className="py-5 space-y-6">
        {/* Report */}
        <section>
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">Report</p>
          <p className="text-[#888] text-sm leading-relaxed">{narrative.detailedReport}</p>
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
            {filtered.length > 0
              ? filtered.map((item) => <ExpandableNewsItem key={item.id} item={item} />)
              : <p className="text-[#333] text-xs text-center py-5">No {importance} news for this period.</p>
            }
          </div>
        </section>

        {/* Coins in space */}
        <section>
          <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">Coins in the Space</p>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
            {narrative.coinsInSpace.map((coin) => (
              <div key={coin.id}
                className="flex-shrink-0 w-52 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-[9px] font-semibold text-[#888]">{coin.symbol.slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="text-[#e8e8e8] text-sm font-medium leading-tight">{coin.symbol}</p>
                    <p className="text-[#444] text-[10px]">{coin.name}</p>
                  </div>
                </div>
                <p className="text-[#666] text-[11px] leading-relaxed line-clamp-2">{coin.quickInfo}</p>
                <div className="grid grid-cols-2 gap-1">
                  {coin.tokenMetrics.slice(0,2).map((m) => (
                    <div key={m.label} className="bg-[#111] rounded p-1.5">
                      <p className="text-[#333] text-[9px] uppercase">{m.label}</p>
                      <p className="text-[#aaa] text-xs font-medium">{m.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[#444] text-[10px] leading-snug line-clamp-2 italic">{coin.personalView}</p>
                <button onClick={() => onOpenCoin(coin.id)}
                  className="text-[11px] text-[#444] hover:text-[#888] transition-colors text-left mt-auto flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" /> Expand
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming */}
        {narrative.upcomingCoins.length > 0 && (
          <section>
            <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">Coins Yet to Launch</p>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
              {narrative.upcomingCoins.map((coin) => (
                <div key={coin.id}
                  className="flex-shrink-0 w-44 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 flex flex-col gap-1.5"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-[9px] font-semibold text-[#888]">{coin.symbol.slice(0,2)}</span>
                  </div>
                  <p className="text-[#e8e8e8] text-sm font-medium">{coin.symbol}</p>
                  <p className="text-[#444] text-[10px]">{coin.name}</p>
                  <p className="text-[#666] text-[11px] leading-relaxed">{coin.quickInfo}</p>
                  <p className="text-[#333] text-[10px]">{coin.tkm}</p>
                  <span className="text-[#f59e0b] text-[10px] bg-[#1a1500] border border-[#2a2000] rounded px-1.5 py-0.5 w-fit">
                    {coin.launchDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Summary */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#444] text-[10px] tracking-widest uppercase">AI Summary</p>
            <span className="text-xs font-semibold tabular-nums" style={{ color: scoreColor(narrative.score) }}>
              Score {narrative.score}/100
            </span>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
            <p className="text-[#888] text-sm leading-relaxed">{narrative.aiSummary}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   NARRATIVES PAGE
══════════════════════════════════════════ */
const NarrativesPage = ({
  onOpenCoin,
}: {
  onOpenCoin: (id: string) => void;
}) => {
  const [selected, setSelected] = useState<NarrativeData | null>(null);

  return (
    <>
      <div className="pt-5 px-5">
        <p className="text-[#333] text-[10px] tracking-widest uppercase mb-4">Active Narratives</p>

        {/* Horizontal scroll of cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none">
          {narratives.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelected(n)}
              className="flex-shrink-0 w-44 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4 text-left hover:border-[#2a2a2a] hover:bg-[#111111] transition-all duration-150 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium text-[#444] uppercase tracking-wide">{n.tag}</span>
                <span className="text-sm font-semibold tabular-nums" style={{ color: scoreColor(n.score) }}>
                  {n.score}
                </span>
              </div>
              <h3 className="text-[#e8e8e8] text-sm font-semibold mb-1.5">{n.title}</h3>
              <p className="text-[#555] text-[11px] leading-relaxed line-clamp-3">{n.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          side="right"
          className="w-full sm:w-[480px] max-w-full border-l border-[#1a1a1a] p-0 bg-[#090909] overflow-hidden"
        >
          <div className="h-full px-6 pt-10 pb-6">
            {selected && (
              <NarrativeDetail
                narrative={selected}
                onOpenCoin={(id) => { setSelected(null); onOpenCoin(id); }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NarrativesPage;
