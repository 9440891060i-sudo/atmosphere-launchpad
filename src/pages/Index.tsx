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

      {/* Luma Event Embed */}
      <section className="relative py-16 sm:py-24 px-5 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase font-light mb-3">
            Upcoming Event
          </p>
          <div className="flex justify-center">
            <iframe
              src="https://luma.com/embed/event/evt-Y7L6AYewuC5CF0e/simple"
              width="600"
              height="450"
              frameBorder="0"
              style={{ border: "1px solid hsla(215, 30%, 80%, 0.53)", borderRadius: "8px" }}
              allow="fullscreen; payment"
              aria-hidden="false"
              tabIndex={0}
              className="w-full max-w-[600px]"
            />
          </div>
        </div>
      </section>

      <FeaturesSection />
      <CTASection />
      <Footer />
      <AuthModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Index;
