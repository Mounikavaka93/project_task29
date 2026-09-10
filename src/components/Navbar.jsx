import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import { useShop } from '../context/ShopContext'
import { Container } from './ui'

export default function Navbar() {
  const {
    cartCount,
    wishlist,
    setCartOpen,
    setWishlistOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    scrollTo,
  } = useShop()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
      let current = '#home'
      navLinks.forEach((link) => {
        const el = document.querySelector(link.href)
        if (el && el.getBoundingClientRect().top <= 130) current = link.href
      })
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [setMenuOpen])

  const light = !scrolled && !menuOpen

  const go = (href) => {
    setMenuOpen(false)
    scrollTo(href)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className={scrolled ? 'pt-2' : ''}>
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-[60] flex items-center justify-between gap-2 py-2.5 sm:gap-3 sm:py-3 ${
            scrolled
              ? 'rounded-full border border-sand/80 bg-cream/90 shadow-[0_10px_40px_rgba(18,38,27,0.08)] backdrop-blur-xl'
              : 'bg-transparent'
          }`}
          aria-label="Primary"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('#home')
            }}
            className="flex min-w-0 items-center gap-2 sm:gap-2.5"
          >
            <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-forest text-cream ring-1 ring-gold/40">
              <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden>
                <path
                  d="M20 32c0-9 6.5-14 14-15.5C29 18 25 22 23.8 27c2.5-6.5 7.8-10.4 14.2-11.6C27.6 15.4 20 22 20 32z"
                  fill="#c9a86a"
                />
                <path
                  d="M20 32c0-9-6.5-14-14-15.5C11 18 15 22 16.2 27c-2.5-6.5-7.8-10.4-14.2-11.6C12.4 15.4 20 22 20 32z"
                  fill="#5c8a63"
                />
                <path d="M20 12v20" stroke="#f6f1e8" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="min-w-0 leading-tight">
              <span
                className={`block truncate font-display text-base sm:text-lg md:text-xl ${
                  light ? 'text-cream' : 'text-forest'
                }`}
              >
                Sylva Atelier
              </span>
              <span
                className={`hidden text-[10px] uppercase tracking-[0.22em] sm:block ${
                  light ? 'text-sage' : 'text-moss'
                }`}
              >
                Nature nursery
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-5 lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  go(link.href)
                }}
                className={`relative whitespace-nowrap text-sm transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-gold after:transition-all ${
                  active === link.href ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                } ${
                  light
                    ? active === link.href
                      ? 'text-gold'
                      : 'text-cream/85 hover:text-cream'
                    : active === link.href
                      ? 'text-forest'
                      : 'text-pine/80 hover:text-forest'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <IconBtn
              label="Search plants"
              onClick={() => {
                setMenuOpen(false)
                setSearchOpen(true)
              }}
            >
              <Search size={18} />
            </IconBtn>
            <IconBtn
              label="Open wishlist"
              onClick={() => {
                setMenuOpen(false)
                setWishlistOpen(true)
              }}
            >
              <Heart size={18} />
              {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </IconBtn>
            <IconBtn
              label="Open shopping cart"
              onClick={() => {
                setMenuOpen(false)
                setCartOpen(true)
              }}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </IconBtn>
            <button
              type="button"
              className="btn-press relative z-[70] ml-0.5 grid h-9 w-9 place-items-center rounded-full border border-sand bg-white/80 text-forest sm:h-10 sm:w-10 lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.nav>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] overflow-y-auto bg-forest/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
          >
            <div className="absolute inset-0 grain pointer-events-none opacity-40" />
            <nav className="relative mx-auto flex max-w-sm flex-col gap-5" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(link.href)
                  }}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 * i, duration: 0.4 }}
                  className={`font-display text-4xl leading-none ${
                    active === link.href ? 'text-gold' : 'text-cream'
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <p className="relative mx-auto mt-12 max-w-sm text-sm leading-relaxed text-sage">
              A living collection of greenhouse botanicals, packed like heirlooms.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function IconBtn({ children, onClick, label, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`btn-press relative grid h-9 w-9 place-items-center rounded-full border border-sand/90 bg-white/80 text-forest shadow-sm sm:h-10 sm:w-10 ${className}`}
    >
      {children}
    </button>
  )
}

function Badge({ children }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold text-white">
      {children}
    </span>
  )
}
