// hueFor — deterministic color from a name string
export function hueFor(name: string): string {
  if (!name) return "#888";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 48%)`;
}

/** Map backend PresenceType → CSS data-s value */
export function presenceToDot(presence?: string | null): string {
  switch (presence) {
    case "ONLINE":    return "online";
    case "IDLE":      return "idle";
    case "DND":       return "dnd";
    case "INVISIBLE": return "invisible";
    case "OFFLINE":
    default:          return "offline";
  }
}

interface AvatarUser {
  id?: string;
  displayName?: string;
  name?: string;
  username?: string;
  avatarUrl?: string | null;
  status?: {
    type?: string;
    presence?: string;
    emoji?: string;
    label?: string;
    customText?: string;
  } | null;
  presence?: string;
}

interface AvatarProps {
  user?: AvatarUser | null;
  name?: string;
  src?: string | null;
  size?: number;
  status?: boolean;
  onBg?: "subtle" | "bg" | "elevated";
  className?: string;
}

export function Avatar({ user, name: nameProp, src: srcProp, size = 32, status = false, onBg, className }: AvatarProps) {
  const resolvedName = user?.displayName ?? user?.name ?? nameProp ?? "?";
  const resolvedSrc = user?.avatarUrl ?? srcProp;
  const bg = hueFor(resolvedName);
  const initials = resolvedName
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Resolve presence: explicit prop > status.presence > legacy string presence
  const rawPresence = user?.status?.presence ?? user?.presence;
  const dotValue = presenceToDot(rawPresence);
  const fontSize = Math.max(10, size * 0.38);

  return (
    <div
      className={`avatar${className ? " " + className : ""}`}
      data-on-bg={onBg}
      style={{ width: size, height: size, fontSize }}
    >
      <div className="avatar-inner" style={{ background: resolvedSrc ? undefined : bg }}>
        {resolvedSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolvedSrc} alt={resolvedName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          initials
        )}
      </div>
      {status && rawPresence && <span className="avatar-status" data-s={dotValue} />}
    </div>
  );
}
