import { Mail } from 'lucide-react'
import { categories, navLinks, studio } from '../data/content'
import { useShop } from '../context/ShopContext'
import { Container } from './ui'

const socials = [
  {
    label: 'Instagram',
    path: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.2 7.1a.9.9 0 1 1-.9-.9.9.9 0 0 1 .9.9z',
  },
  {
    label: 'Facebook',
    path: 'M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.4l.6-3H13V9c0-.6.4-1 1-1z',
  },
  {
    label: 'Pinterest',
    path: 'M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.2-1.8 0-2.6l1.3-5.6s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6 1 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.5 2 1.6 2 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8-3 0-4.9 2.3-4.9 4.8 0 .9.3 1.8.7 2.4a.3.3 0 0 1 .1.3l-.3 1c0 .1-.2.2-.4.1-1.4-.6-2.1-2.2-2.1-4 0-3 2.5-6.6 7.5-6.6 4 0 6.6 2.8 6.6 5.9 0 4-2.2 7-5.5 7-1.1 0-2.1-.6-2.5-1.3l-.7 2.6c-.2.9-.9 2-1.4 2.7A9 9 0 1 0 12 3z',
  },
]

export default function Footer() {
  const { scrollTo, setActiveCategory } = useShop()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-sage">
      <Container className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="min-w-0">
          <p className="font-display text-2xl text-cream">Sylva Atelier</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            A boutique nature nursery raising indoor, outdoor, flowering,
            succulent, medicinal, and decorative plants with unhurried care.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo('#contact')
                }}
                aria-label={social.label}
                className="btn-press grid h-9 w-9 place-items-center rounded-full border border-white/10 text-cream hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d={social.path} />
                </svg>
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#contact')
              }}
              aria-label="Email"
              className="btn-press grid h-9 w-9 place-items-center rounded-full border border-white/10 text-cream hover:border-gold hover:text-gold"
            >
              <Mail size={15} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Quick links</p>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(link.href)
                  }}
                  className="transition hover:text-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Plant categories</p>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id)
                    scrollTo('#plants')
                  }}
                  className="transition hover:text-cream"
                >
                  {cat.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Contact</p>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>{studio.line1}</li>
            <li>{studio.line2}</li>
            <li>{studio.phone}</li>
            <li>{studio.email}</li>
            <li>{studio.hours}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-sage/70 sm:flex-row sm:text-left">
          <span>© {year} Sylva Atelier. Grown in Bengaluru, shipped across India.</span>
          <span>Prices inclusive of GST</span>
        </Container>
      </div>
    </footer>
  )
}
