import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "./session-provider"
import { QQueryClientProvider } from "@/components/query-client-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Soulmate 友趣館",
  description: "Discover and experience unforgettable events",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QQueryClientProvider>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </QQueryClientProvider>
      </body>
    </html>
  )
}

