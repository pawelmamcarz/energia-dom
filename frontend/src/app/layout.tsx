import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energia Dom - Kalkulator Kosztow Energii",
  description:
    "Oblicz koszty energii dla domu z fotowoltaika, magazynem i pompa ciepla",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
