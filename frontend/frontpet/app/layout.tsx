import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-petconnect",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetConnect | All Your Pet Care in One Place",
  description: "PetConnect helps pet owners manage pets, bookings, health records, and communication in one modern dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/jsm-logo.png" sizes="any" />
      </head>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
