"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/hooks/useAuth";

const schema = z
  .object({
    displayName: z.string().min(1, "Display name is required").max(50),
    username: z
      .string()
      .min(3, "At least 3 characters")
      .max(20, "At most 20 characters")
      .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and underscores"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

function Field({
  label,
  error,
  prefix,
  children,
}: {
  label: string;
  error?: string;
  prefix?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-base dark:text-text-base-dark">{label}</label>
      {prefix ? (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle dark:text-text-subtle-dark text-sm select-none">
            {prefix}
          </span>
          <div className="[&>input]:pl-6">{children}</div>
        </div>
      ) : (
        children
      )}
      {error && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm text-text-base dark:text-text-base-dark placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary-500";

export default function RegisterPage() {
  const reg = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = ({ confirmPassword: _, ...data }: FormData) =>
    reg.mutate(data);

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-accent-600 to-primary-500 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-white" />
          <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Join Taskyy 🚀</h1>
          <p className="text-white/80 text-lg max-w-sm">
            Manage tasks, connect with friends, and do activities together.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-2/5 items-center justify-center p-8 bg-[var(--bg)] overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-base dark:text-text-base-dark">Create account</h2>
            <p className="text-text-muted dark:text-text-muted-dark text-sm mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-500 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {reg.error && (
            <div className="mb-4 p-3 rounded-input bg-error-500/10 border border-error-500/20 text-error-500 text-sm">
              {(reg.error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? "Something went wrong. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Display Name" error={errors.displayName?.message}>
              <input {...register("displayName")} placeholder="Ana Smith" className={inputCls} />
            </Field>

            <Field label="Username" error={errors.username?.message} prefix="@">
              <input
                {...register("username")}
                placeholder="anasmith"
                autoCapitalize="none"
                className={inputCls}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" placeholder="you@example.com" autoComplete="email" className={inputCls} />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <input {...register("password")} type="password" placeholder="At least 8 characters" autoComplete="new-password" className={inputCls} />
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type="password" placeholder="••••••••" autoComplete="new-password" className={inputCls} />
            </Field>

            <button
              type="submit"
              disabled={reg.isPending}
              className="h-11 w-full rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {reg.isPending && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {reg.isPending ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-xs text-center text-text-subtle dark:text-text-subtle-dark">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
