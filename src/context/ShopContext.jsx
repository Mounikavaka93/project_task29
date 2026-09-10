import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLenis } from 'lenis/react'
import { plants } from '../data/content'

const ShopContext = createContext(null)

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / private mode */
  }
}

function offsetFor(el, id) {
  if (id === '#home') return 0
  const header = document.querySelector('header')
  const navH = header ? header.getBoundingClientRect().height : 64
  const pad = parseFloat(window.getComputedStyle(el).paddingTop) || 0
  return pad - navH - 8
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStore('sylva-cart', []))
  const [wishlist, setWishlist] = useState(() => readStore('sylva-wishlist', []))
  const [toasts, setToasts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => writeStore('sylva-cart', cart), [cart])
  useEffect(() => writeStore('sylva-wishlist', wishlist), [wishlist])

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
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    if (locked) lenis?.stop()
    else lenis?.start()
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [cartOpen, wishlistOpen, searchOpen, menuOpen, lenis])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setSearchOpen(false)
    const el = document.querySelector(id)
    if (!el) return
    const offset = offsetFor(el, id)
    if (lenis) {
      lenis.scrollTo(el, { offset, duration: 0.85 })
      return
    }
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
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
