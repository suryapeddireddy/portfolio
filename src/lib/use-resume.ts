"use client";

import { useEffect, useState } from "react";
import { getLatestResumeUrl, RESUME_FALLBACK_URL } from "./supabase";

export function useResumeUrl() {
  const [url, setUrl] = useState(RESUME_FALLBACK_URL);
  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const latest = await getLatestResumeUrl();
        if (active) setUrl(latest || RESUME_FALLBACK_URL);
      } catch { /* Keep the static resume available when storage is unavailable. */ }
    }
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); };
  }, []);
  return url;
}
