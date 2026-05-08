import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Zap, Gamepad2, Brain, TrendingUp,
  ChevronDown, ChevronUp,
} from "lucide-react";
import {
  Sheet, SheetContent,
} from "@/components/ui/sheet";
import atmosphereLogo from "@/assets/atmosphere-logo.png";

/* ══════════════════════════════════════════
   SHARED DATA
══════════════════════════════════════════ */

export type TimeFilter = "1D" | "7D" | "1m" | "1y";
export type NewsImportance = "major" | "minor";

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  time: string;
  importance: NewsImportance;
}

export interface CoinCard {
  id: string;
  symbol: string;
  name: string;
  quickInfo: string;
  tokenMetrics: { label: string; value: string }[];
  personalView: string;
}

export interface UpcomingCoin {
  id: string;
  symbol: string;
  name: string;
  quickInfo: string;
  tkm: string;
  launchDate: string;
}

export interface NarrativeData {
  id: string;
  title: string;
  score: number;
  icon: React.ReactNode;
  summary: string;
  color: string;
  detailedReport: string;
  news: NewsItem[];
  coinsInSpace: CoinCard[];
  upcomingCoins: UpcomingCoin[];
  aiSummary: string;
}

export const narratives: NarrativeData[] = [
  {
    id: "privacy",
    title: "Privacy",
    score: 93,
    icon: <Shield className="w-4 h-4" />,
    summary: "Privacy-preserving protocols gaining momentum as regulatory pressure mounts.",
    color: "from-violet-500/20 to-purple-500/10",
    detailedReport:
      "Privacy-focused blockchain protocols are experiencing a renaissance as regulators tighten scrutiny on transparent on-chain activity. Zero-knowledge proof systems have matured significantly, enabling both compliance and confidentiality. Institutional adoption is accelerating driven by demand for private asset transfers without sacrificing auditability. Network activity across major privacy coins has increased 34% month-over-month.",
    news: [
      {
        id: "n1", title: "ONDO Finance integrates ZK-proof layer for institutional clients",
        body: "ONDO Finance announced a partnership with StarkWare to bring zero-knowledge proof capabilities to its tokenized asset platform, enabling institutional investors to transact privately while maintaining regulatory compliance.",
        time: "2h ago", importance: "major",
      },
      {
        id: "n2", title: "Secret Network TVL surges 28% after new DEX launch",
        body: "Secret Network's total value locked surged following the launch of SecretSwap v3, which introduced private liquidity pools and encrypted order books.",
        time: "5h ago", importance: "major",
      },
      {
        id: "n3", title: "Horizen expands sidechain ecosystem with new privacy dApps",
        body: "Horizen's EON EVM-compatible sidechain now hosts 12 new privacy-focused dApps, targeting healthcare data and private voting.",
        time: "1d ago", importance: "minor",
      },
      {
        id: "n4", title: "Tornado Cash governance votes to implement compliance mode",
        body: "TORN holders voted to implement an optional compliance mode allowing users to generate cryptographic proofs of transaction history.",
        time: "1d ago", importance: "minor",
      },
    ],
    coinsInSpace: [
      {
        id: "ondo", symbol: "ONDO", name: "Ondo Finance",
        quickInfo: "Tokenized real-world assets with privacy layer integration. Market leader in institutional DeFi.",
        tokenMetrics: [
          { label: "Market Cap", value: "$1.24B" }, { label: "24h Vol", value: "$89.4M" },
          { label: "Price", value: "$1.24" }, { label: "7D Change", value: "+12.4%" },
        ],
        personalView: "Strong fundamentals with growing institutional adoption. Privacy features are a key differentiator in the RWA space.",
      },
      {
        id: "scrt", symbol: "SCRT", name: "Secret Network",
        quickInfo: "The original privacy-preserving smart contract platform. Encrypted state for all contracts.",
        tokenMetrics: [
          { label: "Market Cap", value: "$142M" }, { label: "24h Vol", value: "$8.7M" },
          { label: "Price", value: "$0.43" }, { label: "7D Change", value: "+18.2%" },
        ],
        personalView: "Undervalued relative to narrative strength. High developer activity and growing ecosystem.",
      },
      {
        id: "zen", symbol: "ZEN", name: "Horizen",
        quickInfo: "Scalable sidechain protocol with optional privacy. Bridges enterprise and crypto.",
        tokenMetrics: [
          { label: "Market Cap", value: "$187M" }, { label: "24h Vol", value: "$12.1M" },
          { label: "Price", value: "$9.87" }, { label: "7D Change", value: "-1.1%" },
        ],
        personalView: "Consolidating after recent gains. Watch for new sidechain launches as potential catalyst.",
      },
      {
        id: "torn", symbol: "TORN", name: "Tornado Cash",
        quickInfo: "Decentralized mixing protocol. Governance token for the world's largest ETH mixer.",
        tokenMetrics: [
          { label: "Market Cap", value: "$56M" }, { label: "24h Vol", value: "$3.4M" },
          { label: "Price", value: "$5.12" }, { label: "7D Change", value: "-3.3%" },
        ],
        personalView: "High risk/reward. Regulatory uncertainty remains but protocol activity is recovering.",
      },
    ],
    upcomingCoins: [
      {
        id: "qntm", symbol: "QNTM", name: "Quantum Shield",
        quickInfo: "Post-quantum cryptography layer for EVM chains",
        tkm: "$50M FDV · 20% TGE unlock", launchDate: "Q3 2026",
      },
      {
        id: "prvx", symbol: "PRVX", name: "PrivaX",
        quickInfo: "Privacy middleware for institutional DeFi",
        tkm: "$120M FDV · 15% TGE", launchDate: "Q4 2026",
      },
      {
        id: "zkid", symbol: "ZKID", name: "ZK Identity",
        quickInfo: "Decentralized identity with zero-knowledge proofs",
        tkm: "$85M FDV · 25% TGE", launchDate: "Q4 2026",
      },
    ],
    aiSummary:
      "The Privacy narrative scores 93/100 — among the strongest this cycle. Key drivers: accelerating institutional demand, maturation of ZK-proof systems, and regulatory pressure pushing users toward privacy-preserving alternatives. Key risks: potential OFAC-style sanctions on mixing protocols. Near-term catalysts: ONDO's ZK layer launch (Q3 2026) and Secret Network v2 upgrade.",
  },
  {
    id: "defi",
    title: "DeFi",
    score: 78,
    icon: <TrendingUp className="w-4 h-4" />,
    summary: "Decentralized finance seeing renewed interest amid traditional finance integration.",
    color: "from-blue-500/20 to-cyan-500/10",
    detailedReport:
      "Decentralized finance is in a structural maturation phase. While speculative fervor has cooled, TVL is recovering driven by real yield protocols and institutional integrations. Layer 2 deployments have significantly reduced transaction costs, making DeFi accessible to a broader audience.",
    news: [
      {
        id: "d1", title: "Aave v4 launches with new risk isolation module",
        body: "Aave's fourth major version introduces granular risk isolation, limiting contagion from new asset listings.",
        time: "3h ago", importance: "major",
      },
      {
        id: "d2", title: "Uniswap v4 hooks ecosystem growing rapidly",
        body: "Over 200 custom hooks have been deployed on Uniswap v4 testnets, signaling strong developer interest.",
        time: "8h ago", importance: "minor",
      },
    ],
    coinsInSpace: [
      {
        id: "aave", symbol: "AAVE", name: "Aave",
        quickInfo: "Leading decentralized lending protocol with $10B+ TVL.",
        tokenMetrics: [
          { label: "Market Cap", value: "$2.1B" }, { label: "24h Vol", value: "$180M" },
          { label: "Price", value: "$192.4" }, { label: "7D Change", value: "+5.2%" },
        ],
        personalView: "Blue chip DeFi. Safety module and governance make it a cornerstone holding.",
      },
      {
        id: "uni", symbol: "UNI", name: "Uniswap",
        quickInfo: "The largest AMM DEX by volume. v4 hooks enable infinite customization.",
        tokenMetrics: [
          { label: "Market Cap", value: "$4.3B" }, { label: "24h Vol", value: "$210M" },
          { label: "Price", value: "$7.21" }, { label: "7D Change", value: "+2.1%" },
        ],
        personalView: "Dominant position in DEX market. Fee switch activation could be a major catalyst.",
      },
    ],
    upcomingCoins: [
      {
        id: "yld", symbol: "YLD", name: "Yield Protocol",
        quickInfo: "Fixed-rate DeFi lending with term structure",
        tkm: "$200M FDV · 10% TGE", launchDate: "Q3 2026",
      },
    ],
    aiSummary:
      "DeFi scores 78/100 — solid but lagging privacy and AI narratives this cycle. Real yield is the key theme separating winners from losers. Focus on protocols with sustainable revenue models and clear fee-accrual mechanisms.",
  },
  {
    id: "gaming",
    title: "Gaming",
    score: 71,
    icon: <Gamepad2 className="w-4 h-4" />,
    summary: "Blockchain gaming expanding with major publisher partnerships announced this quarter.",
    color: "from-green-500/20 to-emerald-500/10",
    detailedReport:
      "The blockchain gaming sector is pivoting from pure speculation toward genuine player acquisition. Several AAA studios have announced token integrations, and daily active users across major gaming chains reached all-time highs this month.",
    news: [
      {
        id: "g1", title: "Immutable X partners with major AAA studio for NFT integration",
        body: "A top-10 game publisher will integrate Immutable X for in-game asset ownership across their flagship franchise.",
        time: "1d ago", importance: "major",
      },
    ],
    coinsInSpace: [
      {
        id: "imx", symbol: "IMX", name: "Immutable X",
        quickInfo: "Leading L2 for gaming NFTs. Near-zero gas fees for in-game transactions.",
        tokenMetrics: [
          { label: "Market Cap", value: "$1.1B" }, { label: "24h Vol", value: "$62M" },
          { label: "Price", value: "$0.92" }, { label: "7D Change", value: "+8.7%" },
        ],
        personalView: "Best positioned to capture AAA gaming adoption. Strong ecosystem and developer tooling.",
      },
      {
        id: "axs", symbol: "AXS", name: "Axie Infinity",
        quickInfo: "Pioneer play-to-earn game. Rebuilding with Axie Origins.",
        tokenMetrics: [
          { label: "Market Cap", value: "$530M" }, { label: "24h Vol", value: "$28M" },
          { label: "Price", value: "$4.81" }, { label: "7D Change", value: "+3.2%" },
        ],
        personalView: "Recovery narrative in play. Watch for Origins Season 3 announcement.",
      },
    ],
    upcomingCoins: [],
    aiSummary:
      "Gaming scores 71/100. The sector is pivoting from speculation to real player acquisition. IMX is the strongest infrastructure play. Risk: most games still lack fun gameplay that can compete with traditional titles.",
  },
  {
    id: "ai-ml",
    title: "AI & ML",
    score: 85,
    icon: <Brain className="w-4 h-4" />,
    summary: "AI tokens surging as LLM integrations drive on-chain activity and utility.",
    color: "from-orange-500/20 to-amber-500/10",
    detailedReport:
      "AI tokens are leading this market cycle driven by real-world adoption of decentralized compute and data marketplaces. The convergence of AI and blockchain is creating genuine utility — not just narrative — with several protocols now generating sustainable revenue.",
    news: [
      {
        id: "a1", title: "Fetch.AI merges with SingularityNET and Ocean Protocol",
        body: "The Artificial Superintelligence Alliance merger is complete, creating the largest AI token by market cap.",
        time: "6h ago", importance: "major",
      },
      {
        id: "a2", title: "Bittensor TAO staking rewards hit record high",
        body: "Network participants earn record yield as demand for decentralized ML subnet compute surges.",
        time: "12h ago", importance: "major",
      },
    ],
    coinsInSpace: [
      {
        id: "fet", symbol: "FET", name: "Fetch.AI",
        quickInfo: "Autonomous AI agents for DeFi, logistics, and smart cities.",
        tokenMetrics: [
          { label: "Market Cap", value: "$2.4B" }, { label: "24h Vol", value: "$195M" },
          { label: "Price", value: "$2.31" }, { label: "7D Change", value: "+7.6%" },
        ],
        personalView: "ASI merger is transformative. Dominant position in AI agent narrative.",
      },
      {
        id: "tao", symbol: "TAO", name: "Bittensor",
        quickInfo: "Decentralized ML network rewarding intelligence contributions.",
        tokenMetrics: [
          { label: "Market Cap", value: "$3.1B" }, { label: "24h Vol", value: "$88M" },
          { label: "Price", value: "$412.00" }, { label: "7D Change", value: "+11.2%" },
        ],
        personalView: "Highest conviction AI play. Subnet expansion creating compounding network effects.",
      },
    ],
    upcomingCoins: [
      {
        id: "agno", symbol: "AGNO", name: "Agnostic AI",
        quickInfo: "Cross-chain AI inference marketplace",
        tkm: "$300M FDV · 12% TGE", launchDate: "Q3 2026",
      },
    ],
    aiSummary:
      "AI & ML scores 85/100. This is the dominant narrative of 2026 with real revenue backing the hype. TAO and FET lead but valuations are stretched. New entrants with novel architectures represent asymmetric opportunities.",
  },
  {
    id: "layer2",
    title: "Layer 2",
    score: 88,
    icon: <Zap className="w-4 h-4" />,
    summary: "L2 scaling solutions leading adoption with record transaction volumes.",
    color: "from-yellow-500/20 to-orange-500/10",
    detailedReport:
      "Layer 2 scaling solutions have achieved mainstream adoption milestones. Combined L2 transaction volume now exceeds Ethereum mainnet by 8×, and average transaction fees across major L2s are under $0.01. The narrative is shifting from infrastructure speculation to real user activity.",
    news: [
      {
        id: "l1", title: "Arbitrum One processes record 4.2M transactions in 24 hours",
        body: "Driven by a major DeFi protocol launch, Arbitrum hit its highest-ever daily transaction count.",
        time: "4h ago", importance: "major",
      },
    ],
    coinsInSpace: [
      {
        id: "arb", symbol: "ARB", name: "Arbitrum",
        quickInfo: "Largest L2 by TVL. Dominant DeFi ecosystem with $8B+ locked.",
        tokenMetrics: [
          { label: "Market Cap", value: "$1.1B" }, { label: "24h Vol", value: "$110M" },
          { label: "Price", value: "$0.87" }, { label: "7D Change", value: "+1.4%" },
        ],
        personalView: "Solid infrastructure play. Undervalued relative to ecosystem size and daily activity.",
      },
      {
        id: "op", symbol: "OP", name: "Optimism",
        quickInfo: "Superchain vision — hundreds of OP Stack chains sharing security.",
        tokenMetrics: [
          { label: "Market Cap", value: "$900M" }, { label: "24h Vol", value: "$89M" },
          { label: "Price", value: "$1.10" }, { label: "7D Change", value: "+3.8%" },
        ],
        personalView: "Superchain thesis is compelling. Coinbase Base success validates the OP Stack approach.",
      },
    ],
    upcomingCoins: [],
    aiSummary:
      "Layer 2 scores 88/100. The infrastructure is mature and adoption is real. Price action may lag narrative due to unlock schedules, but 12-month outlook is strongly bullish as sequencer revenue decentralization unlocks token value accrual.",
  },
];

/* ══════════════════════════════════════════
   SHARED SMALL COMPONENTS
══════════════════════════════════════════ */

export const TabBar = ({
  active,
  onChange,
}: {
  active: "narratives" | "coin-scan";
  onChange: (t: "narratives" | "coin-scan") => void;
}) => (
  <div className="flex items-center gap-2">
    {(["narratives", "coin-scan"] as const).map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 capitalize ${
          active === tab
            ? "bg-white text-black"
            : "border border-white/20 text-white/50 hover:text-white hover:border-white/40"
        }`}
      >
        {tab === "coin-scan" ? "Coin Scan" : "Narratives"}
      </button>
    ))}
  </div>
);

export const ExpandableNewsItem = ({ item }: { item: NewsItem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex-1">
          <p className="text-white/80 text-sm leading-snug">{item.title}</p>
          <p className="text-white/30 text-[11px] mt-1">{item.time}</p>
        </div>
        <span className="flex-shrink-0 mt-0.5 text-white/30">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3">
          <p className="text-white/50 text-xs leading-relaxed">{item.body}</p>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   NARRATIVE DETAIL SHEET CONTENT
══════════════════════════════════════════ */

const NarrativeDetail = ({
  narrative,
  onOpenCoin,
}: {
  narrative: NarrativeData;
  onOpenCoin: (id: string) => void;
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [importance, setImportance] = useState<NewsImportance>("major");
  const scoreColor =
    narrative.score >= 85 ? "text-emerald-400" : narrative.score >= 70 ? "text-amber-400" : "text-red-400";
  const filtered = narrative.news.filter((n) => n.importance === importance);

  return (
    <div className="overflow-y-auto h-full pb-10">
      {/* Title + score */}
      <div className="flex items-end justify-between pt-2 pb-6">
        <h2 className="text-3xl font-extralight text-white tracking-tight">{narrative.title}</h2>
        <div className="text-right">
          <span className={`text-2xl font-light ${scoreColor}`}>{narrative.score}</span>
          <span className="text-white/30 text-xs">/100</span>
        </div>
      </div>

      {/* Detailed report */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">Detailed Report</p>
        <div className="rounded-xl border border-white/8 bg-white/3 p-4">
          <p className="text-white/60 text-sm leading-relaxed">{narrative.detailedReport}</p>
        </div>
      </section>

      {/* News */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">News</p>
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
          {filtered.length > 0 ? (
            filtered.map((item) => <ExpandableNewsItem key={item.id} item={item} />)
          ) : (
            <p className="text-white/30 text-sm text-center py-5">No {importance} news for this period.</p>
          )}
        </div>
      </section>

      {/* Coins in the space */}
      <section className="mb-7">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">Coins in the Space</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6">
          {narrative.coinsInSpace.map((coin) => (
            <div
              key={coin.id}
              className="flex-shrink-0 w-52 rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white/80">{coin.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{coin.symbol}</p>
                  <p className="text-white/35 text-[10px]">{coin.name}</p>
                </div>
              </div>
              <p className="text-white/45 text-[11px] leading-relaxed line-clamp-2">{coin.quickInfo}</p>
              <div className="grid grid-cols-2 gap-1">
                {coin.tokenMetrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="bg-white/5 rounded-lg p-1.5">
                    <p className="text-white/25 text-[9px] uppercase">{m.label}</p>
                    <p className="text-white/75 text-xs font-medium">{m.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-[10px] italic line-clamp-2">{coin.personalView}</p>
              <button
                onClick={() => onOpenCoin(coin.id)}
                className="mt-auto text-[11px] text-white/40 hover:text-white transition-colors text-left"
              >
                → Expand
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Coins yet to launch */}
      {narrative.upcomingCoins.length > 0 && (
        <section className="mb-7">
          <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">Coins Yet to Launch Soon</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6">
            {narrative.upcomingCoins.map((coin) => (
              <div
                key={coin.id}
                className="flex-shrink-0 w-44 rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col gap-1.5"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-amber-400">{coin.symbol.slice(0, 2)}</span>
                </div>
                <p className="text-white text-sm font-semibold">{coin.symbol}</p>
                <p className="text-white/45 text-[11px] leading-relaxed">{coin.quickInfo}</p>
                <p className="text-white/30 text-[10px]">{coin.tkm}</p>
                <span className="text-amber-400/80 text-[10px] bg-amber-500/10 rounded px-2 py-0.5 w-fit">
                  {coin.launchDate}
                </span>
                <button className="text-[11px] text-white/35 hover:text-white transition-colors text-left mt-1">
                  → Expand
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Summary */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/35 text-[10px] tracking-widest uppercase">AI Summary Report</p>
          <span className={`text-sm font-semibold ${scoreColor}`}>[Score {narrative.score}/100]</span>
        </div>
        <div className="rounded-xl border border-white/8 bg-gradient-to-br from-white/5 to-transparent p-4">
          <p className="text-white/60 text-sm leading-relaxed">{narrative.aiSummary}</p>
        </div>
      </section>
    </div>
  );
};

/* ══════════════════════════════════════════
   NARRATIVES PAGE
══════════════════════════════════════════ */

const NarrativesPage = ({ onTabChange, onOpenCoin }: {
  onTabChange: (t: "narratives" | "coin-scan") => void;
  onOpenCoin: (id: string) => void;
}) => {
  const [selectedNarrative, setSelectedNarrative] = useState<NarrativeData | null>(null);

  return (
    <>
      <div className="pt-6 px-4">
        <p className="text-white/35 text-[10px] tracking-widest uppercase mb-4">Active Narratives</p>
        {/* Horizontal scroll of narrative cards */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4">
          {narratives.map((n) => {
            const scoreColor =
              n.score >= 85 ? "text-emerald-400" : n.score >= 70 ? "text-amber-400" : "text-red-400";
            return (
              <button
                key={n.id}
                onClick={() => setSelectedNarrative(n)}
                className={`flex-shrink-0 w-44 rounded-2xl p-4 text-left bg-gradient-to-br ${n.color} border border-white/10 backdrop-blur-sm hover:border-white/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-white/60">
                    {n.icon}
                  </div>
                  <span className={`text-sm font-semibold ${scoreColor}`}>{n.score}/100</span>
                </div>
                <h3 className="text-white text-sm font-medium mb-1">{n.title}</h3>
                <p className="text-white/45 text-[11px] leading-relaxed line-clamp-3">{n.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Narrative detail sheet */}
      <Sheet open={!!selectedNarrative} onOpenChange={(o) => !o && setSelectedNarrative(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-full md:max-w-xl bg-background border-l border-white/10 p-6 overflow-hidden"
        >
          {selectedNarrative && (
            <NarrativeDetail
              narrative={selectedNarrative}
              onOpenCoin={(id) => {
                setSelectedNarrative(null);
                onOpenCoin(id);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NarrativesPage;
