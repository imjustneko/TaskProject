"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT, type TKey } from "@/hooks/useT";

const STORAGE_KEY = "taskyy-onboarding-v1";

interface Step {
  emoji: string;
  titleKey: string;
  descKey: string;
  actionKey: string;
  href?: string;
}

const STEPS: Step[] = [
  {
    emoji: "🎯",
    titleKey: "ob_step1_title",
    descKey: "ob_step1_desc",
    actionKey: "ob_next",
  },
  {
    emoji: "📋",
    titleKey: "ob_step2_title",
    descKey: "ob_step2_desc",
    actionKey: "ob_next",
    href: "/tasks/today",
  },
  {
    emoji: "👥",
    titleKey: "ob_step3_title",
    descKey: "ob_step3_desc",
    actionKey: "ob_next",
    href: "/friends",
  },
  {
    emoji: "🤝",
    titleKey: "ob_step4_title",
    descKey: "ob_step4_desc",
    actionKey: "ob_next",
    href: "/rooms",
  },
  {
    emoji: "🚀",
    titleKey: "ob_step5_title",
    descKey: "ob_step5_desc",
    actionKey: "ob_start",
  },
];

export function OnboardingModal() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { t, tf } = useT();

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {}
  }, []);

  function finish() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setVisible(false);
  }

  function next() {
    const current = STEPS[step];
    if (step < STEPS.length - 1) {
      if (current.href) router.prefetch(current.href);
      setStep(s => s + 1);
    } else {
      finish();
    }
  }

  function skip() {
    finish();
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={skip}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(2px)",
          animation: "ob-fade-in 200ms ease",
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
          pointerEvents: "none",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 400,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow: "var(--shadow-3)",
            padding: "28px 28px 24px",
            pointerEvents: "all",
            animation: "ob-slide-in 250ms var(--ease-out)",
          }}
        >
          {/* Progress bar */}
          <div style={{
            height: 3, borderRadius: 999, background: "var(--bg-subtle)",
            marginBottom: 28, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "var(--accent)", borderRadius: 999,
              transition: "width 300ms var(--ease-out)",
            }} />
          </div>

          {/* Step dots */}
          <div style={{
            display: "flex", gap: 6, justifyContent: "center", marginBottom: 24,
          }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 18 : 6, height: 6, borderRadius: 999,
                background: i <= step ? "var(--accent)" : "var(--border-strong)",
                transition: "all 250ms var(--ease-out)",
              }} />
            ))}
          </div>

          {/* Emoji */}
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "var(--accent-tint-strong)",
            display: "grid", placeItems: "center",
            fontSize: 30, margin: "0 auto 20px",
          }}>
            {current.emoji}
          </div>

          {/* Text */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, color: "var(--text)" }}>
              {t(current.titleKey as TKey)}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-muted)", maxWidth: 300, margin: "0 auto" }}>
              {t(current.descKey as TKey)}
            </div>
            {current.href && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                marginTop: 14, padding: "5px 12px", borderRadius: 999,
                background: "var(--bg-subtle)", border: "1px solid var(--border)",
                fontSize: 12, color: "var(--text-soft)",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {current.href}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-sm"
              style={{ flex: 1, height: 40, fontSize: 13.5 }}
              onClick={isLast ? finish : skip}
            >
              {isLast ? t("ob_maybe_later") : t("ob_skip")}
            </button>
            <button
              className="btn btn-sm btn-primary"
              style={{ flex: 2, height: 40, fontSize: 13.5 }}
              onClick={next}
            >
              {t(current.actionKey as TKey)}
              {!isLast && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6"/>
                </svg>
              )}
            </button>
          </div>

          {/* Step counter */}
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 11.5, color: "var(--text-faint)" }}>
            {tf("ob_step_of", step + 1, STEPS.length)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ob-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ob-slide-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px) }
          to   { opacity: 1; transform: scale(1)    translateY(0)    }
        }
      `}</style>
    </>
  );
}
