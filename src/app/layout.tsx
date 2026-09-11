import type { Metadata, Viewport } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const inter = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Montserrat({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://aladdin-distribuidora.vercel.app";
const SITE_NAME = "Aladdin Distribuidora";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aladdin Distribuidora — Cosméticos e Produtos Capilares em Goiás e DF",
    template: "%s · Aladdin Distribuidora",
  },
  description:
    "Distribuidora oficial de cosméticos e produtos capilares em Goiás e no Distrito Federal. Representamos Knut Hair Care, Dailus, Labotrat, Doha Professional, City Girls, SP Colors, Sffumato Beauty e #SUPER PODERES. +9 anos de experiência.",
  keywords: [
    "Aladdin Distribuidora",
    "cosméticos Goiânia",
    "cosméticos Goiás",
    "produtos capilares",
    "Knut Hair Care",
    "Dailus",
    "Labotrat",
    "Doha Professional",
    "City Girls",
    "SP Colors",
    "Sffumato Beauty",
    "#SUPER PODERES",
    "distribuidora cosméticos DF",
    "revenda cosméticos",
    "maquiagem profissional",
    "tratamento capilar",
  ],
  authors: [{ name: "Aladdin Distribuidora" }],
  creator: "Aladdin Distribuidora",
  publisher: "Aladdin Distribuidora",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "1024x1024" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Aladdin Distribuidora — Beleza que move o seu negócio",
    description:
      "Distribuidora oficial de cosméticos e produtos capilares em Goiás e no DF. +9 anos de experiência. Marcas: Knut, Dailus, Labotrat, Doha, City Girls, SP Colors, Sffumato, #SUPER PODERES.",
    images: [
      {
        url: "/hero/hero-main.png",
        width: 1800,
        height: 1344,
        alt: "Aladdin Distribuidora — Linha Fiber Pro Knut Hair Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aladdin Distribuidora — Beleza que move o seu negócio",
    description:
      "Distribuidora oficial de cosméticos e produtos capilares em Goiás e DF. +9 anos de experiência.",
    images: ["/hero/hero-main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "beauty",
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    description:
      "Distribuidora oficial de cosméticos e produtos capilares em Goiás e no Distrito Federal.",
    image: `${SITE_URL}/hero/hero-main.png`,
    url: SITE_URL,
    telephone: "+55 62 99546-0509",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Av. Dr. Ismerino Soares de Carvalho, 292 - Quadra 16-A Lote 16 - St. Aeroporto",
      addressLocality: "Goiânia",
      addressRegion: "GO",
      postalCode: "74075-040",
      addressCountry: "BR",
    },
    areaServed: ["Goiás", "Distrito Federal"],
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
