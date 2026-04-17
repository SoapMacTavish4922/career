import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/lib/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}