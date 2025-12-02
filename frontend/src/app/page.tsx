import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, Trophy, Users, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-white/10 backdrop-blur-md bg-black/50 fixed w-full z-50">
        <Link className="flex items-center justify-center" href="#">
          <Terminal className="h-6 w-6 text-white" />
          <span className="ml-2 text-lg font-bold tracking-tighter">CP-Nexus</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-zinc-300 transition-colors" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:text-zinc-300 transition-colors" href="/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1 pt-14">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                  Master Competitive Programming
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                  Track your progress, visualize your stats, and compete with friends. The ultimate dashboard for coders.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
                  href="/register"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
                  href="/login"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full px-4 mx-auto">
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
    <div className="p-6 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 transition-all text-left">
      <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}