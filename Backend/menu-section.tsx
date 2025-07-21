"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { toast } from "@/components/ui/use-toast"
import { addMenuItem, updateMenuItem, deleteMenuItem, addMenuCategory, deleteMenuCategory } from "@/lib/actions"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
}

interface MenuCategory {
  id: string
  category: string
  items: MenuItem[]
}

interface MenuSectionProps {
  menu: MenuCategory[]
  venueId: string
  isOwner: boolean
}

export default function MenuSection({ menu, venueId, isOwner }: MenuSectionProps) {
  const [menuData, setMenuData] = useState<MenuCategory[]>(menu)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sayfa açıldığında localStorage'dan menüyü yükle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const menuStr = localStorage.getItem(`venueMenu_${venueId}`)
      if (menuStr) {
        setMenuData(JSON.parse(menuStr))
      }
    }
  }, [venueId])

  // Menü değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`venueMenu_${venueId}`, JSON.stringify(menuData))
    }
  }, [menuData, venueId])

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addMenuCategory(venueId, newCategoryName)

      setMenuData([
        ...menuData,
        {
          id: result.id,
          category: newCategoryName,
          items: [],
        },
      ])

      setNewCategoryName("")
      setIsAddingCategory(false)

      toast({
        title: "Kategori eklendi",
        description: "Menü kategorisi başarıyla eklendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kategori eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    setIsSubmitting(true)
    try {
      await deleteMenuCategory(venueId, categoryId)

      setMenuData(menuData.filter((cat) => cat.id !== categoryId))

      toast({
        title: "Kategori silindi",
        description: "Menü kategorisi başarıyla silindi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function openAddItemDialog(categoryId: string) {
    setSelectedCategory(categoryId)
    setItemForm({
      name: "",
      description: "",
      price: "",
    })
    setIsAddingItem(true)
  }

  function openEditItemDialog(categoryId: string, item: MenuItem) {
    setSelectedCategory(categoryId)
    setSelectedItem(item)
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
    })
    setIsEditingItem(true)
  }

  async function handleAddItem() {
    if (!selectedCategory || !itemForm.name.trim() || !itemForm.price.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addMenuItem(venueId, selectedCategory, {
        name: itemForm.name,
        description: itemForm.description,
        price: Number.parseFloat(itemForm.price),
      })

      const newItem = {
        id: result.id,
        name: itemForm.name,
        description: itemForm.description,
        price: Number.parseFloat(itemForm.price),
      }

      setMenuData(
        menuData.map((cat) => {
          if (cat.id === selectedCategory) {
            return {
              ...cat,
              items: [...cat.items, newItem],
            }
          }
          return cat
        }),
      )

      setIsAddingItem(false)

      toast({
        title: "Ürün eklendi",
        description: "Menü ürünü başarıyla eklendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdateItem() {
    if (!selectedCategory || !selectedItem || !itemForm.name.trim() || !itemForm.price.trim()) return

    setIsSubmitting(true)
    try {
      await updateMenuItem(venueId, selectedCategory, selectedItem.id, {
        name: itemForm.name,
        description: itemForm.description,
        price: Number.parseFloat(itemForm.price),
      })

      setMenuData(
        menuData.map((cat) => {
          if (cat.id === selectedCategory) {
            return {
              ...cat,
              items: cat.items.map((item) => {
                if (item.id === selectedItem.id) {
                  return {
                    ...item,
                    name: itemForm.name,
                    description: itemForm.description,
                    price: Number.parseFloat(itemForm.price),
                  }
                }
                return item
              }),
            }
          }
          return cat
        }),
      )

      setIsEditingItem(false)

      toast({
        title: "Ürün güncellendi",
        description: "Menü ürünü başarıyla güncellendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteItem(categoryId: string, itemId: string) {
    setIsSubmitting(true)
    try {
      await deleteMenuItem(venueId, categoryId, itemId)

      setMenuData(
        menuData.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              items: cat.items.filter((item) => item.id !== itemId),
            }
          }
          return cat
        }),
      )

      toast({
        title: "Ürün silindi",
        description: "Menü ürünü başarıyla silindi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menü</h2>
        {isOwner && (
          <Button onClick={() => setIsAddingCategory(true)} className="gap-2">
            <Plus size={16} />
            Kategori Ekle
          </Button>
        )}
      </div>

      {menuData.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-gray-600">Bu mekan için henüz menü bilgisi eklenmemiş.</p>
          {isOwner && (
            <Button onClick={() => setIsAddingCategory(true)} className="mt-4">
              Menü Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {menuData.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{category.category}</h3>
                {isOwner && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddItemDialog(category.id)}
                      className="gap-1"
                    >
                      <Plus size={14} />
                      Ürün Ekle
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                          Kategoriyi Sil
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Kategoriyi silmek istediğinize emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu işlem geri alınamaz. Bu kategori ve içindeki tüm ürünler kalıcı olarak silinecektir.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                {category.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{item.price.toFixed(2)} ₺</span>
                          {isOwner && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditItemDialog(category.id, item)}
                              >
                                <Edit size={16} />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                    <Trash2 size={16} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Ürünü silmek istediğinize emin misiniz?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bu işlem geri alınamaz. Bu ürün kalıcı olarak silinecektir.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteItem(category.id, item.id)}
                                      disabled={isSubmitting}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {category.items.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Bu kategoride henüz ürün bulunmuyor.</p>
                )}
              </div>

              <Separator />
            </div>
          ))}
        </div>
      )}

      {/* Kategori Ekleme Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Kategori Ekle</DialogTitle>
            <DialogDescription>Menüye yeni bir kategori ekleyin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Kategori Adı</Label>
              <Input
                id="categoryName"
                placeholder="Örn: Kahveler, Tatlılar, Ana Yemekler"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              İptal
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim() || isSubmitting}>
              {isSubmitting ? "Ekleniyor..." : "Kategori Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ürün Ekleme Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
            <DialogDescription>Menüye yeni bir ürün ekleyin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Ürün Adı</Label>
              <Input
                id="itemName"
                placeholder="Örn: Espresso, Cheesecake"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Açıklama (İsteğe bağlı)</Label>
              <Textarea
                id="itemDescription"
                placeholder="Ürün hakkında kısa bir açıklama"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Fiyat (₺)</Label>
              <Input
                id="itemPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingItem(false)}>
              İptal
            </Button>
            <Button onClick={handleAddItem} disabled={!itemForm.name.trim() || !itemForm.price.trim() || isSubmitting}>
              {isSubmitting ? "Ekleniyor..." : "Ürün Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ürün Düzenleme Dialog */}
      <Dialog open={isEditingItem} onOpenChange={setIsEditingItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürün Düzenle</DialogTitle>
            <DialogDescription>Menü ürününü düzenleyin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editItemName">Ürün Adı</Label>
              <Input
                id="editItemName"
                placeholder="Örn: Espresso, Cheesecake"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemDescription">Açıklama (İsteğe bağlı)</Label>
              <Textarea
                id="editItemDescription"
                placeholder="Ürün hakkında kısa bir açıklama"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemPrice">Fiyat (₺)</Label>
              <Input
                id="editItemPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingItem(false)}>
              İptal
            </Button>
            <Button
              onClick={handleUpdateItem}
              disabled={!itemForm.name.trim() || !itemForm.price.trim() || isSubmitting}
            >
              {isSubmitting ? "Güncelleniyor..." : "Ürünü Güncelle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
