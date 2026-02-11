import type { Metadata } from "next";
import { Poppins, IBM_Plex_Mono, DM_Sans, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kwizhub.vercel.app"), // Replace with your production domain
  title: {
    default: "KwizHub - The Marketplace for Verified Academic Creators",
    template: "%s | KwizHub"
  },
  description: "The premier platform for educators and scholars to publish, sell, and scale their academic impact. Monetize your expertise and reach a global audience of students.",
  keywords: ["academic marketplace", "educator tools", "study materials", "verified creators", "educational resources"],
  authors: [{ name: "KwizHub Team" }],
  creator: "KwizHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kwizhub.vercel.app",
    title: "KwizHub - The Marketplace for Verified Academic Creators",
    description: "Publish, sell, and scale your academic impact. Join the elite circle of top educators globally.",
    siteName: "KwizHub",
    images: [
      {
        url: "/og-image.png", // Recommended size: 1200x630
        width: 1200,
        height: 630,
        alt: "KwizHub - Academic Creators Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KwizHub - The Marketplace for Verified Academic Creators",
    description: "The premier platform for educators and scholars to publish, sell, and scale their academic impact.",
    creator: "@xyz_07hb",
    images: ["/og-image.png"], // Recommended size: 1200x600
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${ibmPlexSans.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
