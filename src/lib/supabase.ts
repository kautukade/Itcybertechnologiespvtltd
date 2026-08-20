import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/db";

const env = import.meta.env as Record<string, string | undefined>;

export const SUPABASE_URL = env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? "";
export const SITE_URL = env.VITE_SITE_URL || "https://www.itcyber.in";

/** Null when env vars are absent — every consumer must handle this gracefully. */
export const supabase: SupabaseClient<Database> | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null;

export const supabaseConfigured = supabase !== null;
