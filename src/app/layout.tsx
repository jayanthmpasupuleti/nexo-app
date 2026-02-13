import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nexo - NFC Keychain",
  description: "Your digital identity, on a keychain. NFC-powered digital business cards, Wi-Fi sharing, and more.",
  manifest: "/manifest.json",
  icons: {
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents zooming for a more native app feel
  },
  themeColor: "#f8f9fa",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nexo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`} style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
