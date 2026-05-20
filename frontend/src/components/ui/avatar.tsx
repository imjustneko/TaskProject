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
  const presence = user?.presence ?? user?.status?.presence;
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
      {status && presence && <span className="avatar-status" data-s={presence} />}
    </div>
  );
}
