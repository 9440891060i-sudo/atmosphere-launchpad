-- ============================================================
-- SECURITY HARDENING — Run this in Supabase SQL Editor
-- startatmosphere.com | Project: qdpodfowuutipyomoffi
-- ============================================================

-- ── 1. CREATE otp_codes TABLE ─────────────────────────────────
-- Stores hashed OTPs server-side. Plaintext code never stored.
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  code_hash   text NOT NULL,   -- SHA-256 hash of the 6-digit code
  expires_at  timestamptz NOT NULL,
  used        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-clean expired/used records (optional, reduces table bloat)
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON public.otp_codes (email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON public.otp_codes (expires_at);

-- ── 2. RLS ON otp_codes ───────────────────────────────────────
-- NO anon access. Only the service role (edge functions) can read/write.
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;
-- No policies = no access for anon or authenticated users. Service role bypasses RLS.

-- ── 3. RLS ON applications TABLE ─────────────────────────────
-- Users can insert their own application, but CANNOT read others' data.
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon insert" ON public.applications;
CREATE POLICY "Allow anon insert"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only the owner can read their own application (if they're authenticated)
DROP POLICY IF EXISTS "Owner can read own application" ON public.applications;
CREATE POLICY "Owner can read own application"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (false); -- Block direct reads; admin uses service role via edge functions

-- Block all anon reads on applications
DROP POLICY IF EXISTS "No anon select" ON public.applications;

-- ── 4. RLS ON profiles TABLE ─────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert profile" ON public.profiles;
CREATE POLICY "Allow profile insert on signup"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ── 5. RLS ON platform_stats TABLE ───────────────────────────
ALTER TABLE public.platform_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read stats" ON public.platform_stats;
CREATE POLICY "Anyone can read stats"
  ON public.platform_stats
  FOR SELECT
  USING (true);

-- Only service role can update stats (no anon/user writes)
DROP POLICY IF EXISTS "No direct writes to stats" ON public.platform_stats;

-- ── 6. CLEANUP: auto-delete expired OTPs older than 1 hour ───
-- Run this periodically or set up a pg_cron job:
-- DELETE FROM public.otp_codes WHERE expires_at < now() - interval '1 hour';

-- ============================================================
-- AFTER RUNNING THIS:
-- 1. Go to Supabase Dashboard → Settings → API
--    → Rotate the anon key (it was exposed in the public JS bundle)
--    → Update VITE_SUPABASE_ANON_KEY in Vercel environment variables
-- 2. Deploy updated edge functions:
--    supabase functions deploy send-otp
--    supabase functions deploy verify-otp
-- 3. Add VITE_ADMIN_EMAILS=youremail@example.com to Vercel env vars
--    (comma-separated for multiple admins)
-- 4. Redeploy the frontend on Vercel
-- ============================================================
