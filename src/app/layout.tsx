import type { Metadata } from "next";
import { Noto_Sans_Hebrew, Space_Grotesk, Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500"],
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
        className={`${notoSansHebrew.variable} ${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable} font-sans antialiased bg-background-dark text-on-surface min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
