import { ArrowLeftRight, User, MessageSquare, Award, UsersRound } from "lucide-react";

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
    title: "Buy & Sell Startups",
    description: "Post a trade for your equity and find interested investors — the eBay of startups.",
  },
  {
    icon: User,
    title: "One Startup Profile",
    description: "Showcase everything about your company to investors in a single, comprehensive profile.",
  },
  {
    icon: MessageSquare,
    title: "Short-Form Updates",
    description: "Post content as updates to be seen by founders, investors, and entrepreneurs.",
  },
  {
    icon: Award,
    title: "Fellowships & Grants",
    description: "Apply to all fellowships, grants, and government funding from one platform.",
  },
  {
    icon: UsersRound,
    title: "Network & Connect",
    description: "Host or join pitch meetings, create groups, find your co-founder, and hire your team.",
  },
];

const HeroSection = ({ onApply }: { onApply: () => void }) => {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 sm:px-6 text-center overflow-hidden pt-14">
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

const ConceptSection = () => {
  return (
    <section className="py-20 sm:py-32 md:py-40 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {concepts.map((concept) => (
          <div
            key={concept.title}
            className="glass glass-hover glow-subtle rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <concept.icon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground mb-4 sm:mb-5" strokeWidth={1.5} />
            <h3 className="text-foreground text-base sm:text-lg font-light mb-2 sm:mb-3">{concept.title}</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed flex-1">
              {concept.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const VisionSection = () => {
  return (
    <section className="py-20 sm:py-32 md:py-40 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extralight text-foreground tracking-tight leading-tight">
          Built for the Startup Ecosystem
        </h2>
        <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed">
          Today's startup landscape is fragmented across social media, email threads,
          and private networks. Atmosphere brings startup opportunities into one unified
          environment — where founders showcase their companies, investors discover deals,
          and talent finds its next mission.
        </p>
      </div>
    </section>
  );
};

const CTASection = ({ onApply }: { onApply: () => void }) => {
  return (
    <section className="py-20 sm:py-32 md:py-40 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass glow-subtle rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center">
          <p className="text-foreground text-lg sm:text-xl md:text-2xl font-extralight leading-relaxed">
            We are opening Atmosphere to a small group of early founders.
          </p>
          <button
            onClick={onApply}
            className="mt-8 sm:mt-10 glass-button rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-light text-foreground tracking-wide"
          >
            Apply Now
          </button>
        </div>
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
          The Marketplace for Startup Opportunities
        </p>
        <p className="mt-6 text-muted-foreground/40 text-xs font-light">
          Early Access Launch · 2026
        </p>
      </div>
    </footer>
  );
};

export { NavBar, HeroSection, ConceptSection, VisionSection, CTASection, Footer };
