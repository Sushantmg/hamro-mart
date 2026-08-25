import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/_components/Navbar";
import BackToTop from "@/_components/BackToTop";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HamroMart — Fresh Groceries Delivered",
    template: "%s | HamroMart",
  },
  description: "Fresh fruits, vegetables, and organic produce delivered to your doorstep. Shop local, eat fresh.",
  keywords: ["groceries", "fresh produce", "fruits", "vegetables", "organic", "delivery", "hamromart"],
  authors: [{ name: "HamroMart" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HamroMart",
    title: "HamroMart — Fresh Groceries Delivered",
    description: "Fresh fruits, vegetables, and organic produce delivered to your doorstep.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HamroMart — Fresh Groceries Delivered",
    description: "Fresh fruits, vegetables, and organic produce delivered to your doorstep.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster
                position="top-right"
                gutter={12}
                toastOptions={{
                  duration: 3500,
                  style: {
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                  },
                  success: {
                    iconTheme: { primary: '#059669', secondary: '#fff' },
                  },
                  error: {
                    iconTheme: { primary: '#dc2626', secondary: '#fff' },
                  },
                }}
              />
              <BackToTop />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
