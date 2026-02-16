
-- Create skills table
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  proficiency integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Public SELECT
CREATE POLICY "Anyone can view skills"
  ON public.skills FOR SELECT
  USING (true);

-- Admin INSERT
CREATE POLICY "Admins can insert skills"
  ON public.skills FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin UPDATE
CREATE POLICY "Admins can update skills"
  ON public.skills FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin DELETE
CREATE POLICY "Admins can delete skills"
  ON public.skills FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
