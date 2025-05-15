import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { OrderProvider } from "@/context/order-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "QMenyu - Restaurant Ordering System",
  description: "QR code-based restaurant ordering system",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <OrderProvider>
            <CartProvider>{children}</CartProvider>
          </OrderProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
