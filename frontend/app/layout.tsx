import type { Metadata, Viewport } from "next";
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

// Configuration PWA & SEO "Tycoon Style"
export const metadata: Metadata = {
  title: "AURA Financial Core | UHG",
  description: "The First AI-CFO for Dubai. Optimized Wealth & Tax Compliance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AURA",
  },
  formatDetection: {
    telephone: false,
  },
};

// Configuration de l'affichage mobile (Empêche le zoom, force le mode app)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-emerald-500 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}

