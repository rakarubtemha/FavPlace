"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Giriş işleminden sonra ana sayfaya yönlendirelim
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await loginUser({ email, password })

      if (result.success) {
        // Oturum bilgilerini localStorage'a kaydet
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              email,
              accountType: result.accountType,
              name: result.name,
            }),
          )

          // Oturum durumunu güncelle
          localStorage.setItem("isLoggedIn", "true")
        }

        toast({
          title: "Giriş başarılı",
          description: "Başarıyla giriş yaptınız.",
        })

        // Her durumda ana sayfaya yönlendir
        router.push("/")

        // Sayfayı yenile (oturum durumunu güncellemek için)
        window.location.reload()
      } else {
        throw new Error("Giriş başarısız")
      }
    } catch (error) {
      toast({
        title: "Giriş başarısız",
        description: "E-posta veya şifre hatalı. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
          <CardDescription className="text-center">FavPlace hesabınıza giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" placeholder="ornek@mail.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" name="password" type="password" placeholder="********" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="text-rose-600 hover:underline">
              Kayıt Ol
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
