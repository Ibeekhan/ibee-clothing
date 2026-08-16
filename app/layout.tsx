import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "IBEE Clothing — Wear Your Identity",
    template: "%s | IBEE Clothing",
  },
  description: "IBEE Clothing — modern, minimal streetwear for young Pakistan. Wear Your Identity.",
  openGraph: {
    title: "IBEE Clothing",
    description: "Wear Your Identity.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
