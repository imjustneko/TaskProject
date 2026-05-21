"use client";

import Link from "next/link";
import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "var(--text)", color: "var(--bg-elevated)",
      padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
      boxShadow: "var(--shadow-pop)", zIndex: 999,
      display: "flex", alignItems: "center", gap: 12,
      animation: "pop 200ms cubic-bezier(.2,.8,.2,1)",
      whiteSpace: "nowrap",
    }}>
      {message}
      <button onClick={onClose} style={{ background: "none", border: 0, color: "inherit", opacity: 0.6, cursor: "pointer", padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return;
    login.mutate({ email, password: pw });
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      height: "100vh",
      background: "var(--bg)",
    }}>

      {/* ── Left brand panel ── */}
      <div style={{
        background: "linear-gradient(160deg, #ffe9dc 0%, #fff5ec 50%, #fafaf7 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
        padding: "48px 56px",
      }}>
        {/* Decorative circle */}
        <div style={{
          position: "absolute", right: -80, top: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 17 }}>
          <div className="side-brand-mark" style={{ width: 32, height: 32, fontSize: 14 }}>T</div>
          Taskyy
        </div>

        <div style={{ marginTop: "auto" }}>
          <div style={{
            fontSize: 36, fontWeight: 700, letterSpacing: "-0.025em",
            lineHeight: 1.15, color: "#2a1a14", maxWidth: 440,
          }}>
            Ажлаа дуусга,<br />хамтдаа.
          </div>
          <div style={{
            fontSize: 15, color: "#6b4530", marginTop: 14,
            maxWidth: 400, lineHeight: 1.6,
          }}>
            Өдрийн таск, хуваалцсан өрөө, найзуудын үйл ажиллагааг харах тайван газар.
          </div>

          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
            {[
              { e: "☀️", t: "Өглөөний бичих", s: "3 найз одоо бичиж байна" },
              { e: "📖", t: "Аажим уншилт · Demon Copperhead", s: "10-р бүлэг Пүрэвт дуусна" },
              { e: "🏃", t: "Диванаас 5км", s: "Priya 2-р гүйлтийг дуусгалаа" },
            ].map((c, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "center",
                padding: "12px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 4px 20px rgba(135,70,30,0.06)",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{c.e}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2a1a14" }}>{c.t}</div>
                  <div style={{ fontSize: 11.5, color: "#6b4530", marginTop: 1 }}>{c.s}</div>
                </div>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: "#34c759",
                  boxShadow: "0 0 0 3px rgba(52,199,89,0.2)",
                }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "auto", fontSize: 12, color: "#8a6648", paddingTop: 32 }}>
          © Taskyy 2026 · Тайван бүтээмжийн төлөө
        </div>
      </div>

      {/* ── Right auth form ── */}
      <div style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 80px",
        background: "var(--bg)",
        overflowY: "auto",
      }}>
        <div style={{ maxWidth: 380, margin: "0 auto", width: "100%" }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Тавтай морил</h1>
          <div className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
            Үргэлжлүүлэхийн тулд нэвтрэнэ үү.
          </div>

          {/* Error */}
          {login.error && (
            <div style={{
              marginBottom: 16, padding: "10px 14px", borderRadius: 8,
              background: "color-mix(in oklab, var(--status-busy) 12%, transparent)",
              color: "var(--status-busy)", fontSize: 13,
              border: "1px solid color-mix(in oklab, var(--status-busy) 22%, transparent)",
            }}>
              {(login.error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? "Имэйл эсвэл нууц үг буруу байна"}
            </div>
          )}

          {/* Email + password form */}
          <form onSubmit={handleSubmit} className="col gap-3">
            <div className="field">
              <label className="field-label">Имэйл</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@taskyy.app"
                autoComplete="email"
                autoFocus
              />
            </div>
            <div className="field">
              <label className="field-label">
                <span style={{ flex: 1 }}>Нууц үг</span>
              </label>
              <input
                className="input"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 4, textAlign: "right", cursor: "pointer" }}
                onClick={() => showToast("Нууц үг сэргээх удахгүй нэмэгдэнэ — support@taskyy.app-д хандана уу")}>
                Нууц үг мартсан уу?
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              disabled={login.isPending || !email || !pw}
            >
              {login.isPending ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Нэвтэрч байна…
                </>
              ) : "Нэвтрэх"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            margin: "22px 0", color: "var(--text-faint)", fontSize: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            эсвэл
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Social login */}
          <div className="col gap-2">
            <button
              className="btn btn-lg"
              style={{ width: "100%", gap: 10, justifyContent: "center", position: "relative" }}
              onClick={() => showToast("Google нэвтрэлт удахгүй нэмэгдэнэ! Одоо имэйл ашиглана уу.")}
            >
              <GoogleIcon />
              Google-ээр нэвтрэх
            </button>
            <button
              className="btn btn-lg"
              style={{ width: "100%", gap: 10, justifyContent: "center" }}
              onClick={() => showToast("Apple нэвтрэлт удахгүй нэмэгдэнэ! Одоо имэйл ашиглана уу.")}
            >
              <AppleIcon />
              Apple-ээр нэвтрэх
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "var(--text-muted)" }}>
            Бүртгэл байхгүй юу?{" "}
            <Link href="/register" style={{ color: "var(--accent)", fontWeight: 500 }}>
              Бүртгүүлэх
            </Link>
          </div>
        </div>
      </div>

      {/* CSS for spin */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
