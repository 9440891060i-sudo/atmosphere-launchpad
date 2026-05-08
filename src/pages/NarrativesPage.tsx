import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export type TimeFilter = "1D" | "7D" | "1m" | "1y";
export type NewsImportance = "major" | "minor";

export interface NewsItem {
  id: string; title: string; body: string; time: string; url?: string; importance: NewsImportance;
}
export interface CoinCard {
  id: string; symbol: string; name: string;
  price: string; change: string; positive: boolean;
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
    summary: "Privacy-preserving protocols gaining momentum as regulatory pressure mounts on transparent chains. ZK-proof systems have matured, enabling compliance-friendly confidentiality. Institutional adoption is accelerating.",
    detailedReport: "Privacy-focused blockchain protocols are experiencing a renaissance as regulators tighten scrutiny on transparent on-chain activity. Zero-knowledge proof systems have matured significantly, enabling both compliance and confidentiality. Institutional adoption is accelerating driven by demand for private asset transfers without sacrificing auditability. Network activity across major privacy coins has increased 34% month-over-month.",
    news: [
      { id: "n1", title: "ONDO Finance integrates ZK-proof layer for institutional clients", body: "ONDO Finance announced a partnership with StarkWare to bring zero-knowledge proof capabilities to its tokenized asset platform, enabling institutional investors to transact privately while maintaining regulatory compliance.", time: "2h ago", importance: "major" },
      { id: "n2", title: "Secret Network TVL surges 28% after new DEX launch", body: "Secret Network's total value locked surged following the launch of SecretSwap v3, which introduced private liquidity pools and encrypted order books.", time: "5h ago", importance: "major" },
      { id: "n3", title: "Horizen expands sidechain ecosystem with new privacy dApps", body: "Horizen's EON EVM-compatible sidechain now hosts 12 new privacy-focused decentralized applications targeting healthcare data and private voting systems.", time: "1d ago", importance: "minor" },
      { id: "n4", title: "Tornado Cash governance votes to implement compliance mode", body: "TORN holders voted to implement an optional compliance mode allowing users to generate cryptographic proofs of transaction history for regulatory purposes.", time: "1d ago", importance: "minor" },
    ],
    coinsInSpace: [
      { id: "ondo", symbol: "ONDO", name: "Ondo Finance", price: "$1.24", change: "+12.4%", positive: true, quickInfo: "Tokenized real-world assets with privacy layer. Market leader in institutional DeFi.", tokenMetrics: [{ label: "Market Cap", value: "$1.24B" }, { label: "24h Volume", value: "$89.4M" }, { label: "Price", value: "$1.24" }, { label: "7D Change", value: "+12.4%" }], personalView: "Strong fundamentals with growing institutional adoption. Privacy features are a key differentiator in the RWA space." },
      { id: "scrt", symbol: "SCRT", name: "Secret Network", price: "$0.43", change: "+18.2%", positive: true, quickInfo: "The original privacy-preserving smart contract platform. Encrypted state for all contracts.", tokenMetrics: [{ label: "Market Cap", value: "$142M" }, { label: "24h Volume", value: "$8.7M" }, { label: "Price", value: "$0.43" }, { label: "7D Change", value: "+18.2%" }], personalView: "Undervalued relative to narrative strength. High developer activity and growing ecosystem." },
      { id: "zen", symbol: "ZEN", name: "Horizen", price: "$9.87", change: "-1.1%", positive: false, quickInfo: "Scalable sidechain protocol with optional privacy. Bridges enterprise and privacy crypto.", tokenMetrics: [{ label: "Market Cap", value: "$187M" }, { label: "24h Volume", value: "$12.1M" }, { label: "Price", value: "$9.87" }, { label: "7D Change", value: "-1.1%" }], personalView: "Consolidating after recent gains. Watch for new sidechain launches as potential catalyst." },
      { id: "torn", symbol: "TORN", name: "Tornado Cash", price: "$5.12", change: "-3.3%", positive: false, quickInfo: "Decentralized mixing protocol. Governance token for the world's largest Ethereum mixer.", tokenMetrics: [{ label: "Market Cap", value: "$56M" }, { label: "24h Volume", value: "$3.4M" }, { label: "Price", value: "$5.12" }, { label: "7D Change", value: "-3.3%" }], personalView: "High risk/reward. Regulatory uncertainty remains but protocol activity is recovering." },
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
    summary: "Decentralized finance in a structural maturation phase. TVL recovering via real yield protocols and institutional integrations. L2 deployments reduced costs dramatically, expanding the addressable audience.",
    detailedReport: "Decentralized finance is in a structural maturation phase. While speculative fervor has cooled, TVL is recovering driven by real yield protocols and institutional integrations. Layer 2 deployments have significantly reduced transaction costs, making DeFi accessible to a broader audience.",
    news: [
      { id: "d1", title: "Aave v4 launches with new risk isolation module", body: "Aave's fourth major version introduces granular risk isolation, allowing protocol governance to limit contagion from new asset listings.", time: "3h ago", importance: "major" },
      { id: "d2", title: "Uniswap v4 hooks ecosystem growing rapidly", body: "Over 200 custom hooks have been deployed on Uniswap v4 testnets, signaling strong developer interest in the customizable AMM architecture.", time: "8h ago", importance: "minor" },
    ],
    coinsInSpace: [
      { id: "aave", symbol: "AAVE", name: "Aave", price: "$192.4", change: "+5.2%", positive: true, quickInfo: "Leading decentralized lending protocol with $10B+ TVL.", tokenMetrics: [{ label: "Market Cap", value: "$2.1B" }, { label: "24h Volume", value: "$180M" }, { label: "Price", value: "$192.4" }, { label: "7D Change", value: "+5.2%" }], personalView: "Blue chip DeFi. Safety module and governance make it a cornerstone holding." },
      { id: "uni", symbol: "UNI", name: "Uniswap", price: "$7.21", change: "+2.1%", positive: true, quickInfo: "Largest AMM DEX by volume. v4 hooks enable infinite customization.", tokenMetrics: [{ label: "Market Cap", value: "$4.3B" }, { label: "24h Volume", value: "$210M" }, { label: "Price", value: "$7.21" }, { label: "7D Change", value: "+2.1%" }], personalView: "Dominant position. Fee switch activation could be a major catalyst." },
    ],
    upcomingCoins: [
      { id: "yld", symbol: "YLD", name: "Yield Protocol", quickInfo: "Fixed-rate DeFi lending with term structure", tkm: "$200M FDV · 10% TGE", launchDate: "Q3 2026" },
    ],
    aiSummary: "DeFi scores 78/100 — solid but lagging privacy and AI narratives this cycle. Real yield is the key theme separating winners from losers. Focus on protocols with sustainable revenue models and clear fee-accrual mechanisms.",
  },
  {
    id: "ai-ml", title: "AI & ML", score: 85, tag: "Hot",
    summary: "AI tokens leading the 2026 cycle with real revenue backing the hype. Decentralized compute and data marketplaces gaining genuine traction. Convergence of AI and blockchain creating durable utility.",
    detailedReport: "AI tokens are leading this market cycle driven by real-world adoption of decentralized compute and data marketplaces. The convergence of AI and blockchain is creating genuine utility with several protocols now generating sustainable revenue.",
    news: [
      { id: "a1", title: "Fetch.AI merges with SingularityNET and Ocean Protocol", body: "The Artificial Superintelligence Alliance merger is complete, creating the largest AI token by market cap.", time: "6h ago", importance: "major" },
      { id: "a2", title: "Bittensor TAO staking rewards hit record high", body: "Network participants earn record yield as demand for decentralized ML subnet compute surges.", time: "12h ago", importance: "major" },
    ],
    coinsInSpace: [
      { id: "fet", symbol: "FET", name: "Fetch.AI", price: "$2.31", change: "+7.6%", positive: true, quickInfo: "Autonomous AI agents for DeFi, logistics, and smart cities.", tokenMetrics: [{ label: "Market Cap", value: "$2.4B" }, { label: "24h Volume", value: "$195M" }, { label: "Price", value: "$2.31" }, { label: "7D Change", value: "+7.6%" }], personalView: "ASI merger is transformative. Dominant position in AI agent narrative." },
      { id: "tao", symbol: "TAO", name: "Bittensor", price: "$412.00", change: "+11.2%", positive: true, quickInfo: "Decentralized ML network rewarding intelligence contributions.", tokenMetrics: [{ label: "Market Cap", value: "$3.1B" }, { label: "24h Volume", value: "$88M" }, { label: "Price", value: "$412.00" }, { label: "7D Change", value: "+11.2%" }], personalView: "Highest conviction AI play. Subnet expansion creating compounding network effects." },
    ],
    upcomingCoins: [
      { id: "agno", symbol: "AGNO", name: "Agnostic AI", quickInfo: "Cross-chain AI inference marketplace", tkm: "$300M FDV · 12% TGE", launchDate: "Q3 2026" },
    ],
    aiSummary: "AI & ML scores 85/100. This is the dominant narrative of 2026 with real revenue backing the hype. TAO and FET lead but valuations are stretched. New entrants with novel architectures represent asymmetric opportunities.",
  },
  {
    id: "layer2", title: "Layer 2", score: 88, tag: "Strong",
    summary: "L2 scaling at mainstream inflection point. Combined volume now 8× Ethereum mainnet. Average fees under $0.01. Narrative shifting from infrastructure speculation to measured real-user growth.",
    detailedReport: "Layer 2 scaling solutions have achieved mainstream adoption milestones. Combined L2 transaction volume now exceeds Ethereum mainnet by 8×, and average transaction fees across major L2s are under $0.01. The narrative is shifting from infrastructure speculation to real user activity.",
    news: [
      { id: "l1", title: "Arbitrum One processes record 4.2M transactions in 24 hours", body: "Driven by a major DeFi protocol launch, Arbitrum hit its highest-ever daily transaction count.", time: "4h ago", importance: "major" },
      { id: "l2b", title: "Base surpasses 2M daily active addresses", body: "Coinbase's L2 continues its rapid growth, now ranking second among all L2s by daily active users.", time: "9h ago", importance: "major" },
    ],
    coinsInSpace: [
      { id: "arb", symbol: "ARB", name: "Arbitrum", price: "$0.87", change: "+1.4%", positive: true, quickInfo: "Largest L2 by TVL. Dominant DeFi ecosystem with $8B+ locked.", tokenMetrics: [{ label: "Market Cap", value: "$1.1B" }, { label: "24h Volume", value: "$110M" }, { label: "Price", value: "$0.87" }, { label: "7D Change", value: "+1.4%" }], personalView: "Solid infrastructure play. Undervalued relative to ecosystem size and daily activity." },
      { id: "op", symbol: "OP", name: "Optimism", price: "$1.10", change: "+3.8%", positive: true, quickInfo: "Superchain vision — hundreds of OP Stack chains sharing security.", tokenMetrics: [{ label: "Market Cap", value: "$900M" }, { label: "24h Volume", value: "$89M" }, { label: "Price", value: "$1.10" }, { label: "7D Change", value: "+3.8%" }], personalView: "Superchain thesis is compelling. Coinbase Base success validates the OP Stack approach." },
    ],
    upcomingCoins: [],
    aiSummary: "Layer 2 scores 88/100. Infrastructure is mature and adoption is real. Price action may lag due to unlock schedules but 12-month outlook is strongly bullish as sequencer revenue decentralization unlocks token value accrual.",
  },
  {
    id: "gaming", title: "Gaming", score: 71, tag: "Recovering",
    summary: "Blockchain gaming pivoting from speculation to real player acquisition. AAA studio partnerships announced. Daily active users across major gaming chains hit all-time highs this month.",
    detailedReport: "The blockchain gaming sector is pivoting from pure speculation toward genuine player acquisition. Several AAA studios have announced token integrations and daily active users across major gaming chains reached all-time highs this month.",
    news: [
      { id: "g1", title: "Immutable X partners with major AAA studio for NFT integration", body: "A top-10 game publisher will integrate Immutable X for in-game asset ownership across their flagship franchise.", time: "1d ago", importance: "major" },
    ],
    coinsInSpace: [
      { id: "imx", symbol: "IMX", name: "Immutable X", price: "$0.92", change: "+8.7%", positive: true, quickInfo: "Leading L2 for gaming NFTs. Near-zero gas fees for in-game transactions.", tokenMetrics: [{ label: "Market Cap", value: "$1.1B" }, { label: "24h Volume", value: "$62M" }, { label: "Price", value: "$0.92" }, { label: "7D Change", value: "+8.7%" }], personalView: "Best positioned to capture AAA gaming adoption. Strong ecosystem and developer tooling." },
      { id: "axs", symbol: "AXS", name: "Axie Infinity", price: "$4.81", change: "+3.2%", positive: true, quickInfo: "Pioneer play-to-earn game. Rebuilding with Axie Origins.", tokenMetrics: [{ label: "Market Cap", value: "$530M" }, { label: "24h Volume", value: "$28M" }, { label: "Price", value: "$4.81" }, { label: "7D Change", value: "+3.2%" }], personalView: "Recovery narrative in play. Watch for Origins Season 3 announcement." },
    ],
    upcomingCoins: [],
    aiSummary: "Gaming scores 71/100. The sector is pivoting from speculation to real player acquisition. IMX is the strongest infrastructure play. Risk: most games still lack fun gameplay that competes with traditional titles.",
  },
];

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
export const scoreColor = (s: number) =>
  s >= 85 ? "#4ade80" : s >= 70 ? "#f59e0b" : "#f87171";

export const TabBar = ({
  active, onChange,
}: {
  active: "narratives" | "coin-scan";
  onChange: (t: "narratives" | "coin-scan") => void;
}) => (
  <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
    {(["narratives", "coin-scan"] as const).map((tab) => (
      <button key={tab} onClick={() => onChange(tab)}
        className="px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
        style={{
          backgroundColor: active === tab ? "#1e1e1e" : "transparent",
          color: active === tab ? "#e8e8e8" : "#555",
        }}
      >
        {tab === "coin-scan" ? "Coin Scan" : "Narratives"}
      </button>
    ))}
  </div>
);

export const ExpandableNewsItem = ({ item }: { item: NewsItem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }} className="last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-3.5 flex items-start justify-between gap-3 transition-colors"
        style={{ backgroundColor: open ? "#0f0f0f" : "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0d0d0d")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = open ? "#0f0f0f" : "transparent")}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug" style={{ color: "#cccccc" }}>{item.title}</p>
          <p className="text-[11px] mt-1" style={{ color: "#444" }}>{item.time}</p>
        </div>
        <span className="flex-shrink-0 mt-0.5" style={{ color: "#333" }}>
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-3.5 space-y-2">
          <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{item.body}</p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] transition-colors"
              style={{ color: "#555" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >
              Read full article ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   NARRATIVES PAGE
══════════════════════════════════════════ */
const NarrativesPage = ({
  narratives: data,
  onOpenNarrative, onOpenCoin,
}: {
  narratives: NarrativeData[];
  onOpenNarrative: (id: string) => void;
  onOpenCoin: (id: string) => void;
}) => {
  const narratives = data;
  return (
    <div className="px-6 pt-6 pb-16">
      <p className="text-[10px] tracking-widest uppercase mb-5" style={{ color: "#333" }}>
        Active Narratives
      </p>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 scrollbar-none">
        {narratives.map((n) => (
          <button
            key={n.id}
            onClick={() => onOpenNarrative(n.id)}
            className="flex-shrink-0 w-72 rounded-xl text-left transition-all duration-150 active:scale-[0.98] flex flex-col"
            style={{
              backgroundColor: "#0d0d0d",
              border: "1px solid #1a1a1a",
              padding: "20px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
              (e.currentTarget as HTMLElement).style.backgroundColor = "#0f0f0f";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
              (e.currentTarget as HTMLElement).style.backgroundColor = "#0d0d0d";
            }}
          >
            {/* Top row: tag + score */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded"
                style={{ color: "#555", backgroundColor: "#141414", border: "1px solid #1e1e1e" }}>
                {n.tag}
              </span>
              <span className="text-lg font-semibold tabular-nums" style={{ color: scoreColor(n.score) }}>
                {n.score}<span className="text-xs font-normal" style={{ color: "#333" }}>/100</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold mb-2" style={{ color: "#e8e8e8" }}>{n.title}</h3>

            {/* Summary */}
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#666" }}>{n.summary}</p>

            {/* Divider */}
            <div className="mb-3" style={{ borderTop: "1px solid #1a1a1a" }} />

            {/* Top coins */}
            <div className="space-y-2 mb-4">
              {n.coinsInSpace.slice(0, 3).map((coin) => (
                <div key={coin.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#1a1a1a" }}>
                      <span className="text-[8px] font-semibold" style={{ color: "#666" }}>
                        {coin.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#aaa" }}>{coin.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs tabular-nums" style={{ color: "#888" }}>{coin.price}</span>
                    <span className="text-[11px] tabular-nums font-medium"
                      style={{ color: coin.positive ? "#4ade80" : "#f87171" }}>
                      {coin.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3"
              style={{ borderTop: "1px solid #141414" }}>
              <span className="text-[11px]" style={{ color: "#444" }}>
                {n.news.filter(x => x.importance === "major").length} major news
              </span>
              <span className="text-[11px]" style={{ color: "#555" }}>View details →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NarrativesPage;
