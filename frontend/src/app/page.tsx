import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, Trophy, Users, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex mini-h-screen flex-col bg-slate-950 text-white">
      <header className="px-6 h-16 flex items-center justify-between border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Terminal className="h-6 w-6 text-blue-500" />
          <span>CP-Nexus</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-linear-to-b from-slate-950 to-slate-900">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-sm text-slate-400 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            v1.0 Now Live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600">
            Master Competitive Programming
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The unified dashboard for Codeforces, CodeChef, and AtCoder.
            Track your progress, manage ICPC teams, and visualize your grind.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700">
                Start Grinding
              </Button>
            </Link>
            <Link href="https://github.com/jigyasu-kalyan/cp-nexus" target="_blank">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-slate-700 text-slate-800 hover:bg-slate-800">
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full px-4">
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-blue-400" />}
            title="Unified Stats"
            desc="Aggregate ratings and submissions from all major platforms in one heatmap."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-400" />}
            title="ICPC Team Hub"
            desc="Form teams, track collective progress, and analyze coverage gaps together."
          />
          <FeatureCard
            icon={<Trophy className="h-8 w-8 text-yellow-400" />}
            title="Virtual Contests"
            desc="Simulate contests with unseen problems to train under pressure."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all text-left">
      <div className="mb-4 p-3 bg-slate-950 rounded-lg w-fit border-slate-800">
        { icon }
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{ title }</h3>
      <p className="text-slate-400 leading-relaxed">{ desc }</p>
    </div>
  );
}