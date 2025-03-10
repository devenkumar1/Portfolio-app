import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/ui/NavBar";
import { Inter } from 'next/font/google';
import { PortfolioProvider } from "@/context/PortfolioContext";
import { SessionProvider } from "@/providers/SessionProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] });

// Metadata export for page (title, description, etc.)
export const metadata: Metadata = {
  title: "Deven's Portfolio",
  description: "A professional portfolio showcasing projects and skills",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

// Viewport export for screen scaling (separate from metadata)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Theme color for the browser toolbar (separate from metadata)
export const themeColor = "#111827";

// Apple web app settings (part of the metadata but separate from viewport/themeColor)
export const appleWebApp = {
  capable: true,
  statusBarStyle: "default",
  title: "Portfolio App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}>
      <body>
        <SessionProvider>
          <PortfolioProvider>
            <NavBar />
            {children}
          </PortfolioProvider>
        </SessionProvider>
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
