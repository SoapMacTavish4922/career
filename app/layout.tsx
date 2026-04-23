// app/layout.tsx
// Wire up setSessionExpiryHandler so axios interceptor can call triggerSessionExpiry
// from AuthContext without circular imports

"use client";

import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/context/AuthContext";
import { setSessionExpiryHandler } from "@/lib/api/client";
import SessionExpiredOverlay from "@/components/career-portal/SessionExpiryOverlay";
import QueryProvider from "@/lib/providers/QueryProvider";

// ── Inner component — has access to AuthContext ───────────────────────────────
function AppShell({ children }: { children: React.ReactNode }) {
  const { triggerSessionExpiry } = useAuth();

  // Wire axios interceptor to AuthContext on mount
  useEffect(() => {
    setSessionExpiryHandler(triggerSessionExpiry);
  }, [triggerSessionExpiry]);

  return (
    <>
      {children}
      {/* Overlay renders on top of everything when session expires */}
      <SessionExpiredOverlay />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}