import HeroDeck from "../components/HeroDeck";
import ProjectBento from "../components/ProjectBento";
import Timeline from "../components/Timeline";
import EducationDeck from "../components/EducationDeck";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] bg-command-grid px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <HeroDeck />
        <ProjectBento />
        <Timeline />
        <EducationDeck />
      </div>
    </main>
  );
}
