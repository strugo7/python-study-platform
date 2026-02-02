import type { Metadata } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Python Master - הכנה למבחן בפייתון",
  description: "פלטפורמת לימוד פייתון אינטראקטיבית בעברית עם ויזואליזציות זיכרון וסימולטור מבחנים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <body
        className={`${notoSansHebrew.variable} font-sans antialiased bg-background-dark text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
