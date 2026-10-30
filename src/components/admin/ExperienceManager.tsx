"use client";

import { MONTHS, formatExperiencePeriod } from "@/lib/experience-dates";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { ExperienceItem } from "@/types";
import { saveExperiences } from "@/lib/portfolio-store";
import { deleteExperienceFromSupabase, isSupabaseConfigured, upsertExperienceInSupabase } from "@/lib/supabase";
import { useExperiences } from "@/lib/use-experiences";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";
const buttonClass = "rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 font-mono text-sm text-cyan-300 hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-cyan-400";
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2 text-sm text-slate-400"><span>{label}</span>{children}</label>;
}
function emptyExperience(): ExperienceItem {
  return { role: "", organization: "", startMonth: "Jan", startYear: new Date().getFullYear(), endMonth: "Jan", endYear: new Date().getFullYear(), isCurrent: false, location: "", type: "Internship", highlights: [], tags: [] };
}

export default function ExperienceManager() {
  const { experiences, loading, error: loadError } = useExperiences();
  const [draft, setDraft] = useState<ExperienceItem>(emptyExperience);
  const [editing, setEditing] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [highlights, setHighlights] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function reset() { setDraft(emptyExperience()); setEditing(null); setHighlights(""); setTags(""); }
  function edit(item: ExperienceItem, index: number) {
    setDraft(item); setEditing(index); setHighlights(item.highlights.join("\n")); setTags(item.tags.join(", ")); setDeleting(null);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || loading) return;
    setBusy(true); setError(""); setNotice("");
    let published = false;
    try {
      if (!MONTHS.includes(draft.startMonth as typeof MONTHS[number]) || !Number.isInteger(draft.startYear) || draft.startYear < 1 || draft.startYear > 9999) throw new Error("Enter a valid start month and year.");
      if (!draft.isCurrent && (!MONTHS.includes(draft.endMonth as typeof MONTHS[number]) || !Number.isInteger(draft.endYear) || !draft.endYear || draft.endYear < 1 || draft.endYear > 9999)) throw new Error("Enter a valid end month and year.");
      if (!draft.isCurrent && (draft.endYear! * 12 + MONTHS.indexOf(draft.endMonth as typeof MONTHS[number]) < draft.startYear * 12 + MONTHS.indexOf(draft.startMonth as typeof MONTHS[number]))) throw new Error("End date must be on or after the start date.");
      const item: ExperienceItem = {
        ...draft, id: draft.id || crypto.randomUUID(), role: draft.role.trim(), organization: draft.organization.trim(),
        period: undefined, endMonth: draft.isCurrent ? undefined : draft.endMonth, endYear: draft.isCurrent ? undefined : draft.endYear, location: draft.location.trim(),
        highlights: highlights.split("\n").map((line) => line.trim()).filter(Boolean),
        tags: [...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))],
      };
      const saved = isSupabaseConfigured ? await upsertExperienceInSupabase(item) : item;
      published = isSupabaseConfigured;
      saveExperiences(editing === null ? [...experiences, saved] : experiences.map((entry, index) => index === editing ? saved : entry));
      reset(); setNotice(isSupabaseConfigured ? "Experience saved to Supabase and this browser." : "Experience saved to this browser.");
    } catch (cause) {
      setError(`${published ? "Published to Supabase, but browser storage could not be updated. Reload to synchronize. " : ""}${cause instanceof Error ? cause.message : "Experience could not be saved."}`);
    } finally { setBusy(false); }
  }
  async function remove(index: number) {
    if (busy || loading) return;
    const item = experiences[index];
    if (!item) return;
    setBusy(true); setError(""); setNotice("");
    let published = false;
    try {
      if (isSupabaseConfigured) {
        if (!item.id) throw new Error("This entry has no database ID. Save it before deleting it from Supabase.");
        await deleteExperienceFromSupabase(item.id); published = true;
      }
      saveExperiences(experiences.filter((_, itemIndex) => itemIndex !== index));
      reset(); setDeleting(null); setNotice(isSupabaseConfigured ? "Experience deleted from Supabase and this browser." : "Experience deleted from this browser.");
    } catch (cause) {
      setError(`${published ? "Deleted from Supabase, but browser storage could not be updated. Reload to synchronize. " : ""}${cause instanceof Error ? cause.message : "Experience could not be deleted."}`);
    } finally { setBusy(false); }
  }
  return <div className="space-y-6">
    <p className="text-sm text-slate-400">{isSupabaseConfigured ? "Changes publish to Supabase and persist in this browser." : "Supabase is not configured. Changes persist in this browser."}</p>
    {loading && <p role="status" className="text-slate-400">Loading experiences...</p>}
    {loadError && <p role="alert" className="text-amber-300">{loadError}</p>}
    {error && <p role="alert" className="text-red-300">{error}</p>}
    {notice && <p role="status" className="text-emerald-300">{notice}</p>}
    <fieldset disabled={busy || loading} className="space-y-8 disabled:opacity-60">
      <form onSubmit={submit} className="space-y-5">
        <h3 className="text-lg font-medium">{editing === null ? "Add experience" : "Edit experience"}</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Role"><input className={inputClass} required pattern=".*\S.*" value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} /></Field>
          <Field label="Organization"><input className={inputClass} required pattern=".*\S.*" value={draft.organization} onChange={(event) => setDraft({ ...draft, organization: event.target.value })} /></Field>
          <Field label="Start Month"><select className={inputClass} required value={draft.startMonth} onChange={(event) => setDraft({ ...draft, startMonth: event.target.value })}><option value="" disabled>Select month</option>{MONTHS.map((month) => <option key={month}>{month}</option>)}</select></Field>
          <Field label="Start Year"><input className={inputClass} type="number" required min={1} max={9999} step={1} value={draft.startYear || ""} onChange={(event) => setDraft({ ...draft, startYear: event.target.valueAsNumber })} /></Field>
          <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={draft.isCurrent} onChange={(event) => setDraft({ ...draft, isCurrent: event.target.checked })} />Is Current Role?</label>
          <Field label="End Month"><select className={inputClass} disabled={draft.isCurrent} required={!draft.isCurrent} value={draft.endMonth ?? ""} onChange={(event) => setDraft({ ...draft, endMonth: event.target.value })}><option value="" disabled>Select month</option>{MONTHS.map((month) => <option key={month}>{month}</option>)}</select></Field>
          <Field label="End Year"><input className={inputClass} type="number" disabled={draft.isCurrent} required={!draft.isCurrent} min={1} max={9999} step={1} value={draft.endYear || ""} onChange={(event) => setDraft({ ...draft, endYear: event.target.valueAsNumber })} /></Field>
          <Field label="Location"><input className={inputClass} required pattern=".*\S.*" value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></Field>
          <Field label="Domain Tags (comma separated)"><input className={inputClass} value={tags} onChange={(event) => setTags(event.target.value)} /></Field>
        </div>
        <Field label="Highlights (one per line)"><textarea className={inputClass} rows={5} value={highlights} onChange={(event) => setHighlights(event.target.value)} /></Field>
        <div className="flex flex-wrap gap-3"><button className={buttonClass}>{busy ? "Saving..." : "Save experience"}</button>{editing !== null && <button type="button" className={buttonClass} onClick={reset}>Cancel edit</button>}</div>
      </form>
      <ul aria-label="Existing experiences" className="space-y-4">
        {experiences.map((item, index) => <li key={item.id ?? index} className="rounded-xl border border-slate-800 bg-[#0B0F17] p-5">
          <h3 className="font-semibold">{item.role}</h3><p className="mt-1 text-sm text-slate-400">{item.organization} · {formatExperiencePeriod(item)} · {item.location}</p>
          <div className="mt-4 flex gap-3"><button type="button" className={buttonClass} aria-label={`Edit ${item.role} at ${item.organization}`} onClick={() => edit(item, index)}>Edit</button><button type="button" className={buttonClass} aria-label={`Delete ${item.role} at ${item.organization}`} onClick={() => setDeleting(index)}>Delete</button></div>
          {deleting === index && <div className="mt-4 space-y-3"><p className="text-sm text-amber-300">Delete this experience?</p><div className="flex gap-3"><button type="button" className={buttonClass} onClick={() => void remove(index)}>Confirm delete</button><button type="button" className={buttonClass} onClick={() => setDeleting(null)}>Cancel</button></div></div>}
        </li>)}
      </ul>
      {!experiences.length && <p className="text-slate-400">No experiences yet. Add your first entry above.</p>}
    </fieldset>
  </div>;
}

