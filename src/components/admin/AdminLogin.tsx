"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Terminal } from "lucide-react";
import { setAdminAuth } from "../../lib/portfolio-store";

export default function AdminLogin() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (passcode !== (process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "surya-admin")) {
      setError("Access denied. Check your master key and try again.");
      return;
    }
    try {
      setAdminAuth(true);
      setPending(true);
      router.replace("/admin");
    } catch {
      setError("Browser storage is unavailable. Enable local storage to sign in.");
    }
  }

  return (
    <main className="bg-command-grid flex min-h-screen items-center justify-center px-5 py-12 text-slate-100">
      <section aria-labelledby="login-title" className="deck-card w-full max-w-lg overflow-hidden rounded-2xl shadow-[0_0_80px_-35px_rgba(6,182,212,0.35)]">
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-4 font-mono text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="mr-3 h-2 w-2 rounded-full bg-emerald-400" />surya.sys / access-control
        </div>
        <div className="space-y-7 p-6 sm:p-10">
          <Terminal aria-hidden="true" className="h-10 w-10 text-cyan-400" />
          <div>
            <p className="mb-3 font-mono text-xs tracking-widest text-emerald-400">SYSTEM ONLINE / AUTH REQUIRED</p>
            <h1 id="login-title" className="text-3xl font-semibold tracking-tight">Enter the command center.</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">Authenticate with your master key to manage the portfolio deck.</p>
          </div>
          <form onSubmit={login} className="space-y-5">
            <label className="block space-y-2 font-mono text-sm text-slate-300">
              <span className="flex items-center gap-2"><KeyRound size={16} aria-hidden="true" />Master Key / Passcode</span>
              <input type="password" autoComplete="current-password" required autoFocus value={passcode} onChange={(event) => setPasscode(event.target.value)} aria-invalid={!!error} aria-describedby={error ? "login-error" : undefined} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
            </label>
            {error && <p id="login-error" role="alert" className="text-sm text-red-400">{error}</p>}
            <button disabled={pending} className="flex w-full items-center justify-between rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-3 font-mono text-sm text-cyan-300 hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-cyan-400 disabled:opacity-50">{pending ? "Opening session…" : "Authenticate"}<ArrowRight size={18} aria-hidden="true" /></button>
          </form>
          <Link href="/" className="inline-block text-sm text-slate-400 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400">← Return to portfolio</Link>
        </div>
      </section>
    </main>
  );
}
