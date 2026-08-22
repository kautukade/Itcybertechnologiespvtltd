import { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { fetchProfile } from "../lib/auth";
import { AButton, AInput, FieldRow, Toaster, toast } from "./ui";
import { Logo } from "../components/icons";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err || !data.user) {
      setError(err?.message ?? "Sign in failed.");
      setBusy(false);
      return;
    }
    const profile = await fetchProfile(data.user.id);
    if (!profile || !profile.active) {
      await supabase.auth.signOut();
      setError("This account isn't active. A super admin must activate it before you can sign in.");
      setBusy(false);
      return;
    }
    toast(`Welcome back, ${profile.full_name || profile.email}`);
    setAuthed(true);
    navigate(location.state?.from ?? "/itcyberadmin", { replace: true });
  };

  if (authed) return <Navigate to="/itcyberadmin" replace />;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(59,82,139,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,82,139,.16) 1px, transparent 1px)", backgroundSize: "44px 44px" }} aria-hidden />
      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-6 text-slate-100"><Logo /></div>
        <div className="bg-white rounded-lg shadow-2xl p-7">
          <h1 className="text-[1.25rem] font-semibold text-slate-900 tracking-tight">Admin sign in</h1>
          <p className="text-[0.82rem] text-slate-500 mt-1">Restricted area — ITCYBER team only.</p>

          {!supabaseConfigured ? (
            <div className="mt-5 border border-amber-200 bg-amber-50 rounded-md p-4">
              <p className="text-[0.82rem] text-amber-800 font-medium">Supabase is not configured</p>
              <p className="text-[0.76rem] text-amber-700 mt-1 leading-relaxed">
                Add <code className="font-mono">VITE_SUPABASE_URL</code> and{" "}
                <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to the deployment environment, then rebuild the site.
                Backend migrations, first-admin setup and Edge Function deployment are documented in{" "}
                <code className="font-mono">SUPABASE_SETUP.md</code>.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-4">
              <FieldRow label="Email">
                <AInput type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@itcyber.in" />
              </FieldRow>
              <FieldRow label="Password">
                <AInput type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </FieldRow>
              {error && <p className="text-[0.8rem] text-rose-600" role="alert">{error}</p>}
              <AButton type="submit" loading={busy} className="w-full">Sign in</AButton>
            </form>
          )}
        </div>
        <p className="text-center text-[0.72rem] text-slate-500 mt-5">
          <a href="/" className="hover:text-slate-300 transition-colors">← Back to itcyber.in</a>
        </p>
      </div>
      <Toaster />
    </div>
  );
}
