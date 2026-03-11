<script lang="ts">
  import { onMount } from 'svelte';
  import { getContent } from '$lib/stores/lang.svelte';
  import { reveal, stagger, countUp } from '$lib/animations/actions';
  import { scrollToSection, prefersReducedMotion } from '$lib/animations/gsap';
  import { gsap } from 'gsap';

  let t = $derived(getContent());
  let blueprintSvg: SVGSVGElement;
  let scrollPromptVisible = $state(true);

  function handleScroll() {
    if (window.scrollY > 80) {
      scrollPromptVisible = false;
    }
  }

  function parseStatValue(value: string): { numeric: string; prefix: string; suffix: string } {
    const match = value.match(/^([+-]?)(\d[\d,.]*)(.*)$/);
    if (!match) return { numeric: '0', prefix: '', suffix: value };
    return { numeric: match[2], prefix: match[1], suffix: match[3] };
  }


  onMount(() => {
    if (!blueprintSvg || prefersReducedMotion()) return;

    const routes = blueprintSvg.querySelectorAll('.route');
    const lanes = blueprintSvg.querySelectorAll('.lane');
    const hubs = blueprintSvg.querySelectorAll('.hub');
    const nodes = blueprintSvg.querySelectorAll('.node');
    const labels = blueprintSvg.querySelectorAll('.hub-label');

    // Prepare routes for stroke drawing
    routes.forEach(route => {
      const length = (route as SVGPathElement).getTotalLength();
      gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });
    });
    lanes.forEach(lane => {
      const length = (lane as SVGPathElement).getTotalLength();
      gsap.set(lane, { strokeDasharray: length, strokeDashoffset: length });
    });

    gsap.set(hubs, { scale: 0, transformOrigin: 'center center' });
    gsap.set(nodes, { scale: 0, transformOrigin: 'center center' });
    gsap.set(labels, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.6 });

    // Draw routes
    tl.to(routes, {
      strokeDashoffset: 0,
      duration: 1.8,
      stagger: 0.3,
      ease: 'power2.inOut',
    });

    // Draw lanes slightly after
    tl.to(lanes, {
      strokeDashoffset: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.inOut',
    }, '-=1.4');

    // Pop in hubs
    tl.to(hubs, {
      scale: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(2)',
    }, '-=0.8');

    // Fade in nodes
    tl.to(nodes, {
      scale: 1,
      duration: 0.35,
      stagger: 0.05,
      ease: 'power2.out',
    }, '-=0.4');

    // Labels fade in
    tl.to(labels, {
      opacity: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power2.out',
    }, '-=0.3');

    return () => { tl.kill(); };
  });
</script>

<svelte:window onscroll={handleScroll} />

<section id="hero" class="hero-section relative overflow-hidden px-container">
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="hero-blueprint-field">
      <div class="hero-blueprint-grid"></div>
      <div class="hero-blueprint-frame"></div>
      <svg bind:this={blueprintSvg} class="hero-blueprint-map" viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="rgba(0,80,47,0.40)" />
          </marker>
        </defs>

        <path class="guide" d="M138 72V504" />
        <path class="guide" d="M362 56V520" />
        <path class="guide" d="M614 90V522" />
        <path class="guide" d="M92 168H760" />
        <path class="guide" d="M116 338H820" />

        <path class="route" d="M84 132H252V182H430V114H660V190H814" marker-end="url(#arrowhead)" />
        <path class="route" d="M120 258H308V214H466V292H624V234H790" marker-end="url(#arrowhead)" />
        <path class="route" d="M186 406H360V356H554V430H702V374H838" marker-end="url(#arrowhead)" />

        <path class="lane" d="M250 182V298H430" />
        <path class="lane" d="M466 292V356H554" />
        <path class="lane" d="M660 190V234H790" />
        <path class="lane" d="M624 234V430H702" />

        <line class="tick" x1="168" y1="129" x2="168" y2="135" />
        <line class="tick" x1="340" y1="179" x2="340" y2="185" />
        <line class="tick" x1="545" y1="111" x2="545" y2="117" />
        <line class="tick" x1="740" y1="187" x2="740" y2="193" />
        <line class="tick" x1="210" y1="255" x2="210" y2="261" />
        <line class="tick" x1="390" y1="211" x2="390" y2="217" />
        <line class="tick" x1="540" y1="289" x2="540" y2="295" />
        <line class="tick" x1="270" y1="403" x2="270" y2="409" />
        <line class="tick" x1="460" y1="353" x2="460" y2="359" />
        <line class="tick" x1="770" y1="371" x2="770" y2="377" />

        <text class="hub-label" x="252" y="170">DC-01</text>
        <text class="hub-label" x="430" y="102">HUB-A</text>
        <text class="hub-label" x="466" y="280">HUB-B</text>
        <text class="hub-label" x="624" y="222">HUB-C</text>
        <text class="hub-label" x="814" y="178">PORT</text>
        <text class="hub-label" x="702" y="362">DC-02</text>

        <circle class="hub" cx="252" cy="182" r="10" />
        <circle class="hub" cx="430" cy="114" r="10" />
        <circle class="hub" cx="466" cy="292" r="11" />
        <circle class="hub" cx="624" cy="234" r="10" />
        <circle class="hub" cx="702" cy="374" r="11" />
        <circle class="hub" cx="814" cy="190" r="12" />

        <circle class="node" cx="308" cy="214" r="5" />
        <circle class="node" cx="360" cy="356" r="5" />
        <circle class="node" cx="554" cy="430" r="5" />
        <circle class="node" cx="186" cy="406" r="5" />
        <circle class="node" cx="790" cy="234" r="5" />

        <rect class="slot" x="540" y="92" width="22" height="10" rx="1" />
        <rect class="slot" x="568" y="92" width="22" height="10" rx="1" />
        <rect class="slot" x="596" y="92" width="22" height="10" rx="1" />
        <rect class="slot" x="624" y="92" width="22" height="10" rx="1" />
        <rect class="slot" x="652" y="92" width="22" height="10" rx="1" />
        <rect class="slot" x="540" y="76" width="22" height="10" rx="1" />
        <rect class="slot" x="568" y="76" width="22" height="10" rx="1" />
        <rect class="slot" x="596" y="76" width="22" height="10" rx="1" />
        <rect class="slot" x="624" y="76" width="22" height="10" rx="1" />

        <rect class="slot" x="96" y="364" width="20" height="9" rx="1" />
        <rect class="slot" x="96" y="378" width="20" height="9" rx="1" />
        <rect class="slot" x="96" y="392" width="20" height="9" rx="1" />
        <rect class="slot" x="96" y="406" width="20" height="9" rx="1" />
        <rect class="slot" x="96" y="420" width="20" height="9" rx="1" />
        <rect class="slot" x="122" y="364" width="20" height="9" rx="1" />
        <rect class="slot" x="122" y="378" width="20" height="9" rx="1" />
        <rect class="slot" x="122" y="392" width="20" height="9" rx="1" />

        <rect class="slot" x="734" y="338" width="22" height="10" rx="1" />
        <rect class="slot" x="762" y="338" width="22" height="10" rx="1" />
        <rect class="slot" x="790" y="338" width="22" height="10" rx="1" />
        <rect class="slot" x="818" y="338" width="22" height="10" rx="1" />
        <rect class="slot" x="734" y="322" width="22" height="10" rx="1" />
        <rect class="slot" x="762" y="322" width="22" height="10" rx="1" />
        <rect class="slot" x="790" y="322" width="22" height="10" rx="1" />
      </svg>
    </div>
  </div>

  <div
    class="hero-content relative z-10 mx-auto grid w-full max-w-7xl items-center gap-y-6 pt-[clamp(52px,7vw,80px)] lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0"
  >
    <!-- Left column: narrative -->
    <div class="lg:col-span-7">
      <div use:reveal class="hero-kicker-block mb-3" data-reveal>
        <div class="hero-kicker-row">
          <span class="hero-kicker-rule" aria-hidden="true"></span>
          <p class="eyebrow mb-0 font-semibold">{t.hero.kicker}</p>
        </div>
        <p class="hero-kicker-sub">{t.hero.kickerSub}</p>
      </div>

      <h1
        use:reveal={{ y: 28 }}
        class="hero-title mb-4 max-w-[18ch] font-serif tracking-tight text-text-primary"
        data-reveal
      >
        {t.hero.title}
      </h1>

      <p
        use:reveal={{ delay: 0.08 }}
        class="hero-subtitle mb-5 max-w-[32rem] text-text-secondary"
        data-reveal
      >
        {t.hero.subtitle}
      </p>

      <div
        use:reveal={{ delay: 0.14 }}
        class="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3"
        data-reveal
      >
        <a
          href="#contact"
          onclick={(e) => {
            e.preventDefault();
            scrollToSection('contact');
          }}
          class="button-primary lift-on-hover"
        >
          {t.hero.ctaPrimary}
          <span class="hero-cta-arrow" aria-hidden="true">→</span>
        </a>

        <a
          href="#methodology"
          onclick={(e) => {
            e.preventDefault();
            scrollToSection('methodology');
          }}
          class="hero-secondary-link"
        >
          {t.hero.ctaSecondary}
        </a>
      </div>

      <div use:reveal={{ delay: 0.2 }} class="hero-pills" data-reveal>
        {#each t.hero.notePills as pill}
          <span class="hero-pill">{pill}</span>
        {/each}
      </div>
    </div>

    <!-- Right column: metrics manifest panel -->
    <div
      use:stagger={{ selector: '.hero-proof-stat', stagger: 0.08, y: 20 }}
      class="hero-proof-band lg:col-span-5 lg:row-start-1 lg:col-start-8"
      role="region"
      aria-label="Indicadores de impacto"
    >
      <div class="hero-proof-header">
        <span class="hero-proof-header-title">{t.hero.statusBadge}</span>
        <span class="hero-proof-header-ref" aria-hidden="true">REF: ELS-{new Date().getFullYear()}</span>
        <span class="hero-proof-header-dot" aria-hidden="true"></span>
      </div>

      <div class="hero-proof-grid">
        {#each t.hero.stats as stat, i}
          {@const parsed = parseStatValue(stat.value)}
          <div class="hero-proof-stat">
            <div class="hero-proof-field-head">
              <span class="hero-proof-ref" aria-hidden="true">KPI-0{i + 1}</span>
              <span class="hero-proof-label">{stat.label}</span>
            </div>
            <div class="hero-proof-value-row">
              <svg class="hero-proof-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                {#if stat.direction === 'up'}
                  <path d="M8 13V3M8 3l4 4M8 3L4 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                {:else}
                  <path d="M8 3v10M8 13l4-4M8 13l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                {/if}
              </svg>
              <div
                class="hero-proof-value"
                use:countUp
                data-value={parsed.numeric}
                data-format="{parsed.prefix}{parsed.suffix}"
              >
                {stat.value}
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="hero-proof-footer">
        <div class="hero-proof-barcode" aria-hidden="true">
          {#each Array(12) as _, i}
            <span class="hero-proof-bar" style:width="{i % 3 === 0 ? 3 : 1.5}px"></span>
          {/each}
        </div>
        <p class="hero-proof-note">{t.hero.cardNote}</p>
      </div>
    </div>
  </div>

  <div
    class="scroll-prompt"
    class:scroll-prompt-hidden={!scrollPromptVisible}
    aria-hidden="true"
  >
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 2l8 6 8-6"/>
    </svg>
  </div>
</section>

<style>
  /* ── Kicker ── */
  .hero-kicker-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .hero-kicker-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .hero-kicker-rule {
    width: 2.4rem;
    height: 1.2px;
    background: var(--color-brand-36);
  }

  .hero-kicker-sub {
    margin: 0;
    padding-left: calc(2.4rem + 0.75rem);
    font-size: 0.78rem;
    color: var(--color-text-tertiary);
    line-height: 1.3;
  }

  /* ── Headline ── */
  .hero-title {
    font-size: clamp(2.4rem, 4.2vw, 3.6rem);
    line-height: 1.04;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  /* ── Subtitle ── */
  .hero-subtitle {
    font-size: clamp(1.02rem, 0.98rem + 0.25vw, 1.18rem);
    line-height: 1.48;
    letter-spacing: -0.008em;
  }

  /* ── Attribute pills ── */
  .hero-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.7rem;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent-deep);
    border: 1px solid var(--color-brand-14);
    background: var(--color-brand-3);
    line-height: 1;
  }

  /* ── CTA arrow ── */
  .hero-cta-arrow {
    display: inline-block;
    transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }

  :global(.button-primary:hover) .hero-cta-arrow {
    transform: translateX(4px);
  }

  :global(.button-primary:active) .hero-cta-arrow {
    transform: translateX(2px);
  }

  /* ── Secondary link ── */
  .hero-secondary-link {
    position: relative;
    color: var(--color-text-secondary);
    font-size: clamp(0.95rem, 0.94rem + 0.1vw, 1.04rem);
    text-decoration: none;
  }

  .hero-secondary-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 1.5px;
    background: var(--color-accent-deep);
    transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1), left 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .hero-secondary-link:hover {
    color: var(--color-text-primary);
  }

  .hero-secondary-link:hover::after {
    width: 100%;
    left: 0;
  }

  /* ── Blueprint SVG ── */
  .hero-blueprint-field {
    position: absolute;
    top: clamp(40px, 8vh, 100px);
    left: 28%;
    width: min(42vw, 560px);
    height: clamp(300px, 40vw, 440px);
    opacity: 0.9;
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.5) 15%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.5) 75%, transparent 100%);
  }

  .hero-blueprint-grid,
  .hero-blueprint-frame,
  .hero-blueprint-map {
    position: absolute;
    inset: 0;
  }

  .hero-blueprint-grid {
    background-image:
      linear-gradient(rgba(var(--color-brand-rgb), 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(var(--color-brand-rgb), 0.035) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.72) 66%, transparent 100%);
  }

  .hero-blueprint-frame::before,
  .hero-blueprint-frame::after {
    content: '';
    position: absolute;
    background: var(--color-brand-14);
  }

  .hero-blueprint-frame::before {
    top: 9%;
    left: 10%;
    width: 72%;
    height: 1px;
  }

  .hero-blueprint-frame::after {
    top: 9%;
    left: 10%;
    width: 1px;
    height: 72%;
  }

  .hero-blueprint-map {
    width: 100%;
    height: 100%;
  }

  .hero-blueprint-map .guide {
    stroke: var(--color-brand-16);
    stroke-width: 1.4;
    stroke-dasharray: 5 10;
  }

  .hero-blueprint-map .route {
    stroke: var(--color-brand-42);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero-blueprint-map .lane {
    stroke: var(--color-accent-36);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero-blueprint-map .hub {
    fill: #fdfcf9;
    stroke: var(--color-brand-52);
    stroke-width: 3.5;
  }

  .hero-blueprint-map .node {
    fill: var(--color-brand-48);
  }

  .hero-blueprint-map .slot {
    fill: var(--color-brand-5);
    stroke: var(--color-brand-22);
    stroke-width: 1;
  }

  .hero-blueprint-map .tick {
    stroke: rgba(var(--color-brand-rgb), 0.24);
    stroke-width: 1;
  }

  .hero-blueprint-map .hub-label {
    font-family: var(--font-sans);
    font-size: 9px;
    text-transform: uppercase;
    fill: rgba(var(--color-brand-rgb), 0.30);
    text-anchor: middle;
  }

  /* ── Hero section layout ── */
  .hero-section {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
  }

  .hero-content {
    flex: 1;
  }

  /* ── Metrics manifest panel ── */
  .hero-proof-band {
    background: var(--color-bg-card);
    border: 1.5px solid var(--color-brand-22);
    position: relative;
    align-self: center;
    z-index: 2;
  }

  /* Corner crop marks — document registration */
  .hero-proof-band::before,
  .hero-proof-band::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    pointer-events: none;
    z-index: 1;
  }

  .hero-proof-band::before {
    top: -6px;
    left: -6px;
    border-top: 2px solid var(--color-brand-36);
    border-left: 2px solid var(--color-brand-36);
  }

  .hero-proof-band::after {
    bottom: -6px;
    right: -6px;
    border-bottom: 2px solid var(--color-brand-36);
    border-right: 2px solid var(--color-brand-36);
  }

  /* Dark teal header — like a real document header */
  .hero-proof-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    background: var(--color-accent-deep);
    border-bottom: 2px solid var(--color-accent);
  }

  .hero-proof-header-title {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.92);
  }

  .hero-proof-header-ref {
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.45);
    font-variant-numeric: tabular-nums;
  }

  .hero-proof-header-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-accent);
    margin-left: auto;
    position: relative;
  }

  .hero-proof-header-dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1.5px solid var(--color-accent);
    animation: ping-ring 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  @keyframes ping-ring {
    0% { transform: scale(0.8); opacity: 0.8; }
    70% { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  .hero-proof-grid {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0;
  }

  .hero-proof-stat {
    position: relative;
    padding: 0.75rem 1rem 0.8rem;
    min-height: 5.4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 3px solid transparent;
    transition: border-color 0.2s;
  }

  .hero-proof-stat:hover {
    border-left-color: var(--color-accent);
    background: var(--color-brand-3);
  }

  /* Dashed field separators — manifest style */
  .hero-proof-stat:not(:first-child)::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-top: 1.5px dashed var(--color-brand-16);
  }

  .hero-proof-field-head {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
  }

  .hero-proof-ref {
    font-family: var(--font-sans);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #fff;
    background: var(--color-accent-deep);
    padding: 0.1rem 0.35rem;
    border-radius: 2px;
    line-height: 1.4;
  }

  .hero-proof-label {
    color: var(--color-text-secondary);
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    line-height: 1.3;
  }

  .hero-proof-value-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .hero-proof-arrow {
    width: 16px;
    height: 16px;
    color: var(--color-accent-deep);
    flex-shrink: 0;
    opacity: 0.7;
  }

  .hero-proof-value {
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-weight: 800;
    font-size: clamp(1.8rem, 2.4vw, 2.4rem);
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  .hero-proof-footer {
    border-top: 1.5px solid var(--color-brand-16);
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .hero-proof-barcode {
    display: flex;
    align-items: stretch;
    gap: 2px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.3;
  }

  .hero-proof-bar {
    display: block;
    background: var(--color-text-primary);
    border-radius: 0.5px;
  }

  .hero-proof-note {
    font-size: 0.66rem;
    color: var(--color-text-tertiary);
    letter-spacing: 0.01em;
  }

  /* ── Scroll prompt ── */
  .scroll-prompt {
    display: flex;
    justify-content: center;
    padding-bottom: clamp(1.2rem, 2.5vh, 2.5rem);
    color: var(--color-text-tertiary);
    opacity: 0.6;
    transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    animation: scroll-bob 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
    margin-top: auto;
  }

  .scroll-prompt-hidden {
    opacity: 0;
    pointer-events: none;
  }

  @keyframes scroll-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .hero-blueprint-field {
      left: 15%;
      width: min(50vw, 500px);
      height: clamp(260px, 34vw, 340px);
      opacity: 0.6;
    }
  }

  @media (max-width: 768px) {
    .hero-section {
      min-height: auto;
    }

    .hero-blueprint-field {
      top: 4.5rem;
      left: -5%;
      width: 85vw;
      height: 220px;
      opacity: 0.25;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
    }

    .hero-blueprint-grid {
      background-size: 32px 32px;
    }

    .hero-proof-stat {
      min-height: 4.6rem;
      padding: 0.6rem 0.75rem 0.65rem;
    }

    .hero-proof-value {
      font-size: clamp(1.5rem, 6vw, 1.8rem);
    }

    .hero-proof-barcode {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-proof-header-dot::after {
      animation: none;
    }

    .hero-cta-arrow {
      transition: none;
    }

    .hero-secondary-link::after {
      transition: none;
    }

    .scroll-prompt {
      animation: none;
    }
  }
</style>
