import { cn } from "@/lib/utils";

const variants = {
  default:  "bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-sm",
  elevated: "bg-surface dark:bg-surface-dark shadow-md",
  bordered: "bg-surface dark:bg-surface-dark border-2 border-primary-200 dark:border-primary-700",
  ghost:    "bg-surface-2 dark:bg-surface-dark-2",
};

const paddings = {
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  padding?: keyof typeof paddings;
}

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card transition-shadow",
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
