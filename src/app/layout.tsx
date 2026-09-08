import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR, Cormorant_Garamond, Great_Vibes } from "next/font/google";
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

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const SITE_URL = "https://invitation-xi-nine.vercel.app";
const SHARE_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "김영서 ♥ 정진성 결혼합니다",
  description:
    "2027년 8월 28일 토요일 낮 12시, 두 사람의 새로운 시작을 함께 축복해 주세요.",
  openGraph: {
    title: "김영서 ♥ 정진성 결혼합니다",
    description: "2027년 8월 28일 토요일 낮 12시, 두 사람의 새로운 시작을 함께 축복해 주세요.",
    url: SITE_URL,
    siteName: "김영서 ♥ 정진성 모바일 청첩장",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: SHARE_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "벚꽃 아래 손을 잡고 마주 보는 김영서와 정진성",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "김영서 ♥ 정진성 결혼합니다",
    description: "2027년 8월 28일 토요일 낮 12시",
    images: [SHARE_IMAGE_URL],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable} ${cormorant.variable} ${greatVibes.variable}`}>
      <body className={`${notoSerifKR.className} antialiased`}>{children}</body>
    </html>
  );
}
