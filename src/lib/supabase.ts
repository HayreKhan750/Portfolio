import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  name: string;
  headline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  technologies?: string[];
  project_url?: string;
  github_url?: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  location?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_id?: string;
  credential_url?: string;
  proof_url?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  proficiency: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  sort_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}
