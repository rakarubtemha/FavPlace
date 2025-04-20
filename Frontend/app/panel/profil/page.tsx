"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateProfile, deleteAccount } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Örnek kullanıcı verisi
  const user = {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    accountType: "venue",
  }

  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsUpdating(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    try {
      await updateProfile({
        name,
        email,
      })

      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleUpdatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsUpdating(true)

    const formData = new FormData(event.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        variant: "destructive",
      })
      setIsUpdating(false)
      return
    }

    try {
      // Şifre güncelleme işlemi
      toast({
        title: "Şifre güncellendi",
        description: "Şifreniz başarıyla güncellendi.",
      })

      // Form alanlarını temizle
      ;(event.target as HTMLFormElement).reset()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Şifre güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true)
    try {
      await deleteAccount()

      toast({
        title: "Hesap silindi",
        description: "Hesabınız başarıyla silindi.",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hesap silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profilim</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil Bilgileri</TabsTrigger>
          <TabsTrigger value="password">Şifre Değiştir</TabsTrigger>
          <TabsTrigger value="account">Hesap Yönetimi</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgileri</CardTitle>
              <CardDescription>Kişisel bilgilerinizi güncelleyin.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" name="name" defaultValue={user.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" name="email" type="email" defaultValue={user.email} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Hesap Türü</Label>
                  <Input id="accountType" value={user.accountType === "venue" ? "Mekan Sahibi" : "Müşteri"} disabled />
                  <p className="text-sm text-gray-500">Hesap türü değiştirilemez.</p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" form="profile-form" disabled={isUpdating}>
                {isUpdating ? "Güncelleniyor..." : "Profili Güncelle"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
              <CardDescription>Hesabınızın şifresini güncelleyin.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="password-form" onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <Input id="currentPassword" name="currentPassword" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input id="newPassword" name="newPassword" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" form="password-form" disabled={isUpdating}>
                {isUpdating ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Hesap Yönetimi</CardTitle>
              <CardDescription>Hesabınızla ilgili önemli işlemler.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md bg-red-50">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Hesabı Sil</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Hesabınızı silmek, tüm verilerinizin kalıcı olarak silinmesine neden olur. Bu işlem geri alınamaz.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Hesabımı Sil</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hesabınızı silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz (mekanlar, etkinlikler, yorumlar vb.)
                          kalıcı olarak silinecektir.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Siliniyor..." : "Evet, Hesabımı Sil"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
