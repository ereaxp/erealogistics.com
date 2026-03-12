import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Easing constants ───
export const REVEAL_EASES = {
  title:    'power3.out',
  body:     'power3.out',
  cta:      'power2.out',
  line:     'power4.out',
  clip:     'power3.out',
} as const;

// ─── Duration constants ───
export const DURATION = {
  fast:   0.4,
  normal: 0.8,
  slow:   1.1,
} as const;

// ─── Y-offset constants ───
export const OFFSET = {
  sm: 12,
  md: 24,
  lg: 40,
} as const;

// ─── Stagger constants ───
export const STAGGER = {
  tight: 0.06,
  loose: 0.12,
} as const;

// ─── Parallax speed constants ───
export const PARALLAX_SPEED = {
  subtle: 0.05,
  normal: 0.08,
} as const;

// ─── ScrollTrigger start positions ───
const TRIGGER_LATE_RATIO = 0.92;

export const TRIGGER = {
  early:  'top 82%',
  normal: 'top 87%',
  late:   `top ${TRIGGER_LATE_RATIO * 100}%`,
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getNavHeight(): number {
  return document.querySelector('nav')?.offsetHeight ?? 80;
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) {
    if (import.meta.env.DEV) console.warn(`scrollToSection: "#${id}" not found`);
    return;
  }
  const navH = getNavHeight();
  const y = target.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top: y, behavior: 'auto' });
}

export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

export function snapPassedAnimations() {
  if (typeof document === 'undefined') return;
  const cutoff = window.scrollY + window.innerHeight * TRIGGER_LATE_RATIO;
  for (const el of document.querySelectorAll<HTMLElement>('.section-rule, .divider-thin')) {
    if (el.getBoundingClientRect().top + window.scrollY < cutoff) {
      gsap.set(el, { scaleX: 1 });
    }
  }
}

export function destroyScrollTriggers() {
  ScrollTrigger.killAll();
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
export function staggerReveal(parent: HTMLElement, childSelector: string, opts?: { stagger?: number; y?: number; delay?: number; onComplete?: () => void }) {
  if (!parent) return null;
  const children = parent.querySelectorAll(childSelector);

  if (prefersReducedMotion()) {
    gsap.set(children, { opacity: 1, y: 0 });
    opts?.onComplete?.();
    return gsap.getTweensOf(children)[0] ?? null;
  }

  return gsap.fromTo(
    children,
    { opacity: 0, y: opts?.y ?? OFFSET.md },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.normal,
      delay: opts?.delay ?? 0,
      stagger: opts?.stagger ?? STAGGER.loose,
      ease: REVEAL_EASES.body,
      onComplete: opts?.onComplete,
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

/** Count-up animation for stat values on scroll */
export function countUpOnScroll(el: HTMLElement, opts?: { onDone?: () => void }) {
  if (!el) return null;

  const rawValue = el.getAttribute('data-value') ?? '0';
  const format = el.getAttribute('data-format') ?? '';
  const numericStr = rawValue.replace(/[^0-9.]/g, '');
  const targetVal = parseFloat(numericStr) || 0;
  const prefix = format.startsWith('+') ? '+' : format.startsWith('-') ? '-' : '';
  const suffix = format.replace(/^[+-]/, '');

  if (prefersReducedMotion()) {
    el.innerText = `${prefix}${rawValue}${suffix}`;
    return null;
  }

  const obj = { val: 0 };

  return gsap.to(obj, {
    val: targetVal,
    duration: DURATION.slow,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: TRIGGER.early,
      once: true,
    },
    onUpdate() {
      const current = Math.round(obj.val);
      const formatted = current >= 1000 ? current.toLocaleString('en-US') : String(current);
      el.innerText = `${prefix}${formatted}${suffix}`;
    },
    onComplete() {
      el.innerText = `${prefix}${rawValue}${suffix}`;
      opts?.onDone?.();
    },
  });
}

export { gsap, ScrollTrigger };
