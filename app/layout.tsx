import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "XAU/USD Trading Academy",
  description: "From Zero to Systematic Chart-Based Gold Trading",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Suspense fallback={<div className="w-[268px] shrink-0 border-r border-border bg-surface" />}>
              <Sidebar />
            </Suspense>
            <main className="min-w-0 flex-1">
              <div className="mx-auto w-full max-w-workspace px-6 py-8 lg:px-10 animate-fade-in">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
