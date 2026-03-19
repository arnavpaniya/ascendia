import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { StoreProvider } from "@/providers/StoreProvider";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ascendia | Elite EdTech Platform",
  description: "A next-generation EdTech platform for elite preparation.",
  icons: {
    icon: [
      { url: "/tab-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/tab-logo.svg",
    apple: "/tab-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-dm-sans antialiased text-white bg-[#07080f]`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
