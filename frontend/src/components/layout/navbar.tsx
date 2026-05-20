"use client";

import { Bell, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle dark:text-text-subtle-dark" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 pl-9 pr-3 text-sm placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-input flex items-center justify-center text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 rounded-input flex items-center justify-center text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <Avatar name="User" size="sm" className="cursor-pointer" />
      </div>
    </header>
  );
}
