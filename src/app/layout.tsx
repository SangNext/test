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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Animated background */}
        <div className="magic-bg" />
        <div className="stars">
          <div className="star" /><div className="star" /><div className="star" />
          <div className="star" /><div className="star" /><div className="star" />
          <div className="star" /><div className="star" /><div className="star" />
          <div className="star" /><div className="star" /><div className="star" />
          <div className="star" /><div className="star" /><div className="star" />
        </div>
        <div className="particles">
          <div className="particle" /><div className="particle" /><div className="particle" />
          <div className="particle" /><div className="particle" /><div className="particle" />
          <div className="particle" /><div className="particle" />
        </div>

        <SessionProvider>
          <Navbar />
          <main className="flex-1 relative z-10 pb-20 sm:pb-0">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
