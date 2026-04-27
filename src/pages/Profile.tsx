import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import atmosphereLogo from "@/assets/atmosphere-logo.png";
import { Upload, X, Plus, Loader2 } from "lucide-react";

const INVESTMENT_INTERESTS = ["AI", "Drones", "Manufacturing", "FinTech", "HealthTech", "EdTech", "CleanTech", "Web3", "SaaS", "Consumer", "Deep Tech", "Other"];
const STAGES = ["Idea", "Prototype", "MVP", "Early Traction", "Scaling"];
const CHECK_SIZES = ["Under $10k", "$10k–$50k", "$50k–$250k", "$250k–$1M", "$1M+"];

const inputClass = "glass-input w-full rounded-xl px-4 py-3 text-sm font-light";
const labelClass = "text-xs text-muted-foreground font-light mb-2 block";
const sectionClass = "gradient-border rounded-2xl p-6 sm:p-8 space-y-5";
const sectionTitleClass = "text-xs text-muted-foreground font-light tracking-[0.2em] uppercase mb-5";

interface Post {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  caption: string | null;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const postInputRef = useRef<HTMLInputElement>(null);
  const pitchInputRef = useRef<HTMLInputElement>(null);

  // Profile fields state
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
  const [investmentInterests, setInvestmentInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pitchVideoUrl, setPitchVideoUrl] = useState<string | null>(null);

  // Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [newPostCaption, setNewPostCaption] = useState("");

  // Loading states
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [uploadingPitch, setUploadingPitch] = useState(false);
  const [feedback, setFeedback] = useState<{ section: string; msg: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

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
      setInvestmentInterests(profile.investment_interests || []);
      setAvatarUrl(profile.avatar_url || null);
      setPitchVideoUrl(profile.pitch_video_url || null);
    }
  }, [profile]);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    const { data } = await (supabase as any).from("posts").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (data) setPosts(data as Post[]);
  };

  const showFeedback = (section: string, msg: string) => {
    setFeedback({ section, msg });
    setTimeout(() => setFeedback(null), 2500);
  };

  const saveSection = async (section: string, data: Record<string, any>) => {
    setSaving(section);
    const { error } = await (supabase as any).from("profiles").update({ ...data, updated_at: new Date().toISOString() }).eq("id", user!.id);
    setSaving(null);
    if (!error) { showFeedback(section, "Saved"); refreshProfile(); }
    else showFeedback(section, "Failed to save");
  };

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) {
      const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      setAvatarUrl(url);
      await (supabase as any).from("profiles").update({ avatar_url: url }).eq("id", user!.id);
      refreshProfile();
    }
    setUploadingAvatar(false);
  };

  const handlePostUpload = async () => {
    if (!newPostFile) return;
    setUploadingPost(true);
    const ext = newPostFile.name.split(".").pop();
    const path = `${user!.id}/${Date.now()}.${ext}`;
    const isVideo = newPostFile.type.startsWith("video/");
    const { error } = await supabase.storage.from("posts").upload(path, newPostFile);
    if (!error) {
      const url = supabase.storage.from("posts").getPublicUrl(path).data.publicUrl;
      await (supabase as any).from("posts").insert([{ user_id: user!.id, media_url: url, media_type: isVideo ? "video" : "image", caption: newPostCaption }]);
      setNewPostFile(null); setNewPostCaption("");
      fetchPosts();
    }
    setUploadingPost(false);
  };

  const handlePitchUpload = async (file: File) => {
    setUploadingPitch(true);
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/pitch.${ext}`;
    const { error } = await supabase.storage.from("pitch-videos").upload(path, file, { upsert: true });
    if (!error) {
      const url = supabase.storage.from("pitch-videos").getPublicUrl(path).data.publicUrl;
      setPitchVideoUrl(url);
      await (supabase as any).from("profiles").update({ pitch_video_url: url }).eq("id", user!.id);
      refreshProfile();
    }
    setUploadingPitch(false);
  };

  const deletePost = async (postId: string) => {
    await (supabase as any).from("posts").delete().eq("id", postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const toggleInterest = (interest: string) => {
    setInvestmentInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const initials = (name || profile?.username || "?").charAt(0).toUpperCase();
  const roleBadge = { startup: "Startup", investor: "Investor", entrepreneur: "Entrepreneur" }[profile?.role || "startup"];

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
    </div>
  );

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-background noise-overlay">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-14 sm:h-16 flex items-center justify-between">
          <img src={atmosphereLogo} alt="Atmosphere" className="h-8 sm:h-10 w-auto opacity-90" />
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-light hidden sm:block">@{profile.username}</span>
            <button onClick={signOut} className="glass-button rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-light text-foreground tracking-wide hover:scale-[1.03] active:scale-[0.98] transition-transform">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-28 sm:pt-32 pb-24 space-y-6">

        {/* Profile Header */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>Profile</p>
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full glass border border-border/40 flex items-center justify-center overflow-hidden hover:border-muted-foreground/30 transition-colors group"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-extralight text-muted-foreground group-hover:text-foreground transition-colors">{initials}</span>
                )}
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className={labelClass}>Display name</label>
                <input className={inputClass} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/50 font-light">@{profile.username}</span>
                <span className="glass rounded-full px-2.5 py-0.5 text-[10px] text-muted-foreground font-light tracking-wide">{roleBadge}</span>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>Short bio <span className="text-muted-foreground/30">{shortBio.length}/160</span></label>
            <textarea
              className={inputClass + " min-h-[70px] resize-none"}
              placeholder="A short line about you…"
              maxLength={160}
              value={shortBio}
              onChange={e => setShortBio(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            {feedback?.section === "header" && <span className="text-xs text-muted-foreground/60 font-light">{feedback.msg}</span>}
            <div />
            <button onClick={() => saveSection("header", { name, short_bio: shortBio })} disabled={saving === "header"} className="glass-button rounded-full px-5 py-2 text-xs font-light text-foreground disabled:opacity-30">
              {saving === "header" ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* About */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>About</p>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea className={inputClass + " min-h-[100px] resize-none"} placeholder="Tell your story…" value={longBio} onChange={e => setLongBio(e.target.value)} />
          </div>
          {(profile.role === "investor" || profile.role === "entrepreneur") && (
            <div>
              <label className={labelClass}>Portfolio link</label>
              <input className={inputClass} placeholder="https://…" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} />
            </div>
          )}
          <div className="flex items-center justify-between">
            {feedback?.section === "about" && <span className="text-xs text-muted-foreground/60 font-light">{feedback.msg}</span>}
            <div />
            <button onClick={() => saveSection("about", { long_bio: longBio, portfolio_link: portfolioLink })} disabled={saving === "about"} className="glass-button rounded-full px-5 py-2 text-xs font-light text-foreground disabled:opacity-30">
              {saving === "about" ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Startup Details */}
        {profile.role === "startup" && (
          <div className={sectionClass}>
            <p className={sectionTitleClass}>Company Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company name</label>
                <input className={inputClass} placeholder="Acme Inc." value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input className={inputClass} placeholder="https://…" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Established year</label>
                <input className={inputClass} placeholder="2024" maxLength={4} value={establishedAt} onChange={e => setEstablishedAt(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input className={inputClass} placeholder="San Francisco, CA" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Stage</label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map(s => (
                  <button key={s} onClick={() => setStage(s)}
                    className={`rounded-full px-4 py-1.5 text-xs font-light transition-all duration-200 ${stage === s ? "bg-foreground/10 border border-foreground/20 text-foreground" : "glass-input text-muted-foreground hover:border-foreground/15"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              {feedback?.section === "company" && <span className="text-xs text-muted-foreground/60 font-light">{feedback.msg}</span>}
              <div />
              <button onClick={() => saveSection("company", { company_name: companyName, company_website: companyWebsite, established_at: establishedAt, stage, location })} disabled={saving === "company"} className="glass-button rounded-full px-5 py-2 text-xs font-light text-foreground disabled:opacity-30">
                {saving === "company" ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Investor Details */}
        {profile.role === "investor" && (
          <div className={sectionClass}>
            <p className={sectionTitleClass}>Investor Details</p>
            <div>
              <label className={labelClass}>Typical check size</label>
              <div className="flex flex-wrap gap-2">
                {CHECK_SIZES.map(s => (
                  <button key={s} onClick={() => setCheckSize(s)}
                    className={`rounded-full px-4 py-1.5 text-xs font-light transition-all duration-200 ${checkSize === s ? "bg-foreground/10 border border-foreground/20 text-foreground" : "glass-input text-muted-foreground hover:border-foreground/15"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Investment interests</label>
              <div className="flex flex-wrap gap-2">
                {INVESTMENT_INTERESTS.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-3 py-1.5 text-xs font-light transition-all duration-200 ${investmentInterests.includes(interest) ? "bg-foreground/10 border border-foreground/20 text-foreground" : "glass-input text-muted-foreground hover:border-foreground/15"}`}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              {feedback?.section === "investor" && <span className="text-xs text-muted-foreground/60 font-light">{feedback.msg}</span>}
              <div />
              <button onClick={() => saveSection("investor", { check_size: checkSize, investment_interests: investmentInterests })} disabled={saving === "investor"} className="glass-button rounded-full px-5 py-2 text-xs font-light text-foreground disabled:opacity-30">
                {saving === "investor" ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Pitch Video (startup only) */}
        {profile.role === "startup" && (
          <div className={sectionClass}>
            <p className={sectionTitleClass}>Pitch Video</p>
            {pitchVideoUrl ? (
              <div className="space-y-3">
                <video src={pitchVideoUrl} controls className="w-full rounded-xl" style={{ maxHeight: "280px" }} />
                <button onClick={() => pitchInputRef.current?.click()} className="text-xs text-muted-foreground/50 hover:text-muted-foreground font-light transition-colors">
                  Replace video
                </button>
              </div>
            ) : (
              <button
                onClick={() => pitchInputRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-border/40 hover:border-muted-foreground/30 transition-colors p-10 flex flex-col items-center gap-3 text-muted-foreground/50 hover:text-muted-foreground"
              >
                {uploadingPitch ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs font-light">{uploadingPitch ? "Uploading…" : "Upload pitch video"}</span>
              </button>
            )}
            <input ref={pitchInputRef} type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handlePitchUpload(e.target.files[0])} />
          </div>
        )}

        {/* Posts & Reels */}
        <div className={sectionClass}>
          <p className={sectionTitleClass}>Posts & Reels</p>

          {/* Upload area */}
          {newPostFile ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-secondary/30 aspect-square flex items-center justify-center max-w-xs">
                {newPostFile.type.startsWith("video/") ? (
                  <video src={URL.createObjectURL(newPostFile)} className="w-full h-full object-cover" />
                ) : (
                  <img src={URL.createObjectURL(newPostFile)} alt="preview" className="w-full h-full object-cover" />
                )}
                <button onClick={() => setNewPostFile(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input className={inputClass} placeholder="Add a caption…" value={newPostCaption} onChange={e => setNewPostCaption(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => setNewPostFile(null)} className="glass-button rounded-full px-4 py-2 text-xs font-light text-muted-foreground">Cancel</button>
                <button onClick={handlePostUpload} disabled={uploadingPost} className="glass-button rounded-full px-5 py-2 text-xs font-light text-foreground disabled:opacity-30">
                  {uploadingPost ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => postInputRef.current?.click()}
              className="w-full rounded-xl border border-dashed border-border/40 hover:border-muted-foreground/30 transition-colors p-8 flex items-center justify-center gap-2 text-muted-foreground/50 hover:text-muted-foreground"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-light">Add photo or video</span>
            </button>
          )}
          <input ref={postInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setNewPostFile(e.target.files[0]); e.target.value = ""; } }} />

          {/* Posts grid */}
          {posts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {posts.map(post => (
                <div key={post.id} className="relative group aspect-square rounded-xl overflow-hidden bg-secondary/20">
                  {post.media_type === "video" ? (
                    <video src={post.media_url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={post.media_url} alt={post.caption || ""} className="w-full h-full object-cover" />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2">
                    {post.caption && <p className="text-xs text-foreground font-light text-center line-clamp-3">{post.caption}</p>}
                    <button onClick={() => deletePost(post.id)} className="w-7 h-7 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground mt-1">
                      <X className="w-3.5 h-3.5" />
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
