
-- Phase 1: New tables & schema changes

-- 1. Add avatar_url to profile
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Modify projects: add live_url, migrate image_url data later
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_url text;

-- Migrate demo_url data to live_url
UPDATE public.projects SET live_url = demo_url WHERE demo_url IS NOT NULL AND live_url IS NULL;

-- 3. Create experience table
CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL,
  date_range text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Admins can insert experience" ON public.experience FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update experience" ON public.experience FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete experience" ON public.experience FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 4. Create certificates table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  date text,
  proof_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins can insert certificates" ON public.certificates FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update certificates" ON public.certificates FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete certificates" ON public.certificates FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 5. Create contact_methods table
CREATE TABLE public.contact_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order int DEFAULT 0
);

ALTER TABLE public.contact_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contact_methods" ON public.contact_methods FOR SELECT USING (true);
CREATE POLICY "Admins can insert contact_methods" ON public.contact_methods FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact_methods" ON public.contact_methods FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact_methods" ON public.contact_methods FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 6. Create project_media table
CREATE TABLE public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0
);

ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project_media" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admins can insert project_media" ON public.project_media FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project_media" ON public.project_media FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project_media" ON public.project_media FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 7. Migrate existing image_url to project_media
INSERT INTO public.project_media (project_id, type, url, sort_order)
SELECT id, 'image', image_url, 0 FROM public.projects WHERE image_url IS NOT NULL;

-- 8. Drop old columns
ALTER TABLE public.projects DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.projects DROP COLUMN IF EXISTS demo_url;

-- 9. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-docs', 'cv-docs', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-media', 'project-media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('cert-proofs', 'cert-proofs', true) ON CONFLICT (id) DO NOTHING;

-- 10. Storage policies
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Admin upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Public read cv-docs" ON storage.objects FOR SELECT USING (bucket_id = 'cv-docs');
CREATE POLICY "Admin upload cv-docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv-docs' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete cv-docs" ON storage.objects FOR DELETE USING (bucket_id = 'cv-docs' AND auth.role() = 'authenticated');

CREATE POLICY "Public read project-media" ON storage.objects FOR SELECT USING (bucket_id = 'project-media');
CREATE POLICY "Admin upload project-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete project-media" ON storage.objects FOR DELETE USING (bucket_id = 'project-media' AND auth.role() = 'authenticated');

CREATE POLICY "Public read cert-proofs" ON storage.objects FOR SELECT USING (bucket_id = 'cert-proofs');
CREATE POLICY "Admin upload cert-proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cert-proofs' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete cert-proofs" ON storage.objects FOR DELETE USING (bucket_id = 'cert-proofs' AND auth.role() = 'authenticated');
