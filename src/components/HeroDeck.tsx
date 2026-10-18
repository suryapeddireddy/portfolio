"use client";

import { Download, FileText } from "lucide-react";
import { usePortfolioContent } from "../lib/portfolio-store";

export default function HeroDeck() {
  const { profile: profileConfig, metrics } = usePortfolioContent();
  return (
    <section aria-labelledby="hero-title" className="space-y-6 py-12">
      <p className="font-mono text-sm text-emerald-400">{profileConfig.statusBadge}</p>
      <p className="font-mono text-cyan-400">{profileConfig.handle}</p>
      <h1 id="hero-title" className="text-4xl font-semibold tracking-tight sm:text-6xl">{profileConfig.name}</h1>
      <p className="max-w-3xl text-xl text-cyan-300">{profileConfig.title}</p>
      <div className="max-w-3xl space-y-3 text-slate-400">
        {profileConfig.bioParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href="/scientific_computing_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Resume (PDF) (opens in a new tab)"
          className="deck-card inline-flex items-center gap-2 rounded-xl px-5 py-3 font-mono text-sm font-semibold text-cyan-300 hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
        >
          <FileText size={18} aria-hidden="true" />
          [ View Resume (PDF) ]
        </a>
        <a
          href="/scientific_computing_CV.pdf"
          download="scientific_computing_CV.pdf"
          aria-label="Download CV (PDF)"
          className="deck-card inline-flex items-center gap-2 rounded-xl px-5 py-3 font-mono text-sm font-semibold text-emerald-300 hover:border-emerald-500/40 hover:text-emerald-100 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          <Download size={18} aria-hidden="true" />
          [ Download CV ]
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="deck-card rounded-xl p-5">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className={`my-2 font-mono text-2xl ${metric.accent === "amber" ? "text-amber-400" : metric.accent === "mint" ? "text-emerald-400" : "text-cyan-400"}`}>{metric.value}</p>
            <p className="text-sm text-slate-400">{metric.subtext}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
