CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public application form)
CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users to read (for admin)
CREATE POLICY "Authenticated users can read applications"
ON public.applications
FOR SELECT
TO authenticated
USING (true);