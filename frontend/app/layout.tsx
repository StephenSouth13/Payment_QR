import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Payment QR Shop",
  description: "A simple shop with QR payment feature",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex flex-col`}
      >
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🚀 Cosmic Shop</h1>
          <nav>
            <ul className="flex gap-6 text-gray-600 font-medium">
              <li className="hover:text-blue-600 cursor-pointer">Home</li>
              <li className="hover:text-blue-600 cursor-pointer">Products</li>
              <li className="hover:text-blue-600 cursor-pointer">Cart</li>
            </ul>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Cosmic Shop. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
