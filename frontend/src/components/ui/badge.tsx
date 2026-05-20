import { cn } from "@/lib/utils";

const variants = {
  default:  "bg-surface-2 dark:bg-surface-dark-2 text-text-base dark:text-text-base-dark border border-border dark:border-border-dark",
  primary:  "bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-300",
  success:  "bg-success-500/10 text-success-500",
  warning:  "bg-warning-500/10 text-warning-500",
  error:    "bg-error-500/10 text-error-500",
  accent:   "bg-accent-500/10 text-accent-500",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
  dot?: boolean;
}

export function Badge({
  variant = "default",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
