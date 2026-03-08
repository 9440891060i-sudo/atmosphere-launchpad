import { useState, useEffect } from "react";
import { useStats } from "@/hooks/use-stats";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, ArrowLeft, Rocket, TrendingUp, Lightbulb } from "lucide-react";

const PASSCODE = "1325";

type Tab = "stats" | "submissions";
type RoleFilter = "all" | "founder" | "investor" | "entrepreneur";

interface Application {
  id: string;
  role: string;
  data: Record<string, unknown>;
  created_at: string;
}

const Admin = () => {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const { stats, updateStats } = useStats();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("stats");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (unlocked) {
      fetchApplications();
    }
  }, [unlocked]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setApplications(data as Application[]);
    setLoading(false);
  };

  const handleSave = async () => {
    await updateStats({
      applicants: parseInt(form.applicants) || stats.applicants,
      earlyUsers: parseInt(form.earlyUsers) || stats.earlyUsers,
      countries: parseInt(form.countries) || stats.countries,
    });
  };

  const filteredApps = roleFilter === "all"
    ? applications
    : applications.filter(a => a.role === roleFilter);

  const counts = {
    all: applications.length,
    founder: applications.filter(a => a.role === "founder").length,
    investor: applications.filter(a => a.role === "investor").length,
    entrepreneur: applications.filter(a => a.role === "entrepreneur").length,
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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/30 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-light">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => setTab("stats")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${
                tab === "stats" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Stats
            </button>
            <button
              onClick={() => setTab("submissions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${
                tab === "submissions" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" /> Submissions
              {counts.all > 0 && (
                <span className="bg-foreground/10 text-foreground text-xs px-2 py-0.5 rounded-full">{counts.all}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Stats Tab */}
        {tab === "stats" && (
          <div className="max-w-sm mx-auto space-y-6">
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
              Save Changes
            </button>
          </div>
        )}

        {/* Submissions Tab */}
        {tab === "submissions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extralight text-foreground">Submissions</h2>
              <button onClick={fetchApplications} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light">
                Refresh
              </button>
            </div>

            {/* Role Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {([
                { key: "all" as RoleFilter, label: "All", icon: Users },
                { key: "founder" as RoleFilter, label: "Startups", icon: Rocket },
                { key: "investor" as RoleFilter, label: "Investors", icon: TrendingUp },
                { key: "entrepreneur" as RoleFilter, label: "Entrepreneurs", icon: Lightbulb },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setRoleFilter(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light transition-all border ${
                    roleFilter === key
                      ? "bg-foreground/10 border-foreground/20 text-foreground"
                      : "border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/15"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  <span className="text-xs opacity-60">({counts[key]})</span>
                </button>
              ))}
            </div>

            {/* Submissions List */}
            {loading ? (
              <p className="text-sm text-muted-foreground font-light text-center py-10">Loading…</p>
            ) : filteredApps.length === 0 ? (
              <p className="text-sm text-muted-foreground font-light text-center py-10">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {filteredApps.map((app) => (
                  <SubmissionCard key={app.id} application={app} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const roleLabels: Record<string, { label: string; icon: typeof Rocket }> = {
  founder: { label: "Startup Founder", icon: Rocket },
  investor: { label: "Investor", icon: TrendingUp },
  entrepreneur: { label: "Entrepreneur", icon: Lightbulb },
};

const fieldLabels: Record<string, string> = {
  startupName: "Startup Name",
  description: "Description",
  link: "Link",
  email: "Email",
  mobile: "Mobile",
  stage: "Stage",
  legal: "Legal Entity",
  funding: "Raised Funding",
  postContent: "Will Post Content",
  skillSet: "Skill Set",
  name: "Full Name",
  type: "Investor Type",
};

const SubmissionCard = ({ application }: { application: Application }) => {
  const roleInfo = roleLabels[application.role] || { label: application.role, icon: Users };
  const Icon = roleInfo.icon;
  const data = application.data || {};
  const date = new Date(application.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center">
            <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.3} />
          </div>
          <span className="text-sm font-light text-foreground">{roleInfo.label}</span>
        </div>
        <span className="text-xs text-muted-foreground/50 font-light">{date}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {Object.entries(data).map(([key, value]) => {
          if (!value || (typeof value === "string" && !value.trim())) return null;
          return (
            <div key={key} className="py-1">
              <span className="text-xs text-muted-foreground/60 font-light block">{fieldLabels[key] || key}</span>
              <span className="text-sm text-foreground font-light break-all">{String(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
