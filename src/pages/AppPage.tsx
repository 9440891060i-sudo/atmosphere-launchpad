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
    <div className="min-h-screen" style={{ backgroundColor: "#090909", color: "#e8e8e8", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#090909", borderColor: "#1a1a1a" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between px-5 h-13" style={{ height: "52px" }}>
          <img src={atmosphereLogo} alt="Atmosphere" className="h-6 w-auto" style={{ opacity: 0.7 }} />
          <TabBar active={activeTab} onChange={setActiveTab} />
          <div className="w-20" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto pb-12">
        {activeTab === "narratives"
          ? <NarrativesPage onOpenCoin={setOpenCoinId} />
          : <CoinScanPage />
        }
      </div>

      {/* Cross-tab coin detail sheet */}
      <Sheet open={!!openCoinId} onOpenChange={(o) => !o && setOpenCoinId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:w-[480px] max-w-full border-l p-0 overflow-hidden"
          style={{ backgroundColor: "#090909", borderColor: "#1a1a1a" }}
        >
          <div className="h-full px-6 pt-10 pb-6">
            {openCoinId && (
              <CoinDetail coinId={openCoinId} onOpenCoin={setOpenCoinId} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AppPage;
