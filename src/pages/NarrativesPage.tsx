import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Zap, Gamepad2, Brain, TrendingUp, Search } from "lucide-react";
import atmosphereLogo from "@/assets/atmosphere-logo.png";

/* ─── Types ─── */
interface Narrative {
  id: string;
  title: string;
  score: number;
  icon: React.ReactNode;
  summary: string;
  recentNews: number;
  majorCoins: string[];
  color: string;
}

interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  positive: boolean;
}

/* ─── Mock Data ─── */
const narratives: Narrative[] = [
  {
    id: "privacy",
    title: "Privacy",
    score: 93,
    icon: <Shield className="w-4 h-4" />,
    summary: "Privacy-preserving protocols gaining momentum as regulatory pressure mounts on transparent chains.",
    recentNews: 12,
    majorCoins: ["ZEN", "SCRT", "ONDO", "TORN"],
    color: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: "defi",
    title: "DeFi",
    score: 78,
    icon: <TrendingUp className="w-4 h-4" />,
    summary: "Decentralized finance protocols seeing renewed interest amid traditional finance integration.",
    recentNews: 24,
    majorCoins: ["AAVE", "UNI", "COMP", "MKR"],
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    id: "gaming",
    title: "Gaming",
    score: 71,
    icon: <Gamepad2 className="w-4 h-4" />,
    summary: "Blockchain gaming sector expanding with major publisher partnerships announced this quarter.",
    recentNews: 8,
    majorCoins: ["AXS", "SAND", "MANA", "IMX"],
    color: "from-green-500/20 to-emerald-500/10",
  },
  {
    id: "ai-ml",
    title: "AI & ML",
    score: 85,
    icon: <Brain className="w-4 h-4" />,
    summary: "AI tokens surging as large language model integrations drive on-chain activity and utility.",
    recentNews: 19,
    majorCoins: ["FET", "AGIX", "OCEAN", "TAO"],
    color: "from-orange-500/20 to-amber-500/10",
  },
  {
    id: "layer2",
    title: "Layer 2",
    score: 88,
    icon: <Zap className="w-4 h-4" />,
    summary: "L2 scaling solutions leading adoption with record transaction volumes and low fee environments.",
    recentNews: 31,
    majorCoins: ["ARB", "OP", "MATIC", "IMX"],
    color: "from-yellow-500/20 to-orange-500/10",
  },
];

const topCoins: Coin[] = [
  { id: "ondo", symbol: "ONDO", name: "Ondo Finance", price: "$1.24", change: "+4.2%", positive: true },
  { id: "zen", symbol: "ZEN", name: "Horizen", price: "$9.87", change: "-1.1%", positive: false },
  { id: "scrt", symbol: "SCRT", name: "Secret", price: "$0.43", change: "+2.8%", positive: true },
  { id: "fetch", symbol: "FET", name: "Fetch.AI", price: "$2.31", change: "+7.6%", positive: true },
  { id: "arb", symbol: "ARB", name: "Arbitrum", price: "$0.87", change: "+1.4%", positive: true },
  { id: "torn", symbol: "TORN", name: "Tornado Cash", price: "$5.12", change: "-3.3%", positive: false },
];

/* ─── Narrative Card ─── */
const NarrativeCard = ({ narrative, onClick }: { narrative: Narrative; onClick: () => void }) => {
  const scoreColor =
    narrative.score >= 85 ? "text-emerald-400" : narrative.score >= 70 ? "text-amber-400" : "text-red-400";

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-44 rounded-2xl p-4 text-left bg-gradient-to-br ${narrative.color} border border-white/10 backdrop-blur-sm hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/70">
          {narrative.icon}
        </div>
        <span className={`text-sm font-semibold ${scoreColor}`}>{narrative.score}/100</span>
      </div>
      <h3 className="text-white text-sm font-medium mb-1">{narrative.title}</h3>
      <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">{narrative.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {narrative.majorCoins.slice(0, 3).map((coin) => (
          <span key={coin} className="text-[10px] text-white/40 bg-white/5 rounded px-1.5 py-0.5">
            {coin}
          </span>
        ))}
      </div>
    </button>
  );
};

/* ─── Coin Row ─── */
const CoinRow = ({ coin, onClick }: { coin: Coin; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/5 active:bg-white/10 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white/80">{coin.symbol.slice(0, 2)}</span>
      </div>
      <div className="text-left">
        <p className="text-white text-sm font-medium">{coin.symbol}</p>
        <p className="text-white/40 text-[11px]">{coin.name}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-white text-sm font-medium">{coin.price}</p>
      <p className={`text-[11px] font-medium ${coin.positive ? "text-emerald-400" : "text-red-400"}`}>
        {coin.change}
      </p>
    </div>
  </button>
);

/* ─── Tab Bar ─── */
export const AppTabBar = ({
  activeTab,
  onTabChange,
}: {
  activeTab: "narratives" | "coin-scan";
  onTabChange: (tab: "narratives" | "coin-scan") => void;
}) => (
  <div className="flex items-center gap-2 px-4">
    <button
      onClick={() => onTabChange("narratives")}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
        activeTab === "narratives"
          ? "bg-white text-black"
          : "border border-white/20 text-white/60 hover:text-white hover:border-white/40"
      }`}
    >
      Narratives
    </button>
    <button
      onClick={() => onTabChange("coin-scan")}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
        activeTab === "coin-scan"
          ? "bg-white text-black"
          : "border border-white/20 text-white/60 hover:text-white hover:border-white/40"
      }`}
    >
      Coin Scan
    </button>
  </div>
);

/* ─── Main Page ─── */
const NarrativesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"narratives" | "coin-scan">("narratives");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoins = topCoins.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab: "narratives" | "coin-scan") => {
    setActiveTab(tab);
    if (tab === "coin-scan") navigate("/coin-scan");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <img src={atmosphereLogo} alt="Atmosphere" className="h-6 w-auto opacity-80" />
          <AppTabBar activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-10">
        {/* Narratives Tab */}
        <div className="pt-6 px-4">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-5">Active Narratives</p>

          {/* Horizontal scroll of narrative cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
            {narratives.map((n) => (
              <NarrativeCard
                key={n.id}
                narrative={n}
                onClick={() => navigate(`/narratives/${n.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 px-4">
          <div className="h-px bg-white/5" />
        </div>

        {/* Top coins */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-white/40 text-xs tracking-widest uppercase">Top Coins</p>
            <button
              onClick={() => navigate("/coin-scan")}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              View all →
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden mx-4">
          {topCoins.slice(0, 5).map((coin) => (
            <CoinRow key={coin.id} coin={coin} onClick={() => navigate(`/coin-scan/${coin.id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NarrativesPage;
export { narratives, topCoins };
