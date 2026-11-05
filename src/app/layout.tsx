import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Sans_Devanagari, Noto_Serif, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans({ variable: "--font-sans-latin", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const sansDeva = Noto_Sans_Devanagari({
  variable: "--font-sans-deva",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});
const serif = Noto_Serif({ variable: "--font-serif-latin", subsets: ["latin"], weight: ["400", "700"] });
const serifDeva = Noto_Serif_Devanagari({ variable: "--font-serif-deva", subsets: ["devanagari"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Arzi: apni shikayat, sahi format mein",
  description:
    "Describe your problem in any Indian language and get a formal RTI application, bank complaint, consumer notice or civic complaint, with next steps.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body className={`${sans.variable} ${sansDeva.variable} ${serif.variable} ${serifDeva.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
