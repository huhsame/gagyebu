import type { Metadata } from "next";
import {
  Song_Myung,
  Nanum_Myeongjo,
  IBM_Plex_Sans_KR,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

// 한글 폰트는 subsets를 지정하면 latin 글리프만 받아온다 → 생략해서 전체(한글 포함)를 self-host.
const songMyung = Song_Myung({
  variable: "--font-song-myung",
  weight: "400",
  display: "swap",
});

// 표제용 굵은 명조 — 금박 글자는 획이 두꺼워야 광택이 산다.
const myeongjo = Nanum_Myeongjo({
  variable: "--font-myeongjo",
  weight: ["400", "700", "800"],
  display: "swap",
  preload: false,
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
  title: "가계부 · 螺鈿帳簿",
  description: "쓰고, 남기고, 들여다보는 아주 단순한 가계부 — 나전칠기 한 겹 둘러서",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${songMyung.variable} ${myeongjo.variable} ${plexKr.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
