import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import atmosphereLogo from "@/assets/atmosphere-logo.png";
import { Camera, Upload, Plus, X, Loader2, Check, ArrowLeft } from "lucide-react";

const INTERESTS = ["AI", "Drones", "Manufacturing", "FinTech", "HealthTech", "EdTech", "CleanTech", "Web3", "SaaS", "Consumer", "Deep Tech", "Other"];
const STAGES = ["Idea", "Prototype", "MVP", "Early Traction", "Scaling"];
const CHECK_SIZES = ["Under $10k", "$10k–$50k", "$50k–$250k", "$250k–$1M", "$1M+"];

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

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

  const SaveBtn = ({ k, onClick }: { k: string; onClick: () => void }) => (
    <button onClick={onClick} disabled={saving === k} className="flex items-center gap-1.5 text-xs font-light px-4 py-1.5 rounded-full border transition-all disabled:opacity-30 border-white/15 hover:border-white/30 text-white/50 hover:text-white/80">
      {saving === k ? <Loader2 className="w-3 h-3 animate-spin" /> : saved === k ? <Check className="w-3 h-3 text-emerald-400" /> : null}
      {saving === k ? "Saving…" : saved === k ? "Saved" : "Save"}
    </button>
  );

  const Tag = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`rounded-full px-3 py-1.5 text-xs font-light border transition-all ${active ? "bg-white/10 border-white/30 text-white" : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"}`}>{label}</button>
  );

  if (!user) return null;
  if (fetching) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <Loader2 className="w-4 h-4 text-white/20 animate-spin" />
    </div>
  );
  if (!profileData) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <p className="text-white/30 text-sm font-light">Something went wrong. <button onClick={load} className="underline">Retry</button></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/95 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-5 h-13 flex items-center justify-between" style={{ height: "52px" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-white/30 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img src={atmosphereLogo} alt="Atmosphere" className="h-6 w-auto opacity-60" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/25 font-light hidden sm:block">@{profileData.username}</span>
            <button onClick={signOut} className="text-xs text-white/30 hover:text-white/70 font-light transition-colors">Sign out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-5 pt-20 pb-20">

        {/* ── Banner ── */}
        <div className="mb-6 px-1 pt-4">
          <p className="text-[10px] text-white/25 tracking-[0.25em] uppercase font-light mb-1">Early Access</p>
          <p className="text-white/50 text-sm font-light leading-relaxed">
            This profile will be visible inside Atmosphere once access opens. The most interesting profiles get in first.
          </p>
        </div>

        {/* ── Profile Card ── */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 mb-3">
          <div className="flex items-start gap-5 mb-6">
            {/* Avatar */}
            <button onClick={() => avatarRef.current?.click()} className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center overflow-hidden group hover:border-white/20 transition-colors">
              {uploading === "avatar" ? <Loader2 className="w-5 h-5 text-white/30 animate-spin" /> :
                avatarUrl ? <>
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-5 h-5 text-white/80" /></div>
                </> : <>
                  <span className="text-2xl font-extralight text-white/20 group-hover:opacity-0 transition-opacity">{initials}</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-5 h-5 text-white/60" /></div>
                </>
              }
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatar(e.target.files[0])} />

            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/30 font-light">@{profileData.username}</span>
                <span className="text-[10px] border border-white/[0.12] rounded-full px-2 py-0.5 text-white/40 font-light">{roleLabel}</span>
              </div>
              <h2 className="text-white/80 font-light text-lg truncate">{name || "Your name"}</h2>
              <p className="text-white/40 text-sm font-light mt-0.5 line-clamp-2">{shortBio || "Add a short bio…"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-white/35 tracking-widest uppercase font-light mb-1.5 block">Name</label>
              <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] text-white/35 tracking-widest uppercase font-light mb-1.5 block">Short bio <span className="normal-case tracking-normal opacity-50">{shortBio.length}/160</span></label>
              <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="One line about you" maxLength={160} value={shortBio} onChange={e => setShortBio(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <SaveBtn k="profile" onClick={() => saveSection("profile", { name, short_bio: shortBio })} />
          </div>
        </div>

        {/* ── Two column on desktop ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Bio */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <p className="text-[10px] text-white/35 tracking-[0.2em] uppercase font-light mb-4">About</p>
            <textarea
              className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none min-h-[100px]"
              placeholder="Your story, what you're building, what drives you…"
              value={longBio} onChange={e => setLongBio(e.target.value)}
            />
            {(role === "investor" || role === "entrepreneur") && (
              <div className="mt-3">
                <label className="text-[11px] text-white/35 tracking-widest uppercase font-light mb-1.5 block">Portfolio link</label>
                <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="https://…" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} />
              </div>
            )}
            <div className="flex justify-end mt-4">
              <SaveBtn k="bio" onClick={() => saveSection("bio", { long_bio: longBio, portfolio_link: portfolioLink })} />
            </div>
          </div>

          {/* Role-specific details */}
          {role === "startup" && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <p className="text-[10px] text-white/35 tracking-[0.2em] uppercase font-light mb-4">Company</p>
              <div className="space-y-3">
                <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="Company name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="Website https://…" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="Est. year" maxLength={4} value={established} onChange={e => setEstablished(e.target.value)} />
                  <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map(s => <Tag key={s} label={s} active={stage === s} onClick={() => setStage(s)} />)}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <SaveBtn k="company" onClick={() => saveSection("company", { company_name: companyName, company_website: companyWebsite, established_at: established, stage, location })} />
              </div>
            </div>
          )}

          {role === "investor" && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <p className="text-[10px] text-white/35 tracking-[0.2em] uppercase font-light mb-4">Investing</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-white/35 tracking-widest uppercase font-light mb-2 block">Check size</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CHECK_SIZES.map(s => <Tag key={s} label={s} active={checkSize === s} onClick={() => setCheckSize(s)} />)}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-white/35 tracking-widest uppercase font-light mb-2 block">Interests</label>
                  <div className="flex flex-wrap gap-1.5">
                    {INTERESTS.map(i => <Tag key={i} label={i} active={interests.includes(i)} onClick={() => setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} />)}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <SaveBtn k="investor" onClick={() => saveSection("investor", { check_size: checkSize, investment_interests: interests })} />
              </div>
            </div>
          )}
        </div>

        {/* ── Pitch Video (startup only) ── */}
        {role === "startup" && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 mb-3">
            <p className="text-[10px] text-white/35 tracking-[0.2em] uppercase font-light mb-4">Pitch / Company Video</p>
            {pitchUrl ? (
              <div className="space-y-2">
                <video src={pitchUrl} controls className="w-full rounded-xl max-h-[260px] bg-white/[0.02]" />
                <button onClick={() => pitchRef.current?.click()} className="text-xs text-white/30 hover:text-white/60 font-light transition-colors">Replace video</button>
              </div>
            ) : (
              <button onClick={() => pitchRef.current?.click()} className="w-full rounded-xl border border-dashed border-white/[0.09] hover:border-white/20 transition-colors p-10 flex flex-col items-center gap-3 text-white/20 hover:text-white/40">
                {uploading === "pitch" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs font-light">{uploading === "pitch" ? "Uploading…" : "Upload your pitch or company video"}</span>
              </button>
            )}
            <input ref={pitchRef} type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handlePitch(e.target.files[0])} />
          </div>
        )}

        {/* ── Posts & Reels ── */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <p className="text-[10px] text-white/35 tracking-[0.2em] uppercase font-light mb-4">Posts & Reels</p>

          {postFile ? (
            <div className="mb-4 space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-white/[0.03] aspect-square max-w-[200px]">
                {postFile.type.startsWith("video/") ? <video src={URL.createObjectURL(postFile)} className="w-full h-full object-cover" /> : <img src={URL.createObjectURL(postFile)} alt="" className="w-full h-full object-cover" />}
                <button onClick={() => setPostFile(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center"><X className="w-3 h-3 text-white/70" /></button>
              </div>
              <input className="w-full rounded-xl px-4 py-2.5 text-sm font-light bg-white/[0.05] border border-white/[0.09] text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors" placeholder="Caption (optional)" value={postCaption} onChange={e => setPostCaption(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => setPostFile(null)} className="text-xs font-light px-4 py-1.5 rounded-full border border-white/10 text-white/30 hover:text-white/60 transition-colors">Cancel</button>
                <button onClick={handlePost} disabled={uploading === "post"} className="text-xs font-light px-5 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 transition-colors disabled:opacity-30">
                  {uploading === "post" ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => postRef.current?.click()} className="w-full rounded-xl border border-dashed border-white/[0.09] hover:border-white/20 transition-colors p-7 flex items-center justify-center gap-2 text-white/20 hover:text-white/40 mb-4">
              <Plus className="w-4 h-4" /><span className="text-xs font-light">Add photo or video</span>
            </button>
          )}
          <input ref={postRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setPostFile(e.target.files[0]); e.target.value = ""; }}} />

          {posts.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {posts.map(p => (
                <div key={p.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/[0.03]">
                  {p.media_type === "video" ? <video src={p.media_url} className="w-full h-full object-cover" /> : <img src={p.media_url} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    {p.caption && <span className="text-[11px] text-white/80 font-light text-center line-clamp-2">{p.caption}</span>}
                    <button onClick={() => deletePost(p.id)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><X className="w-3 h-3 text-white/70" /></button>
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
