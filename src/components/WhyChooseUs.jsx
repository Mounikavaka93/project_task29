import { motion } from 'framer-motion'
import { CreditCard, Leaf, Package, Sprout, Truck } from 'lucide-react'
import { reasons } from '../data/content'
import { Container, SectionHeading } from './ui'

const icons = [Sprout, Truck, Package, Leaf, CreditCard]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-forest py-16 text-cream sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          light
          eyebrow="Why Choose Us"
          title="The quiet luxuries of a serious nursery"
          copy="Healthy stock, swift climate crates, and care that continues after the doorstep."
        />

        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {reasons.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/10 bg-pine/40 p-5 sm:p-6"
              >
                <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/10 transition duration-500 group-hover:scale-150" />
                <span className="relative mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                  <Icon size={22} />
                  <span className="absolute inset-0 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-2xl border border-gold/40" />
                </span>
                <h3 className="relative font-display text-xl leading-tight sm:text-2xl">{item.title}</h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-sage">{item.copy}</p>
              </motion.article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
