import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent-gold">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const TESTIMONIALS = [
  {
    name: 'Sofia Reyes',
    role: 'Head of Data, Lattice',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    quote: 'Vexel replaced three separate tools and cut our pipeline maintenance from a full day a week to about 20 minutes. The AI transform suggestions alone paid for the subscription in month one.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'CTO, Stackline',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    quote: 'We onboard new data sources in minutes now. The warehouse-native execution means our Snowflake costs barely moved even as data volume tripled.',
    stars: 5,
  },
  {
    name: 'Priya Kapoor',
    role: 'Analytics Lead, Vanta',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80',
    quote: "The visual pipeline builder is genuinely one of the best UX decisions I've seen in a data tool. My non-technical PM can trace a pipeline now. That's unheard of.",
    stars: 5,
  },
]

const COMPANY_LOGOS = [
  'Lattice', 'Stackline', 'Vanta', 'Figma', 'Notion', 'Vercel', 'Linear', 'Stripe', 'Supabase', 'Retool',
]

export default function Testimonials() {
  const sectionRef   = useRef(null)
  const cardRefs     = useRef([])
  const marqueeRef   = useRef(null)
  const marqueeTween = useRef(null)

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)

    // Pre-hide cards so they don't flash, then animate in
    gsap.set(cards, { autoAlpha: 0, y: 35 })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: 'power2.out',
        })
      },
    })

    return () => st.kill()
  }, [])

  /* GSAP marquee */
  useEffect(() => {
    const track = marqueeRef.current
    if (!track) return

    const clone = track.cloneNode(true)
    clone.setAttribute('aria-hidden', 'true')
    track.parentElement.appendChild(clone)

    const totalWidth = track.scrollWidth
    marqueeTween.current = gsap.to([track, clone], {
      x: `-=${totalWidth}`,
      duration: 28,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth),
      },
    })

    return () => {
      marqueeTween.current?.kill()
      if (clone.parentElement) clone.parentElement.removeChild(clone)
    }
  }, [])

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 bg-bg-secondary"
      aria-label="Testimonials"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-3">Social proof</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
            Trusted by data teams worldwide
          </h2>
          <p className="font-body text-text-secondary text-lg">
            From startups to Fortune 500s — real results from real teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              ref={el => { cardRefs.current[i] = el }}
              className="testimonial-card"
              aria-label={`Testimonial from ${t.name}`}
            >
              <div className="flex gap-0.5 mb-4" aria-label={`${t.stars} out of 5 stars`}>
                {Array.from({ length: t.stars }).map((_, si) => <StarIcon key={si} />)}
              </div>
              <blockquote className="font-body text-text-secondary text-sm leading-relaxed mb-6">
                {t.quote}
              </blockquote>
              <footer className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="rounded-full object-cover border-2 border-border-color"
                  loading="lazy"
                />
                <div>
                  <p className="font-display font-semibold text-sm text-text-primary">{t.name}</p>
                  <p className="font-body text-text-secondary text-xs">{t.role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>

        <div
          className="overflow-hidden relative"
          aria-label="Trusted by companies"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="flex">
            <div ref={marqueeRef} className="marquee-track flex-shrink-0">
              {COMPANY_LOGOS.map(logo => (
                <span key={logo} className="marquee-logo">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}