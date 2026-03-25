"use client"
import React from "react"

import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { client } from "../lib/apollo-client"
import { ApolloProvider } from "@apollo/client/react";
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });



import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { usePathname } from "next/navigation"
import { GoogleOAuthProvider } from '@react-oauth/google'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()


  const hideNavbarRoutes = ["/admin", "/company", "/student"]
  const shouldHideNavbar = hideNavbarRoutes.some(route => pathname.startsWith(route))

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ApolloProvider client={client}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {!shouldHideNavbar && <Navbar />}
              {children}
              {!shouldHideNavbar && <Footer />}
              <Analytics />
              <Toaster />
            </ThemeProvider>
          </GoogleOAuthProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
