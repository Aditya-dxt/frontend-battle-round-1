import { useState, useCallback, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

/* Minimal geometric region glyphs — kept on-brand with the line-icon system (no emoji) */
const FlagUS = () => (
  <svg width="18" height="14" viewBox="0 0 24 18"><rect width="24" height="18" rx="2" fill="#1f3a5f"/><g fill="#f0f4f8"><rect y="2" width="11" height="1.6"/><rect y="5.2" width="11" height="1.6"/><rect y="8.4" width="11" height="1.6"/></g><g fill="#dc2626"><rect y="0" width="24" height="1.4"/><rect y="3.6" width="24" height="1.4" x="11"/><rect y="6.8" width="24" height="1.4" x="11"/><rect y="10" width="24" height="1.4"/><rect y="13.2" width="24" height="1.4"/><rect y="16.4" width="24" height="1.4"/></g></svg>
)
const FlagEU = () => (
  <svg width="18" height="14" viewBox="0 0 24 18"><rect width="24" height="18" rx="2" fill="#1e3a8a"/><circle cx="12" cy="9" r="5" fill="none" stroke="#f59e0b" strokeWidth="0.6" strokeDasharray="1.2 1.4"/></svg>
)
const FlagGB = () => (
  <svg width="18" height="14" viewBox="0 0 24 18"><rect width="24" height="18" rx="2" fill="#1e3a8a"/><path d="M0 0 24 18M24 0 0 18" stroke="#f0f4f8" strokeWidth="2"/><path d="M12 0v18M0 9h24" stroke="#f0f4f8" strokeWidth="3"/><path d="M12 0v18M0 9h24" stroke="#dc2626" strokeWidth="1.4"/></svg>
)
const FlagIN = () => (
  <svg width="18" height="14" viewBox="0 0 24 18"><rect width="24" height="6" fill="#f59e0b"/><rect y="6" width="24" height="6" fill="#f0f4f8"/><rect y="12" width="24" height="6" fill="#15803d"/><circle cx="12" cy="9" r="2" fill="none" stroke="#1e3a8a" strokeWidth="0.4"/></svg>
)

const PRICING_CONFIG = {
  currencies: {
    USD: { symbol: '$', rate: 1,    label: 'US Dollar',     Flag: FlagUS },
    EUR: { symbol: '€', rate: 0.92, label: 'Euro',          Flag: FlagEU },
    GBP: { symbol: '£', rate: 0.79, label: 'British Pound', Flag: FlagGB },
    INR: { symbol: '₹', rate: 83.5, label: 'Indian Rupee',  Flag: FlagIN },
  },
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      baseMonthly: 0,
      baseAnnual: 0,
      description: 'For solo analysts and side projects.',
      features: [
        { label: '5 pipelines',           included: true  },
        { label: '1M rows / month',        included: true  },
        { label: 'Community support',      included: true  },
        { label: 'AI transforms',          included: false },
        { label: 'SSO / SAML',             included: false },
        { label: 'Custom SLA',             included: false },
      ],
      cta: 'Start free',
      featured: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      baseMonthly: 79,
      baseAnnual: 63,
      description: 'For growing teams shipping fast.',
      features: [
        { label: 'Unlimited pipelines',    included: true  },
        { label: '50M rows / month',       included: true  },
        { label: 'Priority email support', included: true  },
        { label: 'AI transforms',          included: true  },
        { label: 'SSO / SAML',             included: false },
        { label: 'Custom SLA',             included: false },
      ],
      cta: 'Start Pro trial',
      featured: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      baseMonthly: 299,
      baseAnnual: 239,
      description: 'For large orgs with compliance needs.',
      features: [
        { label: 'Unlimited pipelines',    included: true  },
        { label: 'Unlimited rows',         included: true  },
        { label: 'Dedicated SRE support',  included: true  },
        { label: 'AI transforms',          included: true  },
        { label: 'SSO / SAML',             included: true  },
        { label: 'Custom SLA',             included: true  },
      ],
      cta: 'Contact sales',
      featured: false,
    },
  ],
}

function computePrice(baseMonthly, baseAnnual, billing, currency) {
  const base   = billing === 'annual' ? baseAnnual : baseMonthly
  const config = PRICING_CONFIG.currencies[currency]
  return base === 0 ? 0 : Math.round(base * config.rate)
}

function formatPrice(amount, currency) {
  const { symbol } = PRICING_CONFIG.currencies[currency]
  if (amount === 0) return 'Free'
  return `${symbol}${amount}`
}

/* ── Custom animated currency dropdown ── */
function CurrencyDropdown({ currency, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef  = useRef(null)
  const panelRef = useRef(null)
  const chevRef  = useRef(null)
  const current  = PRICING_CONFIG.currencies[currency]
  const CurrentFlag = current.Flag

  useEffect(() => {
    if (!panelRef.current) return
    if (open) {
      gsap.set(panelRef.current, { display: 'block' })
      gsap.fromTo(panelRef.current,
        { autoAlpha: 0, y: -8, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
      )
      gsap.to(chevRef.current, { rotate: 180, duration: 0.25, ease: 'power2.out' })
    } else {
      gsap.to(panelRef.current, {
        autoAlpha: 0, y: -8, scale: 0.96, duration: 0.16, ease: 'power1.in',
        onComplete: () => gsap.set(panelRef.current, { display: 'none' }),
      })
      gsap.to(chevRef.current, { rotate: 0, duration: 0.25, ease: 'power2.out' })
    }
  }, [open])

  useEffect(() => {
    const onClick = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onKey   = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [])

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select currency"
        className="currency-trigger"
      >
        <span className="flex items-center justify-center"><CurrentFlag /></span>
        <span className="font-display text-sm text-text-primary font-medium">{currency}</span>
        <span ref={chevRef} className="text-text-secondary flex items-center"><ChevronDownIcon /></span>
      </button>

      <div ref={panelRef} role="listbox" className="currency-panel" style={{ display: 'none' }}>
        {Object.entries(PRICING_CONFIG.currencies).map(([code, cfg]) => {
          const Flag = cfg.Flag
          const active = code === currency
          return (
            <button
              key={code}
              role="option"
              aria-selected={active}
              type="button"
              onClick={() => { onChange(code); setOpen(false) }}
              className={`currency-option ${active ? 'is-active' : ''}`}
            >
              <span className="flex items-center justify-center"><Flag /></span>
              <span className="flex flex-col items-start leading-tight">
                <span className="font-display text-sm">{code}</span>
                <span className="font-body text-[0.7rem] text-text-secondary">{cfg.label}</span>
              </span>
              {active && <span className="ml-auto text-accent-cyan"><CheckIcon /></span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Sliding pill billing toggle ── */
function BillingToggle({ billing, onChange }) {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const monthlyRef = useRef(null)
  const annualRef  = useRef(null)

  useEffect(() => {
    const targetRef = billing === 'annual' ? annualRef : monthlyRef
    if (!targetRef.current || !thumbRef.current || !trackRef.current) return
    const trackBox  = trackRef.current.getBoundingClientRect()
    const targetBox = targetRef.current.getBoundingClientRect()
    gsap.to(thumbRef.current, {
      x: targetBox.left - trackBox.left,
      width: targetBox.width,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [billing])

  /* Re-measure on resize so the thumb tracks correctly */
  useEffect(() => {
    const onResize = () => {
      const targetRef = billing === 'annual' ? annualRef : monthlyRef
      if (!targetRef.current || !thumbRef.current || !trackRef.current) return
      const trackBox  = trackRef.current.getBoundingClientRect()
      const targetBox = targetRef.current.getBoundingClientRect()
      gsap.set(thumbRef.current, { x: targetBox.left - trackBox.left, width: targetBox.width })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [billing])

  return (
    <div className="billing-toggle" ref={trackRef}>
      <div ref={thumbRef} className="billing-thumb" />
      <button
        ref={monthlyRef}
        type="button"
        onClick={() => onChange('monthly')}
        className={`billing-option ${billing === 'monthly' ? 'is-active' : ''}`}
      >
        Monthly
      </button>
      <button
        ref={annualRef}
        type="button"
        onClick={() => onChange('annual')}
        className={`billing-option ${billing === 'annual' ? 'is-active' : ''}`}
      >
        Annual <span className="billing-discount">–20%</span>
      </button>
    </div>
  )
}

export default function PricingMatrix() {
  const [billing,  setBilling]  = useState('monthly')
  const [currency, setCurrency] = useState('USD')

  const sectionRef = useRef(null)
  const cardRefs   = useRef([])
  const proCardRef = useRef(null)
  const glowTween  = useRef(null)

  /* Scroll entrance — pre-hide then animate in on enter */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    gsap.set(cards, { autoAlpha: 0, y: 55 })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.2,
          ease: 'power2.out',
        })
      },
    })

    return () => st.kill()
  }, [])

  /* Pro card pulsing glow */
  useEffect(() => {
    if (!proCardRef.current) return
    glowTween.current = gsap.to(proCardRef.current, {
      boxShadow: '0 0 55px rgba(0,212,255,0.5)',
      duration: 1.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
    return () => glowTween.current?.kill()
  }, [])

  const handleBillingChange  = useCallback(v => setBilling(v),  [])
  const handleCurrencyChange = useCallback(v => setCurrency(v), [])

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 px-6 bg-bg-primary"
      aria-label="Pricing"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Pricing</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
            Simple, predictable pricing
          </h2>
          <p className="font-body text-text-secondary text-lg">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14">
          <BillingToggle billing={billing} onChange={handleBillingChange} />
          <CurrencyDropdown currency={currency} onChange={handleCurrencyChange} />
        </div>

        {/* Cards — note: autoAlpha sets visibility+opacity via GSAP, so no inline opacity needed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-stretch">
          {PRICING_CONFIG.plans.map((plan, i) => {
            const price = computePrice(plan.baseMonthly, plan.baseAnnual, billing, currency)
            const isProCard = plan.featured
            return (
              <article
                key={plan.id}
                ref={el => {
                  cardRefs.current[i] = el
                  if (isProCard) proCardRef.current = el
                }}
                className={`pricing-card flex flex-col h-full ${plan.featured ? 'featured md:-translate-y-3' : ''}`}
                aria-label={`${plan.name} plan`}
              >
                {plan.featured && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-accent-cyan text-bg-primary font-display text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-[0_0_16px_rgba(0,212,255,0.6)]">
                      Most popular
                    </span>
                  </div>
                )}

                <div className={`mb-6 ${plan.featured ? 'pt-6' : ''}`}>
                  <h3 className="font-display font-bold text-xl text-text-primary mb-1">{plan.name}</h3>
                  <p className="font-body text-text-secondary text-sm">{plan.description}</p>
                </div>

                <div className="mb-6 min-h-[4.5rem]">
                  <span className="font-display font-bold text-5xl text-text-primary">
                    {formatPrice(price, currency)}
                  </span>
                  {price > 0 && (
                    <span className="font-body text-text-secondary text-sm ml-1">/ mo</span>
                  )}
                  {billing === 'annual' && price > 0 && (
                    <p className="font-body text-accent-cyan text-xs mt-1">Billed annually</p>
                  )}
                </div>

                <a
                  href={`#${plan.id}`}
                  className={`block text-center font-display font-semibold text-sm py-3 rounded-lg mb-6 transition-all duration-200 ${
                    plan.featured ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </a>

                <div className="section-divider mb-6" />

                <ul className="space-y-3 flex-1">
                  {plan.features.map(f => (
                    <li key={f.label} className="flex items-center gap-2.5">
                      <span className={f.included ? 'text-accent-cyan' : 'text-text-secondary opacity-40'}>
                        {f.included ? <CheckIcon /> : <XIcon />}
                      </span>
                      <span className={`font-body text-sm ${f.included ? 'text-text-primary' : 'text-text-secondary opacity-50'}`}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <p className="text-center font-body text-text-secondary text-sm mt-10">
          Need a custom volume deal? <a href="#contact" className="text-accent-cyan hover:underline">Talk to sales →</a>
        </p>
      </div>
    </section>
  )
}