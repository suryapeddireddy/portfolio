"use client";

import { GraduationCap, BookOpen, Award, Check } from "lucide-react";
import { educationData } from "@/data/portfolioData";
import type { EducationItem } from "@/types";

export default function EducationDeck() {
  const education: EducationItem = educationData;

  return (
    <section aria-labelledby="education-title" className="py-12">
      <div className="flex items-center gap-4">
        <h2 id="education-title" className="font-mono text-cyan-400 text-sm tracking-wider uppercase">
          03. EDUCATION &amp; ACADEMIC PREPARATION
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-cyan-800/40" />
      </div>

      <article aria-labelledby="education-institution" className="deck-card mt-8 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-800/40 bg-cyan-950/30 text-cyan-400">
              <GraduationCap size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 id="education-institution" className="text-xl font-semibold text-slate-100 sm:text-2xl">
                {education.institution}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{education.degree}</p>
              <p className="mt-2 text-xs text-slate-400">{education.location}</p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-800/40 bg-cyan-950/30 px-3 py-1 font-mono text-xs text-cyan-400">
            {education.period}
          </span>
        </div>
        <div className="mt-5">
          <span className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 px-3 py-1 rounded-full">
            <Award size={14} aria-hidden="true" />
            CGPA: {education.cgpa}
          </span>
        </div>
      </article>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {education.courseworkCategories.map((category, index) => (
          <article key={category.title} aria-labelledby={`coursework-title-${index}`} className="deck-card min-w-0 rounded-2xl p-5 sm:p-6">
            <h3 id={`coursework-title-${index}`} className="flex items-start gap-2 font-mono text-cyan-400 text-xs">
              <BookOpen size={16} className="shrink-0" aria-hidden="true" />
              {category.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {category.courses.map((course) => (
                <li key={course} className="inline-flex max-w-full items-start gap-1.5 font-mono text-xs bg-slate-900/80 text-slate-300 border border-slate-800 px-2.5 py-1 rounded">
                  <Check size={12} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <span className="min-w-0 break-words">{course}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
