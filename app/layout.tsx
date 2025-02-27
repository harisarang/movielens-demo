import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movielens 20M Ratings",
  description: "Recommender System using 20M Movie Ratings",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors expand={true} closeButton={true} style={{ width: '400px', fontSize: '16px' }} />
      </body>
    </html>
  )
}

