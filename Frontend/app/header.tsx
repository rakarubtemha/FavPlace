"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LogoutButton from "@/components/logout-button"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // useEffect hook'unu güncelleyelim ve localStorage işlemlerinin sadece tarayıcı tarafında çalışmasını sağlayalım
  useEffect(() => {
    // localStorage işlemlerini sadece tarayıcı tarafında çalıştır
    if (typeof window !== "undefined") {
      checkAuth()
    }
  }, [])

  // checkAuth fonksiyonunu güncelleyelim
  function checkAuth() {
    try {
      setIsLoading(true)

      // localStorage'dan oturum durumunu kontrol et
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        // localStorage'dan kullanıcı bilgilerini al
        const userInfoStr = localStorage.getItem("userInfo")
        if (userInfoStr) {
          const userInfoData = JSON.parse(userInfoStr)
          setUserInfo(userInfoData)
        }
      } else {
        setUserInfo(null)
      }
    } catch (error) {
      console.error("Kimlik doğrulama kontrolü sırasında hata:", error)
      setIsLoggedIn(false)
      setUserInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogoutSuccess() {
    // Kullanıcı çıkış yaptığında state'i güncelle
    setIsLoggedIn(false)
    setUserInfo(null)

    // localStorage'dan oturum bilgilerini temizle
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userInfo")
  }

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold text-rose-600">
          FavPlace
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/mekanlar" className="text-sm font-medium hover:text-rose-600">
            Mekanlar
          </Link>
          <Link href="/etkinlikler" className="text-sm font-medium hover:text-rose-600">
            Etkinlikler
          </Link>
          <Link href="/hakkimizda" className="text-sm font-medium hover:text-rose-600">
            Hakkımızda
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-md"></div>
          ) : isLoggedIn ? (
            <>
              <Link href="/favoriler">
                <Button variant="outline" size="sm" className="gap-2">
                  <Heart size={16} />
                  Favorilerim
                </Button>
              </Link>

              {userInfo?.accountType === "venue" ? (
                <Link href="/panel/mekanlar">
                  <Button size="sm">Panel</Button>
                </Link>
              ) : (
                <Link href="/profil">
                  <Button size="sm">Profilim</Button>
                </Link>
              )}

              <LogoutButton variant="outline" className="h-9 px-4" onLogoutSuccess={handleLogoutSuccess} />
            </>
          ) : (
            <>
              <Link href="/giris">
                <Button variant="outline" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/kayit">
                <Button size="sm">Kayıt Ol</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobil menü */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="text-xl font-bold text-rose-600">
                    FavPlace
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X />
                    </Button>
                  </SheetTrigger>
                </div>

                <div className="flex flex-col gap-4">
                  <Link href="/mekanlar" className="text-sm font-medium hover:text-rose-600">
                    Mekanlar
                  </Link>
                  <Link href="/etkinlikler" className="text-sm font-medium hover:text-rose-600">
                    Etkinlikler
                  </Link>
                  <Link href="/hakkimizda" className="text-sm font-medium hover:text-rose-600">
                    Hakkımızda
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t flex flex-col gap-3">
                  {isLoading ? (
                    <div className="w-full h-9 bg-gray-100 animate-pulse rounded-md"></div>
                  ) : isLoggedIn ? (
                    <>
                      <Link href="/favoriler" className="w-full">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Heart size={16} />
                          Favorilerim
                        </Button>
                      </Link>

                      {userInfo?.accountType === "venue" ? (
                        <Link href="/panel/mekanlar" className="w-full">
                          <Button className="w-full">Panel</Button>
                        </Link>
                      ) : (
                        <Link href="/profil" className="w-full">
                          <Button className="w-full">Profilim</Button>
                        </Link>
                      )}

                      <div className="mt-2">
                        <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" className="w-full">
                        <Button variant="outline" className="w-full">
                          Giriş Yap
                        </Button>
                      </Link>
                      <Link href="/kayit" className="w-full">
                        <Button className="w-full">Kayıt Ol</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
