export type Category = 'All' | 'Systems & C++' | 'Robotics & Sim' | 'Geospatial & Operations' | 'Full-Stack';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: Category;
  tags: string[];
  summary: string;
  architectureDetails: {
    problem: string;
    solution: string;
    performanceGain?: string;
  };
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  date: string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  accent: 'cyan' | 'mint' | 'amber';
}

export interface ProfileConfig {
  name: string;
  handle: string;
  title: string;
  statusBadge: string;
  education: {
    degree: string;
    institution: string;
    year: string;
  };
  bioParagraphs: string[];
  socials: {
    github: string;
    linkedin: string;
    email: string;
    leetcode: string;
    codeforces: string;
  };
}

export interface ExperienceItem {
  id?: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: 'Internship' | 'Full-Time' | 'Academic/Research';
  highlights: string[];
  tags: string[];
}

export interface EducationItem {
  institution: string;
  location: string;
  degree: string;
  period: string;
  cgpa: string;
  courseworkCategories: {
    title: string;
    courses: string[];
  }[];
}
