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
import { usePathname } from "next/navigation"

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {!shouldHideNavbar && <Navbar />}
            {children}
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
