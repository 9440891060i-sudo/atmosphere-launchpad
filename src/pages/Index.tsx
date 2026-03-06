import { useState } from "react";
import { NavBar, HeroSection, ConceptSection, Footer } from "@/components/LandingSections";
import ApplicationModal from "@/components/ApplicationModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <NavBar onApply={() => setModalOpen(true)} />
      <HeroSection onApply={() => setModalOpen(true)} />
      <ConceptSection />
      <Footer />
      <ApplicationModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Index;
