import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, LayoutDashboard, Calendar, Users, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/team', label: 'My Teams', icon: Users },
    { href: '/contests', label: 'Contest Calendar', icon: Calendar },
    { href: '/editor', label: 'Hardcore Editor', icon: Flame },
  ];

  return (
    <div className="hidden border-r border-white/10 bg-black/50 backdrop-blur md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-white/10 px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
            <Terminal className="h-6 w-6 text-white" />
            <span className="">CP-Nexus</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}