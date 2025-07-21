"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Header from "./header"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <html lang="tr">
      <head>
        <title>FavPlace - Isparta Etkinlik Rehberi</title>
        <meta name="description" content="Isparta'daki en iyi mekanları keşfedin, etkinlikleri takip edin ve unutulmaz anılar biriktirin." />
        <meta name="generator" content="v0.dev" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <Header />
        <main className={!isHomePage ? "pt-20" : ""}>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
