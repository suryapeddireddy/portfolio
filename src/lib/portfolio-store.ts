"use client";

import { normalizeExperience, compareExperiences, MONTHS } from "./experience-dates";
import { useSyncExternalStore } from "react";
import { experiences, metrics, profileConfig, projects } from "../data/portfolioData";
import type { ExperienceItem, Metric, ProfileConfig, Project } from "../types";

export const AUTH_KEY = "surya_admin_auth";
const DATA_KEY = "surya_portfolio_data_v1";
const CHANGE_EVENT = "surya-storage-change";
export const projectCategories = ["Systems & C++", "Robotics & Sim", "Geospatial & Operations", "Full-Stack"] as const;

export interface PortfolioContent {
  profile: ProfileConfig;
  projects: Project[];
  metrics: Metric[];
  experiences: ExperienceItem[];
}

const defaults: PortfolioContent = { profile: profileConfig, projects, metrics, experiences };
let cachedRaw: string | null = null;
let cachedContent = defaults;

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

function readRaw() {
  try { return localStorage.getItem(DATA_KEY); } catch { return null; }
}

function isContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== "object") return false;
  const content = value as PortfolioContent;
  const profile = content.profile;
  return !!profile && [profile.name, profile.title, profile.statusBadge, profile.handle].every((item) => typeof item === "string")
    && Array.isArray(profile.bioParagraphs) && profile.bioParagraphs.every((item) => typeof item === "string")
    && Array.isArray(content.projects) && content.projects.every((project) => project && typeof project.id === "string"
      && [project.title, project.tagline, project.summary, project.date].every((item) => typeof item === "string")
      && projectCategories.some((category) => category === project.category)
      && Array.isArray(project.tags) && project.tags.every((tag) => typeof tag === "string")
      && !!project.architectureDetails && typeof project.architectureDetails.problem === "string"
      && typeof project.architectureDetails.solution === "string")
    && (content.experiences === undefined || (Array.isArray(content.experiences) && content.experiences.every((item) => item
      && (item.id === undefined || typeof item.id === "string")
      && [item.role, item.organization, item.location].every((field) => typeof field === "string")
      && (typeof item.period === "string" || (MONTHS.includes(item.startMonth as typeof MONTHS[number]) && Number.isInteger(item.startYear) && typeof item.isCurrent === "boolean"))
      && ["Internship", "Full-Time", "Academic/Research"].includes(item.type)
      && Array.isArray(item.highlights) && item.highlights.every((field) => typeof field === "string")
      && Array.isArray(item.tags) && item.tags.every((field) => typeof field === "string"))))
    && Array.isArray(content.metrics) && content.metrics.every((metric) => metric
      && [metric.id, metric.label, metric.value, metric.subtext].every((item) => typeof item === "string")
      && ["cyan", "mint", "amber"].includes(metric.accent));
}

function snapshot() {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedContent;
  cachedRaw = raw;
  try {
    const value: unknown = raw ? JSON.parse(raw) : null;
    cachedContent = isContent(value) ? { ...value, experiences: (value.experiences ?? experiences).map(normalizeExperience).sort(compareExperiences) } : defaults;
  } catch { cachedContent = defaults; }
  return cachedContent;
}

export function usePortfolioContent() {
  return useSyncExternalStore(subscribe, snapshot, () => defaults);
}

export function savePortfolioContent(content: PortfolioContent) {
  localStorage.setItem(DATA_KEY, JSON.stringify({ ...content, experiences: content.experiences.map(normalizeExperience).sort(compareExperiences) }));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function saveExperiences(experiences: ExperienceItem[]) {
  savePortfolioContent({ ...snapshot(), experiences });
}

function authSnapshot() {
  try { return localStorage.getItem(AUTH_KEY) === "true"; } catch { return false; }
}

export function useAdminAuth() {
  return useSyncExternalStore(subscribe, authSnapshot, () => false);
}

export function setAdminAuth(authenticated: boolean) {
  if (authenticated) localStorage.setItem(AUTH_KEY, "true");
  else localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
