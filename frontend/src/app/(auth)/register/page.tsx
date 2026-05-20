export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-primary-600 to-accent-500 flex-col items-center justify-center p-12">
        <h1 className="text-4xl font-bold text-white mb-4">Join Taskyy 🚀</h1>
        <p className="text-white/80 text-lg text-center max-w-sm">
          Manage tasks, connect with friends, and do things together.
        </p>
      </div>

      <div className="flex w-full lg:w-2/5 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-text-base dark:text-text-base-dark mb-1">Create account</h2>
          <p className="text-text-muted dark:text-text-muted-dark text-sm mb-8">
            Already have an account?{" "}
            <a href="/login" className="text-primary-500 hover:underline font-medium">
              Sign in
            </a>
          </p>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Display Name</label>
              <input type="text" placeholder="Ana Smith" className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle dark:text-text-subtle-dark text-sm">@</span>
                <input type="text" placeholder="anasmith" className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Email</label>
              <input type="email" placeholder="you@example.com" className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-base dark:text-text-base-dark">Password</label>
              <input type="password" placeholder="••••••••" className="h-11 w-full rounded-input border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <button type="submit" className="h-11 w-full rounded-input bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
