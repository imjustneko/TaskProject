import Link from "next/link";

const FEATURES = [
  {
    emoji: "☀️",
    title: "Daily tasks, your way",
    desc: "Add tasks for today or plan ahead. Set priorities, times, and categories — then check them off as you go.",
  },
  {
    emoji: "👥",
    title: "See what friends are up to",
    desc: "Live status, shared tasks, and activity updates. Know when Priya's on a walk or Felix is baking sourdough.",
  },
  {
    emoji: "🏠",
    title: "Do things together",
    desc: "Create shared rooms, invite friends, and complete activities side-by-side with a live checklist and chat.",
  },
];

const SOCIAL_PROOF = [
  { e: "☀️", t: "Morning Pages", s: "3 friends writing now" },
  { e: "📖", t: "Slow Reads · Demon Copperhead", s: "Chapter 10 due Friday" },
  { e: "🏃", t: "Couch to 5K", s: "Priya finished Run 2" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px",
        background: "var(--bg-elevated)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 16 }}>
          <div className="side-brand-mark" style={{ width: 28, height: 28, fontSize: 13 }}>T</div>
          Taskyy
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/register" className="btn btn-accent btn-sm">Get started free</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "80px 24px 64px",
      }}>
        <div className="badge" style={{
          marginBottom: 20, fontSize: 12, padding: "4px 12px", height: "auto",
          background: "var(--accent-tint)", color: "var(--accent)", borderColor: "transparent",
        }}>
          ✦ Calm productivity · Social tasks
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 5vw, 58px)",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          maxWidth: 700,
          margin: "0 auto 20px",
        }}>
          Your tasks.{" "}
          <span style={{ color: "var(--accent)" }}>Your friends.</span>
          {" "}Together.
        </h1>

        <p style={{
          fontSize: 17, color: "var(--text-soft)", maxWidth: 520,
          lineHeight: 1.6, margin: "0 auto 36px",
        }}>
          A calm place for daily tasks, shared rooms, and showing friends what you&apos;re up to. Less noise, more doing.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/register" className="btn btn-accent btn-lg">
            Start for free — it&apos;s quick
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/login" className="btn btn-lg">Sign in</Link>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-faint)" }}>
          No credit card. Free forever on the starter plan.
        </p>
      </section>

      {/* ── Social proof cards ── */}
      <section style={{ padding: "0 24px 72px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SOCIAL_PROOF.map((c, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, alignItems: "center",
              padding: "14px 16px", borderRadius: 12,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-1)",
              animation: `slide-in ${180 + i * 60}ms cubic-bezier(.2,.8,.2,1) both`,
            }}>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{c.e}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.t}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{c.s}</div>
              </div>
              <div style={{
                marginLeft: "auto", width: 8, height: 8, borderRadius: "50%",
                background: "var(--status-online)",
                boxShadow: "0 0 0 3px color-mix(in oklab, var(--status-online) 22%, transparent)",
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{
        padding: "64px 24px",
        background: "var(--bg-subtle)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, letterSpacing: "-0.015em" }}>Everything in one place</h2>
            <p style={{ color: "var(--text-muted)", marginTop: 10, fontSize: 15 }}>
              Built for people who want to get things done — and stay connected doing it.
            </p>
          </div>
          <div className="grid-3">
            {FEATURES.map(({ emoji, title, desc }) => (
              <div key={title} className="card" style={{ textAlign: "center", padding: "28px 24px" }}>
                <div style={{
                  fontSize: 28, marginBottom: 14,
                  width: 52, height: 52, borderRadius: 14,
                  background: "var(--accent-tint)",
                  display: "grid", placeItems: "center",
                  margin: "0 auto 14px",
                }}>
                  {emoji}
                </div>
                <h3 style={{ fontSize: 15, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, letterSpacing: "-0.015em", textAlign: "center", marginBottom: 40 }}>
          How it works
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { n: "1", t: "Create your account", d: "Sign up in seconds. No lengthy onboarding — just add your name and you're in." },
            { n: "2", t: "Add today's tasks", d: "Add what you need to do today. Set priorities, times, and categories to stay focused." },
            { n: "3", t: "Invite friends", d: "Search for friends by username. See their live status and what they're working on." },
            { n: "4", t: "Start a shared room", d: "Create a room, invite friends, and tackle activities together with a live checklist and chat." },
          ].map(({ n, t, d }, i) => (
            <div key={n} style={{
              display: "flex", gap: 20, paddingBottom: i < 3 ? 32 : 0,
              borderLeft: i < 3 ? "2px solid var(--border)" : "2px solid transparent",
              marginLeft: 18, paddingLeft: 28, position: "relative",
            }}>
              <div style={{
                position: "absolute", left: -14, top: 0,
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--accent)", color: "#fff",
                display: "grid", placeItems: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{n}</div>
              <div>
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>{t}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.55 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "64px 24px",
        background: "var(--bg-subtle)",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: 520, margin: "0 auto",
          background: "var(--accent)",
          borderRadius: 20, padding: "48px 40px",
          boxShadow: "0 20px 60px rgba(255,107,53,0.25)",
        }}>
          <h2 style={{ color: "#fff", fontSize: 26, letterSpacing: "-0.015em", marginBottom: 10 }}>
            Ready to start?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, marginBottom: 28 }}>
            Join and start managing your tasks with friends today. Free forever on the starter plan.
          </p>
          <Link href="/register" className="btn btn-lg" style={{
            background: "#fff", color: "var(--accent)",
            borderColor: "transparent", fontWeight: 600,
          }}>
            Create your free account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "24px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: "1px solid var(--border)",
        fontSize: 12, color: "var(--text-faint)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "var(--text-muted)" }}>
          <div className="side-brand-mark" style={{ width: 20, height: 20, fontSize: 10 }}>T</div>
          Taskyy
        </div>
        <div>© 2026 Taskyy · Built for calm productivity</div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/login" style={{ color: "var(--text-faint)" }}>Sign in</Link>
          <Link href="/register" style={{ color: "var(--text-faint)" }}>Register</Link>
        </div>
      </footer>
    </div>
  );
}
