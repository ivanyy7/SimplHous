import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimplHous",
  description: "Сервис по обмену новостями о вакантном жилье",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
