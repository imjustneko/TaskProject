"use client";

import { Bell, Search, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/useAuth";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle dark:text-text-subtle-dark" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 pl-9 pr-3 text-sm placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-base dark:text-text-base-dark"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-input flex items-center justify-center text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="relative h-9 w-9 rounded-input flex items-center justify-center text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-input px-2 py-1 hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors"
          >
            <Avatar name={user?.displayName ?? "User"} src={user?.avatarUrl} size="sm" />
            <span className="hidden sm:block text-sm font-medium text-text-base dark:text-text-base-dark max-w-[120px] truncate">
              {user?.displayName}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-card border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-lg z-50 py-1">
              <div className="px-3 py-2 border-b border-border dark:border-border-dark">
                <p className="text-sm font-medium text-text-base dark:text-text-base-dark truncate">
                  {user?.displayName}
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark truncate">
                  @{user?.username}
                </p>
              </div>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-500 hover:bg-error-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
