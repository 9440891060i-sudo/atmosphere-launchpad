import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = ["Startup Info", "Stage", "Legal", "Funding", "Revenue", "Contact"];

const INDUSTRIES = ["SaaS", "Fintech", "Health", "AI / ML", "Marketplace", "E-Commerce", "Climate", "Other"];
const STAGES = ["Idea", "Prototype", "MVP", "Early Traction", "Scaling"];
const LEGAL_OPTIONS = ["Yes", "No", "In Progress"];
const FUNDING_OPTIONS = ["No Funding", "Friends & Family", "Angel Round", "Pre-Seed", "Seed", "Series A+"];
const REVENUE_OPTIONS = ["Pre-Revenue", "< $1K / mo", "$1K – $10K / mo", "$10K – $50K / mo", "$50K+ / mo"];

const ApplicationModal = ({ open, onOpenChange }: ApplicationModalProps) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    startupName: "",
    building: "",
    industry: "",
    stage: "",
    legal: "",
    funding: "",
    fundingAmount: "",
    revenue: "",
    founderName: "",
    email: "",
    linkedin: "",
    website: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    console.log("Application submitted:", form);
    setSubmitted(true);
  };

  const reset = () => {
    setStep(0);
    setSubmitted(false);
    setForm({
      startupName: "", building: "", industry: "", stage: "", legal: "",
      funding: "", fundingAmount: "", founderName: "", email: "", linkedin: "", website: "", revenue: "",
    });
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const SelectableOption = ({ value, selected, onClick }: { value: string; selected: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-light transition-all duration-200 ${
        selected
          ? "bg-foreground/10 border border-foreground/20 text-foreground"
          : "glass-input hover:border-foreground/15"
      }`}
    >
      {value}
    </button>
  );

  const renderStep = () => {
    if (submitted) {
      return (
        <div className="text-center py-8 sm:py-12">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full glass flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <Check className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg sm:text-xl font-extralight text-foreground mb-3">Application Received</h3>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
            Thank you for applying. Our team will review your application and reach out soon.
          </p>
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Startup Name</label>
              <input className="glass-input w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-light" placeholder="Your startup name" value={form.startupName} onChange={(e) => update("startupName", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">What are you building?</label>
              <textarea className="glass-input w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-light min-h-[70px] sm:min-h-[80px] resize-none" placeholder="Describe your product in a few sentences" value={form.building} onChange={(e) => update("building", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Industry</label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((ind) => (
                  <SelectableOption key={ind} value={ind} selected={form.industry === ind} onClick={() => update("industry", ind)} />
                ))}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-2.5 sm:space-y-3">
            <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">What stage is your startup?</label>
            {STAGES.map((s) => (
              <SelectableOption key={s} value={s} selected={form.stage === s} onClick={() => update("stage", s)} />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-2.5 sm:space-y-3">
            <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Do you have a legal registered entity?</label>
            {LEGAL_OPTIONS.map((l) => (
              <SelectableOption key={l} value={l} selected={form.legal === l} onClick={() => update("legal", l)} />
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-2.5 sm:space-y-3">
            <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Have you raised funding?</label>
            {FUNDING_OPTIONS.map((f) => (
              <SelectableOption key={f} value={f} selected={form.funding === f} onClick={() => update("funding", f)} />
            ))}
            {form.funding && form.funding !== "No Funding" && (
              <div className="pt-2">
                <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Amount raised</label>
                <input className="glass-input w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-light" placeholder="e.g. $500K" value={form.fundingAmount} onChange={(e) => update("fundingAmount", e.target.value)} />
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-2.5 sm:space-y-3">
            <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Are you generating revenue?</label>
            {REVENUE_OPTIONS.map((r) => (
              <SelectableOption key={r} value={r} selected={form.revenue === r} onClick={() => update("revenue", r)} />
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Founder Name</label>
              <input className="glass-input w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-light" placeholder="Your full name" value={form.founderName} onChange={(e) => update("founderName", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Email Address</label>
              <input className="glass-input w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-light" placeholder="you@startup.com" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">LinkedIn <span className="text-muted-foreground/50">(optional)</span></label>
              <input className="glass-input w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-light" placeholder="linkedin.com/in/..." value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-light mb-1.5 sm:mb-2 block">Website <span className="text-muted-foreground/50">(optional)</span></label>
              <input className="glass-input w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-light" placeholder="https://..." value={form.website} onChange={(e) => update("website", e.target.value)} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass border-foreground/[0.08] bg-background/80 backdrop-blur-2xl w-[calc(100%-2rem)] sm:w-full max-w-lg rounded-2xl p-0 overflow-hidden max-h-[90dvh] flex flex-col">
        <DialogTitle className="sr-only">Apply for Early Access</DialogTitle>
        
        {!submitted && (
          <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-0 flex-shrink-0">
            {/* Step indicators */}
            <div className="flex gap-1.5 mb-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? "bg-foreground/40" : "bg-foreground/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-light">
              Step {step + 1} of 6 — {STEPS[step]}
            </p>
          </div>
        )}

        <div className="px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto flex-1 min-h-0">
          {renderStep()}
        </div>

        {!submitted && (
          <div className="px-5 sm:px-8 pb-5 sm:pb-8 flex items-center justify-between flex-shrink-0">
            <button
              onClick={prev}
              disabled={step === 0}
              className="text-sm text-muted-foreground font-light flex items-center gap-1 disabled:opacity-30 transition-opacity hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < 5 ? (
              <button onClick={next} className="glass-button rounded-full px-5 sm:px-6 py-2.5 text-sm font-light text-foreground flex items-center gap-1">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} className="glass-button rounded-full px-5 sm:px-6 py-2.5 text-sm font-light text-foreground">
                Submit Application
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
