import { ArrowLeftRight, Megaphone, UsersRound } from "lucide-react";
import iphoneMockup from "@/assets/iphone-mockup.png";
import appScreen from "@/assets/app-screen.png";

interface NavBarProps {
  onApply: () => void;
}

const NavBar = ({ onApply }: NavBarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-14 sm:h-16 flex items-center justify-between">
        <span className="text-foreground text-base sm:text-lg font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase">
          Atmosphere
        </span>
        <button
          onClick={onApply}
          className="glass-button rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-light text-foreground tracking-wide"
        >
          Apply for Early Access
        </button>
      </div>
    </nav>
  );
};

const concepts = [
  { icon: ArrowLeftRight, title: "Trade & Invest" },
  { icon: Megaphone, title: "Showcase & Update" },
  { icon: UsersRound, title: "Connect & Build" },
];

const HeroSection = ({ onApply }: { onApply: () => void }) => {
  return (
    <section className="relative min-h-[90dvh] flex flex-col items-center justify-center px-5 sm:px-6 text-center overflow-hidden pt-24 sm:pt-28">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(0,0%,100%,0.03) 0%, transparent 70%)" }}
      />

      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight text-foreground tracking-tight leading-[1.15] sm:leading-[1.1] max-w-4xl opacity-0 animate-fade-up-delay-1">
        One Platform for the<br />Startup Ecosystem
      </h1>

      <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl sm:max-w-2xl opacity-0 animate-fade-up-delay-2">
        A unified platform where founders, investors, and entrepreneurs
        discover opportunities in one structured platform —
        replacing fragmented networks with clarity.
      </p>

      {/* Stats + CTA */}
      <div className="mt-8 sm:mt-12 flex flex-col items-center gap-6 opacity-0 animate-fade-up-delay-3">
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="text-center">
            <span className="text-foreground text-2xl sm:text-3xl font-light">2,400+</span>
            <p className="text-muted-foreground text-[10px] sm:text-xs font-light tracking-wide mt-1">Applicants</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center">
            <span className="text-foreground text-2xl sm:text-3xl font-light">580</span>
            <p className="text-muted-foreground text-[10px] sm:text-xs font-light tracking-wide mt-1">Early Users</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center">
            <span className="text-foreground text-2xl sm:text-3xl font-light">12</span>
            <p className="text-muted-foreground text-[10px] sm:text-xs font-light tracking-wide mt-1">Countries</p>
          </div>
        </div>

        <button
          onClick={onApply}
          className="group relative glass-button rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-light text-foreground tracking-wide overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.15)]"
        >
          <span className="relative z-10">Apply for Early Access</span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Phone mockup directly below */}
      <div className="mt-8 sm:mt-10 w-[320px] sm:w-[400px] md:w-[460px] lg:w-[500px] mx-auto opacity-0 animate-fade-up-delay-3">
        <img
          src={appScreen}
          alt="Atmosphere app login screen"
          className="w-full h-auto drop-shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        />
      </div>
    </section>
  );
};

const ConceptSection = () => {
  return (
    <section className="py-12 sm:py-16 px-5 sm:px-6">
      <div className="max-w-md mx-auto flex items-center justify-center gap-8 sm:gap-12">
        {concepts.map((concept) => (
          <div key={concept.title} className="flex flex-col items-center gap-2.5 text-center">
            <div className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center">
              <concept.icon className="w-4 h-4 text-muted-foreground/60" strokeWidth={1.3} />
            </div>
            <span className="text-muted-foreground text-xs font-light tracking-wide">{concept.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 px-5 sm:px-6 border-t border-border/50">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-muted-foreground text-sm tracking-[0.2em] uppercase font-light">
          Atmosphere
        </span>
        <p className="mt-3 text-muted-foreground/60 text-xs font-light">
          One Platform for the Startup Ecosystem
        </p>
        <p className="mt-6 text-muted-foreground/40 text-xs font-light">
          Early Access Launch · 2026
        </p>
      </div>
    </footer>
  );
};

export { NavBar, HeroSection, ConceptSection, Footer };
