import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  username: string;
  role: "startup" | "investor" | "entrepreneur";
  name: string | null;
  avatar_url: string | null;
  short_bio: string | null;
  long_bio: string | null;
  portfolio_link: string | null;
  company_name: string | null;
  company_website: string | null;
  established_at: string | null;
  stage: string | null;
  location: string | null;
  pitch_video_url: string | null;
  check_size: string | null;
  investment_interests: string[] | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  /** Demo mode (no backend configured): in-memory only, nothing is saved. */
  demoMode: boolean;
  demoSignIn: (email: string, username: string, role: Profile["role"]) => void;
  demoUpdateProfile: (fields: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  demoMode: false,
  demoSignIn: () => {},
  demoUpdateProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && data) setProfile(data as Profile);
    else setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const demoMode = !supabaseConfigured;

  const demoSignIn = (email: string, username: string, role: Profile["role"]) => {
    const id = "demo-user";
    setUser({ id, email, user_metadata: { username, role } } as unknown as User);
    setProfile({
      id, username, role, name: null, avatar_url: null, short_bio: null, long_bio: null,
      portfolio_link: null, company_name: null, company_website: null, established_at: null,
      stage: null, location: null, pitch_video_url: null, check_size: null, investment_interests: null,
    });
  };

  const demoUpdateProfile = (fields: Partial<Profile>) =>
    setProfile((p) => (p ? { ...p, ...fields } : p));

  const signOut = async () => {
    if (!demoMode) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Retry a few times in case profile insert is still in flight
        const tryFetch = async (attempts = 3) => {
          const { data, error } = await (supabase as any)
            .from("profiles").select("*").eq("id", session.user.id).single();
          if (!error && data) { setProfile(data); }
          else if (attempts > 1) setTimeout(() => tryFetch(attempts - 1), 1000);
        };
        tryFetch();
      } else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile, demoMode, demoSignIn, demoUpdateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
