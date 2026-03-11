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
export const stagger: Action<HTMLElement, { selector: string; stagger?: number; y?: number }> = (
  node,
  opts
) => {
  const tween = staggerReveal(node, opts.selector, { stagger: opts.stagger, y: opts.y });
  return { destroy: () => destroyTween(tween) };
};

/** Subtle scroll-driven parallax for ambient viz layers. */
export const parallax: Action<
  HTMLElement,
  { speed?: number; direction?: 'up' | 'down' } | undefined
> = (node, opts) => {
  const tween = ambientParallaxFn(node, opts);
  return { destroy: () => destroyTween(tween) };
};
