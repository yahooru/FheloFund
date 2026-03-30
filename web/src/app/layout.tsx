import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FundMissingBanner } from "@/components/fund-missing-banner";
import { AppBackground } from "@/components/app-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FheloFund — Private on-chain fund (Sepolia demo)",
    template: "%s · FheloFund",
  },
  description:
    "Wallet-first DeFi fund demo on Ethereum Sepolia: deposits, shares, and manager trades. On-chain data is public on Sepolia; full FHE privacy targets Fhenix networks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AppBackground />
        <Providers>
          <FundMissingBanner />
          <SiteHeader />
          <main className="relative z-0 mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
