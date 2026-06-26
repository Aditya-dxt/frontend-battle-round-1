import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/* ── Icons ── */
const BrainIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.16Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.16Z"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'Docs',     href: '#docs'     },
  { label: 'Blog',     href: '#blog'     },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [activeHref,  setActiveHref]  = useState(null)

  const navRef     = useRef(null)
  const innerRef   = useRef(null)
  const linksRef   = useRef([])
  const linkElRefs = useRef({})
  const indicatorRef = useRef(null)
  const listRef    = useRef(null)

  /* scroll shadow + condense — rAF-throttled so rapid scroll events
     can't fire setState faster than the browser paints, which was
     causing overlapping GSAP tweens and the ghosting/flicker on the nav. */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Condense + glass effect driven together by one GSAP tween, so the
     backdrop-blur and padding change in lockstep instead of one snapping
     via a CSS class and the other easing via JS (that mismatch was the
     cause of the ghosted/double-exposed text behind the nav on scroll). */
  useEffect(() => {
    if (!navRef.current || !innerRef.current) return
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? 'rgba(5, 10, 14, 0.85)' : 'rgba(5, 10, 14, 0)',
      backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px) saturate(100%)',
      borderBottomColor: scrolled ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 212, 255, 0)',
      boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.4)' : '0 0 0 rgba(0,0,0,0)',
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    })
    gsap.to(innerRef.current, {
      paddingTop: scrolled ? '0.65rem' : '1rem',
      paddingBottom: scrolled ? '0.65rem' : '1rem',
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [scrolled])

  /* GSAP stagger reveal on mount.
     Switched from gsap.from() to the set+to pattern: gsap.from() animates
     FROM the given state back TO whatever the element's current style is —
     if that tween is interrupted (e.g. the page loads directly on a hash
     URL like #contact and the browser's native hash-jump fires before GSAP
     finishes setting up), the element can be left stuck at opacity:0 with
     nothing to recover it. gsap.set() forces a known starting state
     synchronously, then gsap.to() animates forward deterministically. */
  useEffect(() => {
    const links = linksRef.current.filter(Boolean)
    gsap.set(links, { autoAlpha: 0, y: -14 })
    gsap.set(navRef.current, { autoAlpha: 0, y: -10 })

    gsap.to(links, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.2,
    })
    gsap.to(navRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
  }, [])

  /* Scroll-spy: observe each section, move the GSAP-animated pill to the active link */
  useEffect(() => {
    const sections = NAV_LINKS
      .map(l => document.querySelector(l.href))
      .filter(Boolean)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* Move the indicator pill under the active link */
  useEffect(() => {
    const el = linkElRefs.current[activeHref]
    if (!el || !indicatorRef.current || !listRef.current) {
      if (indicatorRef.current) gsap.to(indicatorRef.current, { autoAlpha: 0, duration: 0.2 })
      return
    }
    const listBox = listRef.current.getBoundingClientRect()
    const linkBox = el.getBoundingClientRect()
    gsap.to(indicatorRef.current, {
      x: linkBox.left - listBox.left,
      width: linkBox.width,
      autoAlpha: 1,
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [activeHref])

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
      ref={navRef}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        ref={innerRef}
        style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 text-accent-cyan font-display font-bold text-lg tracking-tight">
          <BrainIcon />
          <span>Vexel<span className="text-text-secondary font-normal"> AI</span></span>
        </a>

        {/* Desktop Links */}
        <ul ref={listRef} className="relative hidden md:flex items-center gap-8 list-none m-0 p-0">
          <span
            ref={indicatorRef}
            className="nav-indicator"
            style={{ opacity: 0 }}
            aria-hidden="true"
          />
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} ref={el => { linksRef.current[i] = el }}>
              <a
                href={l.href}
                ref={el => { linkElRefs.current[l.href] = el }}
                className={`font-body text-sm transition-colors duration-200 tracking-wide ${
                  activeHref === l.href ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3" ref={el => { linksRef.current[NAV_LINKS.length] = el }}>
          <a href="#login" className="btn-secondary text-sm py-2 px-5">Sign in</a>
          <a href="#signup" className="btn-primary text-sm py-2 px-5">Get started</a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-primary p-1"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-border-color px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`font-body transition-colors ${
                activeHref === l.href ? 'text-accent-cyan' : 'text-text-secondary hover:text-accent-cyan'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="#signup" className="btn-primary text-center text-sm mt-2">Get started</a>
        </div>
      )}
    </header>
  )
}