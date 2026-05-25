"use client";

import Link from "next/link";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail, useResendVerification } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";

function VerifyEmailContent() {
  const { t, tf } = useT();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";

  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const [resent, setResent] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (token && !attempted.current) {
      attempted.current = true;
      verify.mutate(token);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = () => {
    if (!email || resend.isPending) return;
    resend.mutate(email, {
      onSuccess: () => setResent(true),
    });
  };

  // ── Token present: show verifying / success / error ──
  if (token) {
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
          textAlign: "center",
        }}>
          {verify.isPending && (
            <>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t("verify_page_title")}</h1>
              <div className="muted" style={{ fontSize: 14 }}>{t("loading")}</div>
            </>
          )}

          {verify.isSuccess && (
            <>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t("verify_success")}</h1>
            </>
          )}

          {verify.isError && (
            <>
              <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t("verify_invalid")}</h1>
              {email && (
                <button
                  className="btn btn-accent"
                  style={{ marginTop: 20, width: "100%" }}
                  onClick={handleResend}
                  disabled={resend.isPending || resent}
                >
                  {resent ? t("verify_resent") : resend.isPending ? t("verify_resending") : t("verify_resend")}
                </button>
              )}
              <div style={{ marginTop: 16 }}>
                <Link href="/login" style={{ fontSize: 13, color: "var(--accent)" }}>
                  {t("verify_back_login")}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── No token: "check your email" state (redirected after register) ──
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
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>📬</div>
        <h1 style={{ fontSize: 24, marginBottom: 10 }}>{t("verify_title")}</h1>
        {email && (
          <div className="muted" style={{ fontSize: 14, marginBottom: 8 }}>
            {tf("verify_subtitle", email)}
          </div>
        )}
        <div className="muted" style={{ fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
          {t("verify_hint")}
        </div>

        {email && (
          <button
            className="btn btn-accent btn-lg"
            style={{ width: "100%", marginBottom: 12 }}
            onClick={handleResend}
            disabled={resend.isPending || resent}
          >
            {resent ? t("verify_resent") : resend.isPending ? t("verify_resending") : t("verify_resend")}
          </button>
        )}

        <Link href="/login" style={{ fontSize: 13, color: "var(--accent)" }}>
          {t("verify_back_login")}
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
