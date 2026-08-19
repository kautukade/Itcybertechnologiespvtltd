/** Supabase Auth + role-based permissions for the admin panel. */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { ProfileRow, Json } from "../types/db";

export type Role = ProfileRow["role"];

export type Resource =
  | "dashboard" | "leads" | "assessments" | "content" | "services" | "agents"
  | "automations" | "industries" | "work" | "resources" | "careers" | "jobs"
  | "applications" | "media" | "seo" | "navigation" | "pages" | "settings"
  | "legal" | "users" | "audit";

const PERMS: Record<Role, Resource[]> = {
  super_admin: ["dashboard","leads","assessments","content","services","agents","automations","industries","work","resources","careers","jobs","applications","media","seo","navigation","pages","settings","legal","users","audit"],
  admin: ["dashboard","leads","assessments","content","services","agents","automations","industries","work","resources","careers","jobs","applications","media","seo","navigation","pages","settings","legal","audit"],
  editor: ["dashboard","content","services","agents","automations","industries","work","resources","media","seo"],
  sales: ["dashboard","leads","assessments"],
  hr: ["dashboard","careers","jobs","applications"],
};

export function can(role: Role | undefined, resource: Resource): boolean {
  if (!role) return false;
  return PERMS[role].includes(resource);
}

export function permittedResources(role: Role | undefined): Resource[] {
  return role ? PERMS[role] : [];
}

export interface AuthState {
  loading: boolean;
  profile: ProfileRow | null;
  sessionReady: boolean;
  unauthorized: boolean;
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data ?? null;
}

export function useAuth(): AuthState & { signOut: () => Promise<void>; refresh: () => Promise<void> } {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setUnauthorized(true);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;
    setSessionReady(true);
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const p = await fetchProfile(user.id);
    setProfile(p);
    setUnauthorized(!p || !p.active);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setProfile(null);
  }, []);

  return { loading, profile, sessionReady, unauthorized, signOut, refresh: load };
}

/** Write an entry to admin_activity_logs (RLS: any active admin role may insert). */
export async function logActivity(
  action: string,
  entityType: string,
  entityId?: string,
  oldData?: Record<string, Json> | null,
  newData?: Record<string, Json> | null
): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id ?? null;
  // loosely typed client — dynamic insert at the boundary
  const sb = supabase as unknown as import("@supabase/supabase-js").SupabaseClient;
  await sb.from("admin_activity_logs").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    old_data: oldData ?? null,
    new_data: newData ?? null,
  });
}
