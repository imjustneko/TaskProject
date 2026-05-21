"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const FAQS = [
  { q: "Is Taskyy really free?", a: "Yes. Daily tasks, rooms, friends, chat, and dark mode are free forever. A paid tier for power users will come later — you'll never be locked out of things you already use." },
  { q: "Do I need friends to use it?", a: "Nope. Taskyy is a fully standalone todo app. Adding one friend is when social features come alive automatically." },
  { q: "Can others see what I'm doing?", a: "Only what you explicitly share — your status, tasks you mark public, and rooms you join. Everything defaults to private." },
  { q: "Is there a mobile app?", a: "A responsive web app is available now; iOS and Android are coming soon." },
];

export default function LandingPage() {
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => navRef.current?.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)" }}>
      <style>{`
        .lnw{position:sticky;top:0;z-index:50;background:color-mix(in oklab,var(--bg) 80%,transparent);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-bottom:1px solid transparent;transition:border-color 200ms;}
        .lnw.is-scrolled{border-bottom-color:var(--border);}
        .lnav{max-width:1180px;margin:0 auto;padding:14px 32px;display:flex;align-items:center;gap:24px;}
        .lbrand{display:inline-flex;align-items:center;gap:10px;font-size:16px;font-weight:600;color:var(--text);text-decoration:none;}
        .lbmark{width:28px;height:28px;border-radius:8px;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px;}
        .lnlinks{display:flex;gap:4px;margin-left:32px;}
        .lnlink{padding:6px 12px;font-size:14px;color:var(--text-soft);border-radius:7px;text-decoration:none;transition:background 120ms;}
        .lnlink:hover{background:var(--bg-hover);color:var(--text);}
        .lhero{position:relative;padding:80px 32px 120px;background:linear-gradient(180deg,#fff5ec 0%,var(--bg) 100%);overflow:hidden;}
        .lhero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(ellipse 600px 400px at 20% 10%,rgba(255,200,150,.4) 0%,transparent 60%);pointer-events:none;}
        .lhi{max-width:1180px;margin:0 auto;position:relative;display:grid;grid-template-columns:1.05fr 1fr;gap:64px;align-items:center;}
        .lmock{background:var(--bg-elevated);border-radius:16px;border:1px solid var(--border);box-shadow:var(--shadow-2);overflow:hidden;font-size:13px;}
        .lmbar{height:28px;display:flex;align-items:center;gap:6px;padding:0 12px;background:var(--bg-subtle);border-bottom:1px solid var(--border);}
        .lmbar i{width:8px;height:8px;border-radius:50%;background:#d3d3cf;}
        .lmbar i:nth-child(1){background:#f5a3a3}.lmbar i:nth-child(2){background:#f5d59c}.lmbar i:nth-child(3){background:#a3d6a3}
        .lmurl{margin-left:12px;font-family:var(--font-mono,monospace);font-size:10.5px;color:var(--text-faint);}
        .ltrow{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border);}
        .ltrow:last-child{border-bottom:0}
        .lttit{flex:1;font-size:13px;font-weight:500}
        .ltrow.dn .lttit{color:var(--text-faint);text-decoration:line-through}
        .lavs{display:flex}
        .lav{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:600;font-size:8px;flex-shrink:0;margin-left:-4px;box-shadow:0 0 0 2px var(--bg-elevated)}
        .lav:first-child{margin-left:0}.lav.fd{opacity:.3}
        .lcbx{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--border-strong);background:var(--bg-elevated);display:grid;place-items:center;flex-shrink:0}
        .lcbx.d{background:var(--accent);border-color:var(--accent)}
        .lhgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .lhcard{background:var(--bg-elevated);border:1px solid var(--border);border-radius:14px;padding:28px 26px 24px}
        .lfgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .lfeat{padding:28px 26px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:14px}
        .lfic{width:36px;height:36px;border-radius:10px;background:var(--accent-tint);color:var(--accent);display:grid;place-items:center;margin-bottom:18px}
        .lshow{display:grid;grid-template-columns:1fr 1.3fr;gap:60px;align-items:center}
        .lbuls{list-style:none;margin:24px 0 0;padding:0}
        .lbuls li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--border);font-size:14.5px;color:var(--text-soft)}
        .lbuls li:first-child{border-top:0;padding-top:4px}
        .lchk{flex-shrink:0;width:22px;height:22px;border-radius:999px;background:var(--accent-tint);color:var(--accent);display:grid;place-items:center;margin-top:1px}
        .lcta{background:linear-gradient(160deg,#ffe9dc 0%,#fff5ec 60%,var(--bg) 100%);border-radius:24px;padding:72px 56px;text-align:center;position:relative;overflow:hidden;max-width:1100px;margin:0 auto;box-shadow:0 20px 80px rgba(135,70,30,.12)}
        .lfaq-item{border-bottom:1px solid var(--border)}
        .lfaq-item:first-child{border-top:1px solid var(--border)}
        .lfaq-item summary{list-style:none;padding:22px 4px;cursor:pointer;font-size:16px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
        .lfaq-item summary::-webkit-details-marker{display:none}
        .lfaq-ico{color:var(--text-muted);transition:transform 200ms;flex-shrink:0}
        .lfaq-item[open] .lfaq-ico{transform:rotate(45deg)}
        .lfaq-a{padding:0 4px 22px;font-size:14.5px;color:var(--text-soft);line-height:1.6}
        .lfcols{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:48px}
        .lfcol h5{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);margin:0 0 14px}
        .lfcol ul{list-style:none;padding:0;margin:0}.lfcol li{padding:5px 0}
        .lfcol a{font-size:14px;color:var(--text-soft);text-decoration:none}.lfcol a:hover{color:var(--text)}
        .lfrow{display:flex;align-items:center;gap:10px;padding:8px 0}
        .lfrow+.lfrow{border-top:1px solid var(--border)}
        .lfav{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:600;font-size:9px;position:relative}
        .lfav.on::after{content:'';position:absolute;right:-1px;bottom:-1px;width:7px;height:7px;border-radius:50%;background:var(--status-online);border:1.5px solid var(--bg-elevated)}
        .lfav.idle::after{content:'';position:absolute;right:-1px;bottom:-1px;width:7px;height:7px;border-radius:50%;background:var(--status-idle);border:1.5px solid var(--bg-elevated)}
        .lmem{background:var(--bg-elevated);padding:12px 12px 14px;border:1px solid var(--border);border-radius:6px;box-shadow:var(--shadow-2);display:inline-block}
        .lmemcap{margin-top:10px;font-family:var(--font-mono,monospace);font-size:10.5px;color:var(--text-muted);text-align:center}
        @media(max-width:980px){.lhi,.lshow,.lhgrid,.lfgrid{grid-template-columns:1fr}.lnlinks{display:none}.lfcols{grid-template-columns:1fr 1fr}.lcta{padding:48px 24px}}
      `}</style>

      {/* Nav */}
      <div className="lnw" ref={navRef}>
        <nav className="lnav">
          <Link href="/" className="lbrand"><span className="lbmark">T</span>Taskyy</Link>
          <div className="lnlinks">
            {[["#how","How it works"],["#rooms","Rooms"],["#features","Features"],["#faq","FAQ"]].map(([h,l])=>(
              <a key={h} href={h} className="lnlink">{l}</a>
            ))}
          </div>
          <div style={{ marginLeft:"auto",display:"flex",gap:8,alignItems:"center" }}>
            <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link href="/register" className="btn btn-accent btn-sm">Get started · free</Link>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="lhero">
        <div className="lhi">
          <div>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 12px 6px 8px",borderRadius:999,background:"var(--bg-elevated)",border:"1px solid var(--border)",fontSize:13,color:"var(--text-soft)",marginBottom:22,boxShadow:"var(--shadow-1)" }}>
              <span style={{ padding:"1px 8px",fontSize:11,fontWeight:600,background:"var(--accent)",color:"#fff",borderRadius:999 }}>NEW</span>
              Rooms — do daily things together
            </div>
            <h1 style={{ fontSize:"clamp(40px,5vw,64px)",fontWeight:700,letterSpacing:"-0.035em",lineHeight:1.04,maxWidth:580,margin:"0 0 0" }}>
              Calm tasks,<br/>
              <span style={{ background:"linear-gradient(180deg,var(--accent) 0%,#d9491a 100%)",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",fontStyle:"italic",fontWeight:500 }}>together.</span>
            </h1>
            <p style={{ marginTop:24,fontSize:19,lineHeight:1.5,color:"var(--text-soft)",maxWidth:520 }}>
              A calm place to keep your daily todos — see what friends are up to and do small things together.
            </p>
            <div style={{ marginTop:36,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap" }}>
              <Link href="/register" className="btn btn-accent" style={{ height:48,padding:"0 22px",fontSize:15,display:"inline-flex",alignItems:"center",gap:8 }}>
                Get started — free
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/login" className="btn" style={{ height:48,padding:"0 18px",fontSize:15 }}>Sign in</Link>
            </div>
            <div style={{ marginTop:18,fontSize:13,color:"var(--text-muted)",display:"inline-flex",gap:14,alignItems:"center",flexWrap:"wrap" }}>
              {["Free forever","No streak guilt","Light & dark mode"].map(t=>(
                <span key={t} style={{ display:"inline-flex",alignItems:"center",gap:6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>{t}
                </span>
              ))}
            </div>
          </div>

          {/* Room mockup */}
          <div style={{ transform:"rotate(-1deg)" }}>
            <div className="lmock">
              <div className="lmbar"><i/><i/><i/><span className="lmurl">taskyy.app / rooms / morning-pages</span></div>
              <div style={{ padding:"16px 18px 14px",borderBottom:"1px solid var(--border)",display:"flex",gap:12,alignItems:"center" }}>
                <div style={{ width:40,height:40,borderRadius:10,background:"var(--bg-subtle)",border:"1px solid var(--border)",display:"grid",placeItems:"center",fontSize:18 }}>☀️</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11,color:"var(--text-faint)",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:2 }}>Room</div>
                  <div style={{ fontSize:15,fontWeight:600 }}>Morning Pages</div>
                </div>
                <div style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"2px 7px",borderRadius:999,fontSize:10,fontWeight:600,color:"var(--status-online)",background:"color-mix(in oklab,var(--status-online) 14%,transparent)" }}>
                  <i style={{ width:5,height:5,borderRadius:"50%",background:"var(--status-online)",display:"block" }}/> 2 active
                </div>
              </div>
              {[
                { t:"25 min free write", d:true, c:[1,1,1,0] },
                { t:"3 lines of gratitude", d:true, c:[1,1,0,0] },
                { t:"One-sentence intention", d:false, c:[0,1,0,0] },
              ].map((r,i)=>(
                <div key={i} className={`ltrow${r.d?" dn":""}`}>
                  <span className={`lcbx${r.d?" d":""}`}/>
                  <span className="lttit">{r.t}</span>
                  <div className="lavs">
                    {[["#f97316","M"],["#0ea5e9","L"],["#a855f7","P"],["#f59e0b","T"]].map(([bg,l],j)=>(
                      <span key={j} className={`lav${r.c[j]?"":" fd"}`} style={{ background:bg }}>{l}</span>
                    ))}
                  </div>
                  <span style={{ fontFamily:"var(--font-mono,monospace)",fontSize:11,color:"var(--text-muted)",width:28,textAlign:"right" }}>{r.c.reduce((a,b)=>a+b,0)}/4</span>
                </div>
              ))}
              <div style={{ padding:"12px 18px",borderTop:"1px solid var(--border)",background:"var(--bg-subtle)",display:"flex",alignItems:"center",gap:8 }}>
                <span className="lav" style={{ width:18,height:18,fontSize:8,marginLeft:0,boxShadow:"none",background:"#0ea5e9" }}>L</span>
                <span style={{ fontSize:11.5,color:"var(--text-soft)" }}><b style={{ color:"var(--text)" }}>Liora</b> joining in 2 min — tea is brewing ☕</span>
                <span style={{ marginLeft:"auto",fontFamily:"var(--font-mono,monospace)",fontSize:10,color:"var(--text-faint)" }}>8:06</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:"100px 32px",background:"var(--bg-elevated)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)" }} id="how">
        <div style={{ maxWidth:1180,margin:"0 auto" }}>
          <div style={{ maxWidth:720,margin:"0 auto 56px",textAlign:"center" }}>
            <div style={{ display:"inline-block",fontSize:12,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--accent)",marginBottom:16 }}>How it works</div>
            <h2 style={{ fontSize:38,fontWeight:700,letterSpacing:"-0.028em" }}>Three small habits, one calm app.</h2>
            <p style={{ fontSize:18,lineHeight:1.5,marginTop:18,color:"var(--text-soft)" }}>Most productivity tools are lonely. Taskyy puts low-stakes shared activity at the center.</p>
          </div>
          <div className="lhgrid">
            {[
              { n:"01", h:"Plan your day gently", p:"Today, plans, someday. Add a task in two taps. No shaming deadlines, no guilt-inducing streaks." },
              { n:"02", h:"Show what you're up to", p:"Pick a status or write your own. Friends see it without DMing you." },
              { n:"03", h:"Do things together", p:"Create a room for something you already do. Check off together." },
            ].map(({ n, h, p })=>(
              <div key={n} className="lhcard">
                <div style={{ fontFamily:"var(--font-mono,monospace)",fontSize:12,color:"var(--text-faint)",marginBottom:16 }}>{n}</div>
                <h3 style={{ fontSize:19,marginBottom:8 }}>{h}</h3>
                <p style={{ fontSize:14,lineHeight:1.55,color:"var(--text-soft)" }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms showcase */}
      <section style={{ padding:"100px 32px",background:"linear-gradient(180deg,var(--bg) 0%,#fff5ec 50%,var(--bg) 100%)" }} id="rooms">
        <div style={{ maxWidth:1180,margin:"0 auto" }}>
          <div className="lshow">
            <div>
              <span style={{ fontSize:12,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--accent)",marginBottom:16,display:"block" }}>Rooms</span>
              <h2 style={{ fontSize:38,fontWeight:700,letterSpacing:"-0.028em",maxWidth:480,marginBottom:20 }}>Read. Run. Write.<br/>Same thing — together.</h2>
              <p style={{ fontSize:17,lineHeight:1.55,maxWidth:460,color:"var(--text-soft)" }}>A room is a shared checklist with chat. Each member marks their own eyes; you watch the room come alive as the day goes on.</p>
              <ul className="lbuls">
                {[
                  ["Per-member progress.", "See who checked off and who hasn't — without broadcasting it publicly."],
                  ["Built-in chat.", "Cheer each other on without sending a separate message thread."],
                  ["Invite-only.", "Just you and whoever you say yes to."],
                ].map(([b,d],i)=>(
                  <li key={i}>
                    <div className="lchk">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
                    </div>
                    <div><b style={{ color:"var(--text)" }}>{b}</b> {d}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lmock" style={{ boxShadow:"0 20px 80px rgba(135,70,30,.12)" }}>
              <div className="lmbar"><i/><i/><i/><span className="lmurl">taskyy.app / rooms / couch-to-5k</span></div>
              <div style={{ padding:"18px 20px",borderBottom:"1px solid var(--border)",display:"flex",gap:12,alignItems:"center" }}>
                <div style={{ width:44,height:44,borderRadius:10,background:"var(--bg-subtle)",border:"1px solid var(--border)",display:"grid",placeItems:"center",fontSize:22 }}>🏃</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11,color:"var(--text-faint)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2 }}>Room · Week 4</div>
                  <div style={{ fontSize:16,fontWeight:600 }}>Couch to 5K</div>
                  <div style={{ fontSize:12,color:"var(--text-muted)",marginTop:2 }}>3 members · Three runs a week</div>
                </div>
              </div>
              <div style={{ padding:"14px 20px",borderBottom:"1px solid var(--border)",background:"var(--bg-subtle)" }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:11.5,color:"var(--text-muted)",marginBottom:6 }}>
                  <span>This week's progress</span><span style={{ fontFamily:"var(--font-mono,monospace)" }}>1/3</span>
                </div>
                <div style={{ height:5,borderRadius:999,background:"var(--border)",overflow:"hidden" }}><div style={{ width:"33%",height:"100%",background:"var(--accent)" }}/></div>
              </div>
              {[
                { t:"Run 1 · 20 min easy", d:true, c:[1,1,1] },
                { t:"Run 2 · intervals", d:false, c:[0,1,0] },
                { t:"Run 3 · long run", d:false, c:[0,0,0] },
              ].map((r,i)=>(
                <div key={i} className={`ltrow${r.d?" dn":""}`}>
                  <span className={`lcbx${r.d?" d":""}`}/>
                  <div style={{ flex:1 }}>
                    <div className="lttit">{r.t}</div>
                    <div className="lavs" style={{ marginTop:6 }}>
                      {[["#f97316","M"],["#10b981","P"],["#ec4899","Y"]].map(([bg,l],j)=>(
                        <span key={j} className={`lav${r.c[j]?"":" fd"}`} style={{ background:bg }}>{l}</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontFamily:"var(--font-mono,monospace)",fontSize:11,color:"var(--text-muted)",width:28,textAlign:"right" }}>{r.c.reduce((a,b)=>a+b,0)}/3</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Daily memory */}
      <section style={{ padding:"100px 32px",background:"var(--bg-elevated)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1180,margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:60,alignItems:"center" }}>
            <div style={{ display:"flex",gap:16,justifyContent:"center",alignItems:"flex-end" }}>
              {[
                { t:"Mon · rainy day run", g:"linear-gradient(135deg,#fde68a,#f59e0b,#92400e)", r:"-3deg", w:180, h:180 },
                { t:"Tue · 5km · river path", g:"linear-gradient(135deg,#a7f3d0,#10b981,#064e3b)", r:"2deg", w:200, h:200, mb:18 },
                { t:"Wed · dinner with friends", g:"linear-gradient(135deg,#fbcfe8,#ec4899,#831843)", r:"-1deg", w:180, h:180 },
              ].map((m,i)=>(
                <div key={i} className="lmem" style={{ transform:`rotate(${m.r})`,marginBottom:m.mb||0 }}>
                  <div style={{ width:m.w,height:m.h,borderRadius:3,background:m.g }}/>
                  <div className="lmemcap">{m.t}</div>
                </div>
              ))}
            </div>
            <div>
              <span style={{ fontSize:12,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--accent)",marginBottom:16,display:"block" }}>Daily memory</span>
              <h2 style={{ fontSize:38,fontWeight:700,letterSpacing:"-0.028em",marginBottom:20 }}>The week, seen whole.</h2>
              <p style={{ fontSize:17,lineHeight:1.55,color:"var(--text-soft)" }}>Attach a photo when you finish a task. Taskyy quietly adds them to a small visual diary of your days.</p>
              <ul className="lbuls">
                {[["Private by default.","Memories are yours alone unless you turn sharing on."],["Weekly digest.","A gentle Sunday email that shows what you did — never makes you feel behind."]].map(([b,d],i)=>(
                  <li key={i}><div className="lchk"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg></div><div><b style={{ color:"var(--text)" }}>{b}</b> {d}</div></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"100px 32px" }} id="features">
        <div style={{ maxWidth:1180,margin:"0 auto" }}>
          <div style={{ maxWidth:720,margin:"0 auto 56px",textAlign:"center" }}>
            <div style={{ display:"inline-block",fontSize:12,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--accent)",marginBottom:16 }}>Everything else</div>
            <h2 style={{ fontSize:38,fontWeight:700,letterSpacing:"-0.028em" }}>Designed calm.</h2>
            <p style={{ fontSize:18,lineHeight:1.5,marginTop:18,color:"var(--text-soft)" }}>No streaks. No medals. No notifications pretending things are urgent.</p>
          </div>
          <div className="lfgrid">
            {[
              { t:"Light & dark mode", d:"Two themes, both calm. Switches automatically with your system." },
              { t:"Labels & priority", d:"Three priority levels — enough structure, never overwhelming." },
              { t:"Quick capture", d:"Press N anywhere to add a task in under two seconds." },
              { t:"Friend chat", d:"1:1 chat with anyone in your circle. No group spam, no noise." },
              { t:"Privacy first", d:"Every signal is opt-in. Anything can be hidden or shared." },
              { t:"Plans view", d:"A quick look at next week. Organize tomorrow before today ends." },
            ].map(({ t, d })=>(
              <div key={t} className="lfeat">
                <div className="lfic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
                </div>
                <h4 style={{ fontSize:16,marginBottom:6 }}>{t}</h4>
                <p style={{ fontSize:14,lineHeight:1.55,color:"var(--text-soft)" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"100px 32px",background:"var(--bg-elevated)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)" }} id="faq">
        <div style={{ maxWidth:1180,margin:"0 auto" }}>
          <div style={{ maxWidth:720,margin:"0 auto 56px",textAlign:"center" }}>
            <div style={{ display:"inline-block",fontSize:12,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--accent)",marginBottom:16 }}>FAQ</div>
            <h2 style={{ fontSize:38,fontWeight:700,letterSpacing:"-0.028em" }}>A few questions, answered.</h2>
          </div>
          <div style={{ maxWidth:760,margin:"0 auto" }}>
            {FAQS.map(({ q, a }, i)=>(
              <details key={i} className="lfaq-item" {...(i===0?{open:true}:{})}>
                <summary>
                  {q}
                  <svg className="lfaq-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </summary>
                <div className="lfaq-a">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"100px 32px 120px" }}>
        <div className="lcta">
          <h2 style={{ fontSize:44,fontWeight:700,letterSpacing:"-0.03em",maxWidth:640,margin:"0 auto 14px",position:"relative" }}>
            Finish the small things.<br/>With people you like.
          </h2>
          <p style={{ fontSize:18,maxWidth:520,margin:"0 auto",color:"var(--text-soft)",position:"relative" }}>
            Sign up in 30 seconds. Add a task. Add a friend. See what happens.
          </p>
          <div style={{ marginTop:32,display:"flex",gap:12,justifyContent:"center",position:"relative",flexWrap:"wrap" }}>
            <Link href="/register" className="btn btn-accent" style={{ height:48,padding:"0 24px",fontSize:15,display:"inline-flex",alignItems:"center",gap:8 }}>
              Get started — free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className="btn" style={{ height:48,padding:"0 18px",fontSize:15 }}>Sign in</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:"64px 32px 40px",borderTop:"1px solid var(--border)",background:"var(--bg)" }}>
        <div className="lfcols">
          <div>
            <Link href="/" className="lbrand" style={{ marginBottom:14 }}><span className="lbmark">T</span>Taskyy</Link>
            <p style={{ maxWidth:280,fontSize:14,color:"var(--text-muted)",marginTop:14,lineHeight:1.5 }}>Calm tasks, together.</p>
          </div>
          {[
            { h:"Product", l:[["#how","How it works"],["#rooms","Rooms"],["#features","Features"],["/register","Open app"]] },
            { h:"Company", l:[["#","About"],["#","Changelog"],["#","Contact"]] },
            { h:"Legal", l:[["#","Privacy"],["#","Terms"],["#","Status"]] },
          ].map(({ h, l })=>(
            <div key={h} className="lfcol">
              <h5>{h}</h5>
              <ul>{l.map(([href,label])=><li key={label}><a href={href}>{label}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div style={{ maxWidth:1180,margin:"64px auto 0",paddingTop:24,borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12.5,color:"var(--text-muted)",flexWrap:"wrap",gap:12 }}>
          <span>© 2026 Taskyy. All rights reserved.</span>
          <span style={{ display:"inline-flex",gap:16 }}>
            {["Twitter","Mastodon","Bluesky"].map(s=><a key={s} href="#" style={{ color:"var(--text-muted)" }}>{s}</a>)}
          </span>
        </div>
      </footer>
    </div>
  );
}
