/**
 * Svelte actions wrapping the GSAP animation helpers.
 *
 * Instead of binding element refs and wiring $effects in each component,
 * attach animations declaratively with use: directives:
 *
 *   <div use:lineReveal class="section-rule"></div>
 *   <h2 use:reveal={{ delay: 0.1 }}>...</h2>
 *   <div use:stagger={{ selector: '.card', stagger: 0.12 }}>...</div>
 *   <div use:parallax={{ speed: 0.06, direction: 'up' }}>...</div>
 *
 * Each action handles its own mount/destroy lifecycle — no manual cleanup needed.
 */

import type { Action } from 'svelte/action';
import {
  revealOnScroll,
  staggerReveal,
  lineReveal as lineRevealFn,
  ambientParallax as ambientParallaxFn,
  countUpOnScroll,
  prefersReducedMotion,
} from './gsap';

function destroyTween(tween: ReturnType<typeof revealOnScroll>) {
  if (!tween) return;
  tween.scrollTrigger?.kill();
  tween.kill();
}

/** Fade-up reveal on scroll. */
export const reveal: Action<HTMLElement, { delay?: number; y?: number } | undefined> = (
  node,
  opts
) => {
  const tween = revealOnScroll(node, opts);
  return { destroy: () => destroyTween(tween) };
};

/** Horizontal line draw, left-to-right on scroll. */
export const lineReveal: Action<HTMLElement> = (node) => {
  const tween = lineRevealFn(node);
  return { destroy: () => destroyTween(tween) };
};

/** Staggered children reveal on scroll. Requires `selector` to target child elements. */
export const stagger: Action<HTMLElement, { selector: string; stagger?: number; y?: number; delay?: number; onComplete?: () => void }> = (
  node,
  opts
) => {
  const tween = staggerReveal(node, opts.selector, { stagger: opts.stagger, y: opts.y, delay: opts.delay, onComplete: opts.onComplete });
  return { destroy: () => destroyTween(tween) };
};

/** Count-up animation for stat values on scroll, with optional live-tick readout. */
export const countUp: Action<HTMLElement, { liveTick?: boolean } | undefined> = (node, opts) => {
  let tickTimer = 0;
  let tickAlive = true;

  const onDone = (opts?.liveTick && !prefersReducedMotion()) ? () => {
    const rawValue = node.getAttribute('data-value') ?? '0';
    const format = node.getAttribute('data-format') ?? '';
    const numericStr = rawValue.replace(/[^0-9.]/g, '');
    const baseVal = Math.round(parseFloat(numericStr) || 0);
    const pfx = format.startsWith('+') ? '+' : format.startsWith('-') ? '-' : '';
    const sfx = format.replace(/^[+-]/, '');

    function fmt(val: number): string {
      const s = val >= 1000 ? val.toLocaleString('en-US') : String(val);
      return `${pfx}${s}${sfx}`;
    }

    function schedule() {
      tickTimer = window.setTimeout(() => {
        if (!tickAlive) return;
        node.innerText = fmt(baseVal + (Math.random() > 0.5 ? 1 : -1));
        tickTimer = window.setTimeout(() => {
          if (!tickAlive) return;
          node.innerText = fmt(baseVal);
          schedule();
        }, 120 + Math.random() * 130);
      }, 4000 + Math.random() * 6000);
    }

    tickTimer = window.setTimeout(schedule, 1500);
  } : undefined;

  const tween = countUpOnScroll(node, { onDone });

  return {
    destroy() {
      tickAlive = false;
      window.clearTimeout(tickTimer);
      destroyTween(tween);
    }
  };
};

/** Subtle scroll-driven parallax for ambient viz layers. */
export const parallax: Action<
  HTMLElement,
  { speed?: number; direction?: 'up' | 'down' } | undefined
> = (node, opts) => {
  const tween = ambientParallaxFn(node, opts);
  return { destroy: () => destroyTween(tween) };
};
