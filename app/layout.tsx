import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/AuthContext'
import { WeaponsProvider } from '@/contexts/WeaponsContext'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import { CollectionsProvider } from '@/contexts/CollectionsContext'
import { WeaponTypesProvider } from '@/contexts/WeaponTypeContext'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Weapons Management System',
  description: 'Weapons inventory management and tracking system',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/assets/Ghana-Customs.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/assets/Ghana-Customs.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/assets/Ghana-Customs.jpg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <WeaponsProvider>
            <CollectionsProvider>
              <WeaponTypesProvider>
                <ToastContainer />
                {children}
              </WeaponTypesProvider>  
            </CollectionsProvider>
          </WeaponsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
