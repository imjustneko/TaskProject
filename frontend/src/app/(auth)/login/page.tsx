export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-3/5 bg-primary-500 flex-col items-center justify-center p-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome back 👋</h1>
        <p className="text-primary-100 text-lg text-center max-w-sm">
          Your tasks, your friends, and your progress are waiting for you.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-2/5 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-text-base dark:text-text-base-dark mb-1">Sign in</h2>
          <p className="text-text-muted dark:text-text-muted-dark text-sm mb-8">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary-500 hover:underline font-medium">
              Sign up
            </a>
          </p>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="h-11 w-full rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
