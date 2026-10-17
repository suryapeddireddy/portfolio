"use client";

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
