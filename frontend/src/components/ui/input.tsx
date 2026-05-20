import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-base dark:text-text-base-dark"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle dark:text-text-subtle-dark">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-11 w-full rounded-input border bg-surface dark:bg-surface-dark text-text-base dark:text-text-base-dark placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark border-border dark:border-border-dark px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-error-500 focus:ring-error-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle dark:text-text-subtle-dark">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error-500">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-text-muted dark:text-text-muted-dark">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
