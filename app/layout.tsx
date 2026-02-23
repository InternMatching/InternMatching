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
<<<<<<< HEAD
=======
import { Toaster } from "sonner"
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
            {children}
            <Analytics />
<<<<<<< HEAD
=======
            <Toaster />
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
