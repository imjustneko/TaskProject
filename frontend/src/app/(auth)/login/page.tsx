"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => login.mutate(data);

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-primary-600 to-primary-400 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome back 👋</h1>
          <p className="text-primary-100 text-lg max-w-sm">
            Your tasks, your friends, and your progress are all waiting for you.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-2/5 items-center justify-center p-8 bg-[var(--bg)]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-base dark:text-text-base-dark">Sign in</h2>
            <p className="text-text-muted dark:text-text-muted-dark text-sm mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary-500 hover:underline font-medium">
                Sign up free
              </Link>
            </p>
          </div>

          {login.error && (
            <div className="mb-4 p-3 rounded-input bg-error-500/10 border border-error-500/20 text-error-500 text-sm">
              {(login.error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? "Invalid email or password"}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm text-text-base dark:text-text-base-dark placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="text-xs text-error-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-base dark:text-text-base-dark">
                  Password
                </label>
                <Link href="#" className="text-xs text-primary-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm text-text-base dark:text-text-base-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.password && (
                <p className="text-xs text-error-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="h-11 w-full rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {login.isPending && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {login.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
