import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "YTC Global Education | Study Abroad Consultancy",
    template: "%s | YTC Global Education",
  },
  description:
    "YTC Global Education helps students explore overseas education opportunities, find top-ranked universities across Canada, UK, USA, Australia, Germany, Ireland, New Zealand & UAE, and build a brighter future with expert guidance at every step.",
  keywords: [
    "study abroad",
    "overseas education consultancy",
    "Canada student visa",
    "UK student visa",
    "Australia study visa",
    "Germany university admission",
    "Ireland study abroad",
    "New Zealand student visa",
    "UAE universities",
    "IELTS coaching",
    "scholarship guidance",
    "YTC Global",
  ],
  authors: [{ name: "YTC Global Education" }],
  creator: "YTC Global Education",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "YTC Global Education | Study Abroad Consultancy",
    description:
      "Explore overseas education opportunities, find top-ranked universities, and build a brighter future with YTC Global's expert guidance.",
    siteName: "YTC Global Education",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "YTC Global Education | Study Abroad Consultancy",
    description:
      "Explore overseas education opportunities with YTC Global Education's expert guidance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
