"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createAccount } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("customer")

  // Kayıt işleminden sonra ana sayfaya yönlendirelim
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const accountType = userType

    try {
      const result = await createAccount({
        email,
        password,
        name,
        accountType,
      })

      if (result.success) {
        // Oturum bilgilerini localStorage'a kaydet
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              name,
              email,
              accountType,
            }),
          )

          // Oturum durumunu güncelle
          localStorage.setItem("isLoggedIn", "true")
        }

        toast({
          title: "Hesap oluşturuldu",
          description: "Hesabınız başarıyla oluşturuldu. Giriş yapıldı.",
        })

        // Her durumda ana sayfaya yönlendir
        router.push("/")

        // Sayfayı yenile (oturum durumunu güncellemek için)
        window.location.reload()
      } else {
        throw new Error("Hesap oluşturulamadı")
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
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
          <CardTitle className="text-2xl font-bold text-center">Hesap Oluştur</CardTitle>
          <CardDescription className="text-center">
            FavPlace'e hoş geldiniz. Hesap türünüzü seçin ve kayıt olun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" name="name" placeholder="Ad Soyad" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" placeholder="ornek@mail.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" name="password" type="password" placeholder="********" required />
            </div>
            <div className="space-y-2">
              <Label>Hesap Türü</Label>
              <RadioGroup
                defaultValue="customer"
                value={userType}
                onValueChange={setUserType}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Müşteri</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venue" id="venue" />
                  <Label htmlFor="venue">Mekan Sahibi</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Zaten hesabınız var mı?{" "}
            <Link href="/giris" className="text-rose-600 hover:underline">
              Giriş Yap
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
