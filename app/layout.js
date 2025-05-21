import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { AuthProvider } from '@/lib/AuthContext';
import { TimerProvider } from '@/lib/TimerContext';
import ThemeRegistry from '@/components/ThemeRegistry';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Study Session",
  description: "Track your study sessions and progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <TimerProvider>
            <ThemeRegistry>
              <Navbar />
              <div className="h-[65px]"></div>
              {children}
              <Footer />
            </ThemeRegistry>
          </TimerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
