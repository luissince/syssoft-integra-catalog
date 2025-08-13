import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext"
import { getCompanyInfo } from "@/lib/api"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
            --font-inter: ${inter.style.fontFamily};
            --font-playfair: ${playfair.style.fontFamily};
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
