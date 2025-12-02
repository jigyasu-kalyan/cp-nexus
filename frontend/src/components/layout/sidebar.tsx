import Link from 'next/link';
import { Terminal } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="hidden border-r border-slate-800 bg-slate-900/50 backdrop-blur md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-slate-800 px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
            <Terminal className="h-6 w-6 text-blue-500" />
            <span className="">CP-Nexus</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* We will add our links here later */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2 text-blue-400 transition-all hover:text-blue-300"
            >
              Dashboard
            </Link>
            <Link
              href="/team"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:text-slate-100 hover:bg-slate-800/50"
            >
              My Teams
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}