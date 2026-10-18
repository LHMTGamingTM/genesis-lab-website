import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GENESIS // LAB",
  description: "Robotics Web by Le Huynh Minh Tri",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}