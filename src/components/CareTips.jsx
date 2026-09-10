import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { careTips } from '../data/content'
import { Container, SectionHeading, SmartImage } from './ui'

function CareTipCard({ tip, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <article className="group flex flex-col rounded-[28px] border border-sand bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(18,38,27,0.08)]">
        <div className="relative h-48 shrink-0 overflow-hidden rounded-t-[28px]">
          <SmartImage
            src={tip.image}
            alt={tip.title}
            className="image-zoom h-full w-full object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-forest/85 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-cream">
            {tip.topic}
          </span>
        </div>
        <div className="flex flex-col p-6">
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-moss">
            <span>0{index + 1}</span>
            <span>{tip.read} read</span>
          </div>
          <h3 className="font-display text-2xl leading-tight text-forest">{tip.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-pine/70">{tip.excerpt}</p>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={`care-tip-${tip.id}`}
            onClick={() => setOpen((value) => !value)}
            className="btn-press relative z-10 mt-5 inline-flex cursor-pointer items-center gap-1.5 self-start rounded-full border border-sand px-4 py-2 text-sm text-clay hover:border-moss hover:bg-mist"
          >
            {open ? 'Show less' : 'Keep reading'}
            <ChevronDown
              size={15}
              className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            id={`care-tip-${tip.id}`}
            className={`care-tip-body ${open ? 'is-open' : ''}`}
            hidden={!open}
          >
            <p className="mt-4 border-l-2 border-gold/70 pl-4 text-sm leading-relaxed text-pine/80">
              {tip.body}
            </p>
          </div>
        </div>
      </article>
    </motion.div>
  )
}

export default function CareTips() {
  return (
    <section id="care" className="bg-cream py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Plant Care Tips"
          title="Field notes from the glasshouse"
          copy="Short essays on watering, light, soil, and the rituals that keep a collection alive."
        />

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          {careTips.map((tip, i) => (
            <CareTipCard key={tip.id} tip={tip} index={i} />
          ))}
        </div>
      </Container>
    </section>
  )
}
