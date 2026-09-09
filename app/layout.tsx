// app/layout.tsx

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, Roboto_Mono } from "next/font/google"
import "../styles/globals.css";
import { getCurrentSession } from "@/lib/auth";
import { ThemeProvider } from "@/components/ThemeProvider"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext"
import { getBranches, getCompanyInfo, getCurrencyInfo, getWhatsappInfo } from "@/lib/api"
import { WishlistProvider } from "@/context/WishlistContext"
import { CurrencyProvider } from "@/context/CurrencyContext"
import WhatsAppButton from "@/components/WhatsAppButton"
import ContactButton from "@/components/ContactButton"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { WhatsAppProvider } from "@/context/WhatsAppContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const company = await getCompanyInfo();

    return {
      title: company.name,
      description: company.aboutUs,
      // keywords: restaurantData.restaurant.keywords,
      generator: "https://www.syssoftintegra.com/",
      icons: {
        icon: company.icon,
        apple: company.icon,
      }
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Sistema",
      description: "Tienda online",
      generator: "https://www.syssoftintegra.com/",
      icons: {
        icon: "/favicon.ico"
      }
    };
  }
}

export const viewport: Viewport = {
  initialScale: 1.0,
  width: 'device-width',
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [
    company,
    currency,
    whatsapp,
    branches,
    person
  ] = await Promise.all([
    getCompanyInfo(),
    getCurrencyInfo(),
    getWhatsappInfo(),
    getBranches(),
    getCurrentSession(),
  ]);

  if (!company) {
    throw new Error("Company information not found");
  }

  if (!currency) {
    throw new Error("Currency information not found");
  }

  if (!whatsapp) {
    throw new Error("Whatsapp information not found");
  }

  if (!branches || branches.length === 0) {
    throw new Error("Branches not found");
  }

  const branch = branches.find((branch) => branch.primary === true)!;

  return (
    <html lang="es" className={`
    ${inter.variable}
    ${playfair.variable}
    ${mono.variable}
  `} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <CurrencyProvider initialCurrency={currency}>
              <WhatsAppProvider initialWhatsapp={whatsapp}>
                <CartProvider>
                  <WishlistProvider>
                    <div className="min-h-screen bg-background">
                      <Nav
                        company={company}
                        branch={branch}
                        person={person}
                      />

                      {children}

                      <Footer
                        company={company}
                        branch={branch}
                      />
                    </div>
                    <Toaster />
                    <WhatsAppButton
                      company={company}
                    />
                    <ContactButton />
                  </WishlistProvider>
                </CartProvider>
              </WhatsAppProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
