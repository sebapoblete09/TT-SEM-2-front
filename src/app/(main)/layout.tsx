import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/layout/navbar";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Definimos la URL base para que las imágenes de redes sociales funcionen
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  // BASE METADATA
  metadataBase: new URL(baseUrl),
  title: {
    default: "Biomateriales UTEM | Plataforma de Innovación Open Source",
    template: "%s | Biomateriales UTEM", // Para sub-páginas: "Alginato | Biomateriales UTEM"
  },
  description:
    "Plataforma digital de la Universidad Tecnológica Metropolitana para la documentación, gestión y divulgación de recetas de biomateriales. Un repositorio Open Source para la innovación sostenible en Chile.",

  // KEYWORDS (Palabras clave para Google)
  keywords: [
    "Biomateriales",
    "UTEM",
    "Innovación",
    "Sustentabilidad",
    "Recetas Open Source",
    "Ciencia de Materiales",
    "Chile",
    "Investigación",
    "Economía Circular",
  ],

  // AUTORES
  authors: [
    { name: "Sebastian Poblete", url: "https://tu-portafolio.com" },
    { name: "Samuel Llach", url: "https://portafolio.com" },
    {
      name: "Universidad Tecnológica Metropolitana",
      url: "https://www.utem.cl",
    },
  ],
  creator: "Sebastian Andres Poblete Chacon",
  publisher: "UTEM",

  // OPEN GRAPH (Cómo se ve en Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: baseUrl,
    title: "Biomateriales UTEM | Repositorio de Innovación",
    description:
      "Explora y colabora en la biblioteca más grande de recetas de biomateriales de la UTEM. Ciencia abierta para un futuro sostenible.",
    siteName: "Biomateriales UTEM",
    images: [
      {
        url: "/images/og-image.jpg", // Tienes que crear esta imagen (1200x630px)
        width: 1200,
        height: 630,
        alt: "Plataforma de Biomateriales UTEM - Preview",
      },
    ],
  },

  // ROBOTS (Instrucciones para Google Bot)
  robots: {
    index: true, // Permitir indexar
    follow: true, // Permitir seguir enlaces
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ICONOS
  icons: {
    icon: "/images/UtemLogo.webp",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// CONFIGURACIÓN DE VIEWPORT (Separado en Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#16a34a", // Color verde de tu marca (green-600)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main>{children}</main>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
