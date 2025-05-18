import { Inter  } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { AuthProvider } from '@/lib/AuthContext';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Stydis",
  description: "Stay curious!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
