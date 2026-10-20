import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "P. Surya | C++ HPC & Systems",
  description:
    "P. Surya is an IIT Kharagpur alumnus focused on C++ systems engineering, high-performance computing, parallel solvers, and computational science.",
  keywords: [
    "P. Surya",
    "IIT Kharagpur",
    "C++ Systems Engineering",
    "High-Performance Computing",
    "Parallel Solvers",
    "OpenMP",
    "Computational Science",
    "C++20",
    "LeetCode Guardian",
  ],
  openGraph: {
    title: "P. Surya | IIT Kharagpur — C++ HPC & Systems",
    description:
      "Portfolio of P. Surya, IIT Kharagpur alumnus specializing in C++ systems engineering, high-performance computing, and parallel scientific computing.",
    type: "website",
    siteName: "P. Surya",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
