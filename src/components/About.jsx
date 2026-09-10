import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Leaf } from 'lucide-react'
import { stats } from '../data/content'
import { Container, Reveal, SmartImage } from './ui'

function CountUp({ value, suffix, start }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!start) return
    const duration = 1400
    const t0 = performance.now()
    let frame
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(value * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, value])

  return (
    <span>
      {n.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function About() {
  const statsRef = useRef(null)
  const inView = useInView(statsRef, { once: true, amount: 0.35 })

  return (
    <section id="about" className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-sage/20 blur-3xl" />
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative mx-auto max-w-lg pb-10">
            <motion.div
              className="group overflow-hidden rounded-[2.2rem] shadow-2xl"
              whileHover={{ rotate: -1 }}
            >
              <SmartImage
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1100&q=80"
                alt="Sunlit greenhouse aisles at Sylva Atelier"
                className="image-zoom h-[380px] w-full object-cover sm:h-[500px]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24, rotate: 6 }}
              whileInView={{ opacity: 1, x: 0, rotate: 3 }}
              viewport={{ once: true }}
              className="absolute bottom-2 right-4 w-32 overflow-hidden rounded-3xl border-4 border-cream shadow-xl sm:bottom-0 sm:w-44"
            >
              <SmartImage
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80"
                alt="Hands tending young nursery plants"
                className="h-28 w-full object-cover sm:h-40"
              />
            </motion.div>
            <div className="absolute left-3 top-6 rounded-2xl bg-forest px-3 py-2 text-cream shadow-xl sm:left-4 sm:top-8 sm:px-4 sm:py-3">
              <p className="font-display text-xl text-gold sm:text-2xl">Since 1998</p>
              <p className="text-[10px] tracking-wide text-sage sm:text-xs">Slow horticulture</p>
            </div>
          </div>
        </Reveal>

        <div className="min-w-0">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
            About the Nursery
          </p>
          <Reveal>
            <h2 className="font-display text-3xl leading-[1.15] text-balance text-forest sm:text-4xl lg:text-[2.75rem]">
              A greenhouse that still believes in patience.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-sm leading-relaxed text-pine/75 sm:text-base">
              Sylva Atelier began as a single glasshouse on the edge of a river
              meadow. We still raise every plant in living soil, harden it under
              real weather, and refuse to rush a root for a catalogue photo.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-5 flex gap-3 rounded-2xl border border-sand bg-mist/70 p-4">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-gold">
                <Leaf size={16} />
              </span>
              <p className="text-sm leading-relaxed text-pine/80">
                Sustainable gardening, for us, is compost returned to the beds,
                rainwater in the tanks, and packaging that can go back to the
                earth as quietly as a fallen leaf.
              </p>
            </div>
          </Reveal>

          <div ref={statsRef} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex min-h-[6.25rem] flex-col justify-center rounded-2xl border border-sand bg-white/80 p-4"
              >
                <p className="font-display text-3xl text-forest sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix} start={inView} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-moss">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
