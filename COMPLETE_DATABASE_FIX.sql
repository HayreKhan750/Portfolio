-- ========================================
-- COMPLETE DATABASE FIX FOR PORTFOLIO APP
-- ========================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This is based on the working Hayredin repo schema
-- ========================================

-- STEP 1: Create role enum and user_roles table (if not exists)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role::app_role
  )
$$;

-- STEP 2: Create projects table (if not exists)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create profile table (if not exists)
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT 'Hayredin Mohammed',
  headline TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  resume_url TEXT,
  avatar_url TEXT
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create messages table (if not exists)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create experience table (if not exists)
CREATE TABLE IF NOT EXISTS public.experience (
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

-- STEP 6: Create certificates table (if not exists)
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  date text,
  proof_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create skills table (if not exists)
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  proficiency integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- STEP 8: Create contact_methods table (if not exists)
CREATE TABLE IF NOT EXISTS public.contact_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order int DEFAULT 0
);

ALTER TABLE public.contact_methods ENABLE ROW LEVEL SECURITY;

-- STEP 9: Create project_media table (if not exists)
CREATE TABLE IF NOT EXISTS public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0
);

ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- STEP 10: Create social_links table (if not exists)
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DROP ALL EXISTING POLICIES (Clean slate)
-- ========================================

-- Projects policies
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

-- Profile policies
DROP POLICY IF EXISTS "Anyone can view profile" ON public.profile;
DROP POLICY IF EXISTS "Admins can insert profile" ON public.profile;
DROP POLICY IF EXISTS "Admins can update profile" ON public.profile;
DROP POLICY IF EXISTS "Admins can delete profile" ON public.profile;

-- Messages policies
DROP POLICY IF EXISTS "Anyone can send messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.messages;

-- Experience policies
DROP POLICY IF EXISTS "Anyone can view experience" ON public.experience;
DROP POLICY IF EXISTS "Admins can insert experience" ON public.experience;
DROP POLICY IF EXISTS "Admins can update experience" ON public.experience;
DROP POLICY IF EXISTS "Admins can delete experience" ON public.experience;

-- Certificates policies
DROP POLICY IF EXISTS "Anyone can view certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can insert certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can update certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can delete certificates" ON public.certificates;

-- Skills policies
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
DROP POLICY IF EXISTS "Admins can insert skills" ON public.skills;
DROP POLICY IF EXISTS "Admins can update skills" ON public.skills;
DROP POLICY IF EXISTS "Admins can delete skills" ON public.skills;

-- Contact methods policies
DROP POLICY IF EXISTS "Anyone can view contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Admins can insert contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Admins can update contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Admins can delete contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Authenticated users can insert contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Authenticated users can update contact_methods" ON public.contact_methods;
DROP POLICY IF EXISTS "Authenticated users can delete contact_methods" ON public.contact_methods;

-- Project media policies
DROP POLICY IF EXISTS "Anyone can view project_media" ON public.project_media;
DROP POLICY IF EXISTS "Admins can insert project_media" ON public.project_media;
DROP POLICY IF EXISTS "Admins can update project_media" ON public.project_media;
DROP POLICY IF EXISTS "Admins can delete project_media" ON public.project_media;
DROP POLICY IF EXISTS "Authenticated users can insert project_media" ON public.project_media;
DROP POLICY IF EXISTS "Authenticated users can update project_media" ON public.project_media;
DROP POLICY IF EXISTS "Authenticated users can delete project_media" ON public.project_media;

-- Social links policies
DROP POLICY IF EXISTS "Anyone can view social_links" ON public.social_links;
DROP POLICY IF EXISTS "Admins can insert social_links" ON public.social_links;
DROP POLICY IF EXISTS "Admins can update social_links" ON public.social_links;
DROP POLICY IF EXISTS "Admins can delete social_links" ON public.social_links;

-- User roles policies
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;

-- ========================================
-- CREATE ALL POLICIES (Fresh)
-- ========================================

-- Projects: public read, admin write
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Profile: public read, admin write
CREATE POLICY "Anyone can view profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Admins can insert profile" ON public.profile FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update profile" ON public.profile FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete profile" ON public.profile FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Messages: public insert, admin read
CREATE POLICY "Anyone can send messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete messages" ON public.messages FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Experience: public read, admin write
CREATE POLICY "Anyone can view experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Admins can insert experience" ON public.experience FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update experience" ON public.experience FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete experience" ON public.experience FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Certificates: public read, admin write
CREATE POLICY "Anyone can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins can insert certificates" ON public.certificates FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update certificates" ON public.certificates FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete certificates" ON public.certificates FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Skills: public read, admin write
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins can insert skills" ON public.skills FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update skills" ON public.skills FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete skills" ON public.skills FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Contact methods: public read, admin write
CREATE POLICY "Anyone can view contact_methods" ON public.contact_methods FOR SELECT USING (true);
CREATE POLICY "Admins can insert contact_methods" ON public.contact_methods FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact_methods" ON public.contact_methods FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact_methods" ON public.contact_methods FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Project media: public read, admin write
CREATE POLICY "Anyone can view project_media" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admins can insert project_media" ON public.project_media FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project_media" ON public.project_media FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project_media" ON public.project_media FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Social links: public read, admin write
CREATE POLICY "Anyone can view social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins can insert social_links" ON public.social_links FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update social_links" ON public.social_links FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete social_links" ON public.social_links FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins can view
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- CREATE STORAGE BUCKETS
-- ========================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-media', 'project-media', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('cv-docs', 'cv-docs', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('cert-proofs', 'cert-proofs', true) 
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- DROP OLD STORAGE POLICIES
-- ========================================

DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;

DROP POLICY IF EXISTS "Public read project-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload project-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete project-media" ON storage.objects;

DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete avatars" ON storage.objects;

DROP POLICY IF EXISTS "Public read cv-docs" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload cv-docs" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete cv-docs" ON storage.objects;

DROP POLICY IF EXISTS "Public read cert-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload cert-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete cert-proofs" ON storage.objects;

-- ========================================
-- CREATE STORAGE POLICIES
-- ========================================

-- Project media storage
CREATE POLICY "Public read project-media" ON storage.objects FOR SELECT USING (bucket_id = 'project-media');
CREATE POLICY "Admin upload project-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete project-media" ON storage.objects FOR DELETE USING (bucket_id = 'project-media' AND auth.role() = 'authenticated');

-- Avatars storage
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Admin upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- CV docs storage
CREATE POLICY "Public read cv-docs" ON storage.objects FOR SELECT USING (bucket_id = 'cv-docs');
CREATE POLICY "Admin upload cv-docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv-docs' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete cv-docs" ON storage.objects FOR DELETE USING (bucket_id = 'cv-docs' AND auth.role() = 'authenticated');

-- Certificate proofs storage
CREATE POLICY "Public read cert-proofs" ON storage.objects FOR SELECT USING (bucket_id = 'cert-proofs');
CREATE POLICY "Admin upload cert-proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cert-proofs' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete cert-proofs" ON storage.objects FOR DELETE USING (bucket_id = 'cert-proofs' AND auth.role() = 'authenticated');

-- ========================================
-- INSERT SAMPLE DATA (only if tables are empty)
-- ========================================

-- Insert sample profile data
INSERT INTO public.profile (name, headline, bio)
SELECT 
  'Hayredin Mohammed',
  'Full Stack Developer',
  'Passionate developer building amazing web applications'
WHERE NOT EXISTS (SELECT 1 FROM public.profile)
LIMIT 1;

-- Insert sample skills
INSERT INTO public.skills (category, name, proficiency, sort_order)
SELECT * FROM (VALUES
  ('Frontend', 'React', 90, 1),
  ('Frontend', 'TypeScript', 85, 2),
  ('Frontend', 'Tailwind CSS', 88, 3),
  ('Backend', 'Node.js', 80, 4),
  ('Backend', 'PostgreSQL', 75, 5),
  ('Tools', 'Git', 85, 6)
) AS v(category, name, proficiency, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.skills);

-- Insert sample contact methods
INSERT INTO public.contact_methods (platform, url, icon, sort_order)
SELECT * FROM (VALUES
  ('Email', 'mailto:hayredin@example.com', 'mail', 1),
  ('GitHub', 'https://github.com/HayreKhan750', 'github', 2),
  ('LinkedIn', 'https://linkedin.com/in/hayredin', 'linkedin', 3)
) AS v(platform, url, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.contact_methods);

-- Insert sample social links
INSERT INTO public.social_links (platform, url, icon, sort_order)
SELECT * FROM (VALUES
  ('GitHub', 'https://github.com/HayreKhan750', 'github', 1),
  ('LinkedIn', 'https://linkedin.com/in/hayredin', 'linkedin', 2),
  ('Twitter', 'https://twitter.com/hayredin', 'twitter', 3)
) AS v(platform, url, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.social_links);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Count rows in each table
SELECT 'profile' as table_name, COUNT(*) as rows FROM public.profile
UNION ALL
SELECT 'projects', COUNT(*) FROM public.projects
UNION ALL
SELECT 'experience', COUNT(*) FROM public.experience
UNION ALL
SELECT 'certificates', COUNT(*) FROM public.certificates
UNION ALL
SELECT 'skills', COUNT(*) FROM public.skills
UNION ALL
SELECT 'contact_methods', COUNT(*) FROM public.contact_methods
UNION ALL
SELECT 'project_media', COUNT(*) FROM public.project_media
UNION ALL
SELECT 'social_links', COUNT(*) FROM public.social_links
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages;
