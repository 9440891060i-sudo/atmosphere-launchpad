import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TabBar } from "./NarrativesPage";
import NarrativesPage from "./NarrativesPage";
import CoinScanPage, { CoinDetail } from "./CoinScanPage";
import atmosphereLogo from "@/assets/atmosphere-logo.png";

const AppPage = () => {
  const [activeTab, setActiveTab] = useState<"narratives" | "coin-scan">("narratives");
  const [openCoinId, setOpenCoinId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header with tab bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          <img src={atmosphereLogo} alt="Atmosphere" className="h-6 w-auto opacity-80" />
          <TabBar active={activeTab} onChange={setActiveTab} />
          <div className="w-20" />
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-2xl mx-auto pb-10">
        {activeTab === "narratives" ? (
          <NarrativesPage onTabChange={setActiveTab} onOpenCoin={setOpenCoinId} />
        ) : (
          <CoinScanPage onTabChange={setActiveTab} />
        )}
      </div>

      {/* Cross-tab coin detail sheet (opened from narrative coins) */}
      <Sheet open={!!openCoinId} onOpenChange={(o) => !o && setOpenCoinId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-full md:max-w-xl bg-background border-l border-white/10 p-6 overflow-hidden"
        >
          {openCoinId && (
            <CoinDetail coinId={openCoinId} onOpenCoin={setOpenCoinId} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppPage;
