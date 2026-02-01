"use client"
import React from "react"

import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { client } from "../lib/apollo-client"
import { ApolloProvider } from "@apollo/client/react";
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ApolloProvider client={client}>
          {children}
          <Analytics />
        </ApolloProvider>

      </body>
    </html>
  )
}
