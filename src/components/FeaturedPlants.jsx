import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { categories } from '../data/content'
import { useShop } from '../context/ShopContext'
import PlantCard from './PlantCard'
import { Container, SectionHeading } from './ui'

const filters = ['All', ...categories.map((c) => c.id)]

export default function FeaturedPlants() {
  const { filteredPlants, activeCategory, setActiveCategory, searchQuery, setSearchQuery } =
    useShop()

  return (
    <section id="plants" className="scroll-mt-24 bg-mist/60 py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Featured Plants"
          title="A living catalogue, freshly watered"
          copy="Search by name or filter by habitat. Every card is a specimen you can save, study, and crate overnight."
        />

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveCategory(filter)}
                className={`btn-press rounded-full px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] sm:px-4 sm:text-xs ${
                  activeCategory === filter
                    ? 'bg-forest text-cream shadow-md'
                    : 'border border-sand bg-white text-pine hover:border-moss hover:bg-mist'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <label className="relative w-full shrink-0 lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-moss" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plants by name"
              className="h-11 w-full rounded-full border border-sand bg-white py-2.5 pl-10 pr-4 text-sm text-forest outline-none ring-gold/40 transition placeholder:text-pine/40 focus:ring-2"
            />
          </label>
        </div>

        <AnimatePresence mode="wait">
          {filteredPlants.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredPlants.map((plant, i) => (
                <PlantCard key={plant.id} plant={plant} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-dashed border-sand bg-white px-6 py-16 text-center text-pine/70"
            >
              No plants match that name. Try another variety or clear the filter.
            </motion.p>
          )}
        </AnimatePresence>
      </Container>
    </section>
  )
}
