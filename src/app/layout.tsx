import type { Metadata } from "next";
import MainShell from "@/components/layout/main-shell";
import QueryProvider from "@/components/common/providers/query-provider";
import AuthSessionProvider from "@/components/common/providers/session-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopping Mall Demo",
  description: "Shopping Mall Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthSessionProvider>
            <MainShell>{children}</MainShell>
          </AuthSessionProvider>
        </QueryProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
