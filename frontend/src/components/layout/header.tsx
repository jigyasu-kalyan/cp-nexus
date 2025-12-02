"use client";

import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import type { User } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Terminal, Search, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  // Get first letter of username or email
  const getInitials = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b border-white/10 bg-black/50 px-6 backdrop-blur-md">
      {/* We can add a mobile sidebar toggle here later */}
      <div className="w-full flex-1">
        {/* We can add a search bar here later */}
      </div>

      {/* User Profile Button */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black border-white/10 text-zinc-200">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Settings</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white">Support</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-950/20 focus:text-red-300" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}