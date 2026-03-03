import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext"
import { getCompanyInfo, getCurrencyInfo, getWhatsappInfo } from "@/lib/api"
import { WishlistProvider } from "@/context/WishlistContext"
import { CurrencyProvider } from "@/context/CurrencyContext"
import WhatsAppButton from "@/components/WhatsAppButton"
import ContactButton from "@/components/ContactButton"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-greatvibes",
  display: "swap",
  weight: "400"
})

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyInfo();

  return {
    title: company.name,
    description: company.aboutUs,
    // keywords: restaurantData.restaurant.keywords,
    generator: "https://www.syssoftintegra.com/",
    icons: {
      icon: company.icon,
      apple: company.icon,
    },
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
  const currency = await getCurrencyInfo();
  const whatsapp = await getWhatsappInfo();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <CurrencyProvider initialCurrency={currency}>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <Toaster />
                  {/* <WhatsAppButton whatsapp={whatsapp} />
                  <ContactButton /> */}
                </WishlistProvider>
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
