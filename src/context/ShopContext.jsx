import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { plants } from '../data/content'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [toasts, setToasts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const pushToast = (message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }

  const addToCart = (plant) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === plant.id)
      if (found) {
        return prev.map((item) =>
          item.id === plant.id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...prev, { ...plant, qty: 1 }]
    })
    pushToast(`${plant.name} added to cart`)
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)))
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (plant) => {
    const exists = wishlist.some((item) => item.id === plant.id)
    setWishlist((prev) =>
      exists ? prev.filter((item) => item.id !== plant.id) : [...prev, plant],
    )
    pushToast(exists ? `Removed from wishlist` : `${plant.name} saved to wishlist`)
  }

  const isWishlisted = (id) => wishlist.some((item) => item.id === id)

  const filteredPlants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return plants.filter((plant) => {
      const matchesCategory =
        activeCategory === 'All' || plant.category === activeCategory
      const matchesSearch = !q || plant.name.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  useEffect(() => {
    const locked = cartOpen || wishlistOpen || searchOpen || menuOpen
    document.body.style.overflow = locked ? 'hidden' : ''
    document.documentElement.style.overflowY = locked ? 'hidden' : ''
    document.documentElement.style.overflowX = 'clip'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflowY = ''
      document.documentElement.style.overflowX = 'clip'
    }
  }, [cartOpen, wishlistOpen, searchOpen, menuOpen])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setSearchOpen(false)
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const value = {
    cart,
    wishlist,
    toasts,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    isWishlisted,
    filteredPlants,
    cartCount,
    cartTotal,
    pushToast,
    scrollTo,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
