import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/ui/NavBar";
import { Inter } from 'next/font/google';
import { SessionProvider } from "@/providers/SessionProvider";
import Script from "next/script";
import { getPortfolioData } from "@/lib/portfolio-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Deven Kumar Chaurasia - Full Stack Developer | Professional Portfolio",
  description: "Professional portfolio of Deven Kumar Chaurasia - Full Stack Developer specializing in React, Next.js, Node.js, and modern web development. View projects, skills, and experience.",
  keywords: [
    'Deven Kumar',
    'Deven Kumar Chaurasia',
    'Deven portfolio',
    'Full Stack Developer',
    'Web Developer',
    'React Developer',
    'Next.js Developer',
    'Node.js Developer',
    'JavaScript Developer',
    'TypeScript Developer',
    'Portfolio',
    'Developer Portfolio',
    'Best Portfolio',
    'Professional Portfolio',
  ],
  authors: [{ name: 'Deven Kumar Chaurasia' }],
  creator: 'Deven Kumar Chaurasia',
  publisher: 'Deven Kumar Chaurasia',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Deven's Portfolio",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  verification: {
    google: 'iI3hfk9EtSSqdV4INaclUSHASYQ1psn8Xx0UoeRlJk0', // Google Search Console verification
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch portfolio data for NavBar
  let userName = "Deven";
  try {
    const portfolioData = await getPortfolioData();
    userName = portfolioData.bio?.name || "Deven";
  } catch (error) {
    console.error("Error fetching portfolio data for layout:", error);
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}>
      <body>
        <SessionProvider>
          <NavBar name={userName} />
          {children}
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
        <Script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></Script>
      </body>
    </html>
  );
}