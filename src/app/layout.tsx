import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "Nicki Beauty Salon | Premium Beauty Services",
  description: "Transform your look with professional hair, lash, nail, and spa services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          <CartProvider>
            <Header />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
            <FloatingActions />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
