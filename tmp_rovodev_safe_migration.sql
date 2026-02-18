-- Safe consolidation migration based on actual schema
-- Run this in your Vercel/Supabase SQL editor

-- Step 1: Ensure profile has name column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profile' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.profile ADD COLUMN name TEXT DEFAULT 'Hayredin Mohammed';
  END IF;
END $$;

-- Step 2: Add timestamps to profile if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profile' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.profile ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profile' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profile ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

-- Step 3: Create safe indexes (only on columns that exist)
-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_created_at 
  ON public.projects(created_at DESC);

-- Check if featured column exists before creating index
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'projects' 
    AND column_name = 'featured'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_projects_featured 
      ON public.projects(featured) WHERE featured = true;
  END IF;
END $$;

-- Skills table indexes
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'skills' 
    AND column_name = 'category'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_skills_category 
      ON public.skills(category);
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'skills' 
    AND column_name = 'sort_order'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_skills_sort_order 
      ON public.skills(sort_order);
  END IF;
END $$;

-- Experience table indexes
CREATE INDEX IF NOT EXISTS idx_experience_sort_order 
  ON public.experience(sort_order);
  
CREATE INDEX IF NOT EXISTS idx_experience_created_at 
  ON public.experience(created_at DESC);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_created_at 
  ON public.messages(created_at DESC);

-- Project media indexes
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'project_media'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_project_media_project_id 
      ON public.project_media(project_id);
  END IF;
END $$;

-- Contact methods indexes
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'contact_methods' 
    AND column_name = 'sort_order'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_contact_methods_sort_order 
      ON public.contact_methods(sort_order);
  END IF;
END $$;

-- Step 4: Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Add triggers only to tables that have updated_at column
DO $$ 
BEGIN
  -- Profile trigger
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profile' 
    AND column_name = 'updated_at'
  ) THEN
    DROP TRIGGER IF EXISTS update_profile_updated_at ON public.profile;
    CREATE TRIGGER update_profile_updated_at 
      BEFORE UPDATE ON public.profile 
      FOR EACH ROW 
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- Projects trigger
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'projects' 
    AND column_name = 'updated_at'
  ) THEN
    DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
    CREATE TRIGGER update_projects_updated_at 
      BEFORE UPDATE ON public.projects 
      FOR EACH ROW 
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
END $$;
