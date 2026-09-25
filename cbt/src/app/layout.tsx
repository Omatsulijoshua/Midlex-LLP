import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Midlex CBT Portal | German, Legal & Multilingual Assessment System",
  description: "Computer-Based Testing (CBT) System for Midlex LLP - German Grammar, MCQ (ABCD), True/False & Theory with Image Support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
