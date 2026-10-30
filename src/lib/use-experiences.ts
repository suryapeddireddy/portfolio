"use client";

import { useEffect, useState } from "react";
import { saveExperiences, usePortfolioContent } from "./portfolio-store";
import { fetchExperiencesFromSupabase, isSupabaseConfigured } from "./supabase";

export function useExperiences() {
  const { experiences } = usePortfolioContent();
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    void fetchExperiencesFromSupabase().then((items) => {
      if (active) saveExperiences(items);
    }).catch((cause: unknown) => {
      if (active) setError(`Could not synchronize experiences. Using saved browser data or starter entries. ${cause instanceof Error ? cause.message : "Check your connection."}`);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { experiences, loading, error };
}
