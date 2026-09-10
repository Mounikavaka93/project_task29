import { motion } from 'framer-motion'
import { categories } from '../data/content'
import { Container, SmartImage, SectionHeading } from './ui'
import { useShop } from '../context/ShopContext'

export default function Categories() {
  const { setActiveCategory, setSearchQuery, scrollTo } = useShop()

  const openCategory = (id) => {
    setSearchQuery('')
    setActiveCategory(id)
    scrollTo('#plants')
  }

  return (
    <section id="categories" className="bg-cream py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Plant Categories"
          title="Six living rooms of the wild"
          copy="Filter the collection by habitat — from quiet indoor foliage to medicinal beds and sculptural succulents."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.button
              type="button"
              key={cat.id}
              onClick={() => openCategory(cat.id)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="group relative isolate flex min-h-[16.5rem] cursor-pointer overflow-hidden rounded-[28px] text-left shadow-[0_16px_40px_rgba(18,38,27,0.08)] sm:min-h-[18.5rem]"
            >
              <SmartImage
                src={cat.image}
                alt={cat.title}
                className="image-zoom absolute inset-0 h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.accent} opacity-70 transition duration-500 group-hover:opacity-90`}
              />
              <div className="absolute inset-0 origin-bottom scale-y-0 bg-gold/20 transition-transform duration-500 group-hover:scale-y-100" />
              <div className="relative mt-auto flex w-full flex-col justify-end p-5 sm:p-6">
                <span className="mb-2 text-[11px] uppercase tracking-[0.22em] text-gold">
                  0{i + 1}
                </span>
                <h3 className="font-display text-[1.65rem] leading-tight text-cream sm:text-3xl">
                  {cat.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist/90">{cat.blurb}</p>
                <span className="mt-4 inline-flex w-fit items-center text-xs uppercase tracking-[0.18em] text-cream after:ml-2 after:h-px after:w-6 after:bg-gold after:transition-all group-hover:after:w-12">
                  View plants
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </Container>
    </section>
  )
}
