import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Easing constants ───
export const REVEAL_EASES = {
  title:    'power3.out',      // clean authority, no overshoot
  body:     'power3.out',      // smooth for supporting text
  cta:      'power2.out',      // snappier for action intent
  line:     'power4.out',      // decisive line draws
  clip:     'power3.out',      // clip-path labels
} as const;

// ─── Duration constants ───
export const DURATION = {
  fast:   0.4,   // labels, small elements, stagger children
  normal: 0.8,   // primary reveals (body, titles, cards)
  slow:   1.1,   // line draws, clip reveals, hero entrance
} as const;

// ─── Y-offset constants ───
export const OFFSET = {
  sm: 12,   // captions, labels, secondary prose
  md: 24,   // body text, cards, standard reveals
  lg: 40,   // hero headline only
} as const;

// ─── Stagger constants ───
export const STAGGER = {
  tight: 0.06,  // words, list items, small elements
  loose: 0.12,  // cards, grid children
} as const;

// ─── Parallax speed constants ───
export const PARALLAX_SPEED = {
  subtle: 0.05,  // dot grids, background textures
  normal: 0.08,  // primary ambient viz layers
} as const;

// ─── ScrollTrigger start positions ───
const TRIGGER_LATE_RATIO = 0.92;

export const TRIGGER = {
  early:  'top 82%',
  normal: 'top 87%',
  late:   `top ${TRIGGER_LATE_RATIO * 100}%`,
} as const;

let lenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function getNavHeight(): number {
  return document.querySelector('nav')?.offsetHeight ?? 80;
}

export function scrollToSection(id: string) {
  const l = getLenis();
  if (l) l.scrollTo(`#${id}`, { offset: -getNavHeight() });
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

/**
 * After language toggle, force any once-animated scaleX lines already past
 * their trigger point to their end state. ScrollTrigger.refresh() recalculates
 * positions but won't replay killed `once: true` triggers.
 */
export function snapPassedAnimations() {
  if (typeof document === 'undefined') return;
  const cutoff = window.scrollY + window.innerHeight * TRIGGER_LATE_RATIO;
  for (const el of document.querySelectorAll<HTMLElement>('.section-rule, .divider-thin')) {
    if (el.getBoundingClientRect().top + window.scrollY < cutoff) {
      gsap.set(el, { scaleX: 1 });
    }
  }
}

export function initSmoothScroll() {
  if (typeof window === 'undefined') return;

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarsePointer || prefersReducedMotion()) return;

  lenis = new Lenis({
    duration: 0.9,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(500, 33);
}

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  ScrollTrigger.killAll();
  lenis?.destroy();
  lenis = null;
}

/** Fade-up reveal — primary section entrance */
export function revealOnScroll(el: HTMLElement, opts?: { delay?: number; y?: number }) {
  if (!el) return null;

  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, y: 0 });
    return gsap.getTweensOf(el)[0] ?? null;
  }

  return gsap.fromTo(
    el,
    { opacity: 0, y: opts?.y ?? OFFSET.md },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.normal,
      delay: opts?.delay ?? 0,
      ease: REVEAL_EASES.body,
      scrollTrigger: {
        trigger: el,
        start: TRIGGER.normal,
        once: true
      }
    }
  );
}

/** Staggered children reveal */
export function staggerReveal(parent: HTMLElement, childSelector: string, opts?: { stagger?: number; y?: number }) {
  if (!parent) return null;
  const children = parent.querySelectorAll(childSelector);

  if (prefersReducedMotion()) {
    gsap.set(children, { opacity: 1, y: 0 });
    return gsap.getTweensOf(children)[0] ?? null;
  }

  return gsap.fromTo(
    children,
    { opacity: 0, y: opts?.y ?? OFFSET.md },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.normal,
      stagger: opts?.stagger ?? STAGGER.loose,
      ease: REVEAL_EASES.body,
      scrollTrigger: {
        trigger: parent,
        start: TRIGGER.early,
        once: true
      }
    }
  );
}

/** Horizontal line draw — precise, left-to-right */
export function lineReveal(el: HTMLElement) {
  if (!el) return null;

  if (prefersReducedMotion()) {
    gsap.set(el, { scaleX: 1 });
    return gsap.getTweensOf(el)[0] ?? null;
  }

  return gsap.fromTo(
    el,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: DURATION.slow,
      ease: REVEAL_EASES.line,
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: el,
        start: TRIGGER.late,
        once: true
      }
    }
  );
}

/** Clip-path reveal — for labels and horizontal elements */
export function clipReveal(el: HTMLElement, opts?: { delay?: number }) {
  if (!el) return null;

  if (prefersReducedMotion()) {
    gsap.set(el, { clipPath: 'inset(0 0% 0 0)', opacity: 1 });
    return gsap.getTweensOf(el)[0] ?? null;
  }

  return gsap.fromTo(
    el,
    { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: DURATION.normal,
      delay: opts?.delay ?? 0,
      ease: REVEAL_EASES.clip,
      scrollTrigger: {
        trigger: el,
        start: TRIGGER.late,
        once: true
      }
    }
  );
}

/** Subtle scroll-driven parallax for ambient viz layers */
export function ambientParallax(el: HTMLElement, opts?: { speed?: number; direction?: 'up' | 'down' }) {
  if (!el || prefersReducedMotion()) return null;

  const speed = opts?.speed ?? PARALLAX_SPEED.normal;
  const dir = opts?.direction ?? 'up';
  const yAmount = dir === 'up' ? -60 * speed * 100 : 60 * speed * 100;

  return gsap.fromTo(
    el,
    { y: 0 },
    {
      y: yAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement ?? el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );
}

export { gsap, ScrollTrigger };
