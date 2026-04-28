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

  const uploadFile = async (bucket: string, file: File, path: string) => {
    await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const handleAvatar = async (file: File) => {
    setUploading("avatar");
    const url = await uploadFile("avatars", file, `${user!.id}/avatar.${file.name.split(".").pop()}`);
    setAvatarUrl(url);
    await (supabase as any).from("profiles").update({ avatar_url: url }).eq("id", user!.id);
    setUploading("");
  };

  const handlePost = async () => {
    if (!postFile) return;
    setUploading("post");
    const isVideo = postFile.type.startsWith("video/");
    const url = await uploadFile("posts", postFile, `${user!.id}/${Date.now()}.${postFile.name.split(".").pop()}`);
    await (supabase as any).from("posts").insert([{ user_id: user!.id, media_url: url, media_type: isVideo ? "video" : "image", caption: postCaption }]);
    setPostFile(null); setPostCaption(""); loadPosts(); setUploading("");
  };

  const handlePitch = async (file: File) => {
    setUploading("pitch");
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

        {/* ── Banner ── */}
        <div className="pt-4 pb-2 px-1">
          <p className="text-[10px] text-muted-foreground/30 tracking-[0.25em] uppercase font-light mb-2">Early Access</p>
          <p className="text-sm text-muted-foreground/60 font-light leading-relaxed max-w-xl">
            This is your early profile. The most interesting profiles get selected first — build a great first impression.
          </p>
        </div>

        {/* ── Profile card ── */}
        <div className="gradient-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-5 mb-6">
            {/* Avatar */}
            <button
              onClick={() => avatarRef.current?.click()}
              className="relative w-18 h-18 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl glass group overflow-hidden"
              style={{ width: "72px", height: "72px" }}
            >
              {uploading === "avatar"
                ? <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-4 h-4 text-muted-foreground/40 animate-spin" /></div>
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
            <Field label="Display name">
              <input className={inp} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </Field>
            <Field label={`Short bio ${shortBio.length}/160`}>
              <input className={inp} placeholder="One line about you" maxLength={160} value={shortBio} onChange={e => setShortBio(e.target.value)} />
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
              <Field label="Bio">
                <textarea
                  className={inp + " min-h-[90px] resize-none"}
                  placeholder="Your story, what you're building…"
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
            <h3 className="text-xs text-muted-foreground/50 font-light tracking-[0.18em] uppercase mb-5">Pitch / Company Video</h3>
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
                {uploading === "pitch" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs font-light">{uploading === "pitch" ? "Uploading…" : "Upload your pitch or company video"}</span>
              </button>
            )}
            <input ref={pitchRef} type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handlePitch(e.target.files[0])} />
          </div>
        )}

        {/* ── Posts & Reels ── */}
        <div className="gradient-border rounded-2xl p-6 sm:p-8">
          <h3 className="text-xs text-muted-foreground/50 font-light tracking-[0.18em] uppercase mb-5">Posts & Reels</h3>

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
                  {uploading === "post" ? "Posting…" : "Post"}
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
