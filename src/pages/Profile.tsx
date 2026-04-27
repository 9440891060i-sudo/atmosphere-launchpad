import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import atmosphereLogo from "@/assets/atmosphere-logo.png";
import { Upload, X, Plus, Loader2, Check, Camera } from "lucide-react";

const INTERESTS = ["AI", "Drones", "Manufacturing", "FinTech", "HealthTech", "EdTech", "CleanTech", "Web3", "SaaS", "Consumer", "Deep Tech", "Other"];
const STAGES = ["Idea", "Prototype", "MVP", "Early Traction", "Scaling"];
const CHECK_SIZES = ["Under $10k", "$10k–$50k", "$50k–$250k", "$250k–$1M", "$1M+"];

const inp = "w-full rounded-xl px-4 py-3 text-sm font-light bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-white/20 transition-colors";
const lbl = "text-[11px] text-muted-foreground/50 font-light tracking-widest uppercase mb-2 block";
const section = "rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 sm:p-8";

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Editable fields
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [uploadingPitch, setUploadingPitch] = useState(false);

  const avatarRef = useRef<HTMLInputElement>(null);
  const postRef = useRef<HTMLInputElement>(null);
  const pitchRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch profile directly
  useEffect(() => {
    if (!user) return;
    loadProfile();
    loadPosts();
  }, [user]);

  const loadProfile = async () => {
    setFetching(true);
    setFetchError("");
    const { data, error } = await (supabase as any)
      .from("profiles").select("*").eq("id", user!.id).single();
    if (error || !data) {
      // Try to create profile if missing
      const meta = (user as any).user_metadata || {};
      const username = meta.username || user!.email?.split("@")[0] || "user";
      const role = meta.role || "entrepreneur";
      await (supabase as any).from("profiles").insert([{ id: user!.id, username, role }]);
      const { data: d2 } = await (supabase as any).from("profiles").select("*").eq("id", user!.id).single();
      if (d2) populateFields(d2);
      else setFetchError("Could not load profile. Please try refreshing.");
    } else {
      populateFields(data);
    }
    setFetching(false);
  };

  const populateFields = (d: any) => {
    setProfileData(d);
    setName(d.name || "");
    setShortBio(d.short_bio || "");
    setLongBio(d.long_bio || "");
    setPortfolioLink(d.portfolio_link || "");
    setCompanyName(d.company_name || "");
    setCompanyWebsite(d.company_website || "");
    setEstablished(d.established_at || "");
    setStage(d.stage || "");
    setLocation(d.location || "");
    setCheckSize(d.check_size || "");
    setInterests(d.investment_interests || []);
    setAvatarUrl(d.avatar_url || "");
    setPitchUrl(d.pitch_video_url || "");
  };

  const loadPosts = async () => {
    const { data } = await (supabase as any).from("posts").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const saveSection = async (key: string, fields: Record<string, any>) => {
    setSaving(key);
    await (supabase as any).from("profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", user!.id);
    setSaving(""); setSaved(key);
    setTimeout(() => setSaved(""), 2000);
    loadProfile();
  };

  const uploadFile = async (bucket: string, file: File, path: string) => {
    await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    const url = await uploadFile("avatars", file, `${user!.id}/avatar.${file.name.split(".").pop()}`);
    setAvatarUrl(url);
    await (supabase as any).from("profiles").update({ avatar_url: url }).eq("id", user!.id);
    setUploadingAvatar(false);
  };

  const handlePostUpload = async () => {
    if (!postFile) return;
    setUploadingPost(true);
    const isVideo = postFile.type.startsWith("video/");
    const url = await uploadFile("posts", postFile, `${user!.id}/${Date.now()}.${postFile.name.split(".").pop()}`);
    await (supabase as any).from("posts").insert([{ user_id: user!.id, media_url: url, media_type: isVideo ? "video" : "image", caption: postCaption }]);
    setPostFile(null); setPostCaption(""); loadPosts();
    setUploadingPost(false);
  };

  const handlePitchUpload = async (file: File) => {
    setUploadingPitch(true);
    const url = await uploadFile("pitch-videos", file, `${user!.id}/pitch.${file.name.split(".").pop()}`);
    setPitchUrl(url);
    await (supabase as any).from("profiles").update({ pitch_video_url: url }).eq("id", user!.id);
    setUploadingPitch(false);
  };

  const Btn = ({ k, onClick }: { k: string; onClick: () => void }) => (
    <button onClick={onClick} disabled={saving === k} className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-light border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30">
      {saving === k ? <Loader2 className="w-3 h-3 animate-spin" /> : saved === k ? <Check className="w-3 h-3 text-emerald-400/80" /> : null}
      {saving === k ? "Saving…" : saved === k ? "Saved" : "Save"}
    </button>
  );

  const initials = (name || profileData?.username || "?")[0].toUpperCase();
  const role = profileData?.role;
  const roleLabel = { startup: "Startup", investor: "Investor", entrepreneur: "Entrepreneur" }[role] || role;

  // ── States ───────────────────────────────────────────────
  if (!user) return null;

  if (fetching) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
      <p className="text-xs text-white/30 font-light">Loading your profile…</p>
    </div>
  );

  if (fetchError) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-3 px-6">
      <p className="text-sm text-white/40 font-light text-center">{fetchError}</p>
      <button onClick={loadProfile} className="text-xs text-white/30 hover:text-white/60 font-light transition-colors">Try again</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <img src={atmosphereLogo} alt="Atmosphere" className="h-7 w-auto opacity-70" />
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/25 font-light hidden sm:block">@{profileData?.username}</span>
            <button onClick={signOut} className="text-xs text-white/25 hover:text-white/60 font-light transition-colors">Sign out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 pt-24 pb-20 space-y-3">

        {/* ── Profile ── */}
        <div className={section}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] text-white/30 font-light tracking-widest uppercase">Profile</p>
            <Btn k="profile" onClick={() => saveSection("profile", { name, short_bio: shortBio })} />
          </div>

          <div className="flex items-center gap-4 mb-5">
            <button onClick={() => avatarRef.current?.click()} className="relative w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden hover:border-white/20 transition-colors group flex-shrink-0">
              {uploadingAvatar ? <Loader2 className="w-4 h-4 text-white/30 animate-spin" /> :
                avatarUrl ? <>
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-4 h-4 text-white/70" /></div>
                </> : <>
                  <span className="text-lg font-light text-white/30 group-hover:opacity-0 transition-opacity">{initials}</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-4 h-4 text-white/50" /></div>
                </>
              }
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
            <div>
              <p className="text-xs text-white/25 font-light">@{profileData?.username}</p>
              <span className="mt-1 inline-block text-[10px] border border-white/10 rounded-full px-2.5 py-0.5 text-white/30 font-light">{roleLabel}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className={lbl}>Name</label>
              <input className={inp} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Short bio <span className="normal-case tracking-normal opacity-50">{shortBio.length}/160</span></label>
              <input className={inp} placeholder="One line about you" maxLength={160} value={shortBio} onChange={e => setShortBio(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Bio ── */}
        <div className={section}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] text-white/30 font-light tracking-widest uppercase">About</p>
            <Btn k="bio" onClick={() => saveSection("bio", { long_bio: longBio, portfolio_link: portfolioLink })} />
          </div>
          <div className="space-y-3">
            <div>
              <label className={lbl}>Bio</label>
              <textarea className={inp + " min-h-[90px] resize-none"} placeholder="Your story…" value={longBio} onChange={e => setLongBio(e.target.value)} />
            </div>
            {(role === "investor" || role === "entrepreneur") && (
              <div>
                <label className={lbl}>Portfolio link</label>
                <input className={inp} placeholder="https://…" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* ── Startup: Company Details ── */}
        {role === "startup" && (
          <div className={section}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] text-white/30 font-light tracking-widest uppercase">Company Details</p>
              <Btn k="company" onClick={() => saveSection("company", { company_name: companyName, company_website: companyWebsite, established_at: established, stage, location })} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={lbl}>Company name</label>
                <input className={inp} placeholder="Acme Inc." value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Website</label>
                <input className={inp} placeholder="https://…" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Established</label>
                <input className={inp} placeholder="2024" maxLength={4} value={established} onChange={e => setEstablished(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Location</label>
                <input className={inp} placeholder="City, Country" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={lbl}>Stage</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {STAGES.map(s => (
                  <button key={s} onClick={() => setStage(s)} className={`rounded-full px-3 py-1.5 text-xs font-light border transition-all ${stage === s ? "border-white/25 bg-white/[0.08] text-white/80" : "border-white/[0.06] text-white/25 hover:border-white/15 hover:text-white/50"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Investor Details ── */}
        {role === "investor" && (
          <div className={section}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] text-white/30 font-light tracking-widest uppercase">Investor Details</p>
              <Btn k="investor" onClick={() => saveSection("investor", { check_size: checkSize, investment_interests: interests })} />
            </div>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Typical check size</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CHECK_SIZES.map(s => (
                    <button key={s} onClick={() => setCheckSize(s)} className={`rounded-full px-3 py-1.5 text-xs font-light border transition-all ${checkSize === s ? "border-white/25 bg-white/[0.08] text-white/80" : "border-white/[0.06] text-white/25 hover:border-white/15 hover:text-white/50"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={lbl}>Investment interests</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} className={`rounded-full px-3 py-1.5 text-xs font-light border transition-all ${interests.includes(i) ? "border-white/25 bg-white/[0.08] text-white/80" : "border-white/[0.06] text-white/25 hover:border-white/15 hover:text-white/50"}`}>{i}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Pitch Video (startup only) ── */}
        {role === "startup" && (
          <div className={section}>
            <p className="text-[11px] text-white/30 font-light tracking-widest uppercase mb-5">Pitch / Company Video</p>
            {pitchUrl ? (
              <div className="space-y-3">
                <video src={pitchUrl} controls className="w-full rounded-xl max-h-[240px] bg-white/[0.02]" />
                <button onClick={() => pitchRef.current?.click()} className="text-xs text-white/20 hover:text-white/50 font-light transition-colors">Replace video</button>
              </div>
            ) : (
              <button onClick={() => pitchRef.current?.click()} className="w-full rounded-xl border border-dashed border-white/[0.07] hover:border-white/[0.15] transition-colors p-10 flex flex-col items-center gap-3 text-white/20 hover:text-white/40">
                {uploadingPitch ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs font-light">{uploadingPitch ? "Uploading…" : "Upload pitch or company video"}</span>
              </button>
            )}
            <input ref={pitchRef} type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handlePitchUpload(e.target.files[0])} />
          </div>
        )}

        {/* ── Posts & Reels ── */}
        <div className={section}>
          <p className="text-[11px] text-white/30 font-light tracking-widest uppercase mb-5">Posts & Reels</p>

          {postFile ? (
            <div className="space-y-3 mb-4">
              <div className="relative rounded-xl overflow-hidden bg-white/[0.03] aspect-square max-w-[220px]">
                {postFile.type.startsWith("video/")
                  ? <video src={URL.createObjectURL(postFile)} className="w-full h-full object-cover" />
                  : <img src={URL.createObjectURL(postFile)} alt="" className="w-full h-full object-cover" />}
                <button onClick={() => setPostFile(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
                  <X className="w-3 h-3 text-white/70" />
                </button>
              </div>
              <input className={inp} placeholder="Caption (optional)…" value={postCaption} onChange={e => setPostCaption(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => setPostFile(null)} className="rounded-full px-4 py-1.5 text-xs border border-white/[0.06] text-white/25 hover:text-white/50 transition-colors font-light">Cancel</button>
                <button onClick={handlePostUpload} disabled={uploadingPost} className="rounded-full px-4 py-1.5 text-xs border border-white/10 hover:border-white/20 text-white/40 hover:text-white/70 transition-colors font-light disabled:opacity-30">
                  {uploadingPost ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => postRef.current?.click()} className="w-full rounded-xl border border-dashed border-white/[0.07] hover:border-white/[0.15] transition-colors p-8 flex items-center justify-center gap-2 text-white/20 hover:text-white/40 mb-4">
              <Plus className="w-4 h-4" />
              <span className="text-xs font-light">Add photo or video</span>
            </button>
          )}
          <input ref={postRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setPostFile(e.target.files[0]); e.target.value = ""; }}} />

          {posts.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {posts.map(p => (
                <div key={p.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/[0.03]">
                  {p.media_type === "video"
                    ? <video src={p.media_url} className="w-full h-full object-cover" />
                    : <img src={p.media_url} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    {p.caption && <span className="text-[11px] text-white/70 font-light text-center line-clamp-2">{p.caption}</span>}
                    <button onClick={async () => { await (supabase as any).from("posts").delete().eq("id", p.id); loadPosts(); }} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <X className="w-3 h-3 text-white/60" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
