"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";

function ResetPasswordContent() {
  const { t } = useT();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const resetPw = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const submitted = useRef(false);

  useEffect(() => {
    if (!token && !submitted.current) submitted.current = true;
  }, [token]);

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t("reset_pw_invalid")}</h1>
        <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--accent)" }}>
          {t("forgot_pw_try_again")}
        </Link>
      </div>
    );
  }

  if (resetPw.isSuccess) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>{t("reset_pw_success")}</h1>
        <Link href="/login" className="btn btn-accent" style={{ display: "inline-block", marginTop: 8 }}>
          {t("reset_pw_back")}
        </Link>
      </div>
    );
  }

  if (resetPw.isError) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t("reset_pw_invalid")}</h1>
        <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--accent)" }}>
          {t("forgot_pw_try_again")}
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setMismatch(true); return; }
    setMismatch(false);
    resetPw.mutate({ token, password });
  };

  return (
    <>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t("reset_pw_title")}</h1>
      <div className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
        {t("reset_pw_subtitle")}
      </div>

      <form onSubmit={handleSubmit} className="col gap-4">
        <div className="field">
          <label className="field-label">{t("new_password_label")}</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            autoFocus
          />
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{t("pw_min_hint")}</div>
        </div>

        <div className="field">
          <label className="field-label">{t("confirm_pw_label")}</label>
          <input
            className="input"
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setMismatch(false); }}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {mismatch && (
            <div style={{ fontSize: 12, color: "var(--status-busy)", marginTop: 4 }}>
              {t("pw_mismatch")}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-accent btn-lg"
          style={{ width: "100%" }}
          disabled={!password || !confirm || password.length < 8 || resetPw.isPending}
        >
          {resetPw.isPending ? (
            <>
              <svg style={{ animation: "spin 1s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              {t("reset_pw_saving")}
            </>
          ) : t("reset_pw_btn")}
        </button>

        <div style={{ textAlign: "center" }}>
          <Link href="/login" style={{ fontSize: 13, color: "var(--accent)" }}>
            {t("reset_pw_back")}
          </Link>
        </div>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
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
          <div className="side-brand-mark" style={{ width: 36, height: 36, fontSize: 15, marginBottom: 20 }}>T</div>
          <ResetPasswordContent />
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Suspense>
  );
}
