import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import DesignerProvider from '@/components/contexts/designer-context';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Paid Form',
  description: 'An application to practice drag and drop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NextTopLoader />
          <DesignerProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </DesignerProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
