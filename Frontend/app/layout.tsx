import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Header from "./header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FavPlace - Isparta Etkinlik Rehberi",
  description: "Isparta'daki en iyi mekanları keşfedin, etkinlikleri takip edin ve unutulmaz anılar biriktirin.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
