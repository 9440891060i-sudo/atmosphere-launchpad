import { useState } from "react";
import { NavBar, HeroSection, FeaturesSection, CTASection, Footer } from "@/components/LandingSections";
import AuthModal from "@/components/AuthModal";
import { useStats } from "@/hooks/use-stats";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { stats, loading } = useStats();

  return (
    <div className="min-h-screen bg-background noise-overlay relative">
      <NavBar onApply={() => setModalOpen(true)} />
      <HeroSection onApply={() => setModalOpen(true)} stats={stats} loading={loading} />

      <FeaturesSection />
      <CTASection />
      <Footer />
      <AuthModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Index;
