import { motion } from 'framer-motion'
import { useState } from 'react'
import { MagneticButton, Container } from './ui'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!emailOk(email.trim())) {
      setError('Enter a valid email, like you@studio.com.')
      return
    }
    setError('')
    setDone(true)
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden bg-pine py-16 text-cream sm:py-20 lg:py-24">
      <div className="absolute inset-0 grain" />
      <div className="pointer-events-none absolute left-8 top-8 h-3 w-3 rounded-full bg-gold/70 animate-dew" />
      <div className="pointer-events-none absolute right-16 top-16 h-2 w-2 rounded-full bg-sage animate-dew [animation-delay:1s]" />
      <div className="pointer-events-none absolute bottom-12 left-1/3 h-2.5 w-2.5 rounded-full bg-cream/50 animate-dew [animation-delay:1.8s]" />

      <svg
        className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 text-gold/15"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M100 180c0-50 36-78 78-86C144 102 122 124 116 152c14-36 44-58 80-64C138 88 100 124 100 180z" />
        <path d="M100 180c0-50-36-78-78-86C56 102 78 124 84 152c-14-36-44-58-80-64C62 88 100 124 100 180z" />
      </svg>

      <Container>
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            Newsletter
          </p>
          <h2 className="font-display text-3xl leading-[1.15] text-balance sm:text-4xl lg:text-[2.75rem]">
            A letter from the beds, once a month.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-sage">
            Seasonal arrivals, care notes, and the odd rare cutting — no clutter,
            only what a gardener would actually open.
          </p>

          {done ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-full bg-gold/15 px-5 py-3 text-sm text-gold"
              role="status"
            >
              Welcome to the grove. Watch your inbox for the first field note.
            </motion.p>
          ) : (
            <form
              noValidate
              onSubmit={submit}
              className="mx-auto mt-8 flex max-w-lg flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="Your email address"
                  aria-label="Email address"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  className={`h-12 w-full rounded-full border bg-white/10 px-5 text-sm text-cream outline-none placeholder:text-sage/70 focus:ring-2 ${
                    error
                      ? 'border-clay ring-2 ring-clay/40'
                      : 'border-white/15 ring-gold/40'
                  }`}
                />
              </div>
              <MagneticButton type="submit" className="bg-gold text-ink hover:bg-cream">
                Subscribe
              </MagneticButton>
            </form>
          )}
          {error ? (
            <p id="newsletter-error" className="mt-3 text-sm text-clay" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
