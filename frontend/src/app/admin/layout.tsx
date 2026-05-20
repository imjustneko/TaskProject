import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <aside className="w-56 shrink-0 flex flex-col border-r border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        <div className="flex h-16 items-center px-5 border-b border-border dark:border-border-dark gap-2">
          <span className="text-lg font-bold text-primary-500">Taskyy</span>
          <span className="text-xs font-medium bg-error-500/10 text-error-500 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/users", label: "Users" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-2.5 rounded-card text-sm font-medium text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-text-base dark:hover:text-text-base-dark transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-y-auto p-8">{children}</div>
    </div>
  );
}
