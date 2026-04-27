import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Rocket, TrendingUp, Lightbulb, ChevronLeft, ChevronRight, Eye, EyeOff, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "signup";
}

type UserRole = "startup" | "investor" | "entrepreneur" | null;

const RoleCard = ({ icon: Icon, title, subtitle, onSelect }: { icon: typeof Rocket; title: string; subtitle: string; onSelect: () => void }) => (
  <button
    onClick={onSelect}
    className="group glass glass-hover rounded-2xl p-6 sm:p-8 text-left transition-all duration-300 hover:scale-[1.02] flex flex-col gap-3 w-full"
  >
    <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center group-hover:border-muted-foreground/40 transition-colors">
      <Icon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.3} />
    </div>
    <h3 className="text-foreground text-sm font-medium tracking-wide">{title}</h3>
    <p className="text-muted-foreground/60 text-xs font-light leading-relaxed">{subtitle}</p>
  </button>
);

const AuthModal = ({ open, onOpenChange, defaultMode = "signup" }: AuthModalProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setStep(0); setRole(null); setEmail(""); setUsername(""); setPassword("");
    setOtp(""); setError(""); setLoading(false); setSuccess(false); setMode(defaultMode);
  }, [defaultMode]);

  const handleClose = () => { reset(); onOpenChange(false); };

  // Login submit
  const handleLogin = async () => {
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    handleClose();
    navigate("/profile");
  };

  // Signup: create account directly (auto-confirm enabled)
  const handleSignup = async () => {
    setError(""); setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data.user) {
      await (supabase as any).from("profiles").insert([{ id: data.user.id, username, role }]);
      setSuccess(true);
      setTimeout(() => { handleClose(); navigate("/profile"); }, 800);
    }
  };

  const glassInput = "glass-input w-full rounded-xl px-4 py-3 text-sm font-light";
  const labelClass = "text-xs text-muted-foreground font-light mb-2 block";

  const signupSteps = 3; // role(0) + details(1) + otp(2)
  const progress = mode === "signup" && step > 0 ? ((step) / (signupSteps - 1)) * 100 : 0;

  const renderContent = () => {
    if (success) return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full glass flex items-center justify-center mx-auto mb-5">
          <Check className="w-6 h-6 text-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-extralight text-foreground">Welcome to Atmosphere</h3>
      </div>
    );

    if (mode === "login") return (
      <div className="space-y-5">
        <h2 className="text-lg font-extralight text-foreground mb-1">Welcome back</h2>
        <div>
          <label className={labelClass}>Email</label>
          <input className={glassInput} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input className={glassInput + " pr-10"} type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-400/70">{error}</p>}
        <button onClick={handleLogin} disabled={loading || !email || !password} className="glass-button w-full rounded-full py-3 text-sm font-light text-foreground disabled:opacity-30">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-xs text-muted-foreground/50 font-light">
          Don't have an account?{" "}
          <button onClick={() => { setMode("signup"); setStep(0); setError(""); }} className="text-muted-foreground hover:text-foreground transition-colors">Sign up</button>
        </p>
      </div>
    );

    // Signup steps
    if (step === 0) return (
      <div className="space-y-3">
        <h2 className="text-lg font-extralight text-foreground mb-1">How would you describe yourself?</h2>
        <p className="text-xs text-muted-foreground font-light mb-4">Select the option that best fits you.</p>
        <RoleCard icon={Rocket} title="Startup Founder" subtitle="Building a startup and looking for visibility, funding, or talent." onSelect={() => { setRole("startup"); setStep(1); }} />
        <RoleCard icon={TrendingUp} title="Investor" subtitle="Looking to discover and invest in high-potential startups." onSelect={() => { setRole("investor"); setStep(1); }} />
        <RoleCard icon={Lightbulb} title="Entrepreneur" subtitle="Have skills to offer and want to join the startup ecosystem." onSelect={() => { setRole("entrepreneur"); setStep(1); }} />
        <p className="text-center text-xs text-muted-foreground/50 font-light pt-2">
          Already have an account?{" "}
          <button onClick={() => { setMode("login"); setError(""); }} className="text-muted-foreground hover:text-foreground transition-colors">Sign in</button>
        </p>
      </div>
    );

    if (step === 1) return (
      <div className="space-y-5">
        <h2 className="text-lg font-extralight text-foreground mb-1">Create your account</h2>
        <div>
          <label className={labelClass}>Email</label>
          <input className={glassInput} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Username</label>
          <input className={glassInput} placeholder="yourhandle" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input className={glassInput + " pr-10"} type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-400/70">{error}</p>}
      </div>
    );

  };

  const canContinue = () => {
    if (mode === "signup" && step === 1) return !!(email.trim() && username.trim() && password.length >= 6);
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent
        className="glass border-foreground/[0.08] bg-background/90 backdrop-blur-2xl w-[calc(100%-2rem)] sm:w-full max-w-lg rounded-2xl p-0 overflow-hidden max-h-[90dvh] flex flex-col"
        onPointerDownOutside={e => { e.preventDefault(); handleClose(); }}
        onEscapeKeyDown={e => { e.preventDefault(); handleClose(); }}
      >
        <DialogTitle className="sr-only">Login to Early Access</DialogTitle>

        {/* Progress bar for signup steps 1+ */}
        {mode === "signup" && step > 0 && !success && (
          <div className="px-6 sm:px-8 pt-6 pb-0 flex-shrink-0">
            <div className="flex gap-1.5 mb-2">
              {[1, 2].map(i => (
                <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-foreground/40" : "bg-foreground/10"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-light">Step {step} of 2</p>
          </div>
        )}

        <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 min-h-0">
          {renderContent()}
        </div>

        {/* Navigation for signup steps */}
        {mode === "signup" && step > 0 && !success && (
          <div className="px-6 sm:px-8 pb-6 flex items-center justify-between flex-shrink-0">
            <button onClick={() => { setError(""); setStep(s => s - 1); }} className="text-sm text-muted-foreground font-light flex items-center gap-1 hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step === 1 ? (
              <button onClick={handleSignup} disabled={!canContinue() || loading} className="glass-button rounded-full px-6 py-2.5 text-sm font-light text-foreground flex items-center gap-1 disabled:opacity-30">
                {loading ? "Creating account…" : "Create account"} {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
