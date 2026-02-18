-- Add missing tables: contact_methods and project_media
-- This migration is safe to run multiple times

-- Create contact_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.contact_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order int DEFAULT 0
);

-- Enable RLS on contact_methods
ALTER TABLE public.contact_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Anyone can view contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Admins can insert contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Admins can update contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Admins can delete contact_methods" ON public.contact_methods;

CREATE POLICY "Anyone can view contact_methods" ON public.contact_methods FOR SELECT USING (true);
CREATE POLICY "Admins can insert contact_methods" ON public.contact_methods FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact_methods" ON public.contact_methods FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact_methods" ON public.contact_methods FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create project_media table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0
);

-- Enable RLS on project_media
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Anyone can view project_media" ON public.project_media;
DROP POLICY IF EXISTS "Admins can insert project_media" ON public.project_media;
DROP POLICY IF EXISTS "Admins can update project_media" ON public.project_media;
DROP POLICY IF EXISTS "Admins can delete project_media" ON public.project_media;

CREATE POLICY "Anyone can view project_media" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admins can insert project_media" ON public.project_media FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project_media" ON public.project_media FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project_media" ON public.project_media FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON public.project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_contact_methods_sort_order ON public.contact_methods(sort_order);

-- Migrate existing image_url to project_media if projects.image_url column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'image_url'
  ) THEN
    -- Only insert if project_media is empty to avoid duplicates
    INSERT INTO public.project_media (project_id, type, url, sort_order)
    SELECT id, 'image', image_url, 0 
    FROM public.projects 
    WHERE image_url IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.project_media WHERE project_id = projects.id);
  END IF;
END $$;

-- Add some default contact methods if table is empty
INSERT INTO public.contact_methods (platform, url, icon, sort_order)
SELECT 'Email', 'mailto:contact@example.com', 'mail', 1
WHERE NOT EXISTS (SELECT 1 FROM public.contact_methods)
ON CONFLICT DO NOTHING;
