import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Midlex CBT Portal | German, Legal & Multilingual Assessment System",
  description: "Computer-Based Testing (CBT) System for Midlex LLP - German Grammar, MCQ (ABCD), True/False & Theory with Image Support",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full max-w-full overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
