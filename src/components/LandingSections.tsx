import { Search, TrendingUp, Users } from "lucide-react";

interface NavBarProps {
  onApply: () => void;
}

const NavBar = ({ onApply }: NavBarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <span className="text-foreground text-lg font-light tracking-[0.2em] uppercase">
          Atmosphere
        </span>
        <button
          onClick={onApply}
          className="glass-button rounded-full px-5 py-2 text-sm font-light text-foreground tracking-wide"
        >
          Apply for Early Access
        </button>
      </div>
    </nav>
  );
};

const HeroSection = ({ onApply }: { onApply: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(0,0%,100%,0.03) 0%, transparent 70%)" }}
      />

      <div className="opacity-0 animate-fade-up">
        <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase font-light">
          Atmosphere
        </span>
      </div>

      <h1 className="mt-8 text-4xl md:text-6xl lg:text-7xl font-extralight text-foreground tracking-tight leading-[1.1] max-w-4xl opacity-0 animate-fade-up-delay-1">
        The Marketplace for<br />Startup Opportunities
      </h1>

      <p className="mt-8 text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl opacity-0 animate-fade-up-delay-2">
        A unified platform where founders, investors, and early employees
        discover startup opportunities in one structured marketplace —
        replacing fragmented networks with clarity.
      </p>

      <button
        onClick={onApply}
        className="mt-12 glass-button rounded-full px-8 py-3.5 text-sm font-light text-foreground tracking-wide opacity-0 animate-fade-up-delay-3"
      >
        Apply for Early Access
      </button>
    </section>
  );
};

const concepts = [
  {
    icon: Search,
    title: "Discover Startups",
    description: "Browse curated startup profiles across industries and stages.",
  },
  {
    icon: TrendingUp,
    title: "Investment Opportunities",
    description: "Connect with vetted deals from early-stage to growth.",
  },
  {
    icon: Users,
    title: "Startup Talent",
    description: "Find early-stage roles at companies shaping the future.",
  },
];

const ConceptSection = () => {
  return (
    <section className="py-32 md:py-40 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {concepts.map((concept, i) => (
          <div
            key={concept.title}
            className="glass glass-hover glow-subtle rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1"
          >
            <concept.icon className="w-6 h-6 text-muted-foreground mb-6" strokeWidth={1.5} />
            <h3 className="text-foreground text-lg font-light mb-3">{concept.title}</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
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
    <section className="py-32 md:py-40 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extralight text-foreground tracking-tight leading-tight">
          Built for the Startup Ecosystem
        </h2>
        <p className="mt-8 text-base md:text-lg text-muted-foreground font-light leading-relaxed">
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
    <section className="py-32 md:py-40 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass glow-subtle rounded-3xl p-12 md:p-16 text-center">
          <p className="text-foreground text-xl md:text-2xl font-extralight leading-relaxed">
            We are opening Atmosphere to a small group of early founders.
          </p>
          <button
            onClick={onApply}
            className="mt-10 glass-button rounded-full px-10 py-4 text-sm font-light text-foreground tracking-wide"
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
    <footer className="py-16 px-6 border-t border-border/50">
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
