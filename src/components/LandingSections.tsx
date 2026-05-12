import { useState, useEffect } from "react";
import { SquarePlay, CircleDollarSign, Handshake, ThumbsUp, ChevronDown } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.9);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "fixed top-0 glass shadow-sm"
          : "absolute top-0 bg-transparent"
      }`}
    >
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
        Post your journey, find investors, sell equity, hire talent and connect with everyone building the next big thing — all in one place.
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

/* ─── Reviews Section ─── */

const reviews = [
  {
    name: "Arjun Mehta",
    handle: "@arjunm",
    avatar: null,
    rating: 5,
    text: "Atmosphere is exactly what the Indian startup ecosystem needed. Found my co-founder within a week of joining. The equity trade feature is a game-changer.",
    likes: 3,
    reply: "Glad to hear it, Arjun! Co-founder matches through Atmosphere are exactly what we're here for. 🙌",
  },
  {
    name: "Priya Nair",
    handle: "@priyanair",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    text: "As an investor I've seen a lot of platforms. This one actually gets it — clean UI, serious founders, real deal flow. Joined the waitlist day one.",
    likes: 2,
    reply: null,
  },
  {
    name: "Rohan Verma",
    handle: "@rohanv",
    avatar: null,
    rating: 4,
    text: "The narrative feed is addictive. I check it every morning like I used to check Twitter. Way more signal, way less noise.",
    likes: 0,
    reply: null,
  },
  {
    name: "Sneha Kulkarni",
    handle: "@snehakulkarni",
    avatar: "https://i.pravatar.cc/150?img=23",
    rating: 5,
    text: "Got discovered by a VC on here before the app even launched publicly. The early access strategy is genius — scarcity creates quality.",
    likes: 1,
    reply: "That's the dream, Sneha — the right people finding you early. Welcome to the ecosystem! 🚀",
  },
  {
    name: "Karan Shah",
    handle: "@karanshah",
    avatar: null,
    rating: 5,
    text: "Finally a platform that treats founders like adults. No vanity metrics, no clout-chasing. Just real connections and real opportunities.",
    likes: 0,
    reply: null,
  },
  {
    name: "Meera Iyer",
    handle: "@meerai",
    avatar: null,
    rating: 4,
    text: "The coin scan feature helped me understand which narratives are actually moving markets. Used it to time my fundraise and it worked.",
    likes: 0,
    reply: null,
  },
  {
    name: "Dev Anand",
    handle: "@devanand",
    avatar: null,
    rating: 5,
    text: "Pitched three investors through Atmosphere in my first month. Two meetings converted. The quality of the network here is real.",
    likes: 2,
    reply: "Two conversions from three pitches — that's incredible. Exactly what Atmosphere is built for.",
  },
  {
    name: "Nisha Patel",
    handle: "@nishap",
    avatar: "https://i.pravatar.cc/150?img=31",
    rating: 5,
    text: "I've been building in stealth for 2 years. Atmosphere gave me a reason to share progress publicly. The community actually gets what you're building.",
    likes: 0,
    reply: null,
  },
  {
    name: "Vikram Bose",
    handle: "@vikrambose",
    avatar: null,
    rating: 4,
    text: "Clean, dark, minimal. Exactly the aesthetic founders want. No bloat, no noise. Just the tools you need.",
    likes: 0,
    reply: null,
  },
  {
    name: "Ananya Rao",
    handle: "@ananyarao",
    avatar: null,
    rating: 5,
    text: "Hired two engineers and a designer all from Atmosphere in the same quarter. The talent pool here is genuinely impressive.",
    likes: 1,
    reply: null,
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`text-xs ${s <= rating ? "text-amber-400" : "text-muted-foreground/20"}`}>★</span>
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
    } else {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  return (
    <div className="gradient-border rounded-2xl p-5 sm:p-6 flex flex-col gap-4 break-inside-avoid mb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.name}
            className="w-9 h-9 rounded-full object-cover border border-border/30"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-secondary/60 border border-border/30 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {review.name.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-light">{review.name}</span>
          <span className="text-muted-foreground/40 text-xs font-light">{review.handle}</span>
        </div>
        <div className="ml-auto">
          <StarRating rating={review.rating} />
        </div>
      </div>

      {/* Body */}
      <p className="text-muted-foreground/70 text-[13px] font-light leading-relaxed">{review.text}</p>

      {/* Reply box — sharp rectangle, pitch black bg, thin border */}
      {review.reply && (
        <div className="border border-border/50 p-3 bg-black">
          <p className="text-[10px] font-semibold text-foreground/50 tracking-widest uppercase mb-1.5">Tricher</p>
          <p className="text-muted-foreground/60 text-[12px] font-light leading-relaxed">{review.reply}</p>
        </div>
      )}

      {/* Was this helpful */}
      <div className="flex items-center gap-2 mt-auto pt-1 border-t border-border/20">
        <span className="text-muted-foreground/30 text-[11px] font-light">Was this helpful?</span>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-[11px] font-light transition-colors ${liked ? "text-foreground" : "text-muted-foreground/30 hover:text-muted-foreground/60"}`}
        >
          <ThumbsUp className="w-3 h-3" />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const col1 = reviews.filter((_, i) => i % 3 === 0);
  const col2 = reviews.filter((_, i) => i % 3 === 1);
  const col3 = reviews.filter((_, i) => i % 3 === 2);

  return (
    <section className="relative py-16 sm:py-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-muted-foreground text-xs tracking-[0.25em] uppercase font-light mb-3">
          From the Community
        </p>
        <h2 className="text-center text-foreground text-2xl sm:text-3xl md:text-4xl font-extralight tracking-tight mb-12 sm:mb-16">
          What early members are saying.
        </h2>

        {/* Desktop: 3-column masonry */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          <div>{col1.map((r) => <ReviewCard key={r.handle} review={r} />)}</div>
          <div>{col2.map((r) => <ReviewCard key={r.handle} review={r} />)}</div>
          <div>{col3.map((r) => <ReviewCard key={r.handle} review={r} />)}</div>
        </div>

        {/* Mobile: single column */}
        <div className="md:hidden flex flex-col gap-4">
          {reviews.map((r) => <ReviewCard key={r.handle} review={r} />)}
        </div>
      </div>
    </section>
  );
};

/* ─── FAQ Section ─── */

const faqs = [
  {
    q: "What is Atmosphere?",
    a: "Atmosphere is a platform for the startup ecosystem — founders, investors, and talent all in one place. Post your startup journey, find investors, trade equity, hire talent, and connect with everyone building the next big thing.",
  },
  {
    q: "How do I get early access?",
    a: 'Click "Create your profile early" at the top of the page to join the waitlist. We\'re rolling out access to a curated group of founders and investors first — the earlier you sign up, the better your position.',
  },
  {
    q: "Is Atmosphere free to use?",
    a: "Yes, the core platform is free. We plan to introduce premium features for power users over time, but early members will always have access to the essentials at no cost.",
  },
  {
    q: "What is the Coin Scan feature?",
    a: "Coin Scan helps you track crypto narratives and understand which themes are moving markets. It's designed for founders and investors who want signal without the noise.",
  },
  {
    q: "Can I invest in startups through Atmosphere?",
    a: "Yes — founders can post equity opportunities and investors can discover and apply directly. We're building the infrastructure to make early-stage deal flow transparent and accessible.",
  },
  {
    q: "How is Atmosphere different from LinkedIn or AngelList?",
    a: "LinkedIn is a resume network. AngelList is a job board with investment features. Atmosphere is built specifically for the real-time startup ecosystem — the story, the deals, the talent, and the community all in one feed.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative py-16 sm:py-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-muted-foreground text-xs tracking-[0.25em] uppercase font-light mb-3">
          FAQ
        </p>
        <h2 className="text-center text-foreground text-2xl sm:text-3xl md:text-4xl font-extralight tracking-tight mb-12 sm:mb-16">
          Common questions.
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left gradient-border rounded-2xl px-5 py-4 transition-all duration-300 focus:outline-none"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground text-sm font-light">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground/50 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 mt-3" : "max-h-0"}`}
                >
                  <p className="text-muted-foreground/60 text-[13px] font-light leading-relaxed">{item.a}</p>
                </div>
              </button>
            );
          })}
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

export { NavBar, HeroSection, FeaturesSection, ReviewsSection, FAQSection, CTASection, Footer };
