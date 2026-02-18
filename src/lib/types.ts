// Shared type definitions for the application
import type { Database } from '@/integrations/supabase/types';

// Extract types from Database schema
export type Profile = Database['public']['Tables']['profile']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Experience = Database['public']['Tables']['experience']['Row'];
export type Certificate = Database['public']['Tables']['certificates']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type ProjectMedia = Database['public']['Tables']['project_media']['Row'];
export type ContactMethod = Database['public']['Tables']['contact_methods']['Row'];

// Insert types for forms
export type ProfileInsert = Database['public']['Tables']['profile']['Insert'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ExperienceInsert = Database['public']['Tables']['experience']['Insert'];
export type CertificateInsert = Database['public']['Tables']['certificates']['Insert'];
export type SkillInsert = Database['public']['Tables']['skills']['Insert'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

// Update types for forms
export type ProfileUpdate = Database['public']['Tables']['profile']['Update'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
export type ExperienceUpdate = Database['public']['Tables']['experience']['Update'];
export type CertificateUpdate = Database['public']['Tables']['certificates']['Update'];
export type SkillUpdate = Database['public']['Tables']['skills']['Update'];
