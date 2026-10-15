"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Project } from "../types";

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

function DrawerContent({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
    >
      <dialog
        ref={dialogRef}
        aria-labelledby="project-drawer-title"
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-slate-100 backdrop:bg-black/70"
        onCancel={(event) => { event.preventDefault(); onClose(); }}
        onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      >
        <motion.div
          className="ml-auto flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-slate-800 bg-[#0b0f17] p-6 shadow-2xl sm:p-10"
          initial={{ x: reducedMotion ? 0 : "100%" }} animate={{ x: 0 }} exit={{ x: reducedMotion ? 0 : "100%" }}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
        >
          <button type="button" autoFocus onClick={onClose} aria-label="Close project specification" className="self-end rounded-lg border border-slate-700 p-3 text-sm hover:border-cyan-500 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400"><X size={20} aria-hidden="true" /></button>
          <span className="mt-8 self-start rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 font-mono text-xs text-cyan-400">{project.category}</span>
          <h2 id="project-drawer-title" className="mt-3 text-3xl font-semibold">{project.title}</h2>
          <p className="mt-4 text-slate-400">{project.tagline}</p>
          <div className="mt-8 space-y-8">
            <section><h3 className="text-lg font-semibold">Problem Statement</h3><p className="mt-2 leading-relaxed text-slate-400">{project.architectureDetails.problem}</p></section>
            <section><h3 className="text-lg font-semibold">Technical Solution</h3><p className="mt-2 leading-relaxed text-slate-400">{project.architectureDetails.solution}</p></section>
            {project.architectureDetails.performanceGain && <section className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4"><h3 className="font-mono text-xs text-emerald-400">Performance / Speedup Gain</h3><p className="mt-2 leading-relaxed text-emerald-200">{project.architectureDetails.performanceGain}</p></section>}
            <section><h3 className="text-lg font-semibold">Tech Tags</h3><ul className="mt-3 flex flex-wrap gap-2">{project.tags.map((tag) => <li key={tag} className="rounded-md border border-slate-700 px-2 py-1 font-mono text-xs text-cyan-300">{tag}</li>)}</ul></section>
          </div>
          {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-8 rounded-lg border border-cyan-500/40 px-4 py-3 text-center font-mono text-sm text-cyan-300 hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-cyan-400">View on GitHub ↗<span className="sr-only"> (opens in a new tab)</span></a> : <p className="mt-8 text-sm text-slate-400">GitHub repository unavailable.</p>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 rounded-lg border border-slate-700 px-4 py-3 text-center font-mono text-sm text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400">Live Demo ↗<span className="sr-only"> (opens in a new tab)</span></a>}
        </motion.div>
      </dialog>
    </motion.div>
  );
}

export default function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  return <AnimatePresence>{project && <DrawerContent key={project.id} project={project} onClose={onClose} />}</AnimatePresence>;
}
