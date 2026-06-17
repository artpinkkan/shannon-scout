import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shannon Scout — AI Recruitment Platform",
  description:
    "AI-powered online recruitment platform with real-time transcription, Indonesian NLP, and intelligent candidate management.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f1117] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
