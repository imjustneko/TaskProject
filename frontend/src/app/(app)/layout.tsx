"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { QuickCapture } from "@/components/ui/quick-capture";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "2px solid var(--accent)",
          borderTopColor: "transparent",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="view">
          {children}
        </div>
      </div>
      <QuickCapture />
    </div>
  );
}
