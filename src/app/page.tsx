import HeroDeck from "../components/HeroDeck";
import ProjectBento from "../components/ProjectBento";
import Timeline from "../components/Timeline";
import EducationDeck from "../components/EducationDeck";
import TerminalPalette from "../components/TerminalPalette";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] bg-command-grid text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <HeroDeck />
        <ProjectBento />
        <Timeline />
        <EducationDeck />
      </div>
      <TerminalPalette />
    </main>
  );
}
