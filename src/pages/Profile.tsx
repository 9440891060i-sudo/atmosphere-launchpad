import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import atmosphereLogo from "@/assets/atmosphere-logo.png";
import { Upload, X, Plus, Loader2, Check, Camera } from "lucide-react";

const INVESTMENT_INTERESTS = ["AI", "Drones", "Manufacturing", "FinTech", "HealthTech", "EdTech", "CleanTech", "Web3", "SaaS", "Consumer", "Deep Tech", "Other"];
const STAGES = ["Idea", "Prototype", "MVP", "Early Traction", "Scaling"];
const CHECK_SIZES = ["Under $10k", "$10k–$50k", "$50k–$250k", "$250k–$1M", "$1M+"];

const inp = "w-full rounded-xl px-4 py-3 text-sm font-light bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-white/20 transition-colors";
const lbl = "text-[11px] text-muted-foreground/60 font-light tracking-wide uppercase mb-2 block";
const card = "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-5";
const cardTitle = "text-xs text-muted-foreground/50 font-light tracking-[0.2em] uppercase";

interface Post { id: string; media_url: string; media_type: "image" | "video"; caption: string | null; created_at: string; }

const SaveBtn = ({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) => (
  <button onClick={onClick} disabled={saving} className="flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-light transition-all disabled:opacity-40 border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground">
    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : saved ? <Check className="w-3 h-3 text-green-400/70" /> : null}
    {saving ? "Saving…" : saved ? "Saved" : "Save"}
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const avatarRef = useRef<HTMLInputElement>(null);
  const postRef = useRef<HTMLInputElement>(null);
  const pitchRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [longBio, setLongBio] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [establishedAt, setEstablishedAt] = useState("");
  const [stage, setStage] = useState("");
  const [location, setLocation] = useState("");
  const [checkSize, setCheckSize] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pitchVideoUrl, setPitchVideoUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [newPostCaption, setNewPostCaption] = useState("");

  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [uploadingPitch, setUploadingPitch] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/"); }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setShortBio(profile.short_bio || "");
      setLongBio(profile.long_bio || "");
      setPortfolioLink(profile.portfolio_link || "");
      setCompanyName(profile.company_name || "");
      setCompanyWebsite(profile.company_website || "");
      setEstablishedAt(profile.established_at || "");
      setStage(profile.stage || "");
      setLocation(profile.location || "");
      setCheckSize(profile.check_size || "");
      setInterests(profile.investment_interests || []);
      setAvatarUrl(profile.avatar_url || null);
      setPitchVideoUrl(profile.pitch_video_url || null);
    }
  }, [profile]);

  useEffect(() => { if (user) fetchPosts(); }, [user]);

  const fetchPosts = async () => {
    const { data } = await (supabase as any).from("posts").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const flash = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  const save = async (section: string, data: Record<string, any>) => {
    setSaving(section);
    await (supabase as any).from("profiles").update({ ...data, updated_at: new Date().toISOString() }).eq("id", user!.id);
    setSaving(null);
    flash(section);
    refreshProfile();
  };

  const uploadAvatar = async (file: File) => {
    setUploadingAvatar(true);
    const path = `${user!.id}/avatar.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) {
      const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      setAvatarUrl(url);
      await (supabase as any).from("profiles").update({ avatar_url: url }).eq("id", user!.id);
      refreshProfile();
    }
    setUploadingAvatar(false);
  };

  const uploadPost = async () => {
    if (!newPostFile) return;
    setUploadingPost(true);
    const isVideo = newPostFile.type.startsWith("video/");
    const path = `${user!.id}/${Date.now()}.${newPostFile.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("posts").upload(path, newPostFile);
    if (!error) {
      const url = supabase.storage.from("posts").getPublicUrl(path).data.publicUrl;
      await (supabase as any).from("posts").insert([{ user_id: user!.id, media_url: url, media_type: isVideo ? "video" : "image", caption: newPostCaption }]);
      setNewPostFile(null); setNewPostCaption(""); fetchPosts();
    }
    setUploadingPost(false);
  };

  const uploadPitch = async (file: File) => {
    setUploadingPitch(true);
    const path = `${user!.id}/pitch.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("pitch-videos").upload(path, file, { upsert: true });
    if (!error) {
      const url = supabase.storage.from("pitch-videos").getPublicUrl(path).data.publicUrl;
      setPitchVideoUrl(url);
      await (supabase as any).from("profiles").update({ pitch_video_url: url }).eq("id", user!.id);
      refreshProfile();
    }
    setUploadingPitch(false);
  };

  const deletePost = async (id: string) => {
    await (supabase as any).from("posts").delete().eq("id", id);
    setPosts(p => p.filter(x => x.id !== id));
  };

  const roleName = { startup: "Startup", investor: "Investor", entrepreneur: "Entrepreneur" }[profile?.role || "entrepreneur"];
  const initials = (name || profile?.username || "?").charAt(0).toUpperCase();

  // ── Loading states ──────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
    </div>
  );
  if (!user) return null;
  if (!profile) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
      <p className="text-xs text-muted-foreground/60 font-light">Setting up your profile…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <img src={atmosphereLogo} alt="Atmosphere" className="h-7 w-auto opacity-80" />
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground/50 font-light hidden sm:block">@{profile.username}</span>
            <button onClick={signOut} className="text-xs text-muted-foreground/50 hover:text-muted-foreground font-light transition-colors">Sign out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-24 pb-24 space-y-4">

        {/* ── Profile Header ── */}
        <div className={card}>
          <div className="flex items-start justify-between mb-1">
            <p className={cardTitle}>Profile</p>
            <SaveBtn onClick={() => save("header", { name, short_bio: shortBio })} saving={saving === "header"} saved={saved === "header"} />
          </div>

          <div className="flex items-center gap-5">
            {/* Avatar */}
            <button onClick={() => avatarRef.current?.click()} className="relative flex-shrink-0 w-20 h-20 rounded-full border border-white/10 hover:border-white/20 overflow-hidden flex items-center justify-center bg-white/[0.03] transition-colors group">
              {uploadingAvatar ? (
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : avatarUrl ? (
                <>
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl font-extralight text-muted-foreground/60 group-hover:opacity-0 transition-opacity">{initials}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                  </div>
                </>
              )}
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />

            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground/40 font-light">@{profile.username}</p>
              <span className="inline-block text-[10px] border border-white/10 rounded-full px-2.5 py-0.5 text-muted-foreground/50 font-light tracking-wide">{roleName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={lbl}>Display name</label>
              <input className={inp} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Short bio <span className="normal-case tracking-normal opacity-50">{shortBio.length}/160</span></label>
              <input className={inp} placeholder="A one-liner about you" maxLength={160} value={shortBio} onChange={e => setShortBio(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── About ── */}
        <div className={card}>
          <div className="flex items-start justify-between mb-1">
            <p className={cardTitle}>About</p>
            <SaveBtn onClick={() => save("about", { long_bio: longBio, portfolio_link: portfolioLink })} saving={saving === "about"} saved={saved === "about"} />
          </div>
          <div>
            <label className={lbl}>Bio</label>
            <textarea className={inp + " min-h-[100px] resize-none"} placeholder="Tell your story — what you're building, what drives you…" value={longBio} onChange={e => setLongBio(e.target.value)} />
          </div>
          {(profile.role === "investor" || profile.role === "entrepreneur") && (
            <div>
              <label className={lbl}>Portfolio link</label>
              <input className={inp} placeholder="https://your-portfolio.com" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} />
            </div>
          )}
        </div>

        {/* ── Startup: Company Details ── */}
        {profile.role === "startup" && (
          <div className={card}>
            <div className="flex items-start justify-between mb-1">
              <p className={cardTitle}>Company Details</p>
              <SaveBtn onClick={() => save("company", { company_name: companyName, company_website: companyWebsite, established_at: establishedAt, stage, location })} saving={saving === "company"} saved={saved === "company"} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Company name</label>
                <input className={inp} placeholder="Acme Inc." value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Website</label>
                <input className={inp} placeholder="https://yourcompany.com" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Year established</label>
                <input className={inp} placeholder="2024" maxLength={4} value={establishedAt} onChange={e => setEstablishedAt(e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Location</label>
                <input className={inp} placeholder="San Francisco, CA" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={lbl}>Stage</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {STAGES.map(s => (
                  <button key={s} onClick={() => setStage(s)} className={`rounded-full px-4 py-1.5 text-xs font-light border transition-all ${stage === s ? "border-white/20 bg-white/[0.06] text-foreground" : "border-white/[0.06] text-muted-foreground/50 hover:border-white/10 hover:text-muted-foreground"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Investor Details ── */}
        {profile.role === "investor" && (
          <div className={card}>
            <div className="flex items-start justify-between mb-1">
              <p className={cardTitle}>Investor Details</p>
              <SaveBtn onClick={() => save("investor", { check_size: checkSize, investment_interests: interests })} saving={saving === "investor"} saved={saved === "investor"} />
            </div>
            <div>
              <label className={lbl}>Typical check size</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {CHECK_SIZES.map(s => (
                  <button key={s} onClick={() => setCheckSize(s)} className={`rounded-full px-4 py-1.5 text-xs font-light border transition-all ${checkSize === s ? "border-white/20 bg-white/[0.06] text-foreground" : "border-white/[0.06] text-muted-foreground/50 hover:border-white/10 hover:text-muted-foreground"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className={lbl}>Investment interests</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {INVESTMENT_INTERESTS.map(i => (
                  <button key={i} onClick={() => setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} className={`rounded-full px-3 py-1.5 text-xs font-light border transition-all ${interests.includes(i) ? "border-white/20 bg-white/[0.06] text-foreground" : "border-white/[0.06] text-muted-foreground/50 hover:border-white/10 hover:text-muted-foreground"}`}>{i}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Pitch Video (startup only) ── */}
        {profile.role === "startup" && (
          <div className={card}>
            <p className={cardTitle + " mb-4"}>Pitch Video</p>
            {pitchVideoUrl ? (
              <div className="space-y-3">
                <video src={pitchVideoUrl} controls className="w-full rounded-xl max-h-[260px]" />
                <button onClick={() => pitchRef.current?.click()} className="text-xs text-muted-foreground/40 hover:text-muted-foreground font-light transition-colors">Replace video</button>
              </div>
            ) : (
              <button onClick={() => pitchRef.current?.click()} className="w-full rounded-xl border border-dashed border-white/[0.08] hover:border-white/[0.15] transition-colors p-10 flex flex-col items-center gap-3 text-muted-foreground/30 hover:text-muted-foreground/60">
                {uploadingPitch ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs font-light">{uploadingPitch ? "Uploading…" : "Upload your pitch video"}</span>
              </button>
            )}
            <input ref={pitchRef} type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && uploadPitch(e.target.files[0])} />
          </div>
        )}

        {/* ── Posts & Reels ── */}
        <div className={card}>
          <p className={cardTitle + " mb-4"}>Posts & Reels</p>

          {newPostFile ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-white/[0.03] aspect-square max-w-[260px]">
                {newPostFile.type.startsWith("video/")
                  ? <video src={URL.createObjectURL(newPostFile)} className="w-full h-full object-cover" />
                  : <img src={URL.createObjectURL(newPostFile)} alt="" className="w-full h-full object-cover" />}
                <button onClick={() => setNewPostFile(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <input className={inp} placeholder="Add a caption…" value={newPostCaption} onChange={e => setNewPostCaption(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => setNewPostFile(null)} className="rounded-full px-4 py-2 text-xs font-light border border-white/[0.06] text-muted-foreground/50 hover:text-muted-foreground transition-colors">Cancel</button>
                <button onClick={uploadPost} disabled={uploadingPost} className="rounded-full px-5 py-2 text-xs font-light border border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                  {uploadingPost ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => postRef.current?.click()} className="w-full rounded-xl border border-dashed border-white/[0.08] hover:border-white/[0.15] transition-colors p-8 flex items-center justify-center gap-2 text-muted-foreground/30 hover:text-muted-foreground/60">
              <Plus className="w-4 h-4" />
              <span className="text-xs font-light">Add photo or video</span>
            </button>
          )}
          <input ref={postRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setNewPostFile(e.target.files[0]); e.target.value = ""; }}} />

          {posts.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {posts.map(post => (
                <div key={post.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/[0.03]">
                  {post.media_type === "video"
                    ? <video src={post.media_url} className="w-full h-full object-cover" />
                    : <img src={post.media_url} alt={post.caption || ""} className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    {post.caption && <p className="text-[11px] text-white/80 font-light text-center line-clamp-2">{post.caption}</p>}
                    <button onClick={() => deletePost(post.id)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <X className="w-3 h-3 text-white/70" />
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
};

export default Profile;
