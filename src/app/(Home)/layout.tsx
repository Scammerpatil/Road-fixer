import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoadFixer | Detect, Report, Repair - Smarter Roads Ahead",
  description:
    "Discover our advanced pothole detection and repair reporting solution. Utilizing cutting-edge technology, we identify road issues and streamline repair processes, ensuring safer and smoother journeys. Built for efficiency and accuracy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="night">
      <body className={`antialiased ${roboto.className}`}>
        <Header />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
