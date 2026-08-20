/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_COMPANY_EMAIL?: string;
  readonly VITE_SALES_EMAIL?: string;
  readonly VITE_CAREERS_EMAIL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_PHONE_DISPLAY?: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_LINKEDIN_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
