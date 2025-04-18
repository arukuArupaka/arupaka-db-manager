import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { useEffectEvent as _useEffectEvent } from "use-effect-event";

(React as any).useEffectEvent = _useEffectEvent;

export const metadata: Metadata = {
  title: "admin site",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
