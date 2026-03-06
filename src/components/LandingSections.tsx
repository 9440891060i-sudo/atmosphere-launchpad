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
  {
    icon: ArrowLeftRight,
    title: "Trade & Invest",
    description: "Buy, sell, or invest in startups. Post equity trades, discover deals, and apply to fellowships and grants — all from one place.",
  },
  {
    icon: Megaphone,
    title: "Showcase & Update",
    description: "Build a single startup profile for investors and post short-form updates that reach founders, investors, and entrepreneurs.",
  },
  {
    icon: UsersRound,
    title: "Connect & Build",
    description: "Host pitch meetings, join networking events, find your co-founder, hire your team, and message investors directly.",
  },
];

const HeroSection = ({ onApply }: { onApply: () => void }) => {
  return (
    <section className="relative min-h-[85dvh] flex flex-col items-center justify-center px-5 sm:px-6 text-center overflow-hidden pt-14">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(0,0%,100%,0.03) 0%, transparent 70%)" }}
      />

      <div className="opacity-0 animate-fade-up">
        <span className="text-muted-foreground text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase font-light">
          Atmosphere
        </span>
      </div>

      <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight text-foreground tracking-tight leading-[1.15] sm:leading-[1.1] max-w-4xl opacity-0 animate-fade-up-delay-1">
        One Platform for the<br />Startup Ecosystem
      </h1>

      <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl sm:max-w-2xl opacity-0 animate-fade-up-delay-2">
        A unified platform where founders, investors, and entrepreneurs
        discover opportunities in one structured platform —
        replacing fragmented networks with clarity.
      </p>

      <button
        onClick={onApply}
        className="mt-8 sm:mt-12 glass-button rounded-full px-7 sm:px-8 py-3 sm:py-3.5 text-sm font-light text-foreground tracking-wide opacity-0 animate-fade-up-delay-3"
      >
        Apply for Early Access
      </button>
    </section>
  );
};

const PhoneMockupSection = () => {
  return (
    <section className="py-12 sm:py-20 flex flex-col items-center px-5">
      <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.2em] uppercase font-light mb-8 sm:mb-12 opacity-0 animate-fade-in">
        Coming Soon
      </p>
      <div className="relative w-[260px] sm:w-[300px] md:w-[340px] mx-auto">
        {/* App screen clipped inside the phone */}
        <img
          src={appScreen}
          alt="Atmosphere app login screen"
          className="absolute top-[2.8%] left-[5.5%] w-[89%] h-[94.5%] object-cover rounded-[2rem] sm:rounded-[2.4rem]"
        />
        {/* Phone frame on top */}
        <img
          src={iphoneMockup}
          alt="iPhone mockup"
          className="relative z-10 w-full h-auto drop-shadow-2xl"
        />
      </div>
    </section>
  );
};

const ConceptSection = () => {
  return (
    <section className="py-10 sm:py-16 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {concepts.map((concept) => (
          <div
            key={concept.title}
            className="group relative rounded-2xl border border-border/60 bg-muted/5 p-6 sm:p-7 transition-all duration-300 hover:border-border hover:bg-muted/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-muted/20 flex items-center justify-center">
                <concept.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground text-sm sm:text-base font-medium tracking-wide">{concept.title}</h3>
            </div>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              {concept.description}
            </p>
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

export { NavBar, HeroSection, PhoneMockupSection, ConceptSection, Footer };
