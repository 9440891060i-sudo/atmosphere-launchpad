import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Check, X, ChevronLeft, ChevronRight, Rocket, TrendingUp, Lightbulb } from "lucide-react";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted?: () => void;
}

type UserRole = "founder" | "investor" | "entrepreneur" | null;
type InvestorType = "new" | "experienced" | "banker" | null;

const SelectableOption = ({ value, selected, onClick }: { value: string; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-light transition-all duration-200 ${
      selected ? "bg-foreground/10 border border-foreground/20 text-foreground" : "glass-input hover:border-foreground/15"
    }`}
  >
    {value}
  </button>
);

const RoleCard = ({ icon: Icon, title, subtitle, onSelect }: { icon: typeof Rocket; title: string; subtitle: string; onSelect: () => void }) => (
  <button
    onClick={onSelect}
    className="group glass glass-hover rounded-2xl p-6 sm:p-8 text-left transition-all duration-300 hover:scale-[1.02] flex flex-col gap-3"
  >
    <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center group-hover:border-muted-foreground/40 transition-colors">
      <Icon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.3} />
    </div>
    <h3 className="text-foreground text-sm font-medium tracking-wide">{title}</h3>
    <p className="text-muted-foreground/60 text-xs font-light leading-relaxed">{subtitle}</p>
  </button>
);

const ApplicationModal = ({ open, onOpenChange, onSubmitted }: ApplicationModalProps) => {
  const [role, setRole] = useState<UserRole>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Founder fields
  const [founderForm, setFounderForm] = useState({
    startupName: "", description: "", link: "", email: "", mobile: "",
    stage: "", legal: "", funding: "", postContent: "",
  });

  // Entrepreneur fields
  const [entForm, setEntForm] = useState({ skillSet: "", email: "", mobile: "", postContent: "" });

  // Investor fields
  const [investorType, setInvestorType] = useState<InvestorType>(null);
  const [investorForm, setInvestorForm] = useState({ name: "", email: "", mobile: "", postContent: "" });

  const reset = useCallback(() => {
    setRole(null); setStep(0); setSubmitted(false);
    setFounderForm({ startupName: "", description: "", link: "", email: "", mobile: "", stage: "", legal: "", funding: "", postContent: "" });
    setEntForm({ skillSet: "", email: "", mobile: "", postContent: "" });
    setInvestorType(null);
    setInvestorForm({ name: "", email: "", mobile: "", postContent: "" });
  }, []);

  const handleClose = () => {
    if (submitted || (role === null && step === 0)) {
      reset(); onOpenChange(false);
    } else {
      setShowExitConfirm(true);
    }
  };

  const confirmExit = () => { setShowExitConfirm(false); reset(); onOpenChange(false); };
  const cancelExit = () => setShowExitConfirm(false);

  const totalSteps = role === "founder" ? 8 : role === "investor" ? 3 : role === "entrepreneur" ? 2 : 1;
  const progress = ((step + 1) / totalSteps) * 100;

  const submit = async () => {
    let formData: Record<string, string | null> = {};
    if (role === "founder") formData = { ...founderForm };
    else if (role === "entrepreneur") formData = { ...entForm };
    else if (role === "investor") formData = { type: investorType, ...investorForm };

    const { error } = await supabase.from("applications").insert([{ role: role!, data: formData as unknown as import("@/integrations/supabase/types").Json }]);
    if (error) console.error("Failed to save application:", error);

    setSubmitted(true);
    onSubmitted?.();
  };

  const stepLabelClass = "text-xs text-muted-foreground font-light mb-2 block";
  const glassInputClass = "glass-input w-full rounded-xl px-4 py-3 text-sm font-light";

  const renderConfirmation = () => {
    const messages: Record<string, string> = {
      founder: "Thank you for applying. Our team will review your startup and reach out soon.",
      entrepreneur: "If your answers are interesting, you will be contacted to be a part of the first 1000 users…",
      investor: "Your investor application has been received. We'll be in touch shortly.",
    };
    return (
      <div className="text-center py-10 sm:py-14">
        <div className="w-14 h-14 rounded-full glass flex items-center justify-center mx-auto mb-6">
          <Check className="w-6 h-6 text-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-extralight text-foreground mb-3">Application Received</h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
          {messages[role || "founder"]}
        </p>
      </div>
    );
  };

  const renderStep = () => {
    if (submitted) return renderConfirmation();

    // Step 0: Role selection
    if (step === 0) {
      return (
        <div className="space-y-3">
          <h2 className="text-lg font-extralight text-foreground mb-1">How would you describe yourself?</h2>
          <p className="text-xs text-muted-foreground font-light mb-5">Select the option that best fits you.</p>
          <RoleCard icon={Rocket} title="Startup Founder" subtitle="You're building a startup and looking for visibility, funding, or talent." onSelect={() => { setRole("founder"); setStep(1); }} />
          <RoleCard icon={TrendingUp} title="Investor" subtitle="You're looking to discover and invest in high-potential startups." onSelect={() => { setRole("investor"); setStep(1); }} />
          <RoleCard icon={Lightbulb} title="Entrepreneur" subtitle="You have skills to offer and want to join the startup ecosystem." onSelect={() => { setRole("entrepreneur"); setStep(1); }} />
        </div>
      );
    }

    // === ENTREPRENEUR FLOW ===
    if (role === "entrepreneur") {
      if (step === 1) return (
        <div className="space-y-5">
          <h2 className="text-lg font-extralight text-foreground">Tell us about your skills</h2>
          <div>
            <label className={stepLabelClass}>Skill Set</label>
            <input className={glassInputClass} placeholder="e.g. Development, Marketing, Design…" value={entForm.skillSet} onChange={(e) => setEntForm(f => ({ ...f, skillSet: e.target.value }))} />
          </div>
          <div>
            <label className={stepLabelClass}>Email Address</label>
            <input className={glassInputClass} placeholder="you@email.com" type="email" value={entForm.email} onChange={(e) => setEntForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className={stepLabelClass}>Mobile Number</label>
            <input className={glassInputClass} placeholder="+1 (555) 000-0000" type="tel" value={entForm.mobile} onChange={(e) => setEntForm(f => ({ ...f, mobile: e.target.value }))} />
          </div>
          <p className="text-[11px] text-muted-foreground/50 font-light">Fill at least one — email or mobile.</p>
        </div>
      );
    }

    // === INVESTOR FLOW ===
    if (role === "investor") {
      if (step === 1) return (
        <div className="space-y-3">
          <h2 className="text-lg font-extralight text-foreground mb-4">What type of investor are you?</h2>
          {([["new", "New Investor", "Just getting started in startup investing."], ["experienced", "Have Invested Before", "You've made investments in startups previously."], ["banker", "Investment Banker", "You work in institutional investment or banking."]] as const).map(([val, title, sub]) => (
            <button key={val} onClick={() => setInvestorType(val as InvestorType)}
              className={`w-full text-left rounded-xl p-5 transition-all duration-200 ${investorType === val ? "bg-foreground/10 border border-foreground/20" : "glass-input hover:border-foreground/15"}`}>
              <p className="text-sm font-light text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground/60 font-light mt-1">{sub}</p>
            </button>
          ))}
        </div>
      );
      if (step === 2) return (
        <div className="space-y-5">
          <h2 className="text-lg font-extralight text-foreground">Contact Details</h2>
          <div><label className={stepLabelClass}>Full Name</label><input className={glassInputClass} placeholder="Your name" value={investorForm.name} onChange={(e) => setInvestorForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className={stepLabelClass}>Email Address</label><input className={glassInputClass} placeholder="you@email.com" type="email" value={investorForm.email} onChange={(e) => setInvestorForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div><label className={stepLabelClass}>Mobile Number</label><input className={glassInputClass} placeholder="+1 (555) 000-0000" type="tel" value={investorForm.mobile} onChange={(e) => setInvestorForm(f => ({ ...f, mobile: e.target.value }))} /></div>
          <p className="text-[11px] text-muted-foreground/50 font-light">Fill at least one — email or mobile.</p>
        </div>
      );
    }

    // === FOUNDER FLOW ===
    if (role === "founder") {
      const updateFounder = (key: string, value: string) => setFounderForm(f => ({ ...f, [key]: value }));
      switch (step) {
        case 1: return (
          <div className="space-y-5">
            <h2 className="text-lg font-extralight text-foreground">Tell us about your startup</h2>
            <div><label className={stepLabelClass}>Startup Name</label><input className={glassInputClass} placeholder="Your startup name" value={founderForm.startupName} onChange={(e) => updateFounder("startupName", e.target.value)} /></div>
            <div><label className={stepLabelClass}>Short Description</label><textarea className="glass-input w-full rounded-xl px-4 py-3 text-sm font-light min-h-[80px] resize-none" placeholder="What does your startup do?" value={founderForm.description} onChange={(e) => updateFounder("description", e.target.value)} /></div>
          </div>
        );
        case 2: return (
          <div className="space-y-5">
            <h2 className="text-lg font-extralight text-foreground">Share a link</h2>
            <p className="text-xs text-muted-foreground font-light">Instagram, LinkedIn, YouTube, website — any relevant link.</p>
            <div><label className={stepLabelClass}>Link</label><input className={glassInputClass} placeholder="https://..." value={founderForm.link} onChange={(e) => updateFounder("link", e.target.value)} /></div>
          </div>
        );
        case 3: return (
          <div className="space-y-5">
            <h2 className="text-lg font-extralight text-foreground">Contact Details</h2>
            <div><label className={stepLabelClass}>Email Address</label><input className={glassInputClass} placeholder="you@startup.com" type="email" value={founderForm.email} onChange={(e) => updateFounder("email", e.target.value)} /></div>
            <div><label className={stepLabelClass}>Mobile Number</label><input className={glassInputClass} placeholder="+1 (555) 000-0000" type="tel" value={founderForm.mobile} onChange={(e) => updateFounder("mobile", e.target.value)} /></div>
            <p className="text-[11px] text-muted-foreground/50 font-light">Fill at least one — email or mobile.</p>
          </div>
        );
        case 4: return (
          <div className="space-y-3">
            <h2 className="text-lg font-extralight text-foreground mb-4">What stage is your startup?</h2>
            {["Idea", "Prototype", "MVP", "Early Traction", "Scaling"].map(s => (
              <SelectableOption key={s} value={s} selected={founderForm.stage === s} onClick={() => updateFounder("stage", s)} />
            ))}
          </div>
        );
        case 5: return (
          <div className="space-y-3">
            <h2 className="text-lg font-extralight text-foreground mb-4">Does your startup have a registered legal entity?</h2>
            {["Yes", "No"].map(v => <SelectableOption key={v} value={v} selected={founderForm.legal === v} onClick={() => updateFounder("legal", v)} />)}
          </div>
        );
        case 6: return (
          <div className="space-y-3">
            <h2 className="text-lg font-extralight text-foreground mb-4">Has your startup raised funding?</h2>
            {["Yes", "No"].map(v => <SelectableOption key={v} value={v} selected={founderForm.funding === v} onClick={() => updateFounder("funding", v)} />)}
          </div>
        );
        case 7: return (
          <div className="space-y-3">
            <h2 className="text-lg font-extralight text-foreground mb-4">Would you post content about your startup on Atmosphere?</h2>
            {["Yes", "No"].map(v => <SelectableOption key={v} value={v} selected={founderForm.postContent === v} onClick={() => updateFounder("postContent", v)} />)}
          </div>
        );
      }
    }
    return null;
  };

  const isLastStep = (role === "entrepreneur" && step === 1) || (role === "investor" && step === 2) || (role === "founder" && step === 7);
  const canGoNext = () => {
    if (role === "entrepreneur" && step === 1) return !!(entForm.skillSet.trim() && (entForm.email.trim() || entForm.mobile.trim()));
    if (role === "investor" && step === 1) return !!investorType;
    if (role === "investor" && step === 2) return !!(investorForm.name.trim() && (investorForm.email.trim() || investorForm.mobile.trim()));
    if (role === "founder") {
      switch (step) {
        case 1: return !!(founderForm.startupName.trim() && founderForm.description.trim());
        case 2: return !!founderForm.link.trim();
        case 3: return !!(founderForm.email.trim() || founderForm.mobile.trim());
        case 4: return !!founderForm.stage;
        case 5: return !!founderForm.legal;
        case 6: return !!founderForm.funding;
        case 7: return !!founderForm.postContent;
      }
    }
    return true;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => handleClose()}>
        <DialogContent
          className="glass border-foreground/[0.08] bg-background/90 backdrop-blur-2xl w-[calc(100%-2rem)] sm:w-full max-w-lg rounded-2xl p-0 overflow-hidden max-h-[90dvh] flex flex-col"
          onPointerDownOutside={(e) => { e.preventDefault(); handleClose(); }}
          onEscapeKeyDown={(e) => { e.preventDefault(); handleClose(); }}
        >
          <DialogTitle className="sr-only">Apply for Early Access</DialogTitle>

          {/* Progress bar */}
          {!submitted && step > 0 && (
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-0 flex-shrink-0">
              <div className="flex gap-1.5 mb-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-foreground/40" : "bg-foreground/10"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-light">Step {step} of {totalSteps - 1}</p>
            </div>
          )}

          <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 min-h-0">
            {renderStep()}
          </div>

          {/* Navigation */}
          {!submitted && step > 0 && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between flex-shrink-0">
              <button onClick={() => { if (step === 1) { setRole(null); setStep(0); } else setStep(s => s - 1); }}
                className="text-sm text-muted-foreground font-light flex items-center gap-1 hover:text-foreground transition-opacity">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {isLastStep ? (
                <button onClick={submit} disabled={!canGoNext()} className="glass-button rounded-full px-6 py-2.5 text-sm font-light text-foreground disabled:opacity-30">
                  Submit Application
                </button>
              ) : (
                <button onClick={() => setStep(s => s + 1)} disabled={!canGoNext()} className="glass-button rounded-full px-6 py-2.5 text-sm font-light text-foreground flex items-center gap-1 disabled:opacity-30">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exit confirmation */}
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="glass border-foreground/[0.08] bg-background/95 backdrop-blur-2xl rounded-2xl max-w-sm">
          <AlertDialogTitle className="text-foreground font-extralight text-lg">Are you sure you don't want to submit your application?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm font-light">Your progress will be lost if you exit now.</AlertDialogDescription>
          <div className="flex gap-3 mt-4">
            <AlertDialogCancel onClick={cancelExit} className="flex-1 glass-button rounded-full py-2.5 text-sm font-light text-foreground border-0">
              No, Continue Application
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="flex-1 rounded-full py-2.5 text-sm font-light bg-foreground/10 text-foreground hover:bg-foreground/20 border border-foreground/10">
              Yes, Exit
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApplicationModal;
