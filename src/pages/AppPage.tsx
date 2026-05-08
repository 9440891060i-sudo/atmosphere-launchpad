import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { TabBar } from "./NarrativesPage";
import NarrativesPage from "./NarrativesPage";
import CoinScanPage, { CoinDetail } from "./CoinScanPage";
import NarrativeDetail from "./NarrativeDetail";
import { useNarratives, useCoins, useCoinDetail, fmt } from "@/hooks/use-suraj-data";
import type { NarrativeData } from "./NarrativesPage";
import atmosphereLogo from "@/assets/atmosphere-logo.png";

type View =
  | { screen: "main" }
  | { screen: "narrative"; id: string }
  | { screen: "coin"; ticker: string };

const AppPage = () => {
  const [view, setView] = useState<View>({ screen: "main" });
  const [activeTab, setActiveTab] = useState<"narratives" | "coin-scan">("narratives");

  const { narratives, loading: narrativesLoading } = useNarratives();
  const { coins, loading: coinsLoading } = useCoins();

  // Coin ticker for detail view
  const coinTicker = view.screen === "coin" ? view.ticker : null;
  const { coin: coinDetail, loading: coinDetailLoading } = useCoinDetail(coinTicker);

  const goBack = () => setView({ screen: "main" });
  const openNarrative = (id: string) => setView({ screen: "narrative", id });
  const openCoin = (ticker: string) => setView({ screen: "coin", ticker: ticker.toUpperCase() });

  const isDetail = view.screen !== "main";

  // Find selected narrative
  const selectedNarrative: NarrativeData | undefined =
    view.screen === "narrative"
      ? narratives.find((n) => n.id === view.id)
      : undefined;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#090909", color: "#e8e8e8", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#090909", borderColor: "#1a1a1a" }}>
        <div className="flex items-center px-6 h-[52px] gap-4">
          {isDetail ? (
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: "#555" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <div className={isDetail ? "flex-1" : "flex-1 flex justify-center"}>
            {!isDetail && <TabBar active={activeTab} onChange={setActiveTab} />}
          </div>

          {isDetail && (
            <TabBar active={activeTab} onChange={(t) => { setActiveTab(t); goBack(); }} />
          )}
          {!isDetail && <div className="w-20" />}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="w-full">

        {/* Main — Narratives tab */}
        {view.screen === "main" && activeTab === "narratives" && (
          narrativesLoading ? (
            <LoadingState label="Loading narratives..." />
          ) : (
            <NarrativesPage narratives={narratives} onOpenNarrative={openNarrative} onOpenCoin={openCoin} />
          )
        )}

        {/* Main — Coin Scan tab */}
        {view.screen === "main" && activeTab === "coin-scan" && (
          coinsLoading ? (
            <LoadingState label="Loading coins..." />
          ) : (
            <CoinScanPage coins={coins} onOpenCoin={openCoin} />
          )
        )}

        {/* Narrative detail */}
        {view.screen === "narrative" && (
          narrativesLoading || !selectedNarrative ? (
            <LoadingState label="Loading..." />
          ) : (
            <NarrativeDetail narrative={selectedNarrative} onOpenCoin={openCoin} />
          )
        )}

        {/* Coin detail */}
        {view.screen === "coin" && (
          coinDetailLoading || !coinDetail ? (
            <LoadingState label={`Loading ${coinTicker}...`} />
          ) : (
            <CoinDetail coin={coinDetail} onOpenCoin={openCoin} />
          )
        )}
      </div>
    </div>
  );
};

const LoadingState = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center h-64">
    <p className="text-sm" style={{ color: "#333" }}>{label}</p>
  </div>
);

export default AppPage;
