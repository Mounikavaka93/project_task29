import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { studio } from '../data/content'
import { Container } from './ui'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const empty = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please share your name (2+ characters).'
    if (!emailOk(form.email.trim())) next.email = 'Enter a valid email so we can reply.'
    if (form.message.trim().length < 12) next.message = 'Tell us a little more (12+ characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSent(true)
    setForm(empty)
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
    },
  })

  return (
    <section id="contact" className="bg-cream py-16 sm:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="min-w-0">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-moss">
            Contact
          </p>
          <h2 className="font-display text-3xl leading-[1.15] text-balance text-forest sm:text-4xl lg:text-[2.75rem]">
            Write to the atelier.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-pine/70 sm:text-base">
            Looking for a rare cutting, a café installation, or advice on a
            stubborn fiddle leaf? Leave a note — horticulturists answer within two days.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-pine">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {studio.line1}
                <br />
                {studio.line2}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${studio.phone.replace(/\s/g, '')}`} className="hover:text-forest">
                {studio.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${studio.email}`} className="hover:text-forest">
                {studio.email}
              </a>
            </li>
            <li className="text-pine/70">{studio.hours}</li>
          </ul>
        </div>

        <motion.form
          noValidate
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full min-w-0 rounded-[28px] border border-sand bg-white p-5 shadow-sm sm:p-8"
        >
          {sent ? (
            <p className="py-10 text-center font-display text-2xl text-forest">
              Message received. We will write back with soil on our hands.
            </p>
          ) : (
            <>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-moss">Name</span>
                <input
                  {...field('name')}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className={`w-full rounded-2xl border bg-cream/50 px-4 py-3 text-sm outline-none focus:ring-2 ${
                    errors.name ? 'border-clay ring-2 ring-clay/30' : 'border-sand ring-gold/40'
                  }`}
                  placeholder="Your name"
                />
                {errors.name ? (
                  <p className="mt-1 text-xs text-clay" role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </label>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-moss">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  {...field('email')}
                  aria-invalid={Boolean(errors.email)}
                  className={`w-full rounded-2xl border bg-cream/50 px-4 py-3 text-sm outline-none focus:ring-2 ${
                    errors.email ? 'border-clay ring-2 ring-clay/30' : 'border-sand ring-gold/40'
                  }`}
                  placeholder="you@studio.com"
                />
                {errors.email ? (
                  <p className="mt-1 text-xs text-clay" role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </label>
              <label className="mb-5 block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-moss">Message</span>
                <textarea
                  {...field('message')}
                  rows={5}
                  aria-invalid={Boolean(errors.message)}
                  className={`w-full resize-y rounded-2xl border bg-cream/50 px-4 py-3 text-sm outline-none focus:ring-2 ${
                    errors.message ? 'border-clay ring-2 ring-clay/30' : 'border-sand ring-gold/40'
                  }`}
                  placeholder="Tell us about the space, the light, the plant you want..."
                />
                {errors.message ? (
                  <p className="mt-1 text-xs text-clay" role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </label>
              <button
                type="submit"
                className="btn-press w-full rounded-full bg-forest py-3 text-sm text-cream hover:bg-moss"
              >
                Send message
              </button>
            </>
          )}
        </motion.form>
      </Container>
    </section>
  )
}
