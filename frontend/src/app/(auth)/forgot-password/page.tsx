"use client";

import Link from "next/link";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";

export default function ForgotPasswordPage() {
  const { t } = useT();
  const forgotPw = useForgotPassword();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || forgotPw.isPending) return;
    forgotPw.mutate(email, {
      onSuccess: () => setSubmitted(true),
    });
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh",
      background: "var(--bg)", padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 420, width: "100%",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "40px 36px",
      }}>
        <div style={{ marginBottom: 24 }}>
          <div className="side-brand-mark" style={{ width: 36, height: 36, fontSize: 15, marginBottom: 20 }}>T</div>

          {submitted ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
              <h1 style={{ fontSize: 22, marginBottom: 10 }}>{t("forgot_pw_sent_title")}</h1>
              <div className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                {t("forgot_pw_sent_hint")(email)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  className="btn btn-ghost"
                  style={{ width: "100%" }}
                  onClick={() => { setSubmitted(false); setEmail(""); forgotPw.reset(); }}
                >
                  {t("forgot_pw_try_again")}
                </button>
                <Link href="/login" style={{ textAlign: "center", fontSize: 13, color: "var(--accent)" }}>
                  {t("forgot_pw_back")}
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t("forgot_pw_title")}</h1>
              <div className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
                {t("forgot_pw_subtitle")}
              </div>

              <form onSubmit={handleSubmit} className="col gap-4">
                <div className="field">
                  <label className="field-label">{t("email_label")}</label>
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

                {forgotPw.isError && (
                  <div style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 13,
                    background: "color-mix(in oklab, var(--status-busy) 12%, transparent)",
                    color: "var(--status-busy)",
                    border: "1px solid color-mix(in oklab, var(--status-busy) 22%, transparent)",
                  }}>
                    {t("error_generic")}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-accent btn-lg"
                  style={{ width: "100%" }}
                  disabled={!email || forgotPw.isPending}
                >
                  {forgotPw.isPending ? (
                    <>
                      <svg style={{ animation: "spin 1s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      {t("forgot_pw_sending")}
                    </>
                  ) : t("forgot_pw_btn")}
                </button>

                <div style={{ textAlign: "center" }}>
                  <Link href="/login" style={{ fontSize: 13, color: "var(--accent)" }}>
                    {t("forgot_pw_back")}
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
