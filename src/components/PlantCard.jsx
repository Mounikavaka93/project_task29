import { Heart, ShoppingBag, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useShop } from '../context/ShopContext'
import { SmartImage, useTilt } from './ui'

export default function PlantCard({ plant, index = 0 }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const { ref, onMove, onLeave } = useTilt()
  const loved = isWishlisted(plant.id)
  const filled = Math.round(plant.rating)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.5 }}
      className="group/card h-full min-w-0"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="card-tilt flex h-full flex-col overflow-hidden rounded-[26px] border border-sand bg-white shadow-[0_12px_36px_rgba(18,38,27,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,38,27,0.12)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <SmartImage
            src={plant.image}
            alt={plant.name}
            className="image-zoom h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-forest backdrop-blur">
            {plant.tag}
          </span>
          <button
            type="button"
            aria-label={loved ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleWishlist(plant)}
            className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition btn-press ${
              loved
                ? 'bg-clay text-white'
                : 'bg-white/80 text-forest hover:bg-gold hover:text-ink'
            }`}
          >
            <Heart size={16} fill={loved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-moss">{plant.category}</p>
          <h3 className="mt-1 line-clamp-2 min-h-[3.25rem] font-display text-xl leading-snug text-forest">
            {plant.name}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-clay">${plant.price}</p>
            <p className="inline-flex items-center gap-0.5 text-xs text-pine/70" aria-label={`Rated ${plant.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  size={12}
                  className={s < filled ? 'fill-gold text-gold' : 'text-sand'}
                />
              ))}
              <span className="ml-1">{plant.rating}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => addToCart(plant)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-forest py-2.5 text-sm text-cream transition hover:bg-moss hover:shadow-md active:scale-[0.98] btn-press"
          >
            <ShoppingBag size={15} /> Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  )
}
