-- Create a single-row table for platform stats
CREATE TABLE public.platform_stats (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  applicants INTEGER NOT NULL DEFAULT 2400,
  early_users INTEGER NOT NULL DEFAULT 580,
  countries INTEGER NOT NULL DEFAULT 12,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO public.platform_stats (id, applicants, early_users, countries)
VALUES (1, 2400, 580, 12);

-- Enable RLS
ALTER TABLE public.platform_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can read stats
CREATE POLICY "Anyone can read stats"
ON public.platform_stats
FOR SELECT
USING (true);

-- Anyone can update stats (admin uses passcode client-side, and applicant increment is public)
CREATE POLICY "Anyone can update stats"
ON public.platform_stats
FOR UPDATE
USING (true)
WITH CHECK (true);