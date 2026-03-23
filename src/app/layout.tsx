import type { Metadata } from "next";
import { Fredoka, Playfair_Display, DM_Sans, Noto_Color_Emoji } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoColorEmoji = Noto_Color_Emoji({
  variable: "--font-emoji",
  subsets: ["emoji"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bolo-bolo.pt";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Bolo-Bolo",
    default: "Bolo-Bolo | Bolos Caseiros em Braga",
  },
  description:
    "Bolos caseiros feitos com carinho em Braga. Cheesecakes, bolos de chocolate e bolos de cenoura — encomenda o teu hoje.",
  keywords: [
    "bolos caseiros Braga",
    "encomenda bolos Braga",
    "cheesecake Braga",
    "bolo de aniversário Braga",
    "padaria caseira Braga",
    "bolos artesanais",
  ],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "Bolo-Bolo",
    title: "Bolo-Bolo | Bolos Caseiros em Braga",
    description:
      "Cheesecakes, bolos de chocolate e bolos de cenoura — feitos em casa, com amor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolo-Bolo | Bolos Caseiros em Braga",
    description:
      "Cheesecakes, bolos de chocolate e bolos de cenoura — feitos em casa, com amor.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${fredoka.variable} ${playfair.variable} ${dmSans.variable} ${notoColorEmoji.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
