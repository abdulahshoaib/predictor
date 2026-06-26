import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
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
    <html lang="en" suppressHydrationWarning className="min-h-screen">
      <body
        className={cn(
          "min-h-screen flex flex-col overflow-x-hidden font-sans antialiased",
          manrope.variable,
        )}
      >
        <Providers>
          <ErrorBoundary>
            <Background />
            <SkeletonTheme baseColor="rgba(255, 255, 255, 0.1)" highlightColor="rgba(255, 255, 255, 0.15)">
              <div className="flex-1">{children}</div>
            </SkeletonTheme>
            <Footer />
          </ErrorBoundary>
        </Providers>
        <Toaster richColors position="bottom-center" theme="dark" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
