"use client";

import { useEffect, useRef, useState } from "react";
import { deleteResumeFromSupabase, getLatestResumeUrl, isSupabaseConfigured, supabase, uploadResumeToSupabase } from "@/lib/supabase";

const buttonClass = "rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-cyan-400";

export default function ResumeManager() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  async function handleGitHubLogin() {
    if (signingIn || !isSupabaseConfigured) return;
    setSigningIn(true); setError(""); setNotice("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: window.location.origin + "/admin" },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in with GitHub.");
    } finally { setSigningIn(false); }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setAuthenticated(Boolean(session));
        setSessionLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!active) return;
      if (error) setError(error.message);
      setAuthenticated(Boolean(session));
    }).catch((err: unknown) => {
      if (active) setError(err instanceof Error ? err.message : "Could not read your session.");
    }).finally(() => { if (active) setSessionLoading(false); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let active = true;
    getLatestResumeUrl().then((latest) => { if (active) setUrl(latest); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Could not load the resume."); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  async function mutate(action: "upload" | "delete") {
    setBusy(true); setError(""); setNotice("");
    try {
      if (action === "upload") {
        if (!file) throw new Error("Select a PDF first.");
        setUrl(await uploadResumeToSupabase(file));
        setFile(null);
        if (input.current) input.current.value = "";
        setNotice("CV uploaded. The portfolio now links to this resume.");
      } else {
        await deleteResumeFromSupabase();
        setUrl(null);
        setNotice("CV deleted. The portfolio now uses the static resume.");
      }
      setConfirming(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Resume operation failed."); }
    finally { setBusy(false); }
  }

  return <div className="max-w-xl space-y-5">
    {!isSupabaseConfigured && <p role="alert" className="text-amber-300">Configure Supabase to manage your CV.</p>}
    {error && <p role="alert" className="text-red-300">{error}</p>}
    {notice && <p role="status" className="text-emerald-300">{notice}</p>}
    {isSupabaseConfigured && sessionLoading && <p role="status" className="text-slate-400">Checking sign-in status…</p>}
    {isSupabaseConfigured && !sessionLoading && !authenticated && <div className="space-y-3">
      <p className="text-slate-400">Sign in with GitHub to manage your resume.</p>
      <button type="button" disabled={signingIn} className={buttonClass} onClick={() => void handleGitHubLogin()}>{signingIn ? "Connecting to GitHub…" : "Sign in with GitHub"}</button>
    </div>}
    {authenticated && <p role="status" className="text-emerald-300">Supabase session active. Resume storage connected.</p>}
    {busy && <p role="status" className="text-slate-400">Working…</p>}
    {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">View current live resume ↗</a> : !busy && <p className="text-slate-400">No uploaded CV. The portfolio uses the static resume.</p>}
    {authenticated && <fieldset disabled={busy || sessionLoading || !isSupabaseConfigured} className="space-y-4 disabled:opacity-60">
      <label className="block space-y-2 text-sm text-slate-300"><span>Select a resume PDF (maximum 6 MB)</span><input ref={input} type="file" accept=".pdf" className="block w-full rounded-lg border border-slate-700 p-3" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(""); setNotice(""); }} /></label>
      <p className="text-sm text-slate-400">Uploading replaces the current CV.</p>
      <button type="button" disabled={!file} className={buttonClass} onClick={() => void mutate("upload")}>Upload Resume</button>
      {url && <button type="button" className={`${buttonClass} ml-3 text-red-300`} onClick={() => setConfirming(true)}>Delete</button>}
      {confirming && <div className="space-y-3 rounded-lg border border-red-500/30 p-4"><p>Delete the uploaded CV? The portfolio will use the static resume.</p><button type="button" className={buttonClass} onClick={() => void mutate("delete")}>Confirm delete</button><button type="button" className={`${buttonClass} ml-3`} onClick={() => setConfirming(false)}>Cancel</button></div>}
    </fieldset>}
  </div>;
}
