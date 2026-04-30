-- Add INSERT policy so the row can be seeded
CREATE POLICY "Anyone can insert stats"
ON public.platform_stats
FOR INSERT
WITH CHECK (true);

-- Seed the row if it doesn't exist
INSERT INTO public.platform_stats (id, applicants, early_users, countries)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
