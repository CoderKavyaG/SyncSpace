import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SyncSpace | Local-First Collaborative Workspace",
  description:
    "A local-first workspace for pages, block content, and real-time collaboration.",
  icons: {
    icon: "/icon.svg",
  },
};

import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                fontFamily: "var(--font-plus-jakarta)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
