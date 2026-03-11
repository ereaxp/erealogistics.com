<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gsap, ScrollTrigger, prefersReducedMotion } from '$lib/animations/gsap';
  import { scrollToSection } from '$lib/animations/gsap';

  const sections = [
    { id: 'about', label: 'About', num: '01' },
    { id: 'methodology', label: 'Value', num: '02' },
    { id: 'transformation', label: 'Transform', num: '03' },
    { id: 'impact', label: 'Impact', num: '04' },
    { id: 'questions', label: 'Audit', num: '05' },
    { id: 'team', label: 'Team', num: '06' },
    { id: 'contact', label: 'Contact', num: '07' },
  ];

  let activeIndex = $state(-1);
  let visible = $state(false);
  let trackerEl: HTMLElement;
  let triggers: ScrollTrigger[] = [];

  onMount(() => {
    // Show/hide based on scroll position
    const heroEl = document.getElementById('hero');
    const footerEl = document.querySelector('footer');

    if (heroEl) {
      triggers.push(
        ScrollTrigger.create({
          trigger: heroEl,
          start: 'bottom 20%',
          onEnterBack: () => { if (visible) visible = false; },
          onLeave: () => { if (!visible) visible = true; },
        })
      );
    }

    if (footerEl) {
      triggers.push(
        ScrollTrigger.create({
          trigger: footerEl,
          start: 'top 90%',
          onEnter: () => { if (visible) visible = false; },
          onLeaveBack: () => { if (!visible) visible = true; },
        })
      );
    }

    // Track active section
    sections.forEach((section, i) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => { if (activeIndex !== i) activeIndex = i; },
          onEnterBack: () => { if (activeIndex !== i) activeIndex = i; },
        })
      );
    });
  });

  onDestroy(() => {
    triggers.forEach(t => t.kill());
  });

  function handleClick(id: string) {
    scrollToSection(id);
  }

  function getNodeState(index: number): 'completed' | 'active' | 'pending' {
    if (activeIndex < 0) return 'pending';
    if (index < activeIndex) return 'completed';
    if (index === activeIndex) return 'active';
    return 'pending';
  }
</script>

<nav
  bind:this={trackerEl}
  class="tracker"
  class:tracker-visible={visible}
  aria-label="Section navigation"
>
  <div class="tracker-line" aria-hidden="true"></div>

  {#each sections as section, i}
    {@const state = getNodeState(i)}
    <div class="tracker-stop">
      <button
        class="tracker-node"
        class:tracker-node-completed={state === 'completed'}
        class:tracker-node-active={state === 'active'}
        class:tracker-node-pending={state === 'pending'}
        onclick={() => handleClick(section.id)}
        aria-label="Go to {section.label}"
        aria-current={state === 'active' ? 'true' : undefined}
      >
        <span class="tracker-node-dot"></span>
        {#if state === 'active'}
          <span class="tracker-pulse" aria-hidden="true"></span>
        {/if}
      </button>
      <span class="tracker-label">
        <span class="tracker-num">{section.num}</span>
        {section.label}
      </span>
    </div>
  {/each}
</nav>

<style>
  .tracker {
    position: fixed;
    left: clamp(16px, 2.5vw, 40px);
    top: 50%;
    transform: translateY(-50%);
    z-index: 40;
    display: none;
    flex-direction: column;
    gap: 0;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  @media (min-width: 1280px) {
    .tracker {
      display: flex;
    }
  }

  .tracker-visible {
    opacity: 1;
    pointer-events: auto;
  }

  .tracker-line {
    position: absolute;
    left: 8px;
    top: 8px;
    bottom: 8px;
    width: 0;
    border-left: 1.5px dashed var(--color-brand-22);
  }

  .tracker-stop {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem 0;
  }

  .tracker-node {
    position: relative;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    flex-shrink: 0;
  }

  .tracker-node:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }

  .tracker-node-dot {
    display: block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  }

  .tracker-node-pending .tracker-node-dot {
    background: transparent;
    border: 1.5px dashed var(--color-brand-28);
  }

  .tracker-node-completed .tracker-node-dot {
    background: var(--color-accent-deep);
    border: 1.5px solid var(--color-accent-deep);
  }

  .tracker-node-active .tracker-node-dot {
    background: var(--color-accent-deep);
    border: 1.5px solid var(--color-accent-deep);
    transform: scale(1.25);
  }

  .tracker-pulse {
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    border: 1.5px solid var(--color-accent-deep);
    animation: tracker-ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  @keyframes tracker-ping {
    0% { transform: scale(0.8); opacity: 0.7; }
    70% { transform: scale(2.4); opacity: 0; }
    100% { transform: scale(2.4); opacity: 0; }
  }

  .tracker-label {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .tracker-stop:hover .tracker-label {
    opacity: 1;
    transform: translateX(0);
  }

  .tracker-num {
    color: var(--color-brand-36);
    margin-right: 0.25rem;
    font-variant-numeric: tabular-nums;
  }

  @media (prefers-reduced-motion: reduce) {
    .tracker-pulse {
      animation: none;
      display: none;
    }

    .tracker-node-dot {
      transition: none;
    }

    .tracker-label {
      transition: none;
    }

    .tracker {
      transition: none;
    }
  }
</style>
