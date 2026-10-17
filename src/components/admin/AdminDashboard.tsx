"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Terminal } from "lucide-react";
import { AUTH_KEY, projectCategories, savePortfolioContent, setAdminAuth, useAdminAuth, usePortfolioContent } from "../../lib/portfolio-store";
import type { PortfolioContent } from "../../lib/portfolio-store";
import type { Metric, ProfileConfig, Project } from "../../types";

const buttonClass = "rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 font-mono text-sm text-cyan-300 hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-cyan-400";
const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";
const tabs = ["Bio & Headline", "Projects CRUD", "Metrics Override"] as const;
type Tab = typeof tabs[number];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2 text-sm text-slate-400"><span>{label}</span>{children}</label>;
}

function ProfileEditor({ profile, onSave }: { profile: ProfileConfig; onSave: (profile: ProfileConfig) => void }) {
  const [draft, setDraft] = useState(profile);
  const [bio, setBio] = useState(profile.bioParagraphs.join("\n\n"));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ ...draft, name: draft.name.trim(), title: draft.title.trim(), statusBadge: draft.statusBadge.trim(), bioParagraphs: bio.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) });
  }
  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name"><input className={inputClass} required pattern=".*\S.*" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
        <Field label="Status badge"><input className={inputClass} required pattern=".*\S.*" value={draft.statusBadge} onChange={(event) => setDraft({ ...draft, statusBadge: event.target.value })} /></Field>
      </div>
      <Field label="Title / headline"><input className={inputClass} required pattern=".*\S.*" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></Field>
      <Field label="Bio paragraphs (separate paragraphs with a blank line)"><textarea className={inputClass} rows={9} required value={bio} onChange={(event) => setBio(event.target.value)} /></Field>
      <button className={buttonClass}>Save profile</button>
    </form>
  );
}

function emptyProject(): Project {
  return { id: "", title: "", tagline: "", category: "Systems & C++", tags: [], summary: "", architectureDetails: { problem: "", solution: "", performanceGain: "" }, featured: false, date: String(new Date().getFullYear()) };
}

function ProjectEditor({ projects, onSave }: { projects: Project[]; onSave: (projects: Project[]) => boolean }) {
  const [draft, setDraft] = useState<Project>(emptyProject);
  const [tags, setTags] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  function reset() { setDraft(emptyProject()); setTags(""); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const project: Project = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      title: draft.title.trim(),
      tagline: draft.tagline.trim(),
      summary: draft.summary.trim(),
      tags: [...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))],
      architectureDetails: { problem: draft.architectureDetails.problem.trim(), solution: draft.architectureDetails.solution.trim(), performanceGain: draft.architectureDetails.performanceGain?.trim() || undefined },
    };
    if (onSave(draft.id ? projects.map((item) => item.id === draft.id ? project : item) : [...projects, project])) reset();
  }
  return (
    <div className="space-y-10">
      <form onSubmit={submit} className="space-y-5">
        <h3 className="text-lg font-medium">{draft.id ? "Edit project" : "Add a new project"}</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title"><input className={inputClass} required pattern=".*\S.*" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></Field>
          <Field label="Category"><select className={inputClass} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Project["category"] })}>{projectCategories.map((category) => <option key={category}>{category}</option>)}</select></Field>
          <Field label="Tagline"><input className={inputClass} required pattern=".*\S.*" value={draft.tagline} onChange={(event) => setDraft({ ...draft, tagline: event.target.value })} /></Field>
          <Field label="Tech tags (comma separated)"><input className={inputClass} value={tags} onChange={(event) => setTags(event.target.value)} /></Field>
          <Field label="Date / year"><input className={inputClass} required pattern=".*\S.*" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></Field>
          <Field label="Performance gain (optional)"><input className={inputClass} value={draft.architectureDetails.performanceGain || ""} onChange={(event) => setDraft({ ...draft, architectureDetails: { ...draft.architectureDetails, performanceGain: event.target.value } })} /></Field>
        </div>
        <Field label="Summary"><textarea className={inputClass} rows={2} required value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Architecture / problem"><textarea className={inputClass} rows={4} required value={draft.architectureDetails.problem} onChange={(event) => setDraft({ ...draft, architectureDetails: { ...draft.architectureDetails, problem: event.target.value } })} /></Field>
          <Field label="Architecture / solution"><textarea className={inputClass} rows={4} required value={draft.architectureDetails.solution} onChange={(event) => setDraft({ ...draft, architectureDetails: { ...draft.architectureDetails, solution: event.target.value } })} /></Field>
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" className="accent-cyan-400" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} />Featured project</label>
        <div className="flex gap-3"><button className={buttonClass}>{draft.id ? "Save changes" : "Add project"}</button>{draft.id && <button type="button" onClick={reset} className={buttonClass}>Cancel edit</button>}</div>
      </form>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <caption className="border-b border-slate-800 p-4 text-left font-mono text-xs text-slate-400">PROJECT REGISTRY / {projects.length} RECORDS</caption>
          <thead className="bg-slate-900/60 text-slate-400"><tr><th scope="col" className="p-4">Project</th><th scope="col" className="p-4">Category</th><th scope="col" className="p-4">Actions</th></tr></thead>
          <tbody>{projects.map((project) => <tr key={project.id} className="border-t border-slate-800"><td className="min-w-48 p-4 font-medium">{project.title}</td><td className="p-4 text-slate-400">{project.category}</td><td className="p-4"><div className="flex flex-wrap gap-3"><button type="button" aria-label={`Edit ${project.title}`} className={buttonClass} onClick={() => { setDraft(project); setTags(project.tags.join(", ")); setDeleting(null); }}>Edit</button><button type="button" aria-label={`Delete ${project.title}`} className="rounded-lg px-3 py-2 text-red-400 hover:bg-red-400/10 focus-visible:outline-2 focus-visible:outline-red-400" onClick={() => setDeleting(project.id)}>Delete</button></div>{deleting === project.id && <div className="mt-3 space-y-3"><p className="text-red-300">Delete this project?</p><div className="flex gap-3"><button type="button" className={buttonClass} onClick={() => { if (onSave(projects.filter((item) => item.id !== project.id))) { setDeleting(null); if (draft.id === project.id) reset(); } }}>Confirm delete</button><button type="button" className={buttonClass} onClick={() => setDeleting(null)}>Cancel</button></div></div>}</td></tr>)}</tbody>
        </table>
        {!projects.length && <p className="p-6 text-slate-400">No projects yet. Add your first project above.</p>}
      </div>
    </div>
  );
}

function MetricsEditor({ metrics, onSave }: { metrics: Metric[]; onSave: (metrics: Metric[]) => void }) {
  const [leetcode, setLeetcode] = useState(metrics.find((metric) => metric.id === "lc-rating")?.value || "");
  const [codeforces, setCodeforces] = useState(metrics.find((metric) => metric.id === "cf-rank")?.value || "");
  const [jee, setJee] = useState((metrics.find((metric) => metric.id === "jee-rank")?.value || "").replace(/^AIR\s*/i, ""));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const overrides: Metric[] = [
      { id: "lc-rating", label: "LeetCode Peak", value: leetcode, subtext: "1,500+ Algorithmic Problems Solved", accent: "cyan" },
      { id: "jee-rank", label: "JEE Advanced", value: `AIR ${jee}`, subtext: "All India Rank", accent: "mint" },
    ];
    if (codeforces.trim()) overrides.push({ id: "cf-rank", label: "Codeforces Rank", value: codeforces.trim(), subtext: "Competitive Programming", accent: "cyan" });
    const next = metrics.filter((metric) => metric.id !== "cf-rank").map((metric) => {
      const override = overrides.find((item) => item.id === metric.id);
      return override ? { ...metric, value: override.value } : metric;
    });
    for (const override of overrides) if (!next.some((metric) => metric.id === override.id)) next.push(override);
    onSave(next);
  }
  return (
    <form onSubmit={submit} className="max-w-xl space-y-5">
      <Field label="LeetCode peak rating"><input className={inputClass} type="number" min="0" step="1" required value={leetcode} onChange={(event) => setLeetcode(event.target.value)} /></Field>
      <Field label="Codeforces rank (optional; leave blank to hide)"><input className={inputClass} value={codeforces} onChange={(event) => setCodeforces(event.target.value)} /></Field>
      <Field label="JEE Advanced All India Rank"><input className={inputClass} type="number" min="1" step="1" required value={jee} onChange={(event) => setJee(event.target.value)} /></Field>
      <button className={buttonClass}>Save metrics</button>
    </form>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const authenticated = useAdminAuth();
  const content = usePortfolioContent();
  const [tab, setTab] = useState<Tab>("Bio & Headline");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    function checkAuth() {
      try {
        if (localStorage.getItem(AUTH_KEY) !== "true") router.replace("/admin/login");
      } catch { router.replace("/admin/login"); }
    }
    checkAuth();
    window.addEventListener("focus", checkAuth);
    window.addEventListener("pageshow", checkAuth);
    return () => { window.removeEventListener("focus", checkAuth); window.removeEventListener("pageshow", checkAuth); };
  }, [authenticated, router]);

  function save(next: PortfolioContent) {
    setNotice(""); setError("");
    try {
      if (localStorage.getItem(AUTH_KEY) !== "true") { router.replace("/admin/login"); return false; }
      savePortfolioContent(next);
      setNotice("Changes saved to this browser. Portfolio preview updated.");
      return true;
    } catch { setError("Changes could not be saved. Check that browser storage is enabled and has free space."); return false; }
  }

  function logout() {
    try { setAdminAuth(false); router.replace("/admin/login"); }
    catch { setError("Could not clear the session. Enable browser storage and try again."); }
  }

  if (!authenticated) return <main className="bg-command-grid flex min-h-screen items-center justify-center font-mono text-sm text-cyan-300"><p role="status">Verifying admin session…</p></main>;

  return (
    <main className="bg-command-grid min-h-screen px-4 py-6 text-slate-100 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="deck-card flex flex-wrap items-center justify-between gap-5 rounded-2xl p-5 sm:p-7">
          <div><p className="mb-3 flex items-center gap-2 font-mono text-xs text-emerald-400"><Terminal size={16} aria-hidden="true" />SESSION ACTIVE</p><h1 className="font-mono text-lg font-semibold tracking-tight sm:text-2xl">SURYA.SYS ADMIN CENTER</h1></div>
          <div className="flex items-center gap-4"><Link href="/" className="rounded-lg text-sm text-slate-400 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400">View portfolio ↗</Link><button type="button" onClick={logout} className={`${buttonClass} flex items-center gap-2`}><LogOut size={16} aria-hidden="true" />Logout</button></div>
        </header>
        <p className="text-sm text-slate-400">Manage your command deck. Changes are stored locally in this browser.</p>
        <nav aria-label="Admin sections" className="flex flex-wrap gap-2">{tabs.map((item, index) => <button key={item} type="button" aria-pressed={tab === item} aria-controls="admin-panel" onClick={() => { setTab(item); setNotice(""); setError(""); }} className={`rounded-lg border px-4 py-3 font-mono text-xs focus-visible:outline-2 focus-visible:outline-cyan-400 sm:text-sm ${tab === item ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300" : "border-slate-800 text-slate-400 hover:border-cyan-500/40 hover:text-slate-100"}`}><span className="mr-2 text-slate-500">0{index + 1}</span>[ {item} ]</button>)}</nav>
        {notice && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{notice}</p>}
        {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
        <section id="admin-panel" aria-labelledby="panel-title" className="deck-card rounded-2xl p-5 sm:p-8">
          <h2 id="panel-title" className="mb-7 text-2xl font-semibold">{tab}</h2>
          <div hidden={tab !== "Bio & Headline"}><ProfileEditor profile={content.profile} onSave={(profile) => save({ ...content, profile })} /></div>
          <div hidden={tab !== "Projects CRUD"}><ProjectEditor projects={content.projects} onSave={(projects) => save({ ...content, projects })} /></div>
          <div hidden={tab !== "Metrics Override"}><MetricsEditor metrics={content.metrics} onSave={(metrics) => save({ ...content, metrics })} /></div>
        </section>
      </div>
    </main>
  );
}

