import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Map",
  description: "Personal travel map with places and routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
