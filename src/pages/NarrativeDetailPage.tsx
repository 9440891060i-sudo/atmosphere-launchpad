import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { AppTabBar } from "./NarrativesPage";
import atmosphereLogo from "@/assets/atmosphere-logo.png";

/* ─── Types ─── */
type TimeFilter = "1D" | "7D" | "1m" | "1y";
type NewsImportance = "major" | "minor";

/* ─── Mock Data ─── */
const narrativeData: Record<
  string,
  {
    title: string;
    score: number;
    scoreColor: string;
    detailedReport: string;
    news: { id: string; title: string; body: string; time: string; importance: NewsImportance }[];
    coinsInSpace: {
      id: string;
      symbol: string;
      name: string;
      quickInfo: string;
      tokenMetrics: { label: string; value: string }[];
      personalView: string;
    }[];
    upcomingCoins: {
      id: string;
      symbol: string;
      name: string;
      quickInfo: string;
      tkm: string;
      launchDate: string;
    }[];
    aiSummary: string;
  }
> = {
  privacy: {
    title: "Privacy",
    score: 93,
    scoreColor: "text-emerald-400",
    detailedReport:
      "Privacy-focused blockchain protocols are experiencing a renaissance as regulators tighten scrutiny on transparent on-chain activity. Zero-knowledge proof systems have matured significantly, enabling both compliance and confidentiality. Institutional adoption is accelerating driven by demand for private asset transfers without sacrificing auditability. Network activity across major privacy coins has increased 34% month-over-month.",
    news: [
      {
        id: "n1",
        title: "ONDO Finance integrates ZK-proof layer for institutional clients",
        body:
          "ONDO Finance announced a partnership with StarkWare to bring zero-knowledge proof capabilities to its tokenized asset platform, enabling institutional investors to transact privately while maintaining regulatory compliance.",
        time: "2h ago",
        importance: "major",
      },
      {
        id: "n2",
        title: "Secret Network TVL surges 28% after new DEX launch",
        body:
          "Secret Network's total value locked surged following the launch of SecretSwap v3, which introduced private liquidity pools and encrypted order books for the first time on any major DEX.",
        time: "5h ago",
        importance: "major",
      },
      {
        id: "n3",
        title: "Horizen expands sidechain ecosystem with new privacy dApps",
        body:
          "Horizen's EON EVM-compatible sidechain now hosts 12 new privacy-focused decentralized applications, targeting niche use cases in healthcare data and private voting systems.",
        time: "1d ago",
        importance: "minor",
      },
      {
        id: "n4",
        title: "Tornado Cash governance votes to implement compliance mode",
        body:
          "In a controversial governance decision, TORN holders voted to implement an optional compliance mode allowing users to generate cryptographic proofs of transaction history for regulatory purposes.",
        time: "1d ago",
        importance: "minor",
      },
    ],
    coinsInSpace: [
      {
        id: "ondo",
        symbol: "ONDO",
        name: "Ondo Finance",
        quickInfo: "Tokenized real-world assets with privacy layer integration. Market leader in institutional DeFi.",
        tokenMetrics: [
          { label: "Market Cap", value: "$1.24B" },
          { label: "24h Volume", value: "$89.4M" },
          { label: "Price", value: "$1.24" },
          { label: "Change 7D", value: "+12.4%" },
        ],
        personalView:
          "Strong fundamentals with growing institutional adoption. Privacy features are a key differentiator in the RWA space.",
      },
      {
        id: "scrt",
        symbol: "SCRT",
        name: "Secret Network",
        quickInfo: "The original privacy-preserving smart contract platform. Encrypted state for all contracts.",
        tokenMetrics: [
          { label: "Market Cap", value: "$142M" },
          { label: "24h Volume", value: "$8.7M" },
          { label: "Price", value: "$0.43" },
          { label: "Change 7D", value: "+18.2%" },
        ],
        personalView:
          "Undervalued relative to narrative strength. High developer activity and growing ecosystem.",
      },
      {
        id: "zen",
        symbol: "ZEN",
        name: "Horizen",
        quickInfo: "Scalable sidechain protocol with optional privacy. Bridges enterprise and privacy crypto.",
        tokenMetrics: [
          { label: "Market Cap", value: "$187M" },
          { label: "24h Volume", value: "$12.1M" },
          { label: "Price", value: "$9.87" },
          { label: "Change 7D", value: "-1.1%" },
        ],
        personalView:
          "Consolidating after recent gains. Watch for new sidechain launches as potential catalyst.",
      },
      {
        id: "torn",
        symbol: "TORN",
        name: "Tornado Cash",
        quickInfo: "Decentralized mixing protocol. Governance token for the world's largest Ethereum mixer.",
        tokenMetrics: [
          { label: "Market Cap", value: "$56M" },
          { label: "24h Volume", value: "$3.4M" },
          { label: "Price", value: "$5.12" },
          { label: "Change 7D", value: "-3.3%" },
        ],
        personalView:
          "High risk/reward. Regulatory uncertainty remains but protocol activity is recovering.",
      },
    ],
    upcomingCoins: [
      {
        id: "qntm",
        symbol: "QNTM",
        name: "Quantum Shield",
        quickInfo: "Post-quantum cryptography layer for EVM chains",
        tkm: "$50M FDV · 20% TGE unlock",
        launchDate: "Q3 2026",
      },
      {
        id: "prvx",
        symbol: "PRVX",
        name: "PrivaX",
        quickInfo: "Privacy middleware for institutional DeFi",
        tkm: "$120M FDV · 15% TGE",
        launchDate: "Q4 2026",
      },
      {
        id: "zkid",
        symbol: "ZKID",
        name: "ZK Identity",
        quickInfo: "Decentralized identity with zero-knowledge proofs",
        tkm: "$85M FDV · 25% TGE",
        launchDate: "Q4 2026",
      },
    ],
    aiSummary:
      "The Privacy narrative scores 93/100 — among the strongest in the current market cycle. Key drivers include accelerating institutional demand for confidential transactions, maturation of ZK-proof systems enabling compliance-friendly privacy, and growing regulatory pressure pushing users toward privacy-preserving alternatives. Risk factors include potential OFAC-style sanctions on mixing protocols and the technical complexity that limits developer adoption. Near-term catalysts: ONDO's ZK layer launch (expected Q3 2026), Secret Network v2 upgrade, and potential ETF applications that include privacy coin exposure.",
  },
  defi: {
    title: "DeFi",
    score: 78,
    scoreColor: "text-amber-400",
    detailedReport:
      "Decentralized finance is experiencing a structural maturation phase. While speculative fervor has cooled, TVL is recovering driven by real yield protocols and institutional integrations. Layer 2 deployments have significantly reduced transaction costs, making DeFi accessible to a broader audience.",
    news: [
      {
        id: "d1",
        title: "Aave v4 launches with new risk isolation module",
        body: "Aave's fourth major version introduces granular risk isolation, allowing protocol governance to limit contagion from new asset listings.",
        time: "3h ago",
        importance: "major",
      },
      {
        id: "d2",
        title: "Uniswap v4 hooks ecosystem growing rapidly",
        body: "Over 200 custom hooks have been deployed on Uniswap v4 testnets, signaling strong developer interest in the customizable AMM architecture.",
        time: "8h ago",
        importance: "minor",
      },
    ],
    coinsInSpace: [
      {
        id: "aave",
        symbol: "AAVE",
        name: "Aave",
        quickInfo: "Leading decentralized lending protocol with $10B+ TVL.",
        tokenMetrics: [
          { label: "Market Cap", value: "$2.1B" },
          { label: "24h Volume", value: "$180M" },
          { label: "Price", value: "$192.4" },
          { label: "Change 7D", value: "+5.2%" },
        ],
        personalView: "Blue chip DeFi. Safety module and governance make it a cornerstone holding.",
      },
    ],
    upcomingCoins: [
      {
        id: "yld",
        symbol: "YLD",
        name: "Yield Protocol",
        quickInfo: "Fixed-rate DeFi lending with term structure",
        tkm: "$200M FDV · 10% TGE",
        launchDate: "Q3 2026",
      },
    ],
    aiSummary:
      "DeFi scores 78/100 — solid but lagging privacy and AI narratives this cycle. Real yield is the key theme separating winners from losers. Focus on protocols with sustainable revenue models.",
  },
};

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

/* ─── Coin Card (Coins in space) ─── */
const CoinCard = ({
  coin,
  onExpand,
}: {
  coin: (typeof narrativeData)["privacy"]["coinsInSpace"][0];
  onExpand: () => void;
}) => (
  <div className="flex-shrink-0 w-52 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white/80">{coin.symbol.slice(0, 2)}</span>
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{coin.symbol}</p>
        <p className="text-white/40 text-[10px]">{coin.name}</p>
      </div>
    </div>
    <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">{coin.quickInfo}</p>
    <div className="grid grid-cols-2 gap-1.5">
      {coin.tokenMetrics.slice(0, 2).map((m) => (
        <div key={m.label} className="bg-white/5 rounded-lg p-2">
          <p className="text-white/30 text-[9px] uppercase tracking-wide">{m.label}</p>
          <p className="text-white/80 text-xs font-medium">{m.value}</p>
        </div>
      ))}
    </div>
    <p className="text-white/30 text-[10px] leading-snug italic line-clamp-2">{coin.personalView}</p>
    <button
      onClick={onExpand}
      className="mt-auto flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition-colors"
    >
      <TrendingUp className="w-3 h-3" /> Expand →
    </button>
  </div>
);

/* ─── Upcoming Coin Card ─── */
const UpcomingCoinCard = ({
  coin,
  onExpand,
}: {
  coin: (typeof narrativeData)["privacy"]["upcomingCoins"][0];
  onExpand: () => void;
}) => (
  <div className="flex-shrink-0 w-44 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
      <span className="text-[10px] font-bold text-amber-400">{coin.symbol.slice(0, 2)}</span>
    </div>
    <p className="text-white text-sm font-semibold">{coin.symbol}</p>
    <p className="text-white/50 text-[11px] leading-relaxed">{coin.quickInfo}</p>
    <p className="text-white/30 text-[10px]">{coin.tkm}</p>
    <div className="flex items-center justify-between mt-1">
      <span className="text-amber-400/80 text-[10px] bg-amber-500/10 rounded px-2 py-0.5">
        {coin.launchDate}
      </span>
    </div>
    <button
      onClick={onExpand}
      className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors"
    >
      Expand →
    </button>
  </div>
);

/* ─── Narrative Detail Page ─── */
const NarrativeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [newsImportance, setNewsImportance] = useState<NewsImportance>("major");

  const data = narrativeData[id ?? "privacy"] ?? narrativeData["privacy"];
  const timeFilters: TimeFilter[] = ["1D", "7D", "1m", "1y"];

  const filteredNews = data.news.filter((n) => n.importance === newsImportance);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate("/narratives")}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div className="flex-1 flex justify-center">
            <AppTabBar
              activeTab="narratives"
              onTabChange={(tab) => navigate(tab === "coin-scan" ? "/coin-scan" : "/narratives")}
            />
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-16 px-4">
        {/* Title + Score */}
        <div className="pt-6 mb-6">
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-extralight text-white tracking-tight">{data.title}</h1>
            <div className="flex flex-col items-end">
              <span className={`text-2xl font-light ${data.scoreColor}`}>{data.score}</span>
              <span className="text-white/30 text-xs">/100</span>
            </div>
          </div>
        </div>

        {/* Detailed Report */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Detailed Report</p>
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <p className="text-white/65 text-sm leading-relaxed">{data.detailedReport}</p>
          </div>
        </section>

        {/* News Section */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">News</p>

          {/* Time filter pills */}
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
            {/* Major / Minor toggle */}
            <div className="flex rounded-full border border-white/15 overflow-hidden">
              {(["major", "minor"] as NewsImportance[]).map((imp) => (
                <button
                  key={imp}
                  onClick={() => setNewsImportance(imp)}
                  className={`px-3 py-1 text-[11px] font-medium transition-all capitalize ${
                    newsImportance === imp
                      ? "bg-white/20 text-white"
                      : "text-white/40 hover:text-white"
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
              <p className="text-white/30 text-sm text-center py-6">No {newsImportance} news for this period.</p>
            )}
          </div>
        </section>

        {/* Coins in the Space */}
        <section className="mb-8">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Coins in the Space</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
            {data.coinsInSpace.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                onExpand={() => navigate(`/coin-scan/${coin.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Coins Yet to Launch */}
        {data.upcomingCoins.length > 0 && (
          <section className="mb-8">
            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">
              Coins Yet to Launch Soon
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
              {data.upcomingCoins.map((coin) => (
                <UpcomingCoinCard
                  key={coin.id}
                  coin={coin}
                  onExpand={() => navigate(`/coin-scan/${coin.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* AI Summary */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 text-[10px] tracking-widest uppercase">AI Summary Report</p>
            <span className={`text-sm font-semibold ${data.scoreColor}`}>[Score {data.score}/100]</span>
          </div>
          <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-transparent p-5">
            <p className="text-white/60 text-sm leading-relaxed">{data.aiSummary}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NarrativeDetailPage;
