import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

function formatLargeNumber(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(Math.round(n))
}
function formatPercent(n) { return Math.round(n) + '%' }
function formatX(n)       { return Math.round(n) + 'x' }

const STATS = [
  { target: 4800000, label: 'Data points processed daily', format: formatLargeNumber },
  { target: 99.4,    label: 'Uptime SLA',                  format: formatPercent     },
  { target: 38,      label: 'Faster than legacy ETL',       format: formatX           },
]

const HEADLINE_WORDS = ['Automate.', 'Analyze.', 'Accelerate.']

/* ── Hero frame sequence config ──
   147 frames, public/assets/hero-frames/frame_000001.jpg ... frame_000147.jpg,
   zero-padded to 6 digits, optimized to 960px wide JPGs (~9MB total). */
const FRAME_COUNT = 147
const FRAME_PATH = i => `/assets/hero-frames/frame_${String(i).padStart(6, '0')}.jpg`

export default function Hero() {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)
  const wordRefs   = useRef([])
  const subRef     = useRef(null)
  const ctaRef     = useRef(null)
  const badgeRef   = useRef(null)
  const statRefs   = useRef([])
  const valueRefs  = useRef([])

  const imagesRef    = useRef([])
  const frameRef     = useRef({ index: 0 })
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const loadedCountRef = useRef(0)
  const failedCountRef = useRef(0)

  /* Preload every frame, then draw frame 0 once all are ready.
     If every single frame fails (most likely cause: the images aren't
     actually sitting at public/assets/hero-frames/ in the project, so
     every request 404s), surface that on screen instead of failing silently
     behind a blank canvas — that silent failure was the bug in the previous
     version. */
  useEffect(() => {
    let cancelled = false
    const images = new Array(FRAME_COUNT)
    imagesRef.current = images

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = () => {
        if (cancelled) return
        loadedCountRef.current += 1
        if (loadedCountRef.current + failedCountRef.current === FRAME_COUNT) {
          setLoaded(true)
          if (failedCountRef.current === FRAME_COUNT) setLoadError(true)
        }
      }
      img.onerror = () => {
        if (cancelled) return
        failedCountRef.current += 1
        if (failedCountRef.current === 1) {
          // eslint-disable-next-line no-console
          console.error(
            `[Hero] Failed to load frame: ${FRAME_PATH(i)} — check that the frames ` +
            `actually live at public/assets/hero-frames/ in your project root ` +
            `(not nested deeper, not in src/).`
          )
        }
        if (loadedCountRef.current + failedCountRef.current === FRAME_COUNT) {
          setLoaded(true)
          if (failedCountRef.current === FRAME_COUNT) setLoadError(true)
        }
      }
      images[i - 1] = img
    }

    return () => { cancelled = true }
  }, [])

  /* Draw a given frame index onto the canvas, covering the canvas like background-size: cover. */
  const drawFrame = (index) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[index]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.scale(dpr, dpr)
    }

    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = cw / ch
    let drawW, drawH, offsetX, offsetY

    if (imgRatio > canvasRatio) {
      drawH = ch
      drawW = ch * imgRatio
      offsetX = (cw - drawW) / 2
      offsetY = 0
    } else {
      drawW = cw
      drawH = cw / imgRatio
      offsetX = 0
      offsetY = (ch - drawH) / 2
    }

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  }

  /* Once loaded, draw the first frame immediately and wire the scroll-scrub.

     Pinning is required here: without it, the frame sequence only gets
     min-h-screen worth of scroll distance to play across, which is roughly
     one viewport — nowhere near enough scroll travel for 147 frames to feel
     deliberate, so the page moved on to Features before the sequence
     finished. pin: true freezes the section in place visually while the
     user keeps scrolling through an extra `end` distance (4x viewport
     height here), the frame index advances across that whole pinned
     scroll, and only once it completes does the page release and continue
     down to Features. This is the standard approach for Apple/Stripe-style
     scroll-scrubbed sequences. */
  useEffect(() => {
    if (!loaded || loadError) return
    drawFrame(0)

    const ro = new ResizeObserver(() => drawFrame(frameRef.current.index))
    if (canvasRef.current) ro.observe(canvasRef.current)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.round(self.progress * (FRAME_COUNT - 1)))
        )
        if (idx !== frameRef.current.index) {
          frameRef.current.index = idx
          drawFrame(idx)
        }
      },
    })

    return () => {
      st.kill()
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, loadError])


  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Words, badge, sub, cta — pre-set then animate on mount */
      const words = wordRefs.current.filter(Boolean)
      gsap.set(words, { y: 60, autoAlpha: 0 })
      gsap.set([badgeRef.current, subRef.current, ctaRef.current], { y: 30, autoAlpha: 0 })

      gsap.to(words, {
        y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out', delay: 0.2,
      })
      gsap.to([badgeRef.current, subRef.current, ctaRef.current], {
        y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.65,
      })

      /* Stats slide in. Previously gated behind a ScrollTrigger keyed to
         the section's scroll position ('center 85%') — but now that the
         section is pinned (see the frame-scrub effect above), it no longer
         moves through the viewport the way that trigger assumed, so it
         could fire at the wrong moment or not at all. Since the whole hero
         reveals on mount rather than on scroll, the stats now join that
         same mount-timed sequence instead. */
      const stats = statRefs.current.filter(Boolean)
      gsap.set(stats, { y: 30, autoAlpha: 0 })
      gsap.to(stats, {
        y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 1.1,
      })

      /* Number counters — same reasoning: mount-timed, not scroll-gated. */
      STATS.forEach((stat, i) => {
        const el = valueRefs.current[i]
        if (!el) return
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: stat.target,
          duration: 2.2,
          ease: 'power1.inOut',
          delay: 1.3,
          onUpdate() { el.textContent = stat.format(proxy.val) },
          onComplete() { el.textContent = stat.format(stat.target) },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-grid-bg cyber-grid relative min-h-screen flex flex-col justify-center pt-20"
      aria-label="Hero section"
    >
      {/* Scroll-scrubbed frame sequence, replaces the static parallax image */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
        aria-hidden="true"
      />
      {!loaded && (
        <div className="absolute inset-0 z-0 bg-bg-primary" aria-hidden="true" />
      )}
      {loadError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-bg-card border border-accent-gold/40 text-text-secondary text-xs font-body px-4 py-2 rounded-lg max-w-md text-center">
          Hero frame sequence failed to load — check that the images are at{' '}
          <code className="text-accent-gold">public/assets/hero-frames/</code> and check the console for the failing URL.
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-bg-primary/85 via-bg-primary/70 to-bg-primary" aria-hidden="true" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-bg-primary/60 via-transparent to-bg-primary/60" aria-hidden="true" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl z-0 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} aria-hidden="true" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl z-0 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} aria-hidden="true" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-color bg-bg-secondary/60 backdrop-blur-sm mb-8">
          <ZapIcon />
          <span className="section-eyebrow">Now with GPT-5 pipeline support</span>
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-6" aria-label="Automate. Analyze. Accelerate.">
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={word}
              ref={el => { wordRefs.current[i] = el }}
              className={`inline-block mr-4 ${i === 1 ? 'text-gradient-cyan' : i === 2 ? 'text-gradient-purple' : 'text-text-primary'}`}
              style={{ display: 'inline-block' }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p ref={subRef} className="font-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          NeuralFlow connects every data source in your stack. Build intelligent pipelines that clean, transform,
          and act on your data — without writing a single line of SQL.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#signup" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5">
            Start free trial <ArrowRightIcon />
          </a>
          <a href="#demo" className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-3.5">
            <PlayIcon /> Watch 2-min demo
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {STATS.map((stat, i) => (
            <article
              key={stat.label}
              ref={el => { statRefs.current[i] = el }}
              className="card-glass py-6 px-4 text-center"
            >
              <div ref={el => { valueRefs.current[i] = el }} className="stat-value" aria-live="polite">
                {stat.format(0)}
              </div>
              <div className="stat-label">{stat.label}</div>
            </article>
          ))}
        </div>
      </main>

      <div className="relative z-10 flex justify-center pb-8 animate-bounce" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8892a4" strokeWidth="1.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </section>
  )
}