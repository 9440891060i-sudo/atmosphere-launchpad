import { useState, useEffect, useRef } from "react";
import { useStats } from "@/hooks/use-stats";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, ArrowLeft, Rocket, TrendingUp, Lightbulb, Trash2, Printer, CheckSquare, Square, Calendar, ListTodo, Linkedin, MessageSquare, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";

const PASSCODE = "1325";

type Tab = "stats" | "submissions" | "content" | "tasks";
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

  // Tasks state (persisted in localStorage)
  const [tasksDone, setTasksDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("atm_tasks_done") || "[]")); }
    catch { return new Set(); }
  });

  const toggleTask = (id: string) => {
    setTasksDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("atm_tasks_done", JSON.stringify([...next]));
      return next;
    });
  };

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
      applicants: parseInt(form.applicants) || stats?.applicants || 0,
      earlyUsers: parseInt(form.earlyUsers) || stats?.earlyUsers || 0,
      countries: parseInt(form.countries) || stats?.countries || 0,
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
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setTab("stats")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${tab === "stats" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <BarChart3 className="w-4 h-4" /> Stats
            </button>
            <button onClick={() => setTab("submissions")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${tab === "submissions" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Users className="w-4 h-4" /> Submissions
              {counts.all > 0 && <span className="bg-foreground/10 text-foreground text-xs px-2 py-0.5 rounded-full">{counts.all}</span>}
            </button>
            <button onClick={() => setTab("content")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${tab === "content" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Calendar className="w-4 h-4" /> Content Queue
            </button>
            <button onClick={() => setTab("tasks")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all ${tab === "tasks" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <ListTodo className="w-4 h-4" /> Tasks
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

        {tab === "content" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extralight text-foreground">Content Queue</h2>
              <span className="text-xs text-muted-foreground font-light">Apr 30 · Day 1 · Review Only — Nothing publishes today</span>
            </div>

            {([
              { id: "li-p1", platform: "LinkedIn", type: "Post", status: "approved", scheduleHint: "Apr 30, 9AM UTC", title: "The best deals I've watched close quietly...", body: "Smart founders raise quietly. Smart investors move before the deck goes viral. Noise is a lagging indicator. The signal was 6 months ago.", image: false },
              { id: "li-p2", platform: "LinkedIn", type: "Post", status: "approved", scheduleHint: "May 2, 9AM UTC", title: "Most fundraising advice is backwards.", body: "The founders closing rounds in 2026 are saying no. To associates, to pre-term data rooms, to everything that signals neediness.", image: false },
              { id: "li-p3", platform: "LinkedIn", type: "Post", status: "pending-image", scheduleHint: "May 4, 9AM UTC", title: "Secondary market for private shares", body: "Founders on Atmosphere who couldn't get meetings 6 months ago are now closing rounds with angels who watched them build on the platform.", image: true },
              { id: "li-c1", platform: "LinkedIn", type: "Comment", status: "approved", scheduleHint: "Manual drop", title: "Under Supremus Angel post", body: "The founders who close quietly are usually the ones worth backing. The ones pitching loudly are usually still figuring out unit economics.", image: false },
              { id: "li-c2", platform: "LinkedIn", type: "Comment", status: "approved", scheduleHint: "Manual drop", title: "Under Keystones post", body: "The people who waited until they knew enough are the same ones now watching founders they passed on ring the bell.", image: false },
              { id: "li-p4", platform: "LinkedIn", type: "Post", status: "approved", scheduleHint: "12PM drop", title: "The biggest fundraising mistake happens before you open the deck.", body: "Three things that actually win the round before the deck opens: who introduces you, the market narrative, and what investors have already heard about you.", image: true },
              { id: "li-p5", platform: "LinkedIn", type: "Post", status: "approved", scheduleHint: "12PM drop", title: "Most fundraising advice is backwards.", body: "The founders closing rounds in 2026 are doing the opposite — saying no to associates, no to pre-term data rooms.", image: false },
              { id: "li-p6", platform: "LinkedIn", type: "Post", status: "pending-image", scheduleHint: "12PM drop", title: "What happens between the last round and the IPO", body: "A few founders on Atmosphere were discussing the secondary market gap — fragmented, relationship-driven, inaccessible.", image: true },
              { id: "rd-c1", platform: "Reddit", type: "Comment", status: "approved", scheduleHint: "Manual drop · r/startups", title: "Under AI paralysis thread", body: "The $1000 spent is not the problem. The 'someone will raise $10M for this tomorrow' paralysis is.", image: false },
              { id: "rd-c2", platform: "Reddit", type: "Comment", status: "approved", scheduleHint: "Manual drop · r/startups", title: "Under startup equity thread", body: "At google-slides stage, treat the equity as lottery tickets, not compensation.", image: false },
              { id: "rd-p1", platform: "Reddit", type: "Post", status: "approved", scheduleHint: "r/entrepreneur", title: "Launching while the market moves is the skill.", body: "The AI landscape isn't going to settle. This is the pace now. The builders who are winning aren't the ones who timed the market.", image: false },
            ] as ContentItem[]).map(item => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {tab === "tasks" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-extralight text-foreground mb-1">Today's Tasks</h2>
              <p className="text-xs text-muted-foreground font-light">Apr 30 · Pipeline Day 1</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-light text-muted-foreground uppercase tracking-widest">🤖 AI Jobs</h3>
              {([
                { id: "ai-1", label: "LinkedIn engine live (4x daily)", done: true },
                { id: "ai-2", label: "Reddit engine live (4x daily)", done: true },
                { id: "ai-3", label: "X engine live (4x daily)", done: true },
                { id: "ai-4", label: "Instagram engine live (4x daily)", done: true },
                { id: "ai-5", label: "Reddit cron delivery fixed", done: true },
                { id: "ai-6", label: "Agent architecture cleaned (3 agents only)", done: true },
                { id: "ai-7", label: "12PM LinkedIn drop reviewed + approved", done: true },
                { id: "ai-8", label: "12PM Reddit drop reviewed + approved", done: true },
                { id: "ai-9", label: "Generate FLUX images for approved posts", done: false },
                { id: "ai-10", label: "5PM content drop (LinkedIn + Reddit + X + Instagram)", done: false },
                { id: "ai-11", label: "8PM content drop (LinkedIn + Reddit + X + Instagram)", done: false },
              ] as TaskItem[]).map(item => (
                <TaskRow key={item.id} item={item} overrideDone={tasksDone.has(item.id)} onToggle={() => toggleTask(item.id)} />
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-light text-muted-foreground uppercase tracking-widest">👤 Human Jobs</h3>
              {([
                { id: "h-1", label: "Connect LinkedIn account to Postiz (platform.postiz.com)", done: false },
                { id: "h-2", label: "Drop Comment 1 on LinkedIn (Supremus Angel post)", done: false },
                { id: "h-3", label: "Drop Comment 2 on LinkedIn (Keystones post)", done: false },
                { id: "h-4", label: "Drop Comment 1 on Reddit (AI paralysis · r/startups)", done: false },
                { id: "h-5", label: "Drop Comment 2 on Reddit (startup equity · r/startups)", done: false },
                { id: "h-6", label: "Add FLUX API key for image generation", done: false },
                { id: "h-7", label: "Record reel video (script pending from 5PM Instagram drop)", done: false },
              ] as TaskItem[]).map(item => (
                <TaskRow key={item.id} item={item} overrideDone={tasksDone.has(item.id)} onToggle={() => toggleTask(item.id)} />
              ))}
            </div>
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

// ── Content Queue Types & Components ──────────────────────────────────────
type ContentStatus = "approved" | "pending-image" | "rejected";
interface ContentItem {
  id: string;
  platform: string;
  type: string;
  status: ContentStatus;
  scheduleHint: string;
  title: string;
  body: string;
  image: boolean;
}

const platformIcon = (p: string) => {
  if (p === "LinkedIn") return <Linkedin className="w-3.5 h-3.5" />;
  if (p === "Reddit") return <MessageSquare className="w-3.5 h-3.5" />;
  if (p === "X") return <Twitter className="w-3.5 h-3.5" />;
  if (p === "Instagram") return <Instagram className="w-3.5 h-3.5" />;
  return null;
};

const statusBadge = (s: ContentStatus) => {
  if (s === "approved") return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-light">Approved</span>;
  if (s === "pending-image") return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-light">Pending Image</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-light">Rejected</span>;
};

const ContentCard = ({ item }: { item: ContentItem }) => (
  <div className="glass rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">{platformIcon(item.platform)}<span className="text-xs font-light">{item.platform}</span></div>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-xs text-muted-foreground font-light">{item.type}</span>
      </div>
      <div className="flex items-center gap-2">
        {statusBadge(item.status)}
        <span className="text-xs text-muted-foreground/50 font-light">{item.scheduleHint}</span>
      </div>
    </div>
    <p className="text-sm font-light text-foreground">{item.title}</p>
    <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.body}</p>
    {item.image && <p className="text-xs text-amber-400/70 font-light">📸 Image required (FLUX pending)</p>}
  </div>
);

// ── Task List Types & Components ────────────────────────────────────────────
interface TaskItem { id: string; label: string; done: boolean; }

const TaskRow = ({ item, overrideDone, onToggle }: { item: TaskItem; overrideDone: boolean; onToggle: () => void }) => {
  const done = item.done || overrideDone;
  return (
    <button onClick={onToggle} className="flex items-center gap-3 w-full text-left group">
      <div className="flex-shrink-0">
        {done ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />}
      </div>
      <span className={`text-sm font-light transition-colors ${done ? "line-through text-muted-foreground/40" : "text-foreground"}`}>{item.label}</span>
    </button>
  );
};

// ────────────────────────────────────────────────────────────────────────────

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
