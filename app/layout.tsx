import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "./context/ProfileContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "600"],  // 400 = regular, 600 = semi-bold
});

export const metadata: Metadata = {
  title: "NavCart",
  description: "Grocery Route Vizualizer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ProfileProvider>
                    {children}
                </ProfileProvider>
            </body>
        </html>
    );
}