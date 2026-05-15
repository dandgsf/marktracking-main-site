'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function useScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Fade-up elements with data-animate="fade-up" ──────────────────
      const fadeUps = document.querySelectorAll('[data-animate="fade-up"]')
      fadeUps.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Scale-in elements with data-animate="scale-in" ────────────────
      const scaleIns = document.querySelectorAll('[data-animate="scale-in"]')
      scaleIns.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Stagger children with data-animate="stagger" ──────────────────
      const staggerParents = document.querySelectorAll('[data-animate="stagger"]')
      staggerParents.forEach((parent) => {
        const children = parent.children
        gsap.fromTo(
          children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: parent,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Parallax images with data-parallax ────────────────────────────
      const parallaxEls = document.querySelectorAll('[data-parallax]')
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax') || '0.3')
        gsap.to(el, {
          y: () => -100 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // ── Scale + fade images with data-scale-scroll ────────────────────
      const scaleScrollEls = document.querySelectorAll('[data-scale-scroll]')
      scaleScrollEls.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.8, opacity: 0.2 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 30%',
              scrub: true,
            },
          }
        )
      })

      // ── Text reveal scrub with data-text-reveal ───────────────────────
      const textReveals = document.querySelectorAll('[data-text-reveal]')
      textReveals.forEach((el) => {
        const words = el.querySelectorAll('.word')
        if (words.length === 0) return
        gsap.fromTo(
          words,
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 70%',
              end: 'top 20%',
              scrub: true,
            },
          }
        )
      })

      // ── Horizontal scroll sections ────────────────────────────────────
      const horizontalSections = document.querySelectorAll('[data-horizontal-scroll]')
      horizontalSections.forEach((section) => {
        const container = section.querySelector('[data-scroll-container]')
        if (!container) return
        const scrollWidth = container.scrollWidth - window.innerWidth
        gsap.to(container, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])
}
