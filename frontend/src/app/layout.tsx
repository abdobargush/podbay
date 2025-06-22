import type { Metadata } from "next";
import { Handjet } from "next/font/google";
import "./globals.css";
import "@hackernoon/pixel-icon-library/fonts/iconfont.css";
import Logo from "@/components/Logo";
import SearchForm from "@/components/SearchForm";
import { Suspense } from "react";
import Player, { PlayerProvider } from "@/components/Player";

const handjet = Handjet({
  variable: "--font-handjet",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "خليج البودكاست",
  description: "استكشف وابحث في أكبر مكتبة عربية للبودكاست.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PlayerProvider>
      <html lang="ar" dir="rtl">
        <body className={`${handjet.variable} font-arabic antialiased`}>
          <main className="container mx-auto flex flex-col min-h-screen md:border-r md:border-l border-neutral-700">
            <nav className="sticky p-4 md:p-8 w-full top-0 bg-background/30 backdrop-blur-xl border-b border-neutral-700 z-[999]">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <Logo />
                <Suspense>
                  <SearchForm />
                </Suspense>
              </div>
            </nav>

            {children}

            <Player />
          </main>
        </body>
      </html>
    </PlayerProvider>
  );
}
