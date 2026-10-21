import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
export const metadata: Metadata = {
  title: "SmartTravel | Descubra seu próximo destino",
  description: "Encontre o destino de viagem ideal para o seu perfil com recomendações inteligentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
        {children}
      </body>
    </html>
  );
}
