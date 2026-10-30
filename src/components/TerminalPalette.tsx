"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useResumeUrl } from "@/lib/use-resume";
import { usePortfolioContent } from "../lib/portfolio-store";

const terminalFont = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

interface CommandEntry {
  command: string;
  output: ReactNode;
}

function TerminalWindow({ entries, onCommand, onClose }: {
  entries: CommandEntry[];
  onCommand: (command: string) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
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

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [entries]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    onCommand(input.trim());
    setInput("");
  }

  return (
    <dialog
      ref={dialogRef}
      id="terminal-palette"
      aria-labelledby="terminal-title"
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-slate-200 backdrop:bg-transparent"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      <motion.div
        className="flex h-full items-center justify-center bg-[#030712]/80 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.18 }}
        onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      >
        <motion.section
          className="mx-2 flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-[#0B0F17] font-mono text-xs text-slate-200 shadow-2xl shadow-cyan-950/30 sm:mx-auto"
          style={{ fontFamily: terminalFont.style.fontFamily }}
          initial={{ y: reducedMotion ? 0 : 16 }} animate={{ y: 0 }} exit={{ y: reducedMotion ? 0 : 16 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/60 px-4 py-3">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </span>
            <h2 id="terminal-title" className="flex-1 text-[10px] tracking-wider sm:text-xs">SURYA.SYS CLI v1.0.0</h2>
            <button type="button" onClick={onClose} aria-label="Close terminal" className="rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400"><X size={16} aria-hidden="true" /></button>
          </header>
          <div ref={outputRef} role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions" tabIndex={0} className="min-h-40 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 leading-relaxed focus-visible:outline-2 focus-visible:outline-cyan-400 sm:min-h-64">
            <p className="text-slate-400">Welcome to SURYA.SYS. Type <span className="text-cyan-300">help</span> to explore.</p>
            {entries.map((entry, index) => (
              <div key={index} className="space-y-2 break-words">
                <p><span className="text-emerald-400">surya@deck:~$ </span>{entry.command}</p>
                <div className="whitespace-pre-wrap">{entry.output}</div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-slate-800 px-5 py-4">
            <label htmlFor="terminal-command" className="shrink-0 text-emerald-400">surya@deck:~$ <span className="sr-only">Command</span></label>
            <input id="terminal-command" autoFocus value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} className="min-w-0 flex-1 bg-transparent text-slate-100 caret-cyan-400 outline-none focus-visible:ring-1 focus-visible:ring-cyan-500" />
          </form>
        </motion.section>
      </motion.div>
    </dialog>
  );
}

export default function TerminalPalette() {
  const resumeUrl = useResumeUrl();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<CommandEntry[]>([]);
  const { profile: profileConfig, projects, metrics } = usePortfolioContent();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!event.repeat) setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function runCommand(command: string) {
    const normalized = command.toLowerCase();
    if (normalized === "clear") {
      setEntries([]);
      return;
    }
    let output: ReactNode;
    switch (normalized) {
      case "help":
        output = "AVAILABLE COMMANDS\nhelp       Show this command menu\nabout      Biography & focus\nprojects   C++ parallel computing projects\nstats      Competitive programming & academic metrics\ncontact    Email, LinkedIn & GitHub\nsocials    Alias for contact\ncv         Open academic resume (PDF)\nresume     Alias for cv\nclear      Clear command log\n\nEsc closes · Cmd/Ctrl + K toggles terminal";
        break;
      case "cv":
      case "resume":
        window.open(resumeUrl, "_blank", "noopener,noreferrer");
        output = (
          <p>
            Academic resume (PDF): {" "}
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="break-all text-cyan-300 underline underline-offset-4 hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-cyan-400">
              {resumeUrl}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        );
        break;
      case "about":
        output = `${profileConfig.name} — ${profileConfig.title}\n\n${profileConfig.bioParagraphs.join("\n\n")}`;
        break;
      case "projects":
        output = projects.filter((project) => project.category === "Systems & C++").map((project) => `${project.title}\n${project.summary}\n${project.architectureDetails.performanceGain ?? project.tagline}`).join("\n\n") || "No C++ projects available.";
        break;
      case "stats":
        output = metrics.map((metric) => `${metric.label}: ${metric.value}\n${metric.subtext}`).join("\n\n");
        break;
      case "contact":
      case "socials":
        output = <div className="space-y-2">{[
          { label: "Email", text: profileConfig.socials.email, href: `mailto:${profileConfig.socials.email}` },
          { label: "LinkedIn", text: profileConfig.socials.linkedin, href: profileConfig.socials.linkedin },
          { label: "GitHub", text: profileConfig.socials.github, href: profileConfig.socials.github },
        ].map((link) => <p key={link.label}>{link.label}: <a href={link.href} target="_blank" rel="noopener noreferrer" className="break-all text-cyan-300 underline underline-offset-4 hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-cyan-400">{link.text}<span className="sr-only"> (opens in a new tab)</span></a></p>)}</div>;
        break;
      default:
        output = `Command not found: ${command}. Type help for available commands.`;
    }
    setEntries((previous) => [...previous, { command, output }]);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? "terminal-palette" : undefined} aria-keyshortcuts="Meta+K Control+K" className="fixed bottom-4 right-4 z-50 rounded-lg border border-cyan-500/40 bg-[#0B0F17]/95 p-3 font-mono text-xs text-cyan-300 shadow-lg hover:border-cyan-400 hover:bg-cyan-950 focus-visible:outline-2 focus-visible:outline-cyan-400">[ Terminal CLI (Cmd + K) ]</button>
      <AnimatePresence>{open && <TerminalWindow key="terminal" entries={entries} onCommand={runCommand} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
