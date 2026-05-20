import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size, icon, iconRight, children, className = "", ...props }, ref) => {
    const cls: string[] = ["btn"];
    if (variant === "primary") cls.push("btn-primary");
    if (variant === "accent") cls.push("btn-accent");
    if (variant === "ghost") cls.push("btn-ghost");
    if (size === "sm") cls.push("btn-sm");
    if (size === "lg") cls.push("btn-lg");
    if (!children) cls.push("btn-icon");
    if (className) cls.push(className);

    return (
      <button ref={ref} className={cls.join(" ")} {...props}>
        {icon}
        {children}
        {iconRight}
      </button>
    );
  }
);

Button.displayName = "Button";
