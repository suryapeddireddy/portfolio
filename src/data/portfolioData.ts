import type { ProfileConfig, Metric, Project, ExperienceItem, EducationItem } from '../types';

export const profileConfig: ProfileConfig = {
  name: "P. Surya",
  handle: "SURYA.SYS",
  title: "Computational Science & High-Performance Computing",
  statusBadge: "🟢 Open to Software, Systems & MS Programs",
  education: {
    degree: "B.Tech in Mining Engineering",
    institution: "IIT Kharagpur",
    year: "2025"
  },
  bioParagraphs: [
    "Mining Engineering graduate from IIT Kharagpur transitioning toward Computational Science, High-Performance Computing, and Parallel Systems.",
    "Solid foundation in C++ programming, OpenMP multithreading, numerical linear algebra, and performance-oriented computing.",
    "Built parallel solvers and stencil engines to study cache behavior, memory bandwidth limits, and parallel speedups across multi-core systems."
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "suryapeddireddy1203@gmail.com",
    leetcode: "https://leetcode.com",
    codeforces: "https://codeforces.com"
  }
};

export const metrics: Metric[] = [
  {
    id: "lc-rating",
    label: "LeetCode Peak",
    value: "1874",
    subtext: "1,500+ Algorithmic Problems Solved",
    accent: "cyan"
  },
  {
    id: "iit-kgp",
    label: "Pedigree",
    value: "IIT KGP",
    subtext: "B.Tech Mining Engineering",
    accent: "amber"
  },
  {
    id: "jee-rank",
    label: "JEE Advanced",
    value: "AIR 8000",
    subtext: "All India Rank",
    accent: "mint"
  }
];

export const projects: Project[] = [
  {
    id: "parallel-jacobi-solver",
    title: "Parallel Jacobi Linear System Solver",
    tagline: "OpenMP-parallelized solver for 2500x2500 linear systems achieving 4.81x speedup",
    category: "Systems & C++",
    tags: ["C++17", "OpenMP", "Multi-Threading", "Numerical Analysis", "GCC -O3"],
    summary: "Implemented an OpenMP-parallelized Jacobi iterative solver in C++17 for large linear systems without mutex lock overhead.",
    architectureDetails: {
      problem: "Iterative linear solvers encounter heavy synchronization bottlenecks during residual error convergence checks across multiple threads.",
      solution: "Designed a thread-safe loop using OpenMP reduction (max) primitives and strictly diagonally dominant matrices for convergence.",
      performanceGain: "Achieved 4.81x parallel speedup on 8 CPU cores"
    },
    githubUrl: "https://github.com",
    featured: true,
    date: "2025"
  },
  {
    id: "spatial-stencil-engine",
    title: "Parallel 2D Spatial Image Stencil Engine",
    tagline: "Cache-optimized 16-Megapixel spatial averaging engine with timing harness",
    category: "Systems & C++",
    tags: ["C++17", "OpenMP", "Cache Optimization", "SIMD", "Benchmarking"],
    summary: "Developed a 2D spatial averaging stencil engine operating on a 4000x4000 grid over 50 iterations.",
    architectureDetails: {
      problem: "2D spatial grid operations suffer from poor spatial cache locality and memory contention when using row/column pointer arrays.",
      solution: "Implemented a row-major memory layout with a flat 1D contiguous vector to maximize CPU L1/L2 cache locality.",
      performanceGain: "Analyzed low arithmetic intensity and memory bandwidth limits across 1, 2, 4, and 8 threads"
    },
    githubUrl: "https://github.com",
    featured: true,
    date: "2025"
  }
];

export const experiences: ExperienceItem[] = [
  {
    id: "unified-mentor-internship",
    role: "Web Development Intern",
    organization: "Unified Mentor Pvt Ltd",
    location: "Gurgaon, India",
    startMonth: "Jun", startYear: 2024, endMonth: "Jul", endYear: 2024, isCurrent: false,
    type: "Internship",
    highlights: [
      "Worked on backend workflow components for structured user data handling, validation, and persistence.",
      "Assisted in organizing database schemas and server-side logic to support efficient request handling."
    ],
    tags: ["Backend Workflows", "Data Persistence", "Database Schemas", "Input Validation"]
  },
  {
    id: "sccl-field-internship",
    role: "Field Engineering Intern",
    organization: "The Singareni Collieries Company Limited (SCCL)",
    location: "Telangana, India",
    startMonth: "May", startYear: 2024, endMonth: "Jun", endYear: 2024, isCurrent: false,
    type: "Internship",
    highlights: [
      "Completed field engineering study at Ravindrakhani No. 6 Incline underground coal operations.",
      "Observed daily underground Board and Pillar face operations, continuous miner setups, and mechanized material handling workflows."
    ],
    tags: ["Underground Coal Operations", "Field Engineering", "Continuous Miner Setups", "Material Handling"]
  }
];
export const educationData: EducationItem = {
  institution: "Indian Institute of Technology (IIT) Kharagpur",
  location: "West Bengal, India",
  degree: "Bachelor of Technology (B.Tech): Mining Engineering",
  period: "2020 – 2025",
  cgpa: "7.04 / 10.00",
  courseworkCategories: [
    {
      title: "Computational & Programming",
      courses: [
        "Programming and Data Structures (Theory & Lab)",
        "Computational Methods and Mine Instrumentation",
        "Mine Computation Laboratory",
        "Engineering Drawing and Computer Graphics"
      ]
    },
    {
      title: "Mathematics & Quantitative Analysis",
      courses: [
        "Advanced Calculus",
        "Linear Algebra, Numerical & Complex Analysis",
        "Probability and Statistics",
        "Quantitative Decision Making"
      ]
    },
    {
      title: "Core Engineering & Physical Sciences",
      courses: [
        "Basic Engineering Mechanics",
        "Basic Electronics & Electronics Laboratory",
        "Electrical Technology",
        "Engineering Laboratory",
        "Solid Mechanics",
        "Physics of Waves & Physics Laboratory",
        "Chemistry & Chemistry Laboratory"
      ]
    },
    {
      title: "Geology & Applied Geomechanics",
      courses: [
        "Geology for Engineers & Geology Laboratory",
        "Rock Mechanics & Rock Mechanics Laboratory",
        "Development of Mineral Deposits",
        "Mine Surveying and Geoinformatics"
      ]
    }
  ]
};
