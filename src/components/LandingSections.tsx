import { useState, useEffect } from "react";
import { SquarePlay, CircleDollarSign, Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import atmosphereLogo from "@/assets/atmosphere-logo.png";
import appScreenJobs from "@/assets/app-screen-jobs.png";
import appScreenTrade from "@/assets/app-screen-trade.png";
import appScreenFeed from "@/assets/app-screen-feed.png";

const mockups = [appScreenFeed, appScreenTrade, appScreenJobs];

const MockupCarousel = () => {
  return (
    <div className="relative mt-8 sm:mt-10 w-full max-w-md md:max-w-2xl mx-auto opacity-0 animate-fade-up-delay-3 px-4 sm:px-0">
      <div className="flex gap-3 md:gap-5 justify-center">
        {mockups.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Atmosphere app screenshot ${i + 1}`}
            className="w-24 sm:w-28 md:w-44 h-auto rounded-2xl shrink-0 drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          />
        ))}
      </div>
    </div>
  );
};

interface NavBarProps {
  onApply: () => void;
}

const NavBar = ({ onApply }: NavBarProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-14 sm:h-16 flex items-center justify-between">
        <img src={atmosphereLogo} alt="Atmosphere" className="h-8 sm:h-10 w-auto opacity-90" />
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-light hidden sm:block">@{profile?.username}</span>
            <button onClick={() => navigate("/profile")} className="glass-button rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-light text-foreground tracking-wide hover:scale-[1.03] active:scale-[0.98] transition-transform">Profile</button>
            <button onClick={signOut} className="text-xs text-muted-foreground/60 font-light hover:text-foreground transition-colors">Sign out</button>
          </div>
        ) : (
          <button
            onClick={onApply}
            className="glass-button rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-light text-foreground tracking-wide hover:scale-[1.03] active:scale-[0.98] transition-transform">
            Create your profile early
          </button>
        )}
      </div>
    </nav>
  );
};

interface HeroProps {
  onApply: () => void;
  stats: { applicants: number; earlyUsers: number; countries: number } | null;
  loading?: boolean;
}

const HeroSection = ({ onApply, stats, loading }: HeroProps) => {
  return (
    <section className="relative min-h-[90dvh] flex flex-col items-center justify-center px-5 sm:px-6 text-center overflow-hidden pt-20 sm:pt-28">
      {/* Ambient orbs */}
      <div
        className="ambient-orb w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] top-[10%] left-[15%]"
        style={{ background: "hsla(30, 85%, 50%, 0.035)", animationDelay: "0s" }}
      />
      <div
        className="ambient-orb w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bottom-[5%] right-[10%]"
        style={{ background: "hsla(260, 60%, 50%, 0.025)", animation: "orb-float-reverse 25s ease-in-out infinite" }}
      />

      {/* Tagline chip */}
      <div className="mb-6 sm:mb-8 opacity-0 animate-fade-up-delay-1 relative z-10">
        <span className="inline-flex items-center glass rounded-full px-4 py-1.5 text-[11px] sm:text-xs text-muted-foreground font-light tracking-widest uppercase shimmer-line">
          One platform for the startup ecosystem
        </span>
      </div>

      <h1 className="relative z-10 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight text-foreground tracking-tight leading-[1.15] sm:leading-[1.1] max-w-4xl opacity-0 animate-fade-up-delay-1">
        Post. Share. Grow<br className="hidden sm:block" />{" "}
        <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
          Your Startup.
        </span>
      </h1>

      <p className="relative z-10 mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl sm:max-w-2xl opacity-0 animate-fade-up-delay-2">
        Atmosphere is where founders share updates, showcase milestones,
        and build an audience — just like Instagram, but built
        for startups, investors, and entrepreneurs.
      </p>

      {/* Stats */}
      <div className="relative z-10 mt-8 sm:mt-12 flex flex-col items-center gap-6 opacity-0 animate-fade-up-delay-3">
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="text-center">
            <span className="stat-value text-foreground text-2xl sm:text-3xl font-light">
              {loading || !stats ? "—" : stats.applicants.toLocaleString()}
            </span>
            <p className="text-muted-foreground text-[10px] sm:text-xs font-light tracking-wide mt-1">Waitlist signups</p>
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />
          <div className="text-center">
            <span className="stat-value text-foreground text-2xl sm:text-3xl font-light">
              {loading || !stats ? "—" : stats.earlyUsers.toLocaleString()}
            </span>
            <p className="text-muted-foreground text-[10px] sm:text-xs font-light tracking-wide mt-1">Early Profiles</p>
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />
          <div className="text-center">
            <span className="stat-value text-foreground text-2xl sm:text-3xl font-light">
              {loading || !stats ? "—" : stats.countries}
            </span>
            <p className="text-muted-foreground text-[10px] sm:text-xs font-light tracking-wide mt-1">Countries</p>
          </div>
        </div>
      </div>

      {/* App screenshots carousel */}
      <div className="mt-10 sm:mt-14">
        <MockupCarousel />
      </div>
    </section>
  );
};

/* ─── Features Section (unified 4 cards) ─── */

const features = [
  {
    icon: SquarePlay,
    title: "Post & Share",
    description:
      "Share startup updates — launches, milestones, funding rounds. Your feed is your startup's story, reaching investors and talent who matter.",
  },
  {
    icon: CircleDollarSign,
    title: "Invest & Trade",
    description:
      "Buy, sell, or invest in startups directly. Post equity trades, discover deals, and apply to fellowships and grants — all in one place.",
  },
  {
    icon: Handshake,
    title: "Connect & Hire",
    description:
      "Find co-founders, book investor meetings, and hire talent. Pitch your startup without cold emails. Your network grows with every post.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-16 sm:py-24 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-muted-foreground text-xs tracking-[0.25em] uppercase font-light mb-3">
          Everything You Need
        </p>
        <h2 className="text-center text-foreground text-2xl sm:text-3xl md:text-4xl font-extralight tracking-tight mb-12 sm:mb-16">
          One platform for the startup ecosystem.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((item, i) => (
            <div
              key={item.title}
              className="group relative gradient-border rounded-2xl p-7 sm:p-9 flex flex-col transition-all duration-500 hover:translate-y-[-2px]"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-11 h-11 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center mb-5 group-hover:border-muted-foreground/30 group-hover:bg-secondary transition-all duration-300">
                <item.icon
                  className="w-5 h-5 text-muted-foreground/70 group-hover:text-foreground transition-colors duration-300"
                  strokeWidth={1.3}
                />
              </div>
              <h3 className="text-foreground text-sm font-medium tracking-wide mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground/60 text-[13px] font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── CTA Section ─── */

const CTASection = () => {
  return (
    <section className="relative py-20 sm:py-32 px-5 sm:px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsla(30,80%,50%,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent mx-auto mb-12" />
        <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-extralight tracking-tight mb-5">
          Be one of the first on the platform.
        </h2>
        <p className="text-muted-foreground/40 text-sm sm:text-base font-light leading-relaxed mb-10 max-w-md mx-auto">
          We're opening Atmosphere to a small group of founders and investors.
          Start posting your startup's story before everyone else.
        </p>

        <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent mx-auto mt-12" />
      </div>
    </section>
  );
};

/* ─── Footer ─── */

const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 px-5 sm:px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto text-center relative">
        <span className="text-muted-foreground/80 text-sm tracking-[0.25em] uppercase font-light">
          Atmosphere
        </span>
        <p className="mt-3 text-muted-foreground/40 text-xs font-light">
          One platform for the startup ecosystem
        </p>
        <p className="mt-6 text-muted-foreground/25 text-[11px] font-light tracking-wide">
          Early Access Launch · 2026
        </p>
        <a
          href="/admin"
          className="absolute bottom-0 right-0 w-4 h-4 opacity-[0.08] hover:opacity-[0.15] transition-opacity cursor-default"
          aria-hidden="true">
          ·
        </a>
      </div>
    </footer>
  );
};

export { NavBar, HeroSection, FeaturesSection, CTASection, Footer };
