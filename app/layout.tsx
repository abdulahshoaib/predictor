import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/error-boundary";
import Background from "@/components/background";
import Footer from "@/components/footer";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "WC Predictor",
  description: "World Cup 2026 Predictor App",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "overflow-x-hidden font-sans antialiased",
          manrope.variable,
        )}
      >
        <Providers>
          <ErrorBoundary>
            <Background />
            {children}
            <Footer />
          </ErrorBoundary>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
