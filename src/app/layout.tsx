import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/lib/toast";
import { ThemeProvider } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catat Uang",
  description: "Aplikasi pencatatan keuangan pribadi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col md:flex-row bg-stone-50 dark:bg-stone-950 font-sans text-stone-800 dark:text-stone-200 antialiased transition-colors duration-200">
        <ThemeProvider>
        <ToastProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20 md:pb-6 animate-fade-in-up">
            {children}
          </main>
        </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
