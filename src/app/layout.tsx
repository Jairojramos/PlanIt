// Root layout. Handles HTML structure, global fonts, and app-wide providers.

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Poppins provides the geometric, bold, and friendly aesthetic seen in modern focus apps.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PlanIt",
  description: "Task and productivity management PWA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased scroll-smooth">
      {/* Defaulting to a deep dark theme (#0A0A0B) to match the exact brand reference. */}
      <body className={`${poppins.className} bg-zinc-50 dark:bg-[#0A0A0B] text-zinc-900 dark:text-zinc-50 transition-colors duration-300 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}