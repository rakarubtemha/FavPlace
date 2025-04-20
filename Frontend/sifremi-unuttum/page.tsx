"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { sendPasswordResetEmail } from "@/lib/actions"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      await sendPasswordResetEmail(email)
      setIsSubmitted(true)
      toast({
        title: "E-posta gönderildi",
        description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Şifre sıfırlama e-postası gönderilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Şifremi Unuttum</CardTitle>
          <CardDescription className="text-center">
            E-posta adresinizi girin, şifre sıfırlama bağlantısını göndereceğiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4 text-green-600">
                Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
              </p>
              <p className="text-sm text-gray-600">
                Lütfen e-posta kutunuzu kontrol edin. Spam klasörünü de kontrol etmeyi unutmayın.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center">
            <Link href="/giris" className="text-rose-600 hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
