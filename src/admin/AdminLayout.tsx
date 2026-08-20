import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth, can, type Resource } from "../lib/auth";
export { Guard } from "./Guard";
import { supabaseConfigured } from "../lib/supabase";
import { Toaster } from "./ui";
import { cn } from "../lib/utils";
import { Logo } from "../components/icons";

interface NavItem {
  to: string;
  label: string;
  resource: Resource;
}
const NAV: { section: string; items: NavItem[] }[] = [
  { section: "Overview", items: [{ to: "/itcyberadmin", label: "Dashboard", resource: "dashboard" }] },
  {
    section: "Revenue",
    items: [
      { to: "/itcyberadmin/leads", label: "Leads", resource: "leads" },
      { to: "/itcyberadmin/assessments", label: "Assessments", resource: "assessments" },
    ],
  },
  {
    section: "Content",
    items: [
      { to: "/itcyberadmin/services", label: "Services", resource: "services" },
      { to: "/itcyberadmin/agents", label: "AI Agents", resource: "agents" },
      { to: "/itcyberadmin/automations", label: "Automations", resource: "automations" },
      { to: "/itcyberadmin/industries", label: "Industries", resource: "industries" },
      { to: "/itcyberadmin/work", label: "Work", resource: "work" },
      { to: "/itcyberadmin/resources", label: "Resources", resource: "resources" },
    ],
  },
  {
    section: "Careers",
    items: [
      { to: "/itcyberadmin/jobs", label: "Jobs", resource: "jobs" },
      { to: "/itcyberadmin/applications", label: "Applications", resource: "applications" },
    ],
  },
  {
    section: "System",
    items: [
      { to: "/itcyberadmin/media", label: "Media", resource: "media" },
      { to: "/itcyberadmin/seo", label: "SEO", resource: "seo" },
      { to: "/itcyberadmin/navigation", label: "Navigation", resource: "navigation" },
      { to: "/itcyberadmin/pages", label: "Pages", resource: "pages" },
      { to: "/itcyberadmin/settings", label: "Settings", resource: "settings" },
      { to: "/itcyberadmin/users", label: "Users", resource: "users" },
      { to: "/itcyberadmin/audit-logs", label: "Audit Logs", resource: "audit" },
    ],
  },
];

function SideNav({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed?: boolean }) {
  const { profile } = useAuth();
  const location = useLocation();
  if (!profile) return null;

  return (
    <nav aria-label="Admin navigation" className={cn("flex flex-col h-full", collapsed ? "w-16" : "w-60")}>
      <div className={cn("flex items-center gap-2 h-14 border-b border-slate-800 text-slate-100", collapsed ? "justify-center" : "px-4")}>
        <Logo compact />
        {!collapsed && <span className="font-semibold text-[0.92rem] tracking-tight">ITCYBER Admin</span>}
      </div>
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV.map((group) => {
          const items = group.items.filter((i) => can(profile.role, i.resource));
          if (items.length === 0) return null;
          return (
            <div key={group.section}>
              {!collapsed && <p className="px-2 mb-1 text-[0.62rem] font-semibold uppercase tracking-wider text-slate-500">{group.section}</p>}
              {items.map((i) => {
                const active = i.to === "/itcyberadmin" ? location.pathname === i.to : location.pathname.startsWith(i.to);
                return (
                  <Link
                    key={i.to}
                    to={i.to}
                    onClick={onNavigate}
                    title={i.label}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md text-[0.84rem] font-medium transition-colors mb-0.5",
                      collapsed ? "justify-center h-9" : "px-2.5 h-9",
                      active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    {!collapsed && i.label}
                    {collapsed && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />}
                    {collapsed && <span className="sr-only">{i.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
      {!collapsed && (
        <div className="border-t border-slate-800 p-3">
          <p className="text-[0.78rem] text-slate-300 font-medium truncate">{profile.full_name || profile.email}</p>
          <p className="text-[0.66rem] uppercase tracking-wider text-slate-500 mt-0.5">{profile.role.replace("_", " ")}</p>
        </div>
      )}
    </nav>
  );
}

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const apply = () => setCollapsed(mq.matches && window.innerWidth >= 768);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* desktop / tablet sidebar */}
      <aside className="hidden md:block bg-slate-900 shrink-0 sticky top-0 h-screen">
        <SideNav collapsed={collapsed} />
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 bg-slate-900 w-64">
            <SideNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden w-9 h-9 rounded-md border border-slate-200 flex items-center justify-center text-slate-600" onClick={() => setMobileOpen(true)} aria-label="Open admin menu">
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"><path d="M3.5 7h17M3.5 12h17M3.5 17h10" /></svg>
            </button>
            <button className="hidden md:flex w-9 h-9 rounded-md border border-slate-200 items-center justify-center text-slate-500 hover:bg-slate-50" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
              <svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M9.5 4.5v15" /></svg>
            </button>
            {!supabaseConfigured && (
              <span className="text-[0.72rem] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                Supabase not configured — connect env vars to enable data
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-[0.8rem] font-medium text-slate-600 hover:text-blue-600 px-2">View site ↗</Link>
            <button
              onClick={async () => {
                await signOut();
                navigate("/itcyberadmin/login");
              }}
              className="text-[0.8rem] font-medium text-slate-600 hover:text-rose-600 border border-slate-200 rounded-md px-3 h-8"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[90rem] w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
