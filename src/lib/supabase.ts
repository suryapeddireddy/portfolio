import { createClient } from "@supabase/supabase-js";
import type { ExperienceItem, Project } from "@/types";

// public.experiences uses domain_tags and does not store experience type.
export type ExperienceRow = Omit<ExperienceItem, "id" | "tags" | "type"> & {
  id: string;
  domain_tags: string[] | null;
};

function experienceFromRow(row: ExperienceRow): ExperienceItem {
  return { id: row.id, role: row.role, organization: row.organization, location: row.location,
    period: row.period, highlights: row.highlights ?? [], tags: row.domain_tags ?? [], type: "Internship" };
}

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

type Database = {
  public: {
    Tables: {
      experiences: {
        Row: ExperienceRow;
        Insert: ExperienceRow;
        Update: Partial<ExperienceRow>;
        Relationships: [];
      };
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, "created_at"> & { created_at?: string };
        Update: Partial<ProjectRow>;
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

export async function fetchExperiencesFromSupabase(): Promise<ExperienceItem[]> {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured. Using browser-local experience data.");
  const { data, error } = await supabase.from("experiences").select("*").order("period", { ascending: false }).order("id");
  if (error) throw new Error(error.message);
  return data.map(experienceFromRow);
}

export async function upsertExperienceInSupabase(experience: ExperienceItem): Promise<ExperienceItem> {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
  const row: ExperienceRow = {
    id: experience.id || crypto.randomUUID(), role: experience.role, organization: experience.organization,
    location: experience.location, period: experience.period, highlights: experience.highlights, domain_tags: experience.tags,
  };
  const { data, error } = await supabase.from("experiences").upsert(row).select("*").single();
  if (error) throw new Error(error.message);
  return { ...experienceFromRow(data), type: experience.type };
}

export async function deleteExperienceFromSupabase(id: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.from("experiences").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (!data.length) throw new Error("No experience was deleted. Check the row and your database permissions.");
}

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
