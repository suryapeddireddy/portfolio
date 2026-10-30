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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    setBusy(true); setError(""); setNotice("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setPassword("");
      setNotice("Storage session connected. Uploads require an account with the resume_admin role.");
    } catch (err) { setError(err instanceof Error ? err.message : "Storage sign-in failed."); }
    finally { setBusy(false); }
  }

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
    <details className="rounded-lg border border-slate-700 p-4">
      <summary className="cursor-pointer text-sm text-slate-300">Connect storage admin account</summary>
      <form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); void signIn(); }}>
        <p className="text-sm text-slate-400">Sign in with the Supabase admin account configured for resume uploads.</p>
        <label className="block text-sm">Email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block w-full rounded border border-slate-700 bg-slate-950 p-2" /></label>
        <label className="block text-sm">Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block w-full rounded border border-slate-700 bg-slate-950 p-2" /></label>
        <button disabled={busy || !isSupabaseConfigured} className={buttonClass}>Connect storage</button>
      </form>
    </details>
    {busy && <p role="status" className="text-slate-400">Working…</p>}
    {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">View current live resume ↗</a> : !busy && <p className="text-slate-400">No uploaded CV. The portfolio uses the static resume.</p>}
    <fieldset disabled={busy || !isSupabaseConfigured} className="space-y-4 disabled:opacity-60">
      <label className="block space-y-2 text-sm text-slate-300"><span>Select a resume PDF (maximum 6 MB)</span><input ref={input} type="file" accept=".pdf,application/pdf" className="block w-full rounded-lg border border-slate-700 p-3" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(""); setNotice(""); }} /></label>
      <p className="text-sm text-slate-400">Uploading replaces the current CV.</p>
      <button type="button" disabled={!file} className={buttonClass} onClick={() => void mutate("upload")}>Upload CV</button>
      {url && <button type="button" className={`${buttonClass} ml-3 text-red-300`} onClick={() => setConfirming(true)}>Delete Current CV</button>}
      {confirming && <div className="space-y-3 rounded-lg border border-red-500/30 p-4"><p>Delete the uploaded CV? The portfolio will use the static resume.</p><button type="button" className={buttonClass} onClick={() => void mutate("delete")}>Confirm delete</button><button type="button" className={`${buttonClass} ml-3`} onClick={() => setConfirming(false)}>Cancel</button></div>}
    </fieldset>
  </div>;
}
