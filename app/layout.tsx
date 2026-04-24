
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/context/AuthContext";
import QueryProvider from "@/lib/providers/QueryProvider";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "IDBI Intech Career Portal",
  description: "Explore opportunities at IDBI Intech",
};

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