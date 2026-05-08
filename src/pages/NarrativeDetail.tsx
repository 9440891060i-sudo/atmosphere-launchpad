import { useState } from "react";
import { narratives, scoreColor, ExpandableNewsItem, type TimeFilter, type NewsImportance } from "./NarrativesPage";

const NarrativeDetail = ({
  narrativeId, onOpenCoin,
}: {
  narrativeId: string;
  onOpenCoin: (id: string) => void;
}) => {
  const narrative = narratives.find((n) => n.id === narrativeId) ?? narratives[0];
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [importance, setImportance] = useState<NewsImportance>("major");
  const filtered = narrative.news.filter((n) => n.importance === importance);

  return (
    <div className="px-6 pt-6 pb-20 max-w-3xl mx-auto">
      {/* Title + score */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8e8" }}>{narrative.title}</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded uppercase tracking-wide font-medium"
            style={{ color: "#555", backgroundColor: "#141414", border: "1px solid #1e1e1e" }}>
            {narrative.tag}
          </span>
          <span className="text-xl font-semibold tabular-nums" style={{ color: scoreColor(narrative.score) }}>
            {narrative.score}<span className="text-sm font-normal" style={{ color: "#333" }}>/100</span>
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Report */}
        <section>
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>Report</p>
          <div className="rounded-lg p-5" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#888" }}>{narrative.detailedReport}</p>
          </div>
        </section>

        {/* News */}
        <section>
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>News</p>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex gap-1">
              {(["1D","7D","1m","1y"] as TimeFilter[]).map((f) => (
                <button key={f} onClick={() => setTimeFilter(f)}
                  className="px-3 py-1 rounded text-[11px] font-medium transition-all"
                  style={{
                    backgroundColor: timeFilter === f ? "#1e1e1e" : "transparent",
                    color: timeFilter === f ? "#e8e8e8" : "#444",
                  }}
                >{f}</button>
              ))}
            </div>
            <div className="flex rounded overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
              {(["major","minor"] as NewsImportance[]).map((i) => (
                <button key={i} onClick={() => setImportance(i)}
                  className="px-3 py-1 text-[11px] capitalize transition-all"
                  style={{
                    backgroundColor: importance === i ? "#1e1e1e" : "transparent",
                    color: importance === i ? "#e8e8e8" : "#444",
                  }}
                >{i}</button>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
            {filtered.length > 0
              ? filtered.map((item) => <ExpandableNewsItem key={item.id} item={item} />)
              : <p className="text-xs text-center py-6" style={{ color: "#333" }}>No {importance} news for this period.</p>
            }
          </div>
        </section>

        {/* Coins in the space */}
        <section>
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>Coins in the Space</p>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none">
            {narrative.coinsInSpace.map((coin) => (
              <div key={coin.id}
                className="flex-shrink-0 w-60 rounded-lg p-4 flex flex-col gap-2.5"
                style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}
              >
                {/* Coin header */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#1a1a1a" }}>
                    <span className="text-[10px] font-semibold" style={{ color: "#777" }}>{coin.symbol.slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#e8e8e8" }}>{coin.symbol}</p>
                    <p className="text-[10px]" style={{ color: "#444" }}>{coin.name}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium tabular-nums" style={{ color: "#ccc" }}>{coin.price}</p>
                    <p className="text-[11px] tabular-nums font-medium"
                      style={{ color: coin.positive ? "#4ade80" : "#f87171" }}>{coin.change}</p>
                  </div>
                </div>

                {/* Quick info */}
                <p className="text-[11px] leading-relaxed" style={{ color: "#666" }}>{coin.quickInfo}</p>

                {/* Token metrics grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {coin.tokenMetrics.map((m) => (
                    <div key={m.label} className="rounded p-2" style={{ backgroundColor: "#111" }}>
                      <p className="text-[9px] uppercase" style={{ color: "#333" }}>{m.label}</p>
                      <p className="text-xs font-medium tabular-nums" style={{ color: "#aaa" }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Personal view */}
                <p className="text-[10px] leading-snug italic" style={{ color: "#444" }}>{coin.personalView}</p>

                <button onClick={() => onOpenCoin(coin.id)}
                  className="text-[11px] mt-auto pt-2 text-left transition-colors"
                  style={{ color: "#444", borderTop: "1px solid #141414" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
                >
                  View full analysis →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming coins */}
        {narrative.upcomingCoins.length > 0 && (
          <section>
            <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>Coins Yet to Launch</p>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none">
              {narrative.upcomingCoins.map((coin) => (
                <div key={coin.id}
                  className="flex-shrink-0 w-52 rounded-lg p-4 flex flex-col gap-2"
                  style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#1a1a1a" }}>
                    <span className="text-[10px] font-semibold" style={{ color: "#777" }}>{coin.symbol.slice(0,2)}</span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#e8e8e8" }}>{coin.symbol}</p>
                  <p className="text-[10px]" style={{ color: "#444" }}>{coin.name}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#666" }}>{coin.quickInfo}</p>
                  <p className="text-[10px]" style={{ color: "#333" }}>{coin.tkm}</p>
                  <span className="text-[10px] font-medium rounded px-2 py-0.5 w-fit"
                    style={{ color: "#f59e0b", backgroundColor: "#1a1500", border: "1px solid #2a2000" }}>
                    {coin.launchDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Summary */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-widest uppercase" style={{ color: "#333" }}>AI Summary</p>
            <span className="text-sm font-semibold tabular-nums" style={{ color: scoreColor(narrative.score) }}>
              Score {narrative.score}/100
            </span>
          </div>
          <div className="rounded-lg p-5" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#888" }}>{narrative.aiSummary}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NarrativeDetail;
