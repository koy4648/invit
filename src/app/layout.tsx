import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "김민준 ♥ 이서연 결혼합니다",
  description:
    "2025년 10월 18일 토요일 오전 11시, 두 사람의 새로운 시작을 함께 축복해 주세요.",
  openGraph: {
    title: "김민준 ♥ 이서연 결혼합니다",
    description: "2025년 10월 18일 토요일 오전 11시",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#c49a55",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable} ${cormorant.variable}`}>
      <body className={`${notoSerifKR.className} antialiased`}>{children}</body>
    </html>
  );
}