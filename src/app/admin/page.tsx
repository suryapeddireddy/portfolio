"use client";

import AdminDashboard from "../../components/admin/AdminDashboard";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function initializeSession() {
      try {
        if (isSupabaseConfigured) {
          // getSession waits for the SDK to consume and persist OAuth URL tokens
          // before the dashboard's route gate can navigate away from this page.
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not complete sign-in.");
      } finally { if (active) setReady(true); }
    }
    void initializeSession();
    return () => { active = false; };
  }, []);

  if (!ready) return <main className="min-h-screen bg-slate-950 p-8 text-cyan-300"><p role="status">Loading admin session…</p></main>;
  if (error) return <main className="min-h-screen space-y-4 bg-slate-950 p-8 text-slate-100"><p role="alert">Sign-in failed: {error}</p><a href="/admin" className="text-cyan-300 underline">Return to admin</a></main>;
  return <AdminDashboard />;
}
