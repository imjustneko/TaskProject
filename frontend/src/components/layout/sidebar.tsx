"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";

const navMain = [
  { href: "/dashboard",    label: "Home",    icon: "home" },
  { href: "/tasks/today",  label: "Today",   icon: "sun" },
  { href: "/tasks/plans",  label: "Plans",   icon: "calendar" },
  { href: "/friends",      label: "Friends", icon: "users" },
  { href: "/profile/edit", label: "Profile", icon: "edit" },
];

function Icon({ name, size = 15 }: { name: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":     return <svg {...props}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-4v-6h-8v6H4a1 1 0 0 1-1-1z"/></svg>;
    case "sun":      return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>;
    case "calendar": return <svg {...props}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>;
    case "users":    return <svg {...props}><circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/></svg>;
    case "edit":     return <svg {...props}><path d="m4 20 4-1 11-11-3-3L5 16l-1 4z"/></svg>;
    case "hash":     return <svg {...props}><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/></svg>;
    case "plus":     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "logout":   return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    default:         return null;
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userForAvatar = user
    ? {
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        status: user.status
          ? { presence: "online", emoji: "", label: user.status.customText ?? user.status.type }
          : undefined,
        presence: user.status ? "online" : "offline",
      }
    : null;

  return (
    <aside className="side">
      <div className="side-brand">
        <div className="side-brand-mark">T</div>
        <span>Taskyy</span>
      </div>

      <Link
        href="/tasks/today"
        className="btn btn-accent btn-sm"
        style={{ margin: "4px 4px 14px", justifyContent: "flex-start", height: 32, paddingLeft: 10 }}
      >
        <Icon name="plus" size={14} />
        New task
      </Link>

      <div className="side-section">Personal</div>
      {navMain.map((n) => {
        const active = pathname === n.href || pathname.startsWith(n.href + "/");
        return (
          <Link
            key={n.href}
            href={n.href}
            className="side-link"
            data-active={active ? "1" : "0"}
          >
            <Icon name={n.icon} size={15} />
            <span>{n.label}</span>
          </Link>
        );
      })}

      <div className="side-section row" style={{ justifyContent: "space-between" }}>
        <span>Rooms</span>
        <Icon name="plus" size={12} />
      </div>
      <Link href="/rooms" className="side-link" data-active={pathname.startsWith("/rooms") ? "1" : "0"}>
        <Icon name="hash" size={15} />
        <span className="truncate">Browse rooms</span>
      </Link>

      <div className="side-foot">
        <div className="side-me">
          <Avatar user={userForAvatar} size={30} status onBg="subtle" />
          <div className="flex1 truncate">
            <div className="side-me-name truncate">{user?.displayName ?? "User"}</div>
            <div className="side-me-status truncate">
              {user?.status
                ? `${user.status.emoji ?? ""} ${user.status.customText ?? user.status.type ?? ""}`.trim()
                : "@" + (user?.username ?? "")}
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            onClick={handleLogout}
            title="Sign out"
            style={{ flexShrink: 0 }}
          >
            <Icon name="logout" size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
