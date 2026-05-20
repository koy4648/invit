import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-serif-kr",
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
  themeColor: "#f87171",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <body className={`${notoSerifKR.className} antialiased`}>{children}</body>
    </html>
  );
}
