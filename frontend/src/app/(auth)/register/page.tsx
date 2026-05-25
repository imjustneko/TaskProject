"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRegister, useGoogleOAuth, useOAuthMutation } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import api from "@/lib/api";

function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: object) => void;
        signIn: () => Promise<{ authorization: { id_token: string }; user?: { name?: { firstName?: string; lastName?: string } } }>;
      };
    };
  }
}

export default function RegisterPage() {
  const reg = useRegister();
  const { login: googleLogin, isPending: googlePending } = useGoogleOAuth();
  const appleMutation = useOAuthMutation();
  const { t } = useT();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID?.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI: window.location.origin,
        usePopup: true,
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleAppleRegister = async () => {
    try {
      const data = await window.AppleID?.auth.signIn();
      if (!data) return;
      const name = [data.user?.name?.firstName, data.user?.name?.lastName].filter(Boolean).join(" ");
      appleMutation.mutate({ provider: "apple", idToken: data.authorization.id_token, displayName: name });
    } catch {}
  };

  const handleUsernameChange = (val: string) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(cleaned);
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    if (cleaned.length < 3) { setUsernameStatus("idle"); return; }
    setUsernameStatus("checking");
    usernameTimer.current = setTimeout(async () => {
      try {
        const res = await api.get<{ available: boolean }>(`/auth/check-username?username=${cleaned}`);
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch { setUsernameStatus("idle"); }
    }, 400);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError(t("email_invalid"));
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) { setEmailError(t("email_invalid")); return; }
    if (pw !== confirmPw) { setPwError(t("pw_mismatch")); return; }
    if (usernameStatus === "taken") return;
    setPwError("");
    setEmailError("");
    reg.mutate({ displayName, username, email, password: pw });
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      height: "100vh",
      background: "var(--bg)",
    }}>
      {/* Left — brand panel */}
      <div style={{
        background: "linear-gradient(160deg, #ffe9dc 0%, #fff5ec 50%, #fafaf7 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "48px 56px",
      }}>
        <div className="row gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
          <div className="side-brand-mark" style={{ width: 32, height: 32, fontSize: 14 }}>T</div>
          Taskyy
        </div>

        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#2a1a14", maxWidth: 440 }}>
            {t("reg_brand_headline")}
          </div>
          <div style={{ fontSize: 15, color: "#6b4530", marginTop: 16, maxWidth: 420, lineHeight: 1.5 }}>
            {t("reg_brand_sub")}
          </div>

          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
            {[
              { e: "✅", t: "Log your tasks", s: "Daily, weekly, or someday" },
              { e: "👥", t: "Share with friends", s: "Rooms, shared tasks, live status" },
              { e: "📸", t: "Daily memories", s: "One photo per completed day" },
            ].map((c, i) => (
              <div key={i} style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 4px 20px rgba(135, 70, 30, 0.06)",
              }}>
                <div style={{ fontSize: 22 }}>{c.e}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2a1a14" }}>{c.t}</div>
                  <div style={{ fontSize: 11.5, color: "#6b4530" }}>{c.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "auto", fontSize: 12, color: "#8a6648", paddingTop: 32 }}>
          © Taskyy 2026 · {t("brand_tagline")}
        </div>
      </div>

      {/* Right — register form */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 80px",
        overflowY: "auto",
      }}>
        <div style={{ maxWidth: 380, margin: "0 auto", width: "100%", paddingBlock: 40 }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>{t("register_title")}</h1>
          <div className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
            {t("register_subtitle")}
          </div>

          {reg.error && (
            <div style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 8,
              background: "color-mix(in oklab, var(--status-busy) 14%, transparent)",
              color: "var(--status-busy)",
              fontSize: 13,
            }}>
              {(reg.error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? t("error_generic")}
            </div>
          )}

          <form onSubmit={handleSubmit} className="col gap-3">
            <div className="field">
              <label className="field-label">{t("display_name")}</label>
              <input
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Mira Tanaka"
                required
              />
            </div>
            <div className="field">
              <label className="field-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {t("username_label")}
                {usernameStatus === "checking" && (
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t("checking")}</span>
                )}
                {usernameStatus === "available" && (
                  <span style={{ fontSize: 11, color: "var(--status-online)" }}>{t("username_available")}</span>
                )}
                {usernameStatus === "taken" && (
                  <span style={{ fontSize: 11, color: "var(--status-busy)" }}>{t("username_taken")}</span>
                )}
              </label>
              <input
                className="input"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="miratanaka"
                required
                minLength={3}
                maxLength={20}
                style={usernameStatus === "taken" ? { borderColor: "var(--status-busy)" } : usernameStatus === "available" ? { borderColor: "var(--status-online)" } : {}}
              />
            </div>
            <div className="field">
              <label className="field-label">{t("email_label")}</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                onBlur={handleEmailBlur}
                placeholder="you@gmail.com"
                autoComplete="email"
                required
              />
              {emailError && <div style={{ fontSize: 12, color: "var(--status-busy)", marginTop: 3 }}>{emailError}</div>}
            </div>
            <div className="field">
              <label className="field-label">{t("password_label")}</label>
              <input
                className="input"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder={t("pw_min_hint")}
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
            <div className="field">
              <label className="field-label">{t("confirm_pw")}</label>
              <input
                className="input"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              {pwError && <div style={{ fontSize: 12, color: "var(--status-busy)" }}>{pwError}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-lg"
              style={{ width: "100%", marginTop: 8 }}
              disabled={reg.isPending}
            >
              {reg.isPending ? t("creating_account") : t("create_account")}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0", color: "var(--text-faint)", fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            {t("or_divider")}
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div className="col gap-2">
            <button className="btn btn-lg" style={{ width: "100%", gap: 10, justifyContent: "center" }}
              onClick={() => googleLogin()}
              disabled={googlePending}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {googlePending ? t("logging_in") : t("continue_google")}
            </button>
            <button className="btn btn-lg" style={{ width: "100%", gap: 10, justifyContent: "center" }}
              onClick={handleAppleRegister}
              disabled={appleMutation.isPending}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              {appleMutation.isPending ? t("logging_in") : t("continue_apple")}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-muted)" }}>
            {t("have_account")}{" "}
            <Link href="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>
              {t("sign_in_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
