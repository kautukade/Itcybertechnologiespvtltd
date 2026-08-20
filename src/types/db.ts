/** Hand-maintained Supabase types mirroring supabase/schema.sql */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface BaseRow {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: "super_admin" | "admin" | "editor" | "sales" | "hr";
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsRow extends BaseRow {
  company_name: string | null;
  legal_name: string | null;
  tagline: string | null;
  description: string | null;
  email: string | null;
  sales_email: string | null;
  careers_email: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  business_hours: string | null;
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  default_og_image: string | null;
  homepage: Json;
  navigation: Json;
}

export interface ServiceRow extends BaseRow {
  slug: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  category: string;
  icon: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface AgentRow extends BaseRow {
  slug: string;
  name: string;
  role: string | null;
  description: string | null;
  inputs: string | null;
  actions: string | null;
  systems: string | null;
  outputs: string | null;
  handoff: string | null;
  demo_type: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

export interface AutomationRow extends BaseRow {
  slug: string;
  name: string;
  category: string;
  description: string | null;
  workflow_json: Json;
  integrations_json: Json;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

export interface IndustryRow extends BaseRow {
  slug: string;
  name: string;
  short_description: string | null;
  hero_description: string | null;
  challenges_json: Json;
  opportunities_json: Json;
  automations_json: Json;
  workflow_json: Json;
  integrations_json: Json;
  agents_json: Json;
  faq_json: Json;
  published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface CaseStudyRow extends BaseRow {
  slug: string;
  title: string;
  client_name: string | null;
  industry: string | null;
  case_type: "real" | "reference";
  challenge: string | null;
  previous_process: string | null;
  solution: string | null;
  architecture_json: Json;
  integrations_json: Json;
  results_json: Json;
  testimonial: string | null;
  client_logo: string | null;
  featured_image: string | null;
  verified: boolean;
  published: boolean;
  sort_order: number;
}

export interface TechnologyRow extends BaseRow {
  name: string;
  category: string;
  published: boolean;
  sort_order: number;
}

export interface ResourceRow extends BaseRow {
  slug: string;
  title: string;
  kind: string;
  summary: string | null;
  body: string | null;
  published: boolean;
  sort_order: number;
}

export interface JobRow extends BaseRow {
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string | null;
  description: string | null;
  responsibilities_json: Json;
  requirements_json: Json;
  salary_range: string | null;
  published: boolean;
  applications_open: boolean;
  sort_order: number;
}

export interface ContactLeadRow extends BaseRow {
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  industry: string | null;
  company_size: string | null;
  automation_interest: string | null;
  existing_tools: string | null;
  budget_range: string | null;
  preferred_contact: string | null;
  message: string | null;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost" | "spam";
  assigned_to: string | null;
  notes: string | null;
}

export interface AssessmentRow extends BaseRow {
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  requirement: string | null;
  industry: string | null;
  business_problem: string | null;
  existing_tools: string | null;
  budget: string | null;
  timeline: string | null;
  answers_json: Json;
  status: "new" | "reviewed" | "converted" | "archived";
  assigned_to: string | null;
}

export interface LeadNoteRow {
  id: string;
  lead_id: string;
  admin_user_id: string | null;
  note: string;
  created_at: string;
}

export interface CareerApplicationRow extends BaseRow {
  job_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  experience: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_path: string | null;
  message: string | null;
  status: "new" | "screening" | "shortlisted" | "interview" | "selected" | "rejected";
  notes: string | null;
}

export interface MediaRow extends BaseRow {
  name: string;
  file_type: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  folder: string;
  uploaded_by: string | null;
}

export interface SeoPageRow extends BaseRow {
  route: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  canonical: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  robots: string | null;
  schema_json: Json;
}

export interface LegalPageRow extends BaseRow {
  slug: string;
  title: string;
  body: string | null;
}

export interface AnnouncementRow extends BaseRow {
  text: string;
  cta_label: string | null;
  cta_to: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

export interface SocialLinkRow extends BaseRow {
  label: string;
  href: string;
  sort_order: number;
}

export interface ActivityLogRow {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Json | null;
  new_data: Json | null;
  created_at: string;
}

interface Crud<R extends { id: string }> {
  Row: R;
  Insert: Omit<R, "id" | "created_at" | "updated_at"> & { id?: string };
  Update: Partial<R>;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Omit<ProfileRow, "created_at" | "updated_at">; Update: Partial<ProfileRow> };
      site_settings: Crud<SiteSettingsRow>;
      services: Crud<ServiceRow>;
      ai_agents: Crud<AgentRow>;
      automations: Crud<AutomationRow>;
      industries: Crud<IndustryRow>;
      case_studies: Crud<CaseStudyRow>;
      technologies: Crud<TechnologyRow>;
      resources: Crud<ResourceRow>;
      jobs: Crud<JobRow>;
      contact_leads: Crud<ContactLeadRow>;
      lead_notes: { Row: LeadNoteRow; Insert: Omit<LeadNoteRow, "id" | "created_at">; Update: Partial<LeadNoteRow> };
      automation_assessments: Crud<AssessmentRow>;
      career_applications: Crud<CareerApplicationRow>;
      media_library: Crud<MediaRow>;
      seo_pages: Crud<SeoPageRow>;
      legal_pages: Crud<LegalPageRow>;
      announcements: Crud<AnnouncementRow>;
      social_links: Crud<SocialLinkRow>;
      admin_activity_logs: { Row: ActivityLogRow; Insert: Omit<ActivityLogRow, "id" | "created_at">; Update: Partial<ActivityLogRow> };
    };
  };
}

export type TableName = keyof Database["public"]["Tables"];
