import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { plants } from '../data/content'
import { useShop } from '../context/ShopContext'
import Checkout, { OrderComplete } from './Checkout'
import { PRELOAD_MS, SmartImage, formatINR } from './ui'

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartTotal, clearCart, pushToast } =
    useShop()
  const [step, setStep] = useState('cart')
  const [orderTotal, setOrderTotal] = useState(0)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    if (cartOpen) return
    setStep('cart')
    setOrderTotal(0)
    setOrderId('')
  }, [cartOpen])

  const close = () => setCartOpen(false)

  const title = step === 'pay' ? 'Checkout' : step === 'done' ? 'Order placed' : 'Your cart'

  return (
    <Drawer open={cartOpen} onClose={close} title={title}>
      {step === 'done' ? (
        <OrderComplete total={orderTotal} orderId={orderId} onClose={close} />
      ) : cart.length === 0 ? (
        <p className="text-sm text-pine/60">Your cart is empty. Browse the collection to add a plant.</p>
      ) : step === 'pay' ? (
        <Checkout
          subtotal={cartTotal}
          onBack={() => setStep('cart')}
          onComplete={({ total, method }) => {
            const id = `SYL${Date.now().toString().slice(-8)}`
            clearCart()
            setOrderTotal(total)
            setOrderId(id)
            setStep('done')
            pushToast(
              method === 'cod'
                ? `Order ${id} · pay ${formatINR(total)} on delivery`
                : `Order ${id} · ${formatINR(total)} paid`,
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
                  <p className="text-xs text-moss">{formatINR(item.price)}</p>
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
              <span className="font-semibold text-forest">{formatINR(cartTotal)}</span>
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
                <p className="text-xs text-moss">{formatINR(item.price)}</p>
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
          data-lenis-prevent
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
                        <span className="text-sm text-clay">{formatINR(plant.price)}</span>
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
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let frame
    const tick = (now) => {
      const p = Math.min((now - start) / PRELOAD_MS, 1)
      setProgress(p)
      if (p < 1) frame = requestAnimationFrame(tick)
      else setShow(false)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const letters = 'Sylva Atelier'.split('')
  const pct = Math.round(progress * 100)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] overflow-hidden bg-forest"
          key="sylva-preloader"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{
            clipPath: 'circle(0% at 50% 50%)',
            filter: 'blur(12px)',
          }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 grain opacity-40" />
          <motion.div
            className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-moss/30 blur-3xl"
            animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
            animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {orbits.map((leaf, i) => (
            <motion.svg
              key={i}
              viewBox="0 0 24 24"
              className="pointer-events-none absolute fill-gold/50"
              style={{ width: leaf.size, height: leaf.size, left: '50%', top: '50%' }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0.8, 0.8],
                scale: 1,
                x: [0, leaf.x],
                y: [0, leaf.y],
                rotate: [0, leaf.r],
              }}
              transition={{ duration: 1.4, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <path d="M12 21c0-7 5-11 11-12-5 1-8 4-9 8 2-6 7-9 13-10C14 7 12 12 12 21zM12 21c0-7-5-11-11-12 5 1 8 4 9 8-2-6-7-9-13-10C10 7 12 12 12 21z" />
            </motion.svg>
          ))}

          <div className="relative grid h-full place-items-center px-6">
            <div className="text-center">
              <div className="relative mx-auto grid h-28 w-28 place-items-center sm:h-32 sm:w-32">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(201,168,106,0.18)" strokeWidth="1.4" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#c9a86a"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray={289}
                    animate={{ strokeDashoffset: 289 - 289 * progress }}
                    transition={{ duration: 0.12, ease: 'linear' }}
                  />
                </svg>
                <motion.div
                  className="absolute inset-[10%] rounded-full border border-dashed border-gold/35"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                />
                <motion.svg
                  viewBox="0 0 80 80"
                  className="relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
                  initial={{ scale: 0.4, rotate: -18, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path
                    d="M40 68c0-22 16-34 34-38C58 34 50 44 47 56c8-18 22-28 39-32C52 24 40 40 40 68"
                    fill="none"
                    stroke="#c9a86a"
                    strokeWidth="2"
                    className="stroke-draw"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <path
                    d="M40 68c0-22-16-34-34-38C22 34 30 44 33 56c-8-18-22-28-39-32C28 24 40 40 40 68"
                    fill="none"
                    stroke="#5c8a63"
                    strokeWidth="2"
                    className="stroke-draw"
                    style={{ animationDelay: '0.32s' }}
                  />
                  <path
                    d="M40 18v50"
                    fill="none"
                    stroke="#f6f1e8"
                    strokeWidth="2"
                    className="stroke-draw"
                    style={{ animationDelay: '0.48s' }}
                  />
                </motion.svg>
              </div>

              <h1 className="mt-7 flex flex-wrap justify-center overflow-hidden font-display text-[2.1rem] leading-none text-cream sm:text-5xl">
                {letters.map((ch, i) => (
                  <motion.span
                    key={`${ch}-${i}`}
                    className={`inline-block ${ch === ' ' ? 'w-2 sm:w-3' : ''} ${i > 5 ? 'italic text-gold' : ''}`}
                    initial={{ y: '120%', opacity: 0, rotate: 10, filter: 'blur(8px)' }}
                    animate={{ y: 0, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.42 + i * 0.045,
                      duration: 0.58,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                className="mt-3 text-[11px] uppercase tracking-[0.34em] text-gold"
                initial={{ opacity: 0, letterSpacing: '0.6em' }}
                animate={{ opacity: 1, letterSpacing: '0.34em' }}
                transition={{ delay: 1.05, duration: 0.8 }}
              >
                Nature nursery
              </motion.p>

              <div className="mx-auto mt-8 h-px w-40 overflow-hidden bg-white/10">
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-sage via-gold to-cream"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.12, ease: 'linear' }}
                />
              </div>
              <motion.p
                className="mt-3 font-display text-sm text-sage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Unfurling {pct}%
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const orbits = [
  { x: -120, y: -70, r: -24, size: 18 },
  { x: 118, y: -62, r: 18, size: 14 },
  { x: -96, y: 86, r: 12, size: 16 },
  { x: 108, y: 78, r: -16, size: 13 },
  { x: 8, y: -128, r: 26, size: 12 },
  { x: -8, y: 124, r: -10, size: 15 },
]

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
            data-lenis-prevent
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
