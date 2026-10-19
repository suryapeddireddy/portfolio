"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Lock } from "lucide-react";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check against env variables or default master key fallback
    const validKey = 
      process.env.NEXT_PUBLIC_ADMIN_MASTER_KEY || 
      process.env.ADMIN_MASTER_KEY || 
      "g3MU/5WFjbbXXQM";

    if (passcode.trim() === validKey) {
      localStorage.setItem("surya_admin_auth", "true");
      setError(false);
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] bg-command-grid text-slate-100 flex items-center justify-center p-4">
      <div className="deck-card w-full max-w-md p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
          <Terminal className="w-4 h-4" />
          <span>SURYA.SYS // AUTHENTICATION</span>
        </div>

        <h1 className="text-2xl font-bold font-mono">Master Key Required</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              ENTER PASSCODE
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 font-mono text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50"
              />
              <Lock className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {error && (
            <p className="text-xs font-mono text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-800/50">
              ACCESS DENIED: INVALID MASTER KEY
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg py-2.5 font-mono text-sm transition-colors"
          >
            Authenticate Session ↗
          </button>
        </form>
      </div>
    </main>
  );
}