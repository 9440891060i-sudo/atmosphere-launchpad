import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { TabBar } from "./NarrativesPage";
import NarrativesPage from "./NarrativesPage";
import CoinScanPage, { CoinDetail } from "./CoinScanPage";
import NarrativeDetail from "./NarrativeDetail";
import atmosphereLogo from "@/assets/atmosphere-logo.png";

type View =
  | { screen: "main" }
  | { screen: "narrative"; id: string }
  | { screen: "coin"; id: string };

const AppPage = () => {
  const [view, setView] = useState<View>({ screen: "main" });
  const [activeTab, setActiveTab] = useState<"narratives" | "coin-scan">("narratives");

  const goBack = () => setView({ screen: "main" });
  const openNarrative = (id: string) => setView({ screen: "narrative", id });
  const openCoin = (id: string) => setView({ screen: "coin", id });

  const isDetail = view.screen !== "main";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#090909", color: "#e8e8e8", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: "#090909", borderColor: "#1a1a1a" }}
      >
        <div className="flex items-center px-6 h-[52px] gap-4">
          {isDetail ? (
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-[#555] hover:text-[#aaa] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <img src={atmosphereLogo} alt="Atmosphere" className="h-6 w-auto" style={{ opacity: 0.7 }} />
          )}

          {!isDetail && (
            <div className="flex-1 flex justify-center">
              <TabBar active={activeTab} onChange={setActiveTab} />
            </div>
          )}

          {view.screen === "narrative" && (
            <div className="flex-1" />
          )}

          {isDetail && (
            <div className="ml-auto">
              <TabBar
                active={activeTab}
                onChange={(t) => { setActiveTab(t); goBack(); }}
              />
            </div>
          )}
          {!isDetail && <div className="w-20" />}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="w-full">
        {view.screen === "main" && activeTab === "narratives" && (
          <NarrativesPage onOpenNarrative={openNarrative} onOpenCoin={openCoin} />
        )}
        {view.screen === "main" && activeTab === "coin-scan" && (
          <CoinScanPage onOpenCoin={openCoin} />
        )}
        {view.screen === "narrative" && (
          <NarrativeDetail narrativeId={view.id} onOpenCoin={openCoin} />
        )}
        {view.screen === "coin" && (
          <div className="px-6 pt-6 pb-16 max-w-3xl mx-auto">
            <CoinDetail coinId={view.id} onOpenCoin={openCoin} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPage;
