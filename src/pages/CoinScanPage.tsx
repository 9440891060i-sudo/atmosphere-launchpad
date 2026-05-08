import { useState } from "react";
import { Search } from "lucide-react";
import {
  scoreColor, ExpandableNewsItem,
  type TimeFilter, type NewsImportance,
} from "./NarrativesPage";
import type { MappedCoinDetail, ApiCoinSummary } from "@/hooks/use-suraj-data";

/* ══════════════════════════════════════════
   COIN DETAIL — full screen content
══════════════════════════════════════════ */
export const CoinDetail = ({
  coin, onOpenCoin,
}: {
  coin: MappedCoinDetail;
  onOpenCoin: (ticker: string) => void;
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7D");
  const [importance, setImportance] = useState<NewsImportance>("major");

  const filteredNews = coin.news.filter((n) => n.importance === importance);

  return (
    <div className="px-6 pt-6 pb-20 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-xs font-semibold" style={{ color: "#777" }}>{coin.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold" style={{ color: "#e8e8e8" }}>{coin.symbol}</h1>
              <span className="text-sm" style={{ color: "#444" }}>{coin.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium tabular-nums" style={{ color: "#e8e8e8" }}>{coin.price}</span>
              <span className="text-sm font-medium tabular-nums"
                style={{ color: coin.positive ? "#4ade80" : "#f87171" }}>
                {coin.change24h} (7D)
              </span>
            </div>
          </div>
        </div>
        <span className="text-xl font-semibold tabular-nums" style={{ color: scoreColor(coin.aiScore) }}>
          {coin.aiScore}<span className="text-sm font-normal" style={{ color: "#333" }}>/100</span>
        </span>
      </div>

      {/* Description */}
      <section>
        <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>Description</p>
        <p className="text-sm leading-relaxed" style={{ color: "#888" }}>{coin.description}</p>
      </section>

      {/* Token Metrics */}
      <section>
        <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>Token Metrics</p>
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
          {coin.tokenMetrics.map((m, i) => (
            <div key={m.label} className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: i < coin.tokenMetrics.length - 1 ? "1px solid #141414" : "none" }}>
              <span className="text-xs" style={{ color: "#555" }}>{m.label}</span>
              <span className="text-sm font-medium tabular-nums" style={{ color: "#cccccc" }}>{m.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section>
        <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>News</p>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex gap-1">
            {(["1D", "7D", "1m", "1y"] as TimeFilter[]).map((f) => (
              <button key={f} onClick={() => setTimeFilter(f)}
                className="px-3 py-1 rounded text-[11px] font-medium transition-all"
                style={{ backgroundColor: timeFilter === f ? "#1e1e1e" : "transparent", color: timeFilter === f ? "#e8e8e8" : "#444" }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex rounded overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
            {(["major", "minor"] as NewsImportance[]).map((i) => (
              <button key={i} onClick={() => setImportance(i)}
                className="px-3 py-1 text-[11px] capitalize transition-all"
                style={{ backgroundColor: importance === i ? "#1e1e1e" : "transparent", color: importance === i ? "#e8e8e8" : "#444" }}>
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
          {filteredNews.length > 0
            ? filteredNews.map((item) => <ExpandableNewsItem key={item.id} item={item} />)
            : <p className="text-xs text-center py-6" style={{ color: "#333" }}>No {importance} news.</p>
          }
        </div>
      </section>

      {/* Social Activity */}
      {coin.socialActivity.length > 0 && (
        <section>
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>Social Activity</p>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
            {coin.socialActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: i < coin.socialActivity.length - 1 ? "1px solid #141414" : "none" }}>
                <div>
                  <p className="text-xs font-medium" style={{ color: "#888" }}>{item.platform}</p>
                  <p className="text-[10px]" style={{ color: "#444" }}>{item.metric}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums" style={{ color: "#ccc" }}>{item.value}</p>
                  {item.trend && (
                    <p className="text-[10px] tabular-nums"
                      style={{ color: item.positive ? "#4ade80" : "#f87171" }}>{item.trend}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Coins */}
      {coin.similarCoinIds.length > 0 && (
        <section>
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#333" }}>Similar Coins</p>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
            {coin.similarCoinIds.map((ticker) => (
              <button key={ticker} onClick={() => onOpenCoin(ticker)}
                className="flex-shrink-0 w-28 rounded-lg p-3 text-left transition-all active:scale-[0.98]"
                style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLElement).style.backgroundColor = "#0f0f0f"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"; (e.currentTarget as HTMLElement).style.backgroundColor = "#0a0a0a"; }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: "#1a1a1a" }}>
                  <span className="text-[9px] font-semibold" style={{ color: "#666" }}>{ticker.slice(0, 2)}</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#e8e8e8" }}>{ticker}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* AI Summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: "#333" }}>AI Summary</p>
          <span className="text-sm font-semibold tabular-nums" style={{ color: scoreColor(coin.aiScore) }}>
            Score {coin.aiScore}/100
          </span>
        </div>
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
          <p className="text-sm leading-relaxed" style={{ color: "#888" }}>{coin.aiSummary}</p>
        </div>
      </section>
    </div>
  );
};

/* ══════════════════════════════════════════
   COIN SCAN LIST PAGE
══════════════════════════════════════════ */
const CoinScanPage = ({
  coins, onOpenCoin,
}: {
  coins: ApiCoinSummary[];
  onOpenCoin: (ticker: string) => void;
}) => {
  const [search, setSearch] = useState("");

  const filtered = coins.filter(
    (c) =>
      c.ticker.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 pt-6 pb-16">
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#333" }} />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
          style={{ backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a", color: "#e8e8e8" }}
          onFocus={(e) => (e.target.style.borderColor = "#2a2a2a")}
          onBlur={(e) => (e.target.style.borderColor = "#1a1a1a")}
        />
      </div>

      {/* Coin list */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1a1a1a", backgroundColor: "#0a0a0a" }}>
        {filtered.map((coin, i) => {
          const positive = coin.change_7d >= 0;
          const price = coin.price >= 1
            ? `$${coin.price.toLocaleString("en", { maximumFractionDigits: 2 })}`
            : `$${coin.price.toFixed(4)}`;
          return (
            <button key={coin.ticker} onClick={() => onOpenCoin(coin.ticker)}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors"
              style={{ borderBottom: i < filtered.length - 1 ? "1px solid #141414" : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0f0f0f")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#1a1a1a" }}>
                  <span className="text-[10px] font-semibold" style={{ color: "#666" }}>{coin.ticker.slice(0, 2)}</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color: "#e8e8e8" }}>{coin.ticker}</p>
                    {coin.narrative?.[0] && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide"
                        style={{ color: "#555", backgroundColor: "#141414", border: "1px solid #1e1e1e" }}>
                        {coin.narrative[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px]" style={{ color: "#444" }}>{coin.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium tabular-nums" style={{ color: "#e8e8e8" }}>{price}</p>
                <div className="flex items-center gap-2 justify-end">
                  <p className="text-[11px] font-medium tabular-nums"
                    style={{ color: positive ? "#4ade80" : "#f87171" }}>
                    {positive ? "+" : ""}{coin.change_7d.toFixed(1)}% 7D
                  </p>
                  <span className="text-[10px] tabular-nums font-medium"
                    style={{ color: scoreColor(coin.opportunity_score) }}>
                    {coin.opportunity_score}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CoinScanPage;
