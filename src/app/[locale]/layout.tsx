import { ReactNode } from "react";

import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { MatchesLiveProvider } from "@/contexts/MatchesLiveContext";
import { routing } from "@/i18n/routing";

import "@/app/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HockeyBet - Pronostics de Hockey",
  description: "Application de pronostics pour les matchs de hockey",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full m-0 p-0`}
      >
        <div className="min-h-full flex flex-col bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <AuthProvider>
            <MatchesLiveProvider>
              <ThemeProvider attribute="class">
                <NextIntlClientProvider>
                  <Toaster position="top-right" richColors />
                  <Navbar />
                  <main className="flex-1 pt-40">{children}</main>
                  <Footer />
                </NextIntlClientProvider>
              </ThemeProvider>
            </MatchesLiveProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
