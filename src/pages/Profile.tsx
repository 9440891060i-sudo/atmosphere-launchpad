import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import atmosphereLogo from "@/assets/atmosphere-logo.png";
import { Camera, Upload, Plus, X, Loader2, Check, ArrowLeft, Info } from "lucide-react";

const INTERESTS = ["AI", "Drones", "Manufacturing", "FinTech", "HealthTech", "EdTech", "CleanTech", "Web3", "SaaS", "Consumer", "Deep Tech", "Other"];
const STAGES = ["Idea", "Prototype", "MVP", "Early Traction", "Scaling"];
const CHECK_SIZES = ["Under $10k", "$10k–$50k", "$50k–$250k", "$250k–$1M", "$1M+"];

const inp = "glass-input w-full rounded-xl px-4 py-2.5 text-sm font-light";

function SaveBtn({ k, saving, saved, onClick }: { k: string; saving: string; saved: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving === k}
      className="glass-button rounded-full px-5 py-2 text-xs font-light text-foreground tracking-wide disabled:opacity-40 transition-all flex items-center gap-1.5"
    >
      {saving === k ? <Loader2 className="w-3 h-3 animate-spin" /> : saved === k ? <Check className="w-3 h-3 text-emerald-400" /> : null}
      {saving === k ? "Saving…" : saved === k ? "Saved" : "Save"}
    </button>
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-light border transition-all duration-200 ${
        active
          ? "bg-foreground/10 border-foreground/25 text-foreground"
          : "border-border text-muted-foreground/60 hover:border-foreground/20 hover:text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] text-muted-foreground/50 font-light tracking-[0.15em] uppercase block">{label}</label>
      {children}
    </div>
  );
}

function getCompletion(role: string, f: {
  name: string; shortBio: string; longBio: string; avatarUrl: string;
  companyName: string; stage: string; location: string; pitchUrl: string;
  portfolioLink: string; checkSize: string; interests: string[]; posts: any[];
}) {
  const checks =
    role === "startup" ? [
      { done: !!f.avatarUrl,           label: "Add a profile photo" },
      { done: !!f.name,                label: "Add your name" },
      { done: !!f.shortBio,            label: "Write a short bio" },
      { done: !!f.longBio,             label: "Tell your story in Bio" },
      { done: !!f.companyName,         label: "Add your company name" },
      { done: !!f.stage,               label: "Set your startup stage" },
      { done: !!f.location,            label: "Add your location" },
      { done: !!f.pitchUrl,            label: "Upload a pitch or company video" },
      { done: f.posts.length > 0,      label: "Share at least one post or reel" },
    ] : role === "investor" ? [
      { done: !!f.avatarUrl,           label: "Add a profile photo" },
      { done: !!f.name,                label: "Add your name" },
      { done: !!f.shortBio,            label: "Write a short bio" },
      { done: !!f.longBio,             label: "Tell your story in Bio" },
      { done: !!f.checkSize,           label: "Set your check size" },
      { done: f.interests.length > 0,  label: "Pick your investment interests" },
      { done: !!f.location,            label: "Add your location" },
    ] : [
      { done: !!f.avatarUrl,           label: "Add a profile photo" },
      { done: !!f.name,                label: "Add your name" },
      { done: !!f.shortBio,            label: "Write a short bio" },
      { done: !!f.longBio,             label: "Tell your story in Bio" },
      { done: !!f.portfolioLink,       label: "Add your portfolio or LinkedIn" },
      { done: !!f.location,            label: "Add your location" },
      { done: f.posts.length > 0,      label: "Share at least one post or reel" },
    ];

  const done = checks.filter(c => c.done).length;
  const pct = Math.round((done / checks.length) * 100);
  const missing = checks.filter(c => !c.done).slice(0, 3).map(c => c.label);
  return { pct, missing };
}

function CompletionBar({ pct, missing }: { pct: number; missing: string[] }) {
  if (pct >= 100) return null;
  const barColor = pct < 30 ? "bg-red-500/50" : pct < 70 ? "bg-amber-400/60" : "bg-emerald-400/60";
  return (
    <div className="rounded-2xl border border-border/40 bg-secondary/10 px-5 py-4">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-light tracking-[0.1em] uppercase text-muted-foreground/50">Profile strength</p>
        <p className="text-xs font-light text-foreground/70">{pct}%</p>
      </div>
      <div className="w-full h-[3px] bg-border/30 rounded-full mb-4 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      {missing.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-muted-foreground/40 font-light mb-2">Complete your profile to get seen:</p>
          {missing.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground/25 flex-shrink-0" />
              <p className="text-xs font-light text-muted-foreground/55">{m}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const [name, setName] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [longBio, setLongBio] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [established, setEstablished] = useState("");
  const [stage, setStage] = useState("");
  const [location, setLocation] = useState("");
  const [checkSize, setCheckSize] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [pitchUrl, setPitchUrl] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postCaption, setPostCaption] = useState("");
  const [saving, setSaving] = useState("");
  const [saved, setSaved] = useState("");
  const [uploading, setUploading] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const avatarRef = useRef<HTMLInputElement>(null);
  const postRef = useRef<HTMLInputElement>(null);
  const pitchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => { if (!s) navigate("/"); });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => { if (user) { load(); loadPosts(); } }, [user]);

  const load = async () => {
    setFetching(true);
    const { data, error } = await (supabase as any).from("profiles").select("*").eq("id", user!.id).single();
    if (error || !data) {
      const meta = (user as any).user_metadata || {};
      await (supabase as any).from("profiles").insert([{ id: user!.id, username: meta.username || user!.email?.split("@")[0], role: meta.role || "entrepreneur" }]);
      const { data: d2 } = await (supabase as any).from("profiles").select("*").eq("id", user!.id).single();
      if (d2) fill(d2);
    } else fill(data);
    setFetching(false);
  };

  const fill = (d: any) => {
    setProfileData(d);
    setName(d.name || ""); setShortBio(d.short_bio || ""); setLongBio(d.long_bio || "");
    setPortfolioLink(d.portfolio_link || ""); setCompanyName(d.company_name || "");
    setCompanyWebsite(d.company_website || ""); setEstablished(d.established_at || "");
    setStage(d.stage || ""); setLocation(d.location || ""); setCheckSize(d.check_size || "");
    setInterests(d.investment_interests || []); setAvatarUrl(d.avatar_url || ""); setPitchUrl(d.pitch_video_url || "");
  };

  const loadPosts = async () => {
    const { data } = await (supabase as any).from("posts").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const saveSection = async (key: string, fields: Record<string, any>) => {
    setSaving(key);
    await (supabase as any).from("profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", user!.id);
    setSaving(""); setSaved(key); setTimeout(() => setSaved(""), 2000); load();
  };

  const uploadFile = async (bucket: string, file: File, path: string): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("x-upsert", "true");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        setUploadProgress(100);
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
        resolve(publicUrl);
      };
      xhr.onerror = () => reject(new Error("Upload failed"));
      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });
  };

  const handleAvatar = async (file: File) => {
    setUploadProgress(0); setUploading("avatar");
    const url = await uploadFile("avatars", file, `${user!.id}/avatar.${file.name.split(".").pop()}`);
    setAvatarUrl(url);
    await (supabase as any).from("profiles").update({ avatar_url: url }).eq("id", user!.id);
    setUploading("");
  };

  const handlePost = async () => {
    if (!postFile) return;
    setUploadProgress(0); setUploading("post");
    const isVideo = postFile.type.startsWith("video/");
    const url = await uploadFile("posts", postFile, `${user!.id}/${Date.now()}.${postFile.name.split(".").pop()}`);
    await (supabase as any).from("posts").insert([{ user_id: user!.id, media_url: url, media_type: isVideo ? "video" : "image", caption: postCaption }]);
    setPostFile(null); setPostCaption(""); loadPosts(); setUploading("");
  };

  const handlePitch = async (file: File) => {
    setUploadProgress(0); setUploading("pitch");
    const url = await uploadFile("pitch-videos", file, `${user!.id}/pitch.${file.name.split(".").pop()}`);
    setPitchUrl(url);
    await (supabase as any).from("profiles").update({ pitch_video_url: url }).eq("id", user!.id);
    setUploading("");
  };

  const deletePost = async (id: string) => {
    await (supabase as any).from("posts").delete().eq("id", id);
    setPosts(p => p.filter(x => x.id !== id));
  };

  const role = profileData?.role;
  const initials = (name || profileData?.username || "?")[0].toUpperCase();
  const roleLabel = { startup: "Startup", investor: "Investor", entrepreneur: "Entrepreneur" }[role] || role;
  const completion = getCompletion(role, { name, shortBio, longBio, avatarUrl, companyName, stage, location, pitchUrl, portfolioLink, checkSize, interests, posts });

  if (!user) return null;
  if (fetching) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-4 h-4 text-muted-foreground/40 animate-spin" />
    </div>
  );
  if (!profileData) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground/40 text-sm font-light">Something went wrong. <button onClick={load} className="underline">Retry</button></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background noise-overlay">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img src={atmosphereLogo} alt="Atmosphere" className="h-7 w-auto opacity-70" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground/40 font-light hidden sm:block">@{profileData.username}</span>
            <button onClick={signOut} className="text-xs text-muted-foreground/40 hover:text-foreground font-light transition-colors">Sign out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-5 pt-20 pb-24 space-y-4">

        {/* ── Completion bar ── */}
        <CompletionBar pct={completion.pct} missing={completion.missing} />

        {/* ── Role context banner ── */}
        {role === "startup" && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 px-5 py-4 flex gap-3 items-start">
            <Info className="w-4 h-4 text-amber-400/60 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-light text-amber-300/80 leading-relaxed">
                <span className="font-medium">This is your startup's profile — not your personal one.</span>{" "}
                Use your company logo, your startup's name, and describe what your company does. Investors are evaluating your startup, not you personally.
              </p>
            </div>
          </div>
        )}

        {/* ── Banner ── */}
        <div className="pt-2 pb-1 px-1">
          <p className="text-sm text-muted-foreground/50 font-light leading-relaxed max-w-xl">
            {completion.pct < 40
              ? "Your profile is just getting started. The most complete profiles get picked first for early access."
              : completion.pct < 80
              ? "Good start. Profiles with photos and posts get 4x more visibility from investors and founders."
              : "Almost there. Finish up and you'll be one of the strongest profiles on Atmosphere."}
          </p>
        </div>

        {/* ── Profile card ── */}
        <div className="gradient-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-5 mb-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => avatarRef.current?.click()}
                className="relative rounded-2xl glass group overflow-hidden"
                style={{ width: "72px", height: "72px" }}
              >
                {uploading === "avatar"
                  ? <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <span className="text-[10px] font-medium text-muted-foreground/60">{uploadProgress}%</span>
                      <div className="w-10 h-0.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                        <div className="h-full bg-muted-foreground/40 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  : avatarUrl
                  ? <>
                      <img src={avatarUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-4 h-4 text-foreground" />
                      </div>
                    </>
                  : <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <span className="text-xl font-extralight text-muted-foreground/40 group-hover:opacity-0 transition-opacity">{initials}</span>
                      <Camera className="w-4 h-4 text-muted-foreground/30 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                }
              </button>
              <span className="text-[10px] text-muted-foreground/35 font-light tracking-wide">
                {role === "startup" ? "Company Logo" : "Your Photo"}
              </span>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatar(e.target.files[0])} />

            {/* Name preview */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground/40 font-light">@{profileData.username}</span>
                <span className="text-[10px] border border-border/50 rounded-full px-2.5 py-0.5 text-muted-foreground/50 font-light tracking-wide">{roleLabel}</span>
              </div>
              <p className="text-foreground font-light text-base">{name || <span className="text-muted-foreground/30">Your name</span>}</p>
              <p className="text-muted-foreground/50 text-sm font-light mt-0.5 line-clamp-1">{shortBio || <span className="text-muted-foreground/25">Short bio will appear here</span>}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Field label={role === "startup" ? "Startup Name" : "Display Name"}>
              <input
                className={inp}
                placeholder={role === "startup" ? "Your startup's name (not your personal name)" : "Your full name"}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Field>
            <Field label={`${role === "startup" ? "Tagline" : "Short Bio"} ${shortBio.length}/160`}>
              <input
                className={inp}
                placeholder={role === "startup" ? "What does your startup do? (one line)" : "One line about you"}
                maxLength={160}
                value={shortBio}
                onChange={e => setShortBio(e.target.value)}
              />
            </Field>
          </div>
          <div className="flex justify-end mt-5">
            <SaveBtn k="profile" saving={saving} saved={saved} onClick={() => saveSection("profile", { name, short_bio: shortBio })} />
          </div>
        </div>

        {/* ── About + Role details side by side ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* About */}
          <div className="gradient-border rounded-2xl p-6">
            <h3 className="text-xs text-muted-foreground/50 font-light tracking-[0.18em] uppercase mb-5">About</h3>
            <div className="space-y-4">
              <Field label={role === "startup" ? "About Your Startup" : "About You"}>
                <textarea
                  className={inp + " min-h-[90px] resize-none"}
                  placeholder={
                    role === "startup"
                      ? "The problem you're solving, your solution, traction so far…"
                      : role === "investor"
                      ? "Your investment thesis, background, what you look for…"
                      : "Your story, skills, what you're working on…"
                  }
                  value={longBio}
                  onChange={e => setLongBio(e.target.value)}
                />
              </Field>
              {(role === "investor" || role === "entrepreneur") && (
                <Field label="Portfolio link">
                  <input className={inp} placeholder="https://…" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} />
                </Field>
              )}
            </div>
            <div className="flex justify-end mt-5">
              <SaveBtn k="bio" saving={saving} saved={saved} onClick={() => saveSection("bio", { long_bio: longBio, portfolio_link: portfolioLink })} />
            </div>
          </div>

          {/* Startup company */}
          {role === "startup" && (
            <div className="gradient-border rounded-2xl p-6">
              <h3 className="text-xs text-muted-foreground/50 font-light tracking-[0.18em] uppercase mb-5">Company</h3>
              <div className="space-y-3">
                <Field label="Company name">
                  <input className={inp} placeholder="Acme Inc." value={companyName} onChange={e => setCompanyName(e.target.value)} />
                </Field>
                <Field label="Website">
                  <input className={inp} placeholder="https://…" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Founded">
                    <input className={inp} placeholder="2024" maxLength={4} value={established} onChange={e => setEstablished(e.target.value)} />
                  </Field>
                  <Field label="Location">
                    <input className={inp} placeholder="City" value={location} onChange={e => setLocation(e.target.value)} />
                  </Field>
                </div>
                <Field label="Stage">
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {STAGES.map(s => <Pill key={s} label={s} active={stage === s} onClick={() => setStage(s)} />)}
                  </div>
                </Field>
              </div>
              <div className="flex justify-end mt-5">
                <SaveBtn k="company" saving={saving} saved={saved} onClick={() => saveSection("company", { company_name: companyName, company_website: companyWebsite, established_at: established, stage, location })} />
              </div>
            </div>
          )}

          {/* Investor details */}
          {role === "investor" && (
            <div className="gradient-border rounded-2xl p-6">
              <h3 className="text-xs text-muted-foreground/50 font-light tracking-[0.18em] uppercase mb-5">Investing</h3>
              <div className="space-y-4">
                <Field label="Check size">
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {CHECK_SIZES.map(s => <Pill key={s} label={s} active={checkSize === s} onClick={() => setCheckSize(s)} />)}
                  </div>
                </Field>
                <Field label="Interests">
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {INTERESTS.map(i => <Pill key={i} label={i} active={interests.includes(i)} onClick={() => setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} />)}
                  </div>
                </Field>
              </div>
              <div className="flex justify-end mt-5">
                <SaveBtn k="investor" saving={saving} saved={saved} onClick={() => saveSection("investor", { check_size: checkSize, investment_interests: interests })} />
              </div>
            </div>
          )}
        </div>

        {/* ── Pitch Video ── */}
        {role === "startup" && (
          <div className="gradient-border rounded-2xl p-6 sm:p-8">
            <h3 className="text-xs text-muted-foreground/50 font-light tracking-[0.18em] uppercase mb-1">Pitch / Company Video</h3>
            <p className="text-[11px] text-muted-foreground/35 font-light mb-5">Investors skip profiles with no video. A 60-second pitch is enough.</p>
            {pitchUrl ? (
              <div className="space-y-3">
                <video src={pitchUrl} controls className="w-full rounded-xl max-h-[260px] bg-secondary/20" />
                <button onClick={() => pitchRef.current?.click()} className="text-xs text-muted-foreground/40 hover:text-muted-foreground font-light transition-colors">Replace video</button>
              </div>
            ) : (
              <button
                onClick={() => pitchRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-border hover:border-muted-foreground/30 transition-colors p-10 flex flex-col items-center gap-3 text-muted-foreground/30 hover:text-muted-foreground/60"
              >
                {uploading === "pitch"
                  ? <>
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-light text-muted-foreground/60">Uploading…</span>
                          <span className="text-xs font-medium text-muted-foreground/60">{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1 bg-muted-foreground/10 rounded-full overflow-hidden">
                          <div className="h-full bg-muted-foreground/50 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    </>
                  : <><Upload className="w-5 h-5" /><span className="text-xs font-light">Upload your pitch or company video</span></>}
              </button>
            )}
            <input ref={pitchRef} type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handlePitch(e.target.files[0])} />
          </div>
        )}

        {/* ── Posts & Reels ── */}
        <div className="gradient-border rounded-2xl p-6 sm:p-8">
          <h3 className="text-xs text-muted-foreground/50 font-light tracking-[0.18em] uppercase mb-1">Posts & Reels</h3>
          <p className="text-[11px] text-muted-foreground/35 font-light mb-5">
            {role === "startup" ? "Show your product, your team, your progress. This is what people actually look at."
              : role === "investor" ? "Share your thinking, your thesis, what you've backed. Founders research investors too."
              : "Show your work. This is how founders and investors know you're the real deal."}
          </p>

          {postFile ? (
            <div className="mb-5 space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-secondary/20 aspect-square max-w-[200px]">
                {postFile.type.startsWith("video/")
                  ? <video src={URL.createObjectURL(postFile)} className="w-full h-full object-cover" />
                  : <img src={URL.createObjectURL(postFile)} alt="" className="w-full h-full object-cover" />}
                <button onClick={() => setPostFile(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full glass flex items-center justify-center">
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              <input className={inp} placeholder="Caption (optional)" value={postCaption} onChange={e => setPostCaption(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => setPostFile(null)} className="glass-button rounded-full px-4 py-1.5 text-xs font-light text-muted-foreground">Cancel</button>
                <button onClick={handlePost} disabled={uploading === "post"} className="glass-button rounded-full px-5 py-1.5 text-xs font-light text-foreground disabled:opacity-30">
                  {uploading === "post"
                    ? <span className="flex items-center gap-2">
                        <span className="text-xs">{uploadProgress}%</span>
                        <span className="w-16 h-1 bg-muted-foreground/10 rounded-full overflow-hidden inline-block align-middle">
                          <span className="block h-full bg-muted-foreground/50 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                        </span>
                      </span>
                    : "Post"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => postRef.current?.click()}
              className="w-full rounded-xl border border-dashed border-border hover:border-muted-foreground/30 transition-colors p-7 flex items-center justify-center gap-2 text-muted-foreground/30 hover:text-muted-foreground/60 mb-5"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-light">Add photo or video</span>
            </button>
          )}
          <input ref={postRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setPostFile(e.target.files[0]); e.target.value = ""; }}} />

          {posts.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {posts.map(p => (
                <div key={p.id} className="group relative aspect-square rounded-xl overflow-hidden bg-secondary/20">
                  {p.media_type === "video"
                    ? <video src={p.media_url} className="w-full h-full object-cover" />
                    : <img src={p.media_url} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-background/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    {p.caption && <span className="text-[11px] text-foreground/80 font-light text-center line-clamp-2">{p.caption}</span>}
                    <button onClick={() => deletePost(p.id)} className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-foreground/10 transition-colors">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Floating info ── */}
      <button
        onClick={() => setShowInfo(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-9 h-9 rounded-full glass-button flex items-center justify-center text-muted-foreground/50"
      >
        <Info className="w-4 h-4" />
      </button>
      {showInfo && (
        <div className="fixed bottom-16 right-6 z-50 max-w-[280px] glass rounded-2xl p-5 shadow-2xl">
          <button onClick={() => setShowInfo(false)} className="absolute top-3 right-3 text-muted-foreground/30 hover:text-muted-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-xs text-muted-foreground/60 font-light leading-relaxed">
            This is your early profile. Interesting accounts will be selected and early access will be granted to them. This profile will be visible to early users inside the platform — so make sure to give your best first appearance.
          </p>
        </div>
      )}
    </div>
  );
}
