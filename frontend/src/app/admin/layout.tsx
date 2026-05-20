"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { href:"/admin", label:"Dashboard", icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="9" height="9"/><rect x="13" y="3" width="9" height="9"/><rect x="2" y="13" width="9" height="9"/><rect x="13" y="13" width="9" height="9"/></svg> },
    { href:"/admin/users", label:"Users", icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/></svg> },
  ];

  return (
    <div style={{ display:"grid",gridTemplateColumns:"220px 1fr",height:"100vh",background:"var(--bg)" }}>
      <aside style={{ background:"var(--bg-subtle)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",padding:"16px 12px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,padding:"6px 8px 20px",fontWeight:600,fontSize:15 }}>
          <div style={{ width:26,height:26,borderRadius:7,background:"var(--accent)",color:"#fff",display:"grid",placeItems:"center",fontWeight:700,fontSize:13 }}>T</div>
          <span>Taskyy</span>
          <span style={{ padding:"1px 6px",fontSize:10,fontWeight:600,background:"color-mix(in oklab,var(--status-busy) 14%,transparent)",color:"var(--status-busy)",borderRadius:999,marginLeft:"auto" }}>Admin</span>
        </div>

        <div style={{ fontSize:10.5,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--text-faint)",padding:"0 8px 8px" }}>Management</div>

        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display:"flex",alignItems:"center",gap:10,padding:"7px 8px",borderRadius:6,
              fontSize:13.5,fontWeight:500,textDecoration:"none",transition:"background 120ms",
              background:active?"var(--bg-elevated)":"transparent",
              color:active?"var(--text)":"var(--text-soft)",
              boxShadow:active?"var(--shadow-1)":"none",
              marginBottom:2,
            }}>
              {icon}{label}
            </Link>
          );
        })}

        <div style={{ marginTop:"auto",paddingTop:12,borderTop:"1px solid var(--border)" }}>
          <Link href="/dashboard" style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:6,fontSize:13,color:"var(--text-muted)",textDecoration:"none",transition:"background 120ms" }}
            onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-hover)")}
            onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to app
          </Link>
        </div>
      </aside>

      <div style={{ overflow:"auto",padding:"40px 48px" }}>{children}</div>
    </div>
  );
}
