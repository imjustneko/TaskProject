import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 h-16 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark sticky top-0 z-50">
        <span className="text-xl font-bold text-primary-500">Taskyy</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="h-9 px-4 rounded-input text-sm font-medium text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 inline-flex items-center transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="h-9 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 inline-flex items-center transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-300 mb-6">
          ✨ Social productivity, reimagined
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-base dark:text-text-base-dark max-w-3xl leading-tight">
          Your tasks.{" "}
          <span className="text-primary-500">Your friends.</span>
          {" "}Together.
        </h1>
        <p className="mt-6 text-lg text-text-muted dark:text-text-muted-dark max-w-xl">
          Taskyy blends personal task management with social features — see what friends
          are working on, share progress, and do activities together in shared rooms.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link href="/register" className="h-12 px-6 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 inline-flex items-center transition-colors shadow-md">
            Get Started Free
          </Link>
          <Link href="/login" className="h-12 px-6 rounded-xl border border-border dark:border-border-dark text-text-base dark:text-text-base-dark font-medium hover:bg-surface-2 dark:hover:bg-surface-dark-2 inline-flex items-center transition-colors">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-text-base dark:text-text-base-dark mb-12">
          Everything you need, all in one place
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: "🗂️", title: "Manage Tasks", desc: "Create daily tasks and future plans with priorities, categories, and photos." },
            { emoji: "👥", title: "Connect Friends", desc: "See your friends' live status, share tasks, and view each other's progress." },
            { emoji: "🏠", title: "Do It Together", desc: "Create shared rooms, invite friends, and complete activities as a team." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-6 shadow-sm text-center hover:-translate-y-1 transition-transform duration-200">
              <p className="text-4xl mb-4">{emoji}</p>
              <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-2">{title}</h3>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <div className="bg-primary-500 rounded-2xl p-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to start?</h2>
          <p className="text-primary-100 mb-6">Join and start managing your tasks with friends today.</p>
          <Link href="/register" className="h-12 px-8 rounded-xl bg-white text-primary-600 font-semibold hover:bg-primary-50 inline-flex items-center transition-colors shadow">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
