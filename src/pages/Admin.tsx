import { useState, useEffect, useRef } from "react";
import { useStats } from "@/hooks/use-stats";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, ArrowLeft, Rocket, TrendingUp, Lightbulb, Trash2, Printer, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

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
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({ applicants: "", earlyUsers: "", countries: "" });
  const printRef = useRef<HTMLDivElement>(null);

  const handleUnlock = () => {
    if (code === PASSCODE) {
      setUnlocked(true);
      setForm({
        applicants: String(stats?.applicants ?? 0),
        earlyUsers: String(stats?.earlyUsers ?? 0),
        countries: String(stats?.countries ?? 0),
      });
    }
  };

  useEffect(() => {
    if (unlocked) fetchApplications();
  }, [unlocked]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setApplications(data as Application[]);
    setSelected(new Set());
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

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredApps.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredApps.map(a => a.id)));
    }
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    const { error } = await supabase.from("applications").delete().in("id", ids);
    if (error) {
      toast.error("Failed to delete submissions");
    } else {
      toast.success(`Deleted ${ids.length} submission(s)`);
      setApplications(prev => prev.filter(a => !ids.includes(a.id)));
      setSelected(new Set());
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const apps = filteredApps;
    const html = `
      <html><head><title>Submissions</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 40px; color: #111; }
        h1 { font-weight: 200; font-size: 24px; margin-bottom: 24px; }
        .card { border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .role { font-weight: 500; font-size: 14px; }
        .date { color: #999; font-size: 12px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .label { color: #888; font-size: 11px; }
        .value { font-size: 13px; }
      </style></head><body>
      <h1>Submissions — ${roleFilter === "all" ? "All" : roleFilter} (${apps.length})</h1>
      ${apps.map(app => `
        <div class="card">
          <div class="header">
            <span class="role">${roleLabels[app.role]?.label || app.role}</span>
            <span class="date">${new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <div class="grid">
            ${Object.entries(app.data || {}).filter(([, v]) => v && String(v).trim()).map(([k, v]) => `
              <div><div class="label">${fieldLabels[k] || k}</div><div class="value">${String(v)}</div></div>
            `).join("")}
          </div>
        </div>
      `).join("")}
      </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const inputClass = "glass-input w-full rounded-xl px-4 py-3 text-sm font-light";
  const labelClass = "text-xs text-muted-foreground font-light mb-2 block";

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="w-full max-w-xs space-y-5">
          <h2 className="text-lg font-extralight text-foreground text-center">Enter Passcode</h2>
          <input className={inputClass} type="password" placeholder="••••" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUnlock()} />
          <button onClick={handleUnlock} className="glass-button rounded-full w-full py-2.5 text-sm font-light text-foreground">Unlock</button>
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground/40 font-light w-full text-center hover:text-muted-foreground transition-colors">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/30 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-light">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </button>
          <div className="flex gap-1">
            <button onClick={() => setTab("stats")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${tab === "stats" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <BarChart3 className="w-4 h-4" /> Stats
            </button>
            <button onClick={() => setTab("submissions")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${tab === "submissions" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Users className="w-4 h-4" /> Submissions
              {counts.all > 0 && <span className="bg-foreground/10 text-foreground text-xs px-2 py-0.5 rounded-full">{counts.all}</span>}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-8">
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
            <button onClick={handleSave} className="glass-button rounded-full w-full py-2.5 text-sm font-light text-foreground">Save Changes</button>
          </div>
        )}

        {tab === "submissions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extralight text-foreground">Submissions</h2>
              <div className="flex items-center gap-3">
                {selected.size > 0 && (
                  <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20">
                    <Trash2 className="w-3.5 h-3.5" /> Delete ({selected.size})
                  </button>
                )}
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light text-muted-foreground hover:text-foreground transition-colors border border-border/30">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={fetchApplications} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light">Refresh</button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              {([
                { key: "all" as RoleFilter, label: "All", icon: Users },
                { key: "founder" as RoleFilter, label: "Startups", icon: Rocket },
                { key: "investor" as RoleFilter, label: "Investors", icon: TrendingUp },
                { key: "entrepreneur" as RoleFilter, label: "Entrepreneurs", icon: Lightbulb },
              ]).map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => { setRoleFilter(key); setSelected(new Set()); }} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light transition-all border ${roleFilter === key ? "bg-foreground/10 border-foreground/20 text-foreground" : "border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/15"}`}>
                  <Icon className="w-3.5 h-3.5" /> {label} <span className="text-xs opacity-60">({counts[key]})</span>
                </button>
              ))}
            </div>

            {!loading && filteredApps.length > 0 && (
              <button onClick={toggleSelectAll} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-light">
                {selected.size === filteredApps.length ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                {selected.size === filteredApps.length ? "Deselect all" : "Select all"}
              </button>
            )}

            {loading ? (
              <p className="text-sm text-muted-foreground font-light text-center py-10">Loading…</p>
            ) : filteredApps.length === 0 ? (
              <p className="text-sm text-muted-foreground font-light text-center py-10">No submissions yet.</p>
            ) : (
              <div className="space-y-3" ref={printRef}>
                {filteredApps.map((app) => (
                  <SubmissionCard key={app.id} application={app} selected={selected.has(app.id)} onToggle={() => toggleSelect(app.id)} />
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

const SubmissionCard = ({ application, selected, onToggle }: { application: Application; selected: boolean; onToggle: () => void }) => {
  const roleInfo = roleLabels[application.role] || { label: application.role, icon: Users };
  const Icon = roleInfo.icon;
  const data = application.data || {};
  const date = new Date(application.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className={`glass rounded-2xl p-5 space-y-3 transition-all cursor-pointer ${selected ? "ring-1 ring-foreground/20 bg-foreground/5" : ""}`} onClick={onToggle}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {selected ? <CheckSquare className="w-4 h-4 text-foreground" /> : <Square className="w-4 h-4 text-muted-foreground/40" />}
          </div>
          <div className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center">
            <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.3} />
          </div>
          <span className="text-sm font-light text-foreground">{roleInfo.label}</span>
        </div>
        <span className="text-xs text-muted-foreground/50 font-light">{date}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pl-7">
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
