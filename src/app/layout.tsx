import type { Metadata } from "next";
import { Song_Myung, IBM_Plex_Sans_KR, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// 한글 폰트는 subsets를 지정하면 latin 글리프만 받아온다 → 생략해서 전체(한글 포함)를 self-host.
const songMyung = Song_Myung({
  variable: "--font-song-myung",
  weight: "400",
  display: "swap",
});

const plexKr = IBM_Plex_Sans_KR({
  variable: "--font-plex-kr",
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "가계부 · 家計簿",
  description: "쓰고, 남기고, 들여다보는 아주 단순한 가계부",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${songMyung.variable} ${plexKr.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
