import { useState } from "react";
import { NavBar, HeroSection, ConceptSection, Footer } from "@/components/LandingSections";
import ApplicationModal from "@/components/ApplicationModal";
import { useStats } from "@/hooks/use-stats";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { stats, incrementApplicants } = useStats();

  return (
    <div className="min-h-screen bg-background">
      <NavBar onApply={() => setModalOpen(true)} />
      <HeroSection onApply={() => setModalOpen(true)} stats={stats} />
      <ConceptSection />
      <Footer />
      <ApplicationModal open={modalOpen} onOpenChange={setModalOpen} onSubmitted={incrementApplicants} />
    </div>
  );
};

export default Index;
