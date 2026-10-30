"use client";

import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { useExperiences } from "@/lib/use-experiences";

export default function Timeline() {
  const { experiences } = useExperiences();
  return (
    <section aria-labelledby="timeline-title" className="py-12">
      <p className="font-mono text-xs tracking-widest text-cyan-400">EXPERIENCE LOG</p>
      <h2 id="timeline-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
        Experience &amp; academic journey
      </h2>
      <ol aria-label="Experience, newest first" className="relative mt-8 space-y-6 border-l border-slate-800 ml-4 pl-8 sm:pl-10">
        {experiences.map((experience, index) => (
          <li key={experience.id ?? index} className="relative">
            <span className="absolute -left-12 top-6 flex size-8 items-center justify-center rounded-full border border-cyan-800/40 bg-[#0B0F17] text-cyan-400 sm:-left-14">
              <Briefcase size={16} aria-hidden="true" />
            </span>
            <article aria-labelledby={`experience-${experience.id ?? index}`} className="deck-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 id={`experience-${experience.id ?? index}`} className="text-xl font-semibold">
                    {experience.role}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">{experience.organization}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/40">
                  <Calendar size={12} aria-hidden="true" />
                  {experience.period}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-slate-400 text-xs">
                <MapPin size={14} className="shrink-0" aria-hidden="true" />
                {experience.location}
              </p>
              <ul aria-label="Highlights" className="mt-5 space-y-3">
                {experience.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <ul aria-label="Technologies and domains" className="mt-5 flex flex-wrap gap-2">
                {experience.tags.map((tag) => (
                  <li key={tag} className="font-mono text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
      {!experiences.length && <p className="mt-8 text-slate-400">No experience entries yet.</p>}
    </section>
  );
}
