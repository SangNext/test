import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "慧娴雅叙 - 视频分享与交流平台",
  description: "上传视频、分享讨论、交流互动",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Static ambient background - no movement, no shake */}
        <div className="ambient-bg" />
        <div className="starfield" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />

        <SessionProvider>
          <Navbar />
          <main className="flex-1 relative z-10 pb-20 sm:pb-0">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
