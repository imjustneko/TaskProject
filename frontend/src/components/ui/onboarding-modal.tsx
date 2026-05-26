"use client";

import { useState, useEffect } from "react";
import { useT, type TKey } from "@/hooks/useT";

const STORAGE_KEY = "taskyy-onboarding-v1";

// ── Step previews ──────────────────────────────────────────────────────────

function PreviewWelcome() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
      <div style={{
        width: 76, height: 76, borderRadius: 24,
        background: "linear-gradient(145deg, #ffb487, var(--accent) 70%, var(--accent-press))",
        display: "grid", placeItems: "center",
        color: "#fff", fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em",
        boxShadow: "0 8px 24px rgba(212,98,26,.30), 0 1px 2px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.3)",
        position: "relative",
      }}>
        T
        <span style={{
          position: "absolute", right: -6, top: -4,
          width: 22, height: 22, background: "var(--bg-elevated)",
          borderRadius: "50%", color: "var(--accent)", fontSize: 12,
          display: "grid", placeItems: "center",
          boxShadow: "var(--shadow-1)",
        }}>✦</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {["📋 Tasks", "👥 Friends", "🔥 Streak"].map(chip => (
          <span key={chip} style={{
            padding: "4px 9px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            fontSize: 11, color: "var(--text-muted)",
            display: "inline-flex", alignItems: "center", gap: 5,
            boxShadow: "var(--shadow-1)",
          }}>{chip}</span>
        ))}
      </div>
    </div>
  );
}

function PreviewTasks() {
  const tasks = [
    { title: "Өглөөний дасгал", done: true,  time: "07:00", pri: "m" },
    { title: "Ажлын тайлан илгээх", done: false, time: "11:30", pri: "h" },
    { title: "Ном унших · 30 мин", done: false, time: "21:00", pri: "m" },
  ];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, position: "relative", zIndex: 1 }}>
      {tasks.map((tk, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "9px 11px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 10, fontSize: 12.5,
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
            border: tk.done ? "none" : "1.5px solid var(--border-strong)",
            background: tk.done ? "var(--accent)" : "transparent",
            display: "grid", placeItems: "center",
          }}>
            {tk.done && (
              <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7.2 5.8 10 11 4.2"/>
              </svg>
            )}
          </div>
          <span style={{ flex: 1, color: tk.done ? "var(--text-faint)" : "var(--text)", textDecoration: tk.done ? "line-through" : "none" }}>{tk.title}</span>
          <div style={{ width: 6, height: 6, borderRadius: 2, background: tk.pri === "h" ? "var(--status-busy)" : "var(--status-idle)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-muted)" }}>{tk.time}</span>
        </div>
      ))}
    </div>
  );
}

const FRIEND_DATA = [
  { name: "Asher Khan",    sub: "@asher · 4 mutual", hue: "#f97316", online: true,  added: true  },
  { name: "Liora Bennett", sub: "@liora · 3 mutual", hue: "#0ea5e9", online: false, added: false },
  { name: "Felix Moreau",  sub: "@felix · 7 mutual", hue: "#10b981", online: true,  added: false },
];
function PreviewFriends() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, position: "relative", zIndex: 1 }}>
      {FRIEND_DATA.map((f, i) => {
        const initials = f.name.split(" ").map(p => p[0]).join("");
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)", borderRadius: 10,
          }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: f.hue, color: "#fff",
                fontSize: 11, fontWeight: 600,
                display: "grid", placeItems: "center",
              }}>{initials}</div>
              {f.online && (
                <span style={{
                  position: "absolute", width: 8, height: 8, borderRadius: "50%",
                  background: "var(--status-online)",
                  border: "2px solid var(--bg-elevated)",
                  transform: "translate(20px, 10px)", top: 0, left: 0,
                }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>{f.name}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{f.sub}</div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: f.added ? "var(--accent)" : "var(--accent-tint)",
              color: f.added ? "#fff" : "var(--accent)",
              display: "grid", placeItems: "center",
              fontSize: 13, fontWeight: 700,
            }}>{f.added ? "✓" : "+"}</div>
          </div>
        );
      })}
    </div>
  );
}

function PreviewRoom() {
  const avs = [
    { bg: "#f97316", label: "AK" },
    { bg: "#0ea5e9", label: "LB" },
    { bg: "#10b981", label: "FM" },
    { bg: "#a855f7", label: "PR" },
  ];
  return (
    <div style={{
      width: "100%", padding: 14,
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)", borderRadius: 14,
      boxShadow: "var(--shadow-2)", position: "relative", zIndex: 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "var(--bg-subtle)",
          display: "grid", placeItems: "center", fontSize: 18,
        }}>📖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Slow Reads · Demon Copperhead</div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 1 }}>96 гишүүн · 3 идэвхтэй</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {avs.map((av, i) => (
            <div key={i} style={{
              width: 20, height: 20, borderRadius: "50%",
              background: av.bg, color: "#fff",
              fontSize: 9, fontWeight: 600,
              boxShadow: "0 0 0 2px var(--bg-elevated)",
              marginLeft: i === 0 ? 0 : -4,
              display: "grid", placeItems: "center",
            }}>{av.label}</div>
          ))}
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "var(--bg-subtle)", color: "var(--text-muted)",
            fontSize: 9.5, fontWeight: 600,
            boxShadow: "0 0 0 2px var(--bg-elevated)",
            marginLeft: -4,
            display: "grid", placeItems: "center",
          }}>+92</div>
        </div>
        <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: 11 }}>Нэгдэх →</span>
      </div>
    </div>
  );
}

function PreviewReady() {
  return (
    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: 4 }}>
      <div style={{
        width: 78, height: 78, borderRadius: 24,
        background: "linear-gradient(145deg, #e87b2c, var(--accent) 70%, var(--accent-press))",
        color: "#fff", fontSize: 36,
        display: "grid", placeItems: "center",
        boxShadow: "0 8px 24px rgba(212,98,26,.30), inset 0 1px 0 rgba(255,255,255,.3)",
        transform: "rotate(-6deg)",
      }}>✓</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, width: "100%" }}>
        {[["5", "Таск"], ["3", "Найз"], ["1", "Өрөө"]].map(([v, l]) => (
          <div key={l} style={{
            padding: "8px 6px", background: "var(--bg-elevated)",
            border: "1px solid var(--border)", borderRadius: 8, textAlign: "center",
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-mono)" }}>{v}</div>
            <div style={{ fontSize: 9.5, color: "var(--text-muted)", marginTop: 1, letterSpacing: "0.05em", textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PREVIEWS = [PreviewWelcome, PreviewTasks, PreviewFriends, PreviewRoom, PreviewReady];

// ── Step data ──────────────────────────────────────────────────────────────

const STEPS = [
  { titleKey: "ob_step1_title", descKey: "ob_step1_desc", ctaKey: "ob_next",  href: null    },
  { titleKey: "ob_step2_title", descKey: "ob_step2_desc", ctaKey: "ob_next",  href: "/tasks/today" },
  { titleKey: "ob_step3_title", descKey: "ob_step3_desc", ctaKey: "ob_next",  href: "/friends"     },
  { titleKey: "ob_step4_title", descKey: "ob_step4_desc", ctaKey: "ob_next",  href: "/rooms"       },
  { titleKey: "ob_step5_title", descKey: "ob_step5_desc", ctaKey: "ob_start", href: null    },
] as const;

// ── Modal ──────────────────────────────────────────────────────────────────

export function OnboardingModal() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const { t, tf } = useT();

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {}
  }, []);

  function finish() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setVisible(false);
  }

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else finish();
  }

  if (!visible) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;
  const Preview = PREVIEWS[step];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={finish}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(12,10,9,0.52)",
          backdropFilter: "blur(4px)",
          animation: "ob-fade 200ms ease",
        }}
      />

      {/* Modal centering wrapper */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, pointerEvents: "none",
      }}>
        <div
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          style={{
            width: "100%", maxWidth: 440,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow: "var(--shadow-pop)",
            overflow: "hidden",
            pointerEvents: "all",
            animation: "ob-in 280ms cubic-bezier(0.34,1.3,0.64,1)",
          }}
        >
          {/* Progress bar — flush top */}
          <div style={{ height: 3, background: "var(--bg-subtle)", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${progress}%`,
              background: "linear-gradient(90deg, #e87b2c, var(--accent))",
              borderRadius: 999,
              transition: "width 320ms cubic-bezier(0.22,1,0.36,1)",
            }} />
          </div>

          {/* Preview area */}
          <div style={{
            padding: "28px 28px 12px",
            background: "linear-gradient(180deg, var(--bg-subtle), var(--bg-elevated))",
            borderBottom: "1px solid var(--border)",
            minHeight: 200,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {/* Grain / accent glow overlay */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, var(--accent-tint), transparent 60%)",
              pointerEvents: "none",
            }} />
            <Preview />
          </div>

          {/* Body */}
          <div style={{ padding: "22px 28px 24px" }}>
            <div style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}>
              {tf("ob_step_of", step + 1, STEPS.length)}
            </div>
            <h2 style={{
              margin: "10px 0 8px", fontSize: 22, fontWeight: 600,
              letterSpacing: "-0.022em", color: "var(--text)", lineHeight: 1.2,
            }}>
              {t(s.titleKey as TKey)}
            </h2>
            <p style={{
              margin: "0 0 16px", fontSize: 13.5,
              color: "var(--text-muted)", lineHeight: 1.6,
            }}>
              {t(s.descKey as TKey)}
            </p>
            {s.href && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 10px 5px 8px", borderRadius: 999,
                background: "var(--bg-subtle)", border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-soft)",
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {s.href}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "12px 16px 16px",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-subtle)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            {/* Step dots */}
            <div style={{ flex: 1, display: "inline-flex", gap: 5 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 6, borderRadius: 999,
                  width: i === step ? 22 : 6,
                  background: i < step
                    ? "rgba(212,98,26,0.5)"
                    : i === step
                    ? "var(--accent)"
                    : "var(--border-strong)",
                  transition: "all 250ms cubic-bezier(0.22,1,0.36,1)",
                }} />
              ))}
            </div>

            {!isLast && (
              <button
                className="btn btn-sm"
                style={{ height: 40, padding: "0 12px", fontSize: 13.5, borderRadius: 10 }}
                onClick={finish}
              >
                {t("ob_skip")}
              </button>
            )}

            <button
              className="btn-accent btn"
              style={{ minWidth: 110, height: 40, padding: "0 14px", fontSize: 13.5, fontWeight: 600, borderRadius: 10 }}
              onClick={next}
            >
              {t(s.ctaKey as TKey)}
              {!isLast && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ob-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ob-in {
          from { opacity: 0; transform: scale(0.92) translateY(10px) }
          to   { opacity: 1; transform: scale(1)   translateY(0)     }
        }
      `}</style>
    </>
  );
}
