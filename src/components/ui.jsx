import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

export const containerClass =
  'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8'

export const PRELOAD_MS = 1700

export function Container({ children, className = '' }) {
  return <div className={`${containerClass} ${className}`}>{children}</div>
}

export function Reveal({ children, className = '', delay = 0, y = 36 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, copy, light = false }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl px-1 text-center md:mb-12">
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.4em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.28em' }}
        viewport={{ once: true }}
        className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-gold' : 'text-moss'}`}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`font-display text-3xl leading-[1.15] text-balance sm:text-4xl lg:text-[2.75rem] ${light ? 'text-cream' : 'text-forest'}`}
      >
        {title}
      </motion.h2>
      {copy ? (
        <p className={`mt-4 text-sm leading-relaxed sm:text-base ${light ? 'text-sage' : 'text-pine/70'}`}>
          {copy}
        </p>
      ) : null}
    </div>
  )
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  as = 'button',
}) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const Tag = as === 'a' ? motion.a : motion.button

  const onMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * 0.22,
      y: (e.clientY - (r.top + r.height / 2)) * 0.22,
    })
  }

  return (
    <Tag
      ref={ref}
      type={as === 'a' ? undefined : type}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className={`btn-shimmer inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-medium transition-colors duration-300 sm:w-auto ${className}`}
    >
      {children}
    </Tag>
  )
}

export function useTilt() {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(max-width: 1023px)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.transform = `perspective(980px) rotateX(${(py - 0.5) * -10}deg) rotateY(${(px - 0.5) * 12}deg) translateY(-4px)`
  }

  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform =
        'perspective(980px) rotateX(0deg) rotateY(0deg) translateY(0)'
    }
  }

  return { ref, onMove, onLeave }
}

const IMAGE_FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect fill="#e8efe4" width="400" height="500"/><path fill="#5c8a63" d="M200 410c0-90 70-140 150-155-60 15-95 55-108 110 25-70 80-110 148-125C220 220 200 300 200 410z"/><path fill="#3f6b4d" d="M200 410c0-90-70-140-150-155 60 15 95 55 108 110-25-70-80-110-148-125C180 220 200 300 200 410z"/><path fill="none" stroke="#12261b" stroke-width="8" d="M200 140v270"/></svg>',
  )

export function SmartImage({ src, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? IMAGE_FALLBACK : src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
