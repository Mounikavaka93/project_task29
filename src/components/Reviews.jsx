import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { reviews } from '../data/content'
import { Container, SectionHeading, SmartImage } from './ui'

export default function Reviews() {
  return (
    <section id="reviews" className="bg-mist/70 py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Letters from other rooms"
          copy="Collectors, café owners, and first-time plant parents on what arrived at their door."
        />

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
          {reviews.map((review, i) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.65 }}
              whileHover={{ y: -6 }}
              className="relative flex h-full flex-col rounded-[28px] border border-sand bg-white p-6 shadow-[0_12px_30px_rgba(18,38,27,0.05)] sm:p-8"
            >
              <Quote className="absolute right-5 top-5 h-9 w-9 text-gold/30 sm:right-6 sm:top-6" aria-hidden />
              <div className="flex items-center gap-3 pr-10">
                <SmartImage
                  src={review.image}
                  alt={`${review.name} profile photo`}
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-gold/40"
                />
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight text-forest">{review.name}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-moss">{review.role}</p>
                </div>
              </div>
              <div
                className="mt-3 flex items-center gap-0.5"
                aria-label={`Rated ${review.rating} out of 5`}
              >
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s < Math.round(review.rating) ? 'fill-gold text-gold' : 'text-sand'}
                  />
                ))}
                <span className="ml-2 text-xs text-pine/60">{review.rating}</span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-pine/75 sm:text-base">
                “{review.text}”
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  )
}
