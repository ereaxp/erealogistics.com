import { tick } from 'svelte';
import { replaceState } from '$app/navigation';
import en from '$lib/content/en.json';
import es from '$lib/content/es.json';
import type { Content } from '$lib/content/types';
import { refreshScrollTrigger, snapPassedAnimations, prefersReducedMotion, getLenis, getNavHeight } from '$lib/animations/gsap';

export type Lang = 'es' | 'en';

/** Find the section currently in view and record its absolute document position. */
function findScrollAnchor(): { el: HTMLElement; offsetTop: number } | null {
  if (typeof document === 'undefined') return null;
  const navH = getNavHeight();
  // 50px buffer below nav to pick the section visually "in view"
  for (const section of document.querySelectorAll<HTMLElement>('section[id]')) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= navH + 50 && rect.bottom > navH + 50) {
      return { el: section, offsetTop: section.offsetTop };
    }
  }
  return null;
}

/**
 * After re-render, correct scroll so the anchored section stays in place.
 * Compares absolute document position (offsetTop) before and after to detect
 * any drift, then corrects bidirectionally using window.scrollBy (synchronous).
 */
function correctDrift(anchor: { el: HTMLElement; offsetTop: number } | null) {
  if (!anchor) return;
  const shift = anchor.el.offsetTop - anchor.offsetTop;
  if (Math.abs(shift) < 2) return; // ignore sub-pixel rounding
  const target = window.scrollY + shift;
  window.scrollBy(0, shift);
  // Sync Lenis internal state — use pre-computed target to avoid
  // any timing ambiguity with scrollBy inside view transitions
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { immediate: true });
}

const contents: Record<Lang, Content> = { en, es };

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'es';
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'es') return urlLang;
    const stored = localStorage.getItem('erea-logistics-lang');
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    // Safari private browsing may throw on localStorage
  }
  return 'es';
}

function persist(lang: Lang) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('erea-logistics-lang', lang);
  } catch {
    // ignore
  }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  replaceState(url, {});
  document.documentElement.lang = lang;
}

class LangStore {
  current = $state<Lang>(detectInitialLang());

  constructor() {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = this.current;
    }
  }

  toggle() {
    const next = this.current === 'es' ? 'en' : 'es';
    const anchor = findScrollAnchor();

    const apply = async () => {
      this.current = next;
      persist(next);
      await tick();
      // Force synchronous reflow so offsetTop reflects new content
      void document.body.offsetHeight;
      refreshScrollTrigger();
      correctDrift(anchor);
      snapPassedAnimations();
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document && !prefersReducedMotion()) {
      (document as Document & { startViewTransition: (cb: () => Promise<void>) => void })
        .startViewTransition(apply);
    } else {
      apply();
    }
  }

  set(lang: Lang) {
    this.current = lang;
    persist(lang);
    tick().then(() => refreshScrollTrigger());
  }
}

export const lang = new LangStore();

export function getContent(): Content {
  return contents[lang.current];
}
