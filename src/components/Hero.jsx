import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Leaf, Sparkles } from 'lucide-react'
import { Container, MagneticButton, PRELOAD_MS, SmartImage } from './ui'
import { useShop } from '../context/ShopContext'

const orbitTags = [
  { label: 'Air purifying', pos: 'left-1 top-[12%]' },
  { label: 'Atelier grown', pos: 'right-1 top-[36%]' },
  { label: 'Pet-kind picks', pos: 'bottom-[22%] left-1 sm:left-2' },
]

export default function Hero() {
  const { scrollTo, setActiveCategory, setSearchQuery } = useShop()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), PRELOAD_MS + 80)
    return () => window.clearTimeout(t)
  }, [])

  const shop = () => {
    setActiveCategory('All')
    setSearchQuery('')
    scrollTo('#plants')
  }

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-forest text-cream"
    >
      <div className="absolute inset-0 grain" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-moss/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl animate-float" />

      <Container className="relative grid min-h-[100svh] items-center gap-10 py-28 sm:gap-12 sm:py-32 lg:grid-cols-2 lg:gap-12 lg:py-28 xl:gap-16">
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage/30 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gold"
          >
            <Sparkles size={12} /> Est. 1998 · Glasshouse No. 4
          </motion.p>

          <div className="overflow-hidden pb-2">
            <motion.h1
              initial={{ y: '108%', opacity: 0 }}
              animate={ready ? { y: 0, opacity: 1 } : { y: '108%', opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[2.35rem] leading-[1.08] text-balance sm:text-5xl md:text-6xl lg:text-[4.15rem] xl:text-[4.75rem]"
            >
              Bring Nature
              <span className="mt-1 block italic text-gold">Into Your Home</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-6 max-w-lg text-sm leading-relaxed text-sage sm:text-base"
          >
            Sylva Atelier is a boutique nature nursery for people who collect
            plants the way others collect art — rare foliage, medicinal greens,
            and flowering companions raised under filtered light.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              onClick={shop}
              className="bg-gold text-ink hover:bg-cream"
            >
              Shop Plants <ArrowUpRight size={16} />
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo('#categories')}
              className="border border-sage/40 bg-transparent text-cream hover:border-gold hover:bg-white/10"
            >
              Explore Collection
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.9, rotate: -4 }}
          transition={{ delay: 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full min-w-0 max-w-md overflow-x-clip px-1 pb-12 sm:px-4 lg:max-w-lg lg:pb-8"
        >
          <div className="pointer-events-none absolute inset-[6%] animate-spin-slow rounded-full border border-dashed border-gold/40" />
          <div className="pointer-events-none absolute inset-0 animate-spin-slower rounded-full border border-sage/15" />

          <div className="relative mx-auto aspect-square w-[90%] overflow-hidden rounded-[46%_54%_42%_58%/48%_38%_62%_52%] border border-gold/20 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[86%]">
            <SmartImage
              src="https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&w=1200&q=80"
              alt="Lush nursery foliage arranged in a sunlit glasshouse"
              eager
              className="h-full w-full object-cover animate-float-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
          </div>

          {orbitTags.map((tag, i) => (
            <motion.span
              key={tag.label}
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.45 + i * 0.1 }}
              className={`absolute z-10 inline-flex items-center rounded-full border border-white/15 bg-forest/80 px-2.5 py-1 text-[10px] tracking-wide text-cream backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[11px] ${tag.pos}`}
            >
              <Leaf size={12} className="mr-1.5 hidden shrink-0 text-gold sm:block" />
              {tag.label}
            </motion.span>
          ))}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.55 }}
            className="absolute bottom-0 right-0 z-10 max-w-[72%] rounded-2xl border border-white/10 bg-cream/95 p-3 text-ink shadow-xl sm:right-2 sm:max-w-none"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-moss">Plant of the week</p>
            <p className="font-display text-base leading-tight text-forest sm:text-lg">Monstera Deliciosa</p>
            <p className="text-sm text-clay">$48 · air-cleansing</p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
