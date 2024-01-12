import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Temple Tablets CRM",
  description: "Custom CRM For Temple Tablets, Built with Next.js and Firebase",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("bg-background font-sans antialiased h-full", inter.variable)}>
          <div className="md:block h-full">
            <div className="border-t h-full">
              <div className="bg-background h-full">
                <div className="w-full">
                  <div className="w-full">{children}</div>
                </div>
              </div>
            </div>
          </div>
          <Toaster />
      </body>
    </html>
  );
}
