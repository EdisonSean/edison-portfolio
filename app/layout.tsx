import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollEnhancer from "@/components/layout/ScrollEnhancer";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDISON | Houdini FX Motion Designer",
  description:
    "Portfolio homepage for a Houdini FX and motion designer focused on procedural systems and simulation-driven visuals.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="notranslate" translate="no">
      <body className="notranslate" translate="no">
        {children}
        <ScrollEnhancer />
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
