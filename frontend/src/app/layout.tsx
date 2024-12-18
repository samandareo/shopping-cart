import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext"; // Import the CartProvider

// Load Google Fonts
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Page Metadata
export const metadata: Metadata = {
  title: "Grocery Store",
  description: "Built by <samandareo/>",
};

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* Wrap the app with the CartProvider */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
