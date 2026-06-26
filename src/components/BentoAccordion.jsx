import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const GitBranchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
)
const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)
const DatabaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
)
const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const BENTO_ITEMS = [
  {
    id: 'analytics', size: 'large', Icon: ChartIcon, eyebrow: 'Real-time',
    title: 'Unified Analytics Dashboard',
    body: 'See every pipeline, metric, and anomaly in one place. Drill from fleet-level KPIs down to a single row in seconds.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    imgAlt: 'Analytics dashboard screenshot', accent: '#00d4ff',
    metrics: [
      { label: 'Pipelines live',  value: '1,284', trend: '+12%' },
      { label: 'Rows / sec',      value: '94.2K',  trend: '+8%'  },
      { label: 'Uptime',          value: '99.98%', trend: '+0.02%' },
    ],
    link: 'See it in action',
    accordion: [
      { q: 'What data sources are supported?', a: 'Over 200 native connectors — Postgres, Snowflake, BigQuery, Kafka, REST APIs, CSV, and more.' },
      { q: 'How do I share dashboards?', a: 'One click to publish a live or snapshot link. Set expiry, password, or domain restrictions.' },
      { q: 'Can I build custom widgets?', a: 'Yes — a drag-and-drop widget builder with SQL or no-code metric definitions, plus 30+ chart types.' },
    ],
  },
  {
    id: 'security', size: 'normal', Icon: ShieldIcon, eyebrow: 'Enterprise-grade',
    title: 'Zero-Trust Security',
    body: 'SOC 2 Type II, end-to-end encryption, column-level access controls, and audit logs retained for 7 years.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    imgAlt: 'Circuit board representing security layer', accent: '#7c3aed',
    link: 'View security whitepaper',
    accordion: [
      { q: 'Is data encrypted at rest?', a: 'Yes — AES-256 at rest, TLS 1.3 in transit, and customer-managed KMS keys on Enterprise tier.' },
      { q: 'Do you support VPC peering?', a: 'Yes, private link and VPC peering are available on Enterprise plans with dedicated network isolation.' },
    ],
  },
  {
    id: 'ai', size: 'tall', Icon: ZapIcon, eyebrow: 'AI-powered',
    title: 'Intelligent Transforms',
    body: 'Let the AI suggest, write, and test your transform logic. Describe in plain English; deploy in one click. Catches schema drift before it breaks downstream tables.',
    img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
    imgAlt: 'AI neural network visualization', accent: '#f59e0b',
    link: 'Try the AI assistant',
    accordion: [
      { q: 'Which LLMs are supported?', a: 'GPT-4o, Claude 3.5, Gemini 1.5 — selectable per pipeline. Your API key, your billing.' },
      { q: 'Does it explain its suggestions?', a: 'Every generated transform ships with a plain-English rationale and a diff preview before you deploy.' },
    ],
  },
  {
    id: 'pipelines', size: 'normal', Icon: GitBranchIcon, eyebrow: 'Visual',
    title: 'Drag-Drop Pipelines',
    body: 'Build complex DAGs visually. Add branches, retry logic, and conditional fans without YAML.',
    img: null, accent: '#00d4ff',
    link: 'Explore pipeline builder',
    accordion: [
      { q: 'Can I version control pipelines?', a: 'Full Git-style versioning with diff, rollback, and branch support built in.' },
      { q: 'Is there a CLI?', a: 'Yes — define pipelines as code and sync them with the visual builder bidirectionally.' },
    ],
  },
  {
    id: 'warehouse', size: 'normal', Icon: DatabaseIcon, eyebrow: 'Storage',
    title: 'Warehouse-Native',
    body: 'Push-down computation to Snowflake, BigQuery, or Redshift. Zero data movement, maximum performance.',
    img: null, accent: '#7c3aed',
    link: 'Compare warehouse support',
    accordion: [
      { q: 'Which warehouses are supported?', a: 'Snowflake, BigQuery, Redshift, and Databricks SQL — with more added quarterly based on demand.' },
    ],
  },
  {
    id: 'orchestration', size: 'normal', Icon: LayersIcon, eyebrow: 'Scheduling',
    title: 'Smart Orchestration',
    body: 'CRON, event-driven, or dependency-based triggers. Automatic retries with exponential backoff.',
    img: null, accent: '#f59e0b',
    link: 'Read the scheduling docs',
    accordion: [
      { q: 'How are failures handled?', a: 'Configurable retry policies, dead-letter routing, and Slack/PagerDuty alerts on repeated failure.' },
    ],
  },
]

export default function BentoAccordion() {
  const [activeIndex, setActiveIndex] = useState(null)
  const lastHoveredIndex = useRef(null)
  const sectionRef  = useRef(null)
  const cardRefs    = useRef([])
  const isResizing  = useRef(false)

  /* Context lock: preserve active accordion on resize */
  useEffect(() => {
    let timer
    const onResize = () => {
      if (!isResizing.current) {
        isResizing.current = true
        lastHoveredIndex.current = activeIndex
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        isResizing.current = false
        setActiveIndex(lastHoveredIndex.current)
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer) }
  }, [activeIndex])

  /* GSAP scroll entrance — pre-hide then reveal on enter (rotate + scale for distinction from Testimonials) */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    gsap.set(cards, { autoAlpha: 0, y: 45, scale: 0.94, rotateX: -6 })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: 'power2.out',
        })
      },
    })

    return () => st.kill()
  }, [])

  /* Hover micro-interactions */
  const onCardEnter = useCallback((el, accent) => {
    gsap.to(el, { scale: 1.02, borderColor: accent, duration: 0.25, ease: 'power1.out' })
  }, [])
  const onCardLeave = useCallback((el) => {
    gsap.to(el, { scale: 1, borderColor: 'rgba(0,212,255,0.15)', duration: 0.25, ease: 'power1.out' })
  }, [])

  const toggle = (i) => {
    lastHoveredIndex.current = i
    setActiveIndex(prev => prev === i ? null : i)
  }

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 px-6 bg-bg-secondary cyber-grid"
      aria-label="Features"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-3">Platform capabilities</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
            Everything your data team needs
          </h2>
          <p className="font-body text-text-secondary text-lg max-w-xl mx-auto">
            One platform. Every pipeline. From ingestion to insights.
          </p>
        </div>

        <div className="bento-grid" style={{ perspective: '1200px' }}>
          {BENTO_ITEMS.map((item, i) => (
            <article
              key={item.id}
              ref={el => { cardRefs.current[i] = el }}
              className={`bento-card ${item.size === 'large' ? 'large' : item.size === 'tall' ? 'tall' : ''} p-6 flex flex-col`}
              style={{ willChange: 'transform' }}
              onMouseEnter={e => onCardEnter(e.currentTarget, item.accent)}
              onMouseLeave={e => onCardLeave(e.currentTarget)}
            >
              {item.img && (
                <div className="mb-4 rounded-lg overflow-hidden flex-shrink-0 relative"
                     style={{ height: item.size === 'large' ? '200px' : '120px' }}>
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                  />
                  {item.size === 'large' && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-card via-bg-card/40 to-transparent h-1/2 pointer-events-none" />
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: item.accent }}><item.Icon /></span>
                <span className="section-eyebrow" style={{ color: item.accent }}>{item.eyebrow}</span>
              </div>

              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{item.title}</h3>
              <p className="font-body text-text-secondary text-sm leading-relaxed mb-4">{item.body}</p>

              {item.metrics && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {item.metrics.map(m => (
                    <div key={m.label} className="bg-bg-primary/40 border border-border-color rounded-lg px-3 py-2.5">
                      <p className="font-display text-base font-bold text-text-primary leading-tight">{m.value}</p>
                      <p className="font-body text-[0.65rem] text-text-secondary mt-0.5 leading-tight">{m.label}</p>
                      <p className="flex items-center gap-1 text-[0.65rem] mt-1" style={{ color: item.accent }}>
                        <TrendUpIcon /> {m.trend}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {item.link && (
                <a
                  href={`#${item.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-body font-medium mb-4 transition-all duration-200 group/link"
                  style={{ color: item.accent }}
                >
                  {item.link}
                  <span className="transition-transform duration-200 group-hover/link:translate-x-1 inline-flex">
                    <ArrowRightIcon />
                  </span>
                </a>
              )}

              {item.accordion.length > 0 && (
                <div className="mt-auto border-t border-border-color pt-4 space-y-2">
                  {item.accordion.map((qa, j) => {
                    const key = `${item.id}-${j}`
                    const isOpen = activeIndex === key
                    return (
                      <div key={key}>
                        <button
                          className="w-full flex items-center justify-between text-left text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 py-1"
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                        >
                          <span>{qa.q}</span>
                          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            <ChevronDownIcon />
                          </span>
                        </button>
                        <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                          <p className="text-text-secondary text-sm pt-2 pb-1 leading-relaxed">{qa.a}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}