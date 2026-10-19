"use client";

import { useEffect, useState } from "react";
import { projects as fallbackProjects } from "@/data/portfolioData";
import { isSupabaseConfigured, projectFromRow, supabase } from "@/lib/supabase";
import type { Category, Project } from "../types";
import ProjectDrawer from "./ProjectDrawer";

const categories: Category[] = ["All", "Systems & C++", "Robotics & Sim", "Geospatial & Operations", "Full-Stack"];

function Github({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.922c.563.104.768-.244.768-.542 0-.267-.01-.974-.015-1.912-3.13.68-3.79-1.508-3.79-1.508-.512-1.3-1.25-1.646-1.25-1.646-1.022-.699.077-.685.077-.685 1.13.08 1.724 1.16 1.724 1.16 1.005 1.722 2.637 1.225 3.28.937.102-.729.393-1.225.715-1.507-2.5-.285-5.128-1.25-5.128-5.565 0-1.23.44-2.233 1.16-3.02-.116-.285-.503-1.43.11-2.98 0 0 .945-.303 3.094 1.153A10.78 10.78 0 0 1 12 6.178c.956.004 1.918.129 2.817.38 2.148-1.456 3.092-1.153 3.092-1.153.615 1.55.228 2.695.112 2.98.722.787 1.158 1.79 1.158 3.02 0 4.328-2.632 5.277-5.14 5.556.404.35.764 1.043.764 2.1 0 1.517-.014 2.742-.014 3.114 0 .3.203.65.774.54A11.252 11.252 0 0 0 12 .75Z" />
    </svg>
  );
}

export default function ProjectBento() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      // Don't issue database calls if Supabase credentials aren't set in .env.local
      if (!isSupabaseConfigured) return;

      try {
        const { data, error } = await supabase.from("projects").select("*").order("date", { ascending: false });
        if (active) {
          setProjects(!error && data && data.length > 0 ? data.map(projectFromRow) : fallbackProjects);
        }
      } catch {
        if (active) setProjects(fallbackProjects);
      }
    }

    void loadProjects();
    return () => {
      active = false;
    };
  }, []);

  const [category, setCategory] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const visibleProjects = projects.filter((project) => category === "All" || project.category === category);

  return (
    <section aria-labelledby="projects-title" className="py-12">
      <p className="font-mono text-xs tracking-widest text-cyan-400">PROJECT MATRIX</p>
      <h2 id="projects-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
        Engineered systems
      </h2>

      <div role="group" aria-label="Filter projects by category" className="my-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={`rounded-full border px-3 py-2 font-mono text-xs focus-visible:outline-2 focus-visible:outline-cyan-400 ${
              category === item
                ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-400 shadow-[0_0_16px_-6px_rgba(6,182,212,0.5)]"
                : "border-slate-800 text-slate-400 hover:border-cyan-500/40 hover:text-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {visibleProjects.length} projects in {category}
      </p>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <article
            key={project.id}
            className={`deck-card flex flex-col rounded-2xl p-6 ${project.featured ? "lg:col-span-2" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="text-slate-400">{project.date}</span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-950/20 px-2 py-1 text-cyan-400">
                {project.category}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
            <p className="mt-3 leading-relaxed text-slate-400">{project.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{project.summary}</p>

            <ul aria-label="Technologies" className="my-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-md border border-slate-800 px-2 py-1 font-mono text-xs text-slate-300">
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`View System Spec: ${project.title}`}
                onClick={() => setSelectedProject(project)}
                className="rounded-lg border border-cyan-500/30 px-4 py-2 font-mono text-sm text-cyan-300 hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                View System Spec ↗
              </button>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub repository for ${project.title} (opens in a new tab)`}
                  className="rounded-lg border border-slate-800 p-3 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  <Github size={18} aria-hidden="true" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {visibleProjects.length === 0 && (
        <p className="deck-card rounded-2xl p-8 text-slate-400">No projects published in this category yet.</p>
      )}

      <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}