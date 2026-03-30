import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { CartProvider } from "@/context/CartContext";

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
      <body className="font-sans antialiased">
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
