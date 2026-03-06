import { useState } from "react";
import { useStats } from "@/hooks/use-stats";
import { useNavigate } from "react-router-dom";

const PASSCODE = "1325";

const Admin = () => {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const { stats, updateStats } = useStats();
  const navigate = useNavigate();

  const [form, setForm] = useState({ applicants: "", earlyUsers: "", countries: "" });

  const handleUnlock = () => {
    if (code === PASSCODE) {
      setUnlocked(true);
      setForm({
        applicants: String(stats.applicants),
        earlyUsers: String(stats.earlyUsers),
        countries: String(stats.countries),
      });
    }
  };

  const handleSave = () => {
    const newStats = {
      applicants: parseInt(form.applicants) || stats.applicants,
      earlyUsers: parseInt(form.earlyUsers) || stats.earlyUsers,
      countries: parseInt(form.countries) || stats.countries,
    };
    // Save directly to localStorage before navigating to avoid race conditions
    localStorage.setItem("atmosphere_stats", JSON.stringify(newStats));
    window.dispatchEvent(new Event("atmosphere_stats_updated"));
    navigate("/");
  };

  const inputClass = "glass-input w-full rounded-xl px-4 py-3 text-sm font-light";
  const labelClass = "text-xs text-muted-foreground font-light mb-2 block";

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="w-full max-w-xs space-y-5">
          <h2 className="text-lg font-extralight text-foreground text-center">Enter Passcode</h2>
          <input
            className={inputClass}
            type="password"
            placeholder="••••"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          />
          <button onClick={handleUnlock} className="glass-button rounded-full w-full py-2.5 text-sm font-light text-foreground">
            Unlock
          </button>
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground/40 font-light w-full text-center hover:text-muted-foreground transition-colors">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-xs space-y-5">
        <h2 className="text-lg font-extralight text-foreground text-center">Manage Stats</h2>
        <div>
          <label className={labelClass}>Applicants</label>
          <input className={inputClass} type="number" value={form.applicants} onChange={(e) => setForm(f => ({ ...f, applicants: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Early Users</label>
          <input className={inputClass} type="number" value={form.earlyUsers} onChange={(e) => setForm(f => ({ ...f, earlyUsers: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Countries</label>
          <input className={inputClass} type="number" value={form.countries} onChange={(e) => setForm(f => ({ ...f, countries: e.target.value }))} />
        </div>
        <button onClick={handleSave} className="glass-button rounded-full w-full py-2.5 text-sm font-light text-foreground">
          Save & Go Back
        </button>
      </div>
    </div>
  );
};

export default Admin;
