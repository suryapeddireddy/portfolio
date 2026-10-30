import { createClient } from "@supabase/supabase-js";
import { normalizeExperience, formatExperiencePeriod } from "./experience-dates";
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
  start_month: string;
  start_year: number;
  end_month: string | null;
  end_year: number | null;
  is_current: boolean;
  highlights: string[];
  domain_tags: string[];
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
  return normalizeExperience({
    id: row.id,
    role: row.role,
    organization: row.organization,
    location: row.location,
    period: row.period,
    startMonth: row.start_month, startYear: row.start_year,
    endMonth: row.end_month ?? undefined, endYear: row.end_year ?? undefined,
    isCurrent: row.is_current,
    type: "Internship",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    tags: Array.isArray(row.domain_tags) ? row.domain_tags : [],
  });
}

export function experienceToRow(item: ExperienceItem): ExperienceRow {
  return {
    id: item.id || crypto.randomUUID(),
    role: item.role,
    organization: item.organization,
    location: item.location,
    period: formatExperiencePeriod(item),
    start_month: item.startMonth, start_year: item.startYear,
    end_month: item.isCurrent ? null : item.endMonth ?? null,
    end_year: item.isCurrent ? null : item.endYear ?? null,
    is_current: item.isCurrent,
    highlights: item.highlights ?? [],
    domain_tags: item.tags ?? [],
  };
}
export async function fetchExperiencesFromSupabase(): Promise<ExperienceItem[]> {
  const { data, error } = await supabase.from("experiences").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []).map(experienceFromRow);
}

export async function upsertExperienceInSupabase(item: ExperienceItem): Promise<ExperienceItem> {
  const { data, error } = await supabase.from("experiences").upsert(experienceToRow(item)).select().single();
  if (error) throw new Error(error.message);
  return { ...experienceFromRow(data), type: item.type };
}

export async function deleteExperienceFromSupabase(id: string): Promise<void> {
  const { data, error } = await supabase.from("experiences").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("Experience was not deleted. Check database permissions or reload the list.");
}
