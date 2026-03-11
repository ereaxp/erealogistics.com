<script lang="ts">
  import { getContent } from '$lib/stores/lang.svelte';
  import { reveal, stagger, countUp } from '$lib/animations/actions';
  import { scrollToSection } from '$lib/animations/gsap';

  let t = $derived(getContent());

  function parseStatValue(value: string): { numeric: string; prefix: string; suffix: string } {
    const match = value.match(/^([+-]?)(\d[\d,.]*)(.*)$/);
    if (!match) return { numeric: '0', prefix: '', suffix: value };
    return { numeric: match[2], prefix: match[1], suffix: match[3] };
  }
</script>

<section id="hero" class="relative overflow-hidden px-container">
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="hero-blueprint-field">
      <div class="hero-blueprint-grid"></div>
      <div class="hero-blueprint-frame"></div>
      <svg class="hero-blueprint-map" viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    class="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-y-6 pt-[clamp(52px,7vw,80px)] pb-[clamp(16px,2vw,28px)] lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0"
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
          <span aria-hidden="true">→</span>
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

    <!-- Right column: metrics command panel -->
    <div
      use:stagger={{ selector: '.hero-proof-stat', stagger: 0.08, y: 20, onComplete: () => { document.querySelector('.hero-proof-band')?.classList.add('is-revealed'); } }}
      class="hero-proof-band lg:col-span-5 lg:row-start-1 lg:col-start-8"
      aria-label="Indicadores de impacto"
    >
      <div class="hero-status-row">
        <span class="hero-status-dot" aria-hidden="true"></span>
        <span class="hero-status-label">{t.hero.statusBadge}</span>
      </div>

      <div class="hero-proof-grid">
        {#each t.hero.stats as stat}
          {@const parsed = parseStatValue(stat.value)}
          <div class="hero-proof-stat">
            <div class="hero-proof-label">{stat.label}</div>
            <div
              class="hero-proof-value"
              use:countUp
              data-value={parsed.numeric}
              data-format="{parsed.prefix}{parsed.suffix}"
            >
              {stat.value}
            </div>
          </div>
        {/each}
      </div>

      <p class="hero-proof-note">{t.hero.cardNote}</p>
    </div>
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
    background: rgba(27, 107, 74, 0.36);
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
    border: 1px solid rgba(27, 107, 74, 0.14);
    background: rgba(27, 107, 74, 0.03);
    line-height: 1;
  }

  /* ── Secondary link ── */
  .hero-secondary-link {
    color: var(--color-text-secondary);
    font-size: clamp(0.95rem, 0.94rem + 0.1vw, 1.04rem);
    text-decoration: none;
  }

  .hero-secondary-link:hover {
    color: var(--color-text-primary);
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
      linear-gradient(rgba(27, 107, 74, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(27, 107, 74, 0.035) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.72) 66%, transparent 100%);
  }

  .hero-blueprint-frame::before,
  .hero-blueprint-frame::after {
    content: '';
    position: absolute;
    background: rgba(27, 107, 74, 0.14);
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
    stroke: rgba(27, 107, 74, 0.16);
    stroke-width: 1.4;
    stroke-dasharray: 5 10;
  }

  .hero-blueprint-map .route {
    stroke: rgba(27, 107, 74, 0.42);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero-blueprint-map .lane {
    stroke: rgba(61, 211, 132, 0.36);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero-blueprint-map .hub {
    fill: #fdfcf9;
    stroke: rgba(27, 107, 74, 0.52);
    stroke-width: 3.5;
  }

  .hero-blueprint-map .node {
    fill: rgba(27, 107, 74, 0.48);
  }

  .hero-blueprint-map .slot {
    fill: rgba(27, 107, 74, 0.05);
    stroke: rgba(27, 107, 74, 0.22);
    stroke-width: 1;
  }

  .hero-blueprint-map .tick {
    stroke: rgba(27, 107, 74, 0.24);
    stroke-width: 1;
  }

  .hero-blueprint-map .hub-label {
    font-family: var(--font-sans);
    font-size: 9px;
    text-transform: uppercase;
    fill: rgba(27, 107, 74, 0.30);
    text-anchor: middle;
  }

  /* ── Status badge ── */
  .hero-status-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1.2rem;
    border-bottom: 1px solid rgba(27, 107, 74, 0.10);
  }

  .hero-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-accent);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .hero-status-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: var(--color-accent);
    line-height: 1;
  }

  /* ── Metrics panel ── */
  .hero-proof-band {
    background: color-mix(in srgb, var(--color-bg-primary) 96%, var(--color-accent-deep) 4%);
    border: 1px solid rgba(27, 107, 74, 0.16);
    border-left: 3px solid var(--color-accent);
    position: relative;
    overflow: hidden;
    align-self: center;
    z-index: 2;
  }

  .hero-proof-band::after {
    content: '';
    position: absolute;
    top: 0;
    left: -10%;
    width: 40px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    animation: scan-sweep 1.2s ease-out 0.3s forwards;
    animation-play-state: paused;
    pointer-events: none;
  }

  .hero-proof-band:global(.is-revealed)::after {
    animation-play-state: running;
  }

  @keyframes scan-sweep {
    from { left: -10%; }
    to { left: 110%; }
  }

  .hero-proof-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero-proof-stat {
    position: relative;
    padding: 0.85rem 1.2rem 0.8rem;
    border-top: 2px solid rgba(61, 211, 132, 0.72);
  }

  .hero-proof-stat:not(:first-child) {
    border-top: 1px solid rgba(27, 107, 74, 0.10);
  }

  .hero-proof-label {
    margin-bottom: 0.35rem;
    color: var(--color-accent-deep);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    max-width: 28ch;
    line-height: 1.3;
  }

  .hero-proof-value {
    color: var(--color-accent-deep);
    font-family: var(--font-sans);
    font-weight: 800;
    font-size: clamp(1.5rem, 1.8vw, 2rem);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .hero-proof-note {
    border-top: 1px solid rgba(27, 107, 74, 0.08);
    padding: 0.65rem 1.2rem 0.7rem;
    font-size: 0.78rem;
    color: var(--color-text-tertiary);
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

    .hero-proof-band {
      border-left: 3px solid var(--color-accent);
    }

    .hero-proof-stat {
      padding: 0.85rem 1rem 0.8rem;
    }

    .hero-proof-value {
      font-size: clamp(1.4rem, 6vw, 1.75rem);
    }

    .hero-proof-note {
      padding: 0.6rem 1rem 0.7rem;
    }

    .hero-status-row {
      padding: 0.5rem 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-status-dot {
      animation: none;
    }

    .hero-proof-band::after {
      animation: none;
    }
  }
</style>
