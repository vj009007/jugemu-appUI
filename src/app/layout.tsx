import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./styles/globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import ModalProvider from "@/app/providers/ModalProvider";
import { GoogleAnalytics } from '@next/third-parties/google';

const poppins = Poppins({ 
  subsets: ["latin"], weight: ["300" , "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Jugemu.AI | Democratizing Generative AI",
  description:
    "Jugemu.AI: Harnessing the power of Generative AI",
  openGraph: {
    title: "Jugemu.AI",
    description: "Democratizing Generative AI",
    images: ["/jugemu-banner.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jugemu.AI",
    description: "Democratizing Generative AI",
    images: "/jugemu-banner.png",
  },
  icons: {
    icon: "/jugemu-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className={poppins.className}>
        <AuthProvider>
          <div className="w-screens flex md:min-h-screen flex-col">
            {children}
            <ModalProvider />
          </div>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-SXP39R6K3W" />
    </html>
  );
}
