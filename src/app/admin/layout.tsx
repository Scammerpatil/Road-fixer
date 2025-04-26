import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import SideNav from "./SideNav";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="night">
      <body className={`antialiased ${roboto.className}`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
}
