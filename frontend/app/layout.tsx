import type { Metadata, Viewport } from "next";
// --- Utilisation de Geist directement depuis le package externe ---
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";


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
  // CLASSE MAÎTRESSE : Applique le mode sombre, la police et le fond directement sur HTML
  return (
    <html 
        lang="en" 
        className={`${GeistSans.variable} ${GeistMono.variable} dark antialiased bg-slate-950 text-white`}
    >
      <body
        // Classes restantes pour le corps
        className="selection:bg-emerald-500 selection:text-black"
      >
        {children}
      </body>
    </html>
  );
}