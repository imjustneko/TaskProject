"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  DoorOpen,
  MessageCircle,
  User,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Home",    icon: LayoutDashboard },
  { href: "/tasks/today", label: "Today",  icon: CheckSquare },
  { href: "/tasks/plans", label: "Plans",  icon: Calendar },
  { href: "/friends",     label: "Friends",icon: Users },
  { href: "/rooms",       label: "Rooms",  icon: DoorOpen },
  { href: "/chat",        label: "Chat",   icon: MessageCircle },
  { href: "/profile/edit",label: "Profile",icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border dark:border-border-dark">
        <span className="text-xl font-bold text-primary-500">Taskyy</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 dark:bg-primary-700/20 text-primary-600 dark:text-primary-400"
                  : "text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-text-base dark:hover:text-text-base-dark"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle placeholder */}
      <div className="p-3 border-t border-border dark:border-border-dark">
        <p className="text-xs text-text-subtle dark:text-text-subtle-dark px-3">Theme toggle coming soon</p>
      </div>
    </aside>
  );
}
