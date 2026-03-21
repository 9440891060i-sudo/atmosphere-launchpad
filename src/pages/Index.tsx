import { useState } from "react";
import { NavBar, HeroSection, HowItWorksSection, MoreFeaturesSection, CTASection, Footer } from "@/components/LandingSections";
import ApplicationModal from "@/components/ApplicationModal";
import { useStats } from "@/hooks/use-stats";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { stats, loading, incrementApplicants } = useStats();

  return (
    <div className="min-h-screen bg-background noise-overlay relative">
      <NavBar onApply={() => setModalOpen(true)} />
      <HeroSection onApply={() => setModalOpen(true)} stats={stats} loading={loading} />
      <HowItWorksSection />
      <MoreFeaturesSection />
      <CTASection onApply={() => setModalOpen(true)} />
      <Footer />
      <ApplicationModal open={modalOpen} onOpenChange={setModalOpen} onSubmitted={incrementApplicants} />
    </div>
  );
};

export default Index;
