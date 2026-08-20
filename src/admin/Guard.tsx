/** Route guard for admin routes — kept dependency-light so it can be
 *  imported statically without pulling the admin chunk into the main bundle. */
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, can, type Resource } from "../lib/auth";
import { supabaseConfigured } from "../lib/supabase";

export function Guard({ resource, children }: { resource: Resource; children: ReactNode }) {
  const { loading, profile, unauthorized } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-[0.82rem] text-slate-500">
          <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden />
          Checking session…
        </div>
      </div>
    );
  if (!supabaseConfigured) return <Navigate to="/itcyberadmin/login" replace />;
  if (!profile || unauthorized) return <Navigate to="/itcyberadmin/login" state={{ from: location.pathname }} replace />;
  if (!can(profile.role, resource)) return <Navigate to="/itcyberadmin" replace />;
  return <>{children}</>;
}
