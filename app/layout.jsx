import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { CartProvider } from '@/context/CartContext'
import Cart from '@/components/Cart'

const inter = Inter({ subsets:['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets:['latin'], variable:'--font-playfair' })

export const metadata = {
  title: 'Palette Haus — Curated Digital Color Palettes for Interiors',
  description: 'Shop curated, downloadable PDF + PNG color palette packs for interiors. Timeless & trendy collections.',
  openGraph: {
    title: 'Palette Haus',
    description: 'Timeless & Trendy Color Palettes for Modern Interiors',
    url: 'https://palette-haus.example.com',
    siteName: 'Palette Haus',
    images: ['/images/palettes/scandi-neutrals-01.svg'],
    locale: 'en_US',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body`}>
        <ErrorBoundary>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Cart />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
