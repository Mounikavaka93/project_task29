import { ArrowLeft, Banknote, CheckCircle2, CreditCard, Lock, Truck, Wallet } from 'lucide-react'
import { useState } from 'react'
import { formatINR } from './ui'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const EXPRESS_FEE = 499

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  delivery: 'standard',
  method: 'card',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  wallet: '',
}

const methods = [
  { id: 'card', label: 'Card', hint: 'Visa, Mastercard, RuPay', Icon: CreditCard },
  { id: 'wallet', label: 'UPI', hint: 'GPay, PhonePe, Paytm', Icon: Wallet },
  { id: 'cod', label: 'Cash on delivery', hint: 'Pay at the door', Icon: Banknote },
]

const deliveries = [
  { id: 'standard', label: 'Standard crate', hint: '5–7 days · free', extra: 0, Icon: Truck },
  { id: 'express', label: 'Express crate', hint: `2 days · +${formatINR(EXPRESS_FEE)}`, extra: EXPRESS_FEE, Icon: Truck },
]

function digits(value) {
  return value.replace(/\D/g, '')
}

function formatCard(value) {
  return digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value) {
  const d = digits(value).slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

function fieldClass(error) {
  return `w-full rounded-2xl border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 ${
    error ? 'border-clay ring-2 ring-clay/30' : 'border-sand ring-gold/40'
  }`
}

export default function Checkout({ subtotal, onBack, onComplete }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const shipping = form.delivery === 'express' ? EXPRESS_FEE : 0
  const total = subtotal + shipping

  const set = (key) => (e) => {
    let value = e.target.value
    if (key === 'cardNumber') value = formatCard(value)
    if (key === 'expiry') value = formatExpiry(value)
    if (key === 'cvc') value = digits(value).slice(0, 4)
    if (key === 'phone') value = digits(value).slice(0, 15)
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const choose = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter the name on this order.'
    if (!emailOk(form.email.trim())) next.email = 'Enter a valid email for receipts.'
    if (digits(form.phone).length < 10) next.phone = 'Enter a 10-digit phone number.'
    if (form.address.trim().length < 8) next.address = 'Add a full delivery address.'
    if (form.method === 'card') {
      if (form.cardName.trim().length < 2) next.cardName = 'Enter the name on the card.'
      if (digits(form.cardNumber).length !== 16) next.cardNumber = 'Enter a 16-digit card number.'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) next.expiry = 'Use MM/YY.'
      if (form.cvc.length < 3) next.cvc = 'Enter the CVC.'
    }
    if (form.method === 'wallet' && !/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(form.wallet.trim())) {
      next.wallet = 'Enter a UPI ID such as name@bank.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onComplete({
      total,
      method: form.method,
      delivery: form.delivery,
    })
  }

  return (
    <form noValidate onSubmit={submit} className="flex h-full min-h-0 flex-col">
      <button
        type="button"
        onClick={onBack}
        className="btn-press mb-4 inline-flex items-center gap-1.5 self-start text-sm text-moss hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back to crate
      </button>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-moss">
            Delivery
          </p>
          <div className="grid grid-cols-1 gap-2">
            {deliveries.map((item) => {
              const selected = form.delivery === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose('delivery', item.id)}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    selected ? 'border-gold bg-mist' : 'border-sand bg-white hover:border-moss'
                  }`}
                >
                  <item.Icon size={16} className="shrink-0 text-clay" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-forest">{item.label}</span>
                    <span className="text-[11px] text-pine/60">{item.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss">
            Shipping details
          </p>
          <Field label="Full name" error={errors.name}>
            <input
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              className={fieldClass(errors.name)}
              placeholder="Anita Sharma"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className={fieldClass(errors.email)}
              placeholder="anita@studio.in"
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              className={fieldClass(errors.phone)}
              placeholder="9876543210"
            />
          </Field>
          <Field label="Address" error={errors.address}>
            <textarea
              value={form.address}
              onChange={set('address')}
              rows={3}
              autoComplete="street-address"
              aria-invalid={Boolean(errors.address)}
              className={`${fieldClass(errors.address)} resize-y`}
              placeholder="House no., street, Bengaluru 560035"
            />
          </Field>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-moss">
            Payment
          </p>
          <div className="grid grid-cols-1 gap-2">
            {methods.map((item) => {
              const selected = form.method === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose('method', item.id)}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    selected ? 'border-gold bg-mist' : 'border-sand bg-white hover:border-moss'
                  }`}
                >
                  <item.Icon size={16} className="shrink-0 text-clay" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-forest">{item.label}</span>
                    <span className="text-[11px] text-pine/60">{item.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {form.method === 'card' ? (
            <div className="mt-3 space-y-3 rounded-2xl border border-sand bg-white p-3">
              <Field label="Name on card" error={errors.cardName}>
                <input
                  value={form.cardName}
                  onChange={set('cardName')}
                  autoComplete="cc-name"
                  aria-invalid={Boolean(errors.cardName)}
                  className={fieldClass(errors.cardName)}
                  placeholder="Anita Sharma"
                />
              </Field>
              <Field label="Card number" error={errors.cardNumber}>
                <input
                  value={form.cardNumber}
                  onChange={set('cardNumber')}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  aria-invalid={Boolean(errors.cardNumber)}
                  className={fieldClass(errors.cardNumber)}
                  placeholder="4242 4242 4242 4242"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Expiry" error={errors.expiry}>
                  <input
                    value={form.expiry}
                    onChange={set('expiry')}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    aria-invalid={Boolean(errors.expiry)}
                    className={fieldClass(errors.expiry)}
                    placeholder="MM/YY"
                  />
                </Field>
                <Field label="CVC" error={errors.cvc}>
                  <input
                    value={form.cvc}
                    onChange={set('cvc')}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    aria-invalid={Boolean(errors.cvc)}
                    className={fieldClass(errors.cvc)}
                    placeholder="123"
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {form.method === 'wallet' ? (
            <div className="mt-3">
              <Field label="UPI ID" error={errors.wallet}>
                <input
                  value={form.wallet}
                  onChange={set('wallet')}
                  aria-invalid={Boolean(errors.wallet)}
                  className={fieldClass(errors.wallet)}
                  placeholder="name@okbank"
                />
              </Field>
            </div>
          ) : null}

          {form.method === 'cod' ? (
            <p className="mt-3 text-xs leading-relaxed text-pine/70">
              Pay in cash when the crate arrives. Keep the exact amount ready for the courier.
            </p>
          ) : null}
        </section>
      </div>

      <div className="mt-4 border-t border-sand pt-4">
        <div className="mb-1 flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="mb-3 flex justify-between text-sm">
          <span>Delivery</span>
          <span>{shipping ? formatINR(shipping) : 'Free'}</span>
        </div>
        <div className="mb-3 flex justify-between text-sm font-semibold text-forest">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
        <button
          type="submit"
          className="btn-press w-full rounded-full bg-forest py-3 text-sm text-cream hover:bg-moss"
        >
          {form.method === 'cod' ? `Place order · ${formatINR(total)}` : `Pay ${formatINR(total)}`}
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-pine/50">
          <Lock size={11} />
          256-bit SSL · prices inclusive of GST
        </p>
      </div>
    </form>
  )
}

export function OrderComplete({ total, orderId, onClose }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-mist text-moss">
        <CheckCircle2 size={28} />
      </span>
      <h4 className="font-display text-2xl text-forest">Order confirmed</h4>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-moss">{orderId}</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-pine/70">
        {formatINR(total)} received. A horticulturist will water, wrap, and email tracking from
        Bengaluru within 24 hours.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="btn-press mt-6 rounded-full bg-forest px-6 py-3 text-sm text-cream hover:bg-moss"
      >
        Continue shopping
      </button>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.14em] text-moss">{label}</span>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-clay" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  )
}
