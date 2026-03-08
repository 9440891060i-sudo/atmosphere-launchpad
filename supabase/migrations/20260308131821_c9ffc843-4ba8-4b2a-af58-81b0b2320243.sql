DROP POLICY "Authenticated users can read applications" ON public.applications;

CREATE POLICY "Anyone can read applications"
ON public.applications
FOR SELECT
USING (true);