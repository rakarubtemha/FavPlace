"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { logoutUser } from "@/lib/actions"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  onLogoutSuccess?: () => void
}

export default function LogoutButton({ variant = "ghost", className = "", onLogoutSuccess }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logoutUser()

      // localStorage'dan oturum bilgilerini temizle
      if (typeof window !== "undefined") {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userInfo")
      }

      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yaptınız.",
      })

      // Callback'i çağır
      if (onLogoutSuccess) {
        onLogoutSuccess()
      }

      // Ana sayfaya yönlendir
      router.push("/")

      // Sayfayı yenile (oturum durumunu güncellemek için)
      window.location.reload()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant={variant}
      className={`${className} w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50`}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut className="mr-3 h-5 w-5" />
      {isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </Button>
  )
}
