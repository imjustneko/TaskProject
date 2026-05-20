interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "accent" | "success" | "warn" | "danger";
  dot?: boolean;
  children?: React.ReactNode;
}

export function Badge({ tone, dot = false, children, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`badge${className ? " " + className : ""}`}
      data-tone={tone}
      {...props}
    >
      {dot && <i className="dot" />}
      {children}
    </span>
  );
}
