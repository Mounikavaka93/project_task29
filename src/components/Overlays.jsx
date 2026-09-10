import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { plants } from '../data/content'
import { useShop } from '../context/ShopContext'
import Checkout, { OrderComplete } from './Checkout'
import { PRELOAD_MS, SmartImage } from './ui'

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartTotal, clearCart, pushToast } =
    useShop()
  const [step, setStep] = useState('cart')
  const [orderTotal, setOrderTotal] = useState(0)

  useEffect(() => {
    if (cartOpen) return
    setStep('cart')
    setOrderTotal(0)
  }, [cartOpen])

  const close = () => setCartOpen(false)

  const title = step === 'pay' ? 'Checkout' : step === 'done' ? 'Order placed' : 'Your crate'

  return (
    <Drawer open={cartOpen} onClose={close} title={title}>
      {step === 'done' ? (
        <OrderComplete total={orderTotal} onClose={close} />
      ) : cart.length === 0 ? (
        <p className="text-sm text-pine/60">The crate is empty. Wander the catalogue.</p>
      ) : step === 'pay' ? (
        <Checkout
          subtotal={cartTotal}
          onBack={() => setStep('cart')}
          onComplete={({ total, method }) => {
            clearCart()
            setOrderTotal(total)
            setStep('done')
            pushToast(
              method === 'cod'
                ? `Order placed · pay $${total} on delivery`
                : `Payment received · $${total}`,
            )
          }}
        />
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 space-y-4 overflow-y-auto pr-1">
            {cart.map((item) => (
              <li key={item.id} className="flex gap-3 rounded-2xl border border-sand p-2">
                <SmartImage src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-forest">{item.name}</p>
                  <p className="text-xs text-moss">${item.price}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <QtyBtn onClick={() => updateQty(item.id, item.qty - 1)}>
                      <Minus size={12} />
                    </QtyBtn>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <QtyBtn onClick={() => updateQty(item.id, item.qty + 1)}>
                      <Plus size={12} />
                    </QtyBtn>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-clay"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-sand pt-4">
            <div className="mb-3 flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold text-forest">${cartTotal}</span>
            </div>
            <button
              type="button"
              onClick={() => setStep('pay')}
              className="btn-press w-full rounded-full bg-forest py-3 text-sm text-cream hover:bg-moss"
            >
              Secure checkout
            </button>
          </div>
        </div>
      )}
    </Drawer>
  )
}

export function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, addToCart, toggleWishlist } = useShop()

  return (
    <Drawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} title="Wishlist">
      {wishlist.length === 0 ? (
        <p className="text-sm text-pine/60">Nothing saved yet. Tap a heart on any plant.</p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-4 overflow-y-auto">
          {wishlist.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-2xl border border-sand p-2">
              <SmartImage src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-forest">{item.name}</p>
                <p className="text-xs text-moss">${item.price}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="btn-press rounded-full bg-forest px-3 py-1 text-[11px] text-cream hover:bg-moss"
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item)}
                    className="text-[11px] text-clay"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}

export function SearchOverlay() {
  const {
    searchOpen,
    setSearchOpen,
    setSearchQuery,
    setActiveCategory,
    scrollTo,
    addToCart,
  } = useShop()
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return plants.slice(0, 6)
    return plants.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 8)
  }, [q])

  const closeSearch = () => {
    setQ('')
    setSearchOpen(false)
  }

  useEffect(() => {
    if (!searchOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  const go = (plant) => {
    setActiveCategory('All')
    setSearchQuery(plant.name)
    setSearchOpen(false)
    scrollTo('#plants')
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-start bg-forest/70 px-4 pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSearch}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full min-w-0 max-w-xl rounded-[28px] bg-cream p-4 shadow-2xl sm:p-6"
          >
            <div className="flex items-center gap-3 rounded-full border border-sand bg-white px-4">
              <Search size={16} className="text-moss" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search plants by name..."
                className="h-12 flex-1 bg-transparent text-sm outline-none"
              />
              <button type="button" onClick={closeSearch} aria-label="Close search">
                <X size={16} />
              </button>
            </div>
            <ul className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">
              {results.length === 0 ? (
                <li className="px-2 py-6 text-center text-sm text-pine/60">No matching plants.</li>
              ) : (
                results.map((plant) => (
                  <li key={plant.id}>
                    <div className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white">
                      <button
                        type="button"
                        onClick={() => go(plant)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <SmartImage src={plant.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-forest">{plant.name}</span>
                          <span className="text-xs text-moss">{plant.category}</span>
                        </span>
                        <span className="text-sm text-clay">${plant.price}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(plant)}
                        className="hidden rounded-full bg-forest px-2.5 py-1 text-[10px] text-cream sm:inline"
                      >
                        Add
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ToastStack() {
  const { toasts } = useShop()
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[80] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-full bg-forest px-4 py-2.5 text-center text-sm text-cream shadow-lg"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function Preloader() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setShow(false), PRELOAD_MS)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-forest"
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <svg viewBox="0 0 80 80" className="mx-auto h-16 w-16">
              <path
                d="M40 68c0-22 16-34 34-38C58 34 50 44 47 56c8-18 22-28 39-32C52 24 40 40 40 68"
                fill="none"
                stroke="#c9a86a"
                strokeWidth="2"
                className="stroke-draw"
              />
              <path
                d="M40 68c0-22-16-34-34-38C22 34 30 44 33 56c-8-18-22-28-39-32C28 24 40 40 40 68"
                fill="none"
                stroke="#5c8a63"
                strokeWidth="2"
                className="stroke-draw"
              />
              <path
                d="M40 18v50"
                fill="none"
                stroke="#f6f1e8"
                strokeWidth="2"
                className="stroke-draw"
              />
            </svg>
            <p className="mt-4 font-display text-3xl text-cream">Sylva Atelier</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-gold">Unfurling</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -40, y: -40 })
  const [hot, setHot] = useState(false)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    const sync = () => setOn(fine.matches)
    sync()
    fine.addEventListener('change', sync)

    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      const t = e.target
      setHot(Boolean(t.closest('a, button, input, textarea, [data-cursor]')))
    }
    window.addEventListener('mousemove', move)
    return () => {
      fine.removeEventListener('change', sync)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  if (!on) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[100] h-2 w-2 rounded-full bg-gold"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.3 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[100] rounded-full border border-gold/70"
        animate={{
          x: pos.x - (hot ? 22 : 16),
          y: pos.y - (hot ? 22 : 16),
          width: hot ? 44 : 32,
          height: hot ? 44 : 32,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      />
    </>
  )
}

export function AmbientLeaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${(i * 11 + 4) % 96}%`,
        delay: `${i * 1.4}s`,
        duration: `${14 + (i % 5) * 2}s`,
        drift: `${-30 + i * 8}px`,
        size: 10 + (i % 4) * 4,
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          viewBox="0 0 24 24"
          className="absolute -top-8 fill-moss/35"
          style={{
            left: leaf.left,
            width: leaf.size + 6,
            height: leaf.size + 6,
            animation: `leaf-drift ${leaf.duration} linear infinite`,
            animationDelay: leaf.delay,
            '--drift': leaf.drift,
          }}
        >
          <path d="M12 21c0-7 5-11 11-12-5 1-8 4-9 8 2-6 7-9 13-10C14 7 12 12 12 21zM12 21c0-7-5-11-11-12 5 1 8 4 9 8-2-6-7-9-13-10C10 7 12 12 12 21z" />
        </svg>
      ))}
    </div>
  )
}

export function ScrollVine() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setP(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed left-3 top-[18%] z-40 hidden h-[64vh] w-1 overflow-hidden rounded-full bg-sand/70 2xl:block">
      <motion.div
        className="w-full origin-top rounded-full bg-gradient-to-b from-gold via-leaf to-moss"
        style={{ height: `${Math.max(p * 100, 4)}%` }}
      />
    </div>
  )
}

export function Marquee() {
  const words = [
    'Monstera',
    'Atelier grown',
    'Rain-fed soil',
    'Slow horticulture',
    'Living rooms',
    'Rare cuttings',
    'Glasshouse light',
    'Root-first packing',
    'Seasonal bloom',
    'Wild & well-kept',
  ]
  const row = [...words, ...words]

  return (
    <div className="relative max-w-full overflow-hidden border-y border-sand bg-cream py-3">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {row.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-8 text-sm text-pine/70">
            <span className="font-display text-lg italic text-forest">{word}</span>
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Drawer({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close panel"
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-y-0 right-0 z-[65] flex w-[min(100%,420px)] flex-col bg-cream p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-2xl text-forest">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="btn-press grid h-9 w-9 place-items-center rounded-full border border-sand hover:border-gold hover:bg-mist"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function QtyBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-6 w-6 place-items-center rounded-full border border-sand text-forest hover:bg-mist"
    >
      {children}
    </button>
  )
}
