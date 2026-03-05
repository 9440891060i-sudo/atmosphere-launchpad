import { useState } from "react";
import { NavBar, HeroSection, ConceptSection, VisionSection, CTASection, Footer } from "@/components/LandingSections";
import ApplicationModal from "@/components/ApplicationModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <NavBar onApply={() => setModalOpen(true)} />
      <HeroSection onApply={() => setModalOpen(true)} />
      <ConceptSection />
      <VisionSection />
      <CTASection onApply={() => setModalOpen(true)} />
      <Footer />
      <ApplicationModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Index;
