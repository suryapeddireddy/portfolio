import { createClient } from "@supabase/supabase-js";
import type { Project, ExperienceItem } from "@/types";

export type ProjectRow = {
  id: string;
  title: string;
  tagline: string;
  category: Project["category"];
  tags: string[];
  summary: string;
  problem: string;
  solution: string;
  performance_gain: string | null;
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  date: string;
};

export type ExperienceRow = {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: string;
  highlights: string[];
  tags: string[];
};

type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, "created_at"> & { created_at?: string };
        Update: Partial<ProjectRow>;
        Relationships: [];
      };
      experiences: {
        Row: ExperienceRow;
        Insert: Omit<ExperienceRow, "id"> & { id?: string };
        Update: Partial<ExperienceRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Always returns a valid client instance so components can execute queries safely
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Helper to verify if environment keys are actually loaded
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// --- Project Mappers ---
export function projectFromRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    tagline: row.tagline,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    summary: row.summary,
    architectureDetails: {
      problem: row.problem ?? "",
      solution: row.solution ?? "",
      performanceGain: row.performance_gain ?? undefined,
    },
    githubUrl: row.github_url ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    featured: row.featured ?? false,
    date: row.date,
  };
}

export function projectToRow(project: Project): ProjectRow {
  return {
    id: project.id,
    title: project.title,
    tagline: project.tagline,
    category: project.category,
    tags: project.tags ?? [],
    summary: project.summary,
    problem: project.architectureDetails?.problem ?? "",
    solution: project.architectureDetails?.solution ?? "",
    performance_gain: project.architectureDetails?.performanceGain || null,
    github_url: project.githubUrl || null,
    demo_url: project.demoUrl || null,
    featured: project.featured ?? false,
    date: project.date,
  };
}

// --- Experience Mappers ---
export function experienceFromRow(row: ExperienceRow): ExperienceItem {
  return {
    id: row.id,
    role: row.role,
    organization: row.organization,
    location: row.location,
    period: row.period,
    type: row.type as ExperienceItem["type"],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export function experienceToRow(item: ExperienceItem): ExperienceRow {
  return {
    id: item.id || crypto.randomUUID(),
    role: item.role,
    organization: item.organization,
    location: item.location,
    period: item.period,
    type: item.type,
    highlights: item.highlights ?? [],
    tags: item.tags ?? [],
  };
}