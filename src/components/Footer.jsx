import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)
const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.16Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.16Z"/>
  </svg>
)

const FOOTER_LINKS = {
  Product:    ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Developers: ['Docs', 'API Reference', 'SDKs', 'Status'],
  Company:    ['About', 'Blog', 'Careers', 'Press'],
  Legal:      ['Privacy', 'Terms', 'DPA', 'Security'],
}

export default function Footer() {
  const footerRef = useRef(null)
  const colRefs   = useRef([])

  useEffect(() => {
    const cols = colRefs.current.filter(Boolean)
    gsap.set(cols, { autoAlpha: 0, y: 24 })

    const st = ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(cols, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
        })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative bg-bg-primary border-t border-border-color"
      aria-label="Site footer"
    >
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=40"
          alt=""
          className="w-full h-full object-cover opacity-5"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-bg-primary/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          <div ref={el => { colRefs.current[0] = el }} className="col-span-2">
            <a href="/" className="flex items-center gap-2 text-accent-cyan font-display font-bold text-lg mb-4">
              <BrainIcon />
              Vexel<span className="text-text-secondary font-normal"> AI</span>
            </a>
            <p className="font-body text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
              The intelligent data automation platform for modern teams. Build, deploy, and monitor pipelines at any scale.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: GithubIcon,   href: '#github',   label: 'GitHub' },
                { Icon: TwitterIcon,  href: '#twitter',  label: 'Twitter/X' },
                { Icon: LinkedInIcon, href: '#linkedin', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  className="text-text-secondary hover:text-accent-cyan transition-colors duration-200 p-2 border border-border-color rounded-lg hover:border-accent-cyan"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links], gi) => (
            <nav
              key={group}
              ref={el => { colRefs.current[gi + 1] = el }}
              aria-label={`${group} links`}
            >
              <p className="section-eyebrow mb-4">{group}</p>
              <ul className="space-y-2.5 list-none m-0 p-0">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-body text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-text-secondary text-sm">
            © {new Date().getFullYear()} Vexel AI, Inc. All rights reserved.
          </p>
          <p className="font-body text-text-secondary text-xs">
            Made with <span className="text-accent-cyan">♥</span> for data teams everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}