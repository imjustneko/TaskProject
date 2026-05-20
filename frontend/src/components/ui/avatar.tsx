import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";
import type { StatusType } from "@/types";

const sizes = {
  sm:  { container: "h-8 w-8 text-xs",   dot: "h-2.5 w-2.5" },
  md:  { container: "h-10 w-10 text-sm",  dot: "h-3 w-3" },
  lg:  { container: "h-14 w-14 text-base",dot: "h-3.5 w-3.5" },
  xl:  { container: "h-20 w-20 text-xl",  dot: "h-4 w-4" },
  "2xl":{ container: "h-28 w-28 text-3xl",dot: "h-4 w-4" },
};

const statusColors: Record<StatusType, string> = {
  PLAYING:  "bg-status-playing",
  COOKING:  "bg-status-cooking",
  WALKING:  "bg-status-walking",
  STUDYING: "bg-status-studying",
  READING:  "bg-status-reading",
  WORKING:  "bg-status-working",
  CUSTOM:   "bg-status-custom",
  OFFLINE:  "bg-status-offline",
};

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof sizes;
  status?: StatusType;
  className?: string;
}

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  const s = sizes[size];
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden bg-primary-100 dark:bg-primary-700 flex items-center justify-center font-semibold text-primary-600 dark:text-primary-200",
          s.container
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 112px"
          />
        ) : (
          getInitials(name)
        )}
      </div>
      {status && status !== "OFFLINE" && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-surface dark:border-surface-dark",
            s.dot,
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
