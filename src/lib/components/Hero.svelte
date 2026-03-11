<script lang="ts">
  import { getContent } from '$lib/stores/lang.svelte';
  import { reveal, stagger } from '$lib/animations/actions';
  import { scrollToSection } from '$lib/animations/gsap';

  let t = $derived(getContent());
</script>

<section id="hero" class="relative flex min-h-screen items-center overflow-hidden px-container">
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="hero-blueprint-field">
      <div class="hero-blueprint-grid"></div>
      <div class="hero-blueprint-frame"></div>
      <svg class="hero-blueprint-map" viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="guide" d="M138 72V504" />
        <path class="guide" d="M362 56V520" />
        <path class="guide" d="M614 90V522" />
        <path class="guide" d="M92 168H760" />
        <path class="guide" d="M116 338H820" />

        <path class="route" d="M84 132H252V182H430V114H660V190H814" />
        <path class="route" d="M120 258H308V214H466V292H624V234H790" />
        <path class="route" d="M186 406H360V356H554V430H702V374H838" />

        <path class="lane" d="M250 182V298H430" />
        <path class="lane" d="M466 292V356H554" />
        <path class="lane" d="M660 190V234H790" />
        <path class="lane" d="M624 234V430H702" />

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

        <rect class="slot" x="540" y="92" width="22" height="10" rx="2" />
        <rect class="slot" x="568" y="92" width="22" height="10" rx="2" />
        <rect class="slot" x="596" y="92" width="22" height="10" rx="2" />
        <rect class="slot" x="624" y="92" width="22" height="10" rx="2" />
        <rect class="slot" x="652" y="92" width="22" height="10" rx="2" />

        <rect class="slot" x="96" y="364" width="20" height="9" rx="2" />
        <rect class="slot" x="96" y="378" width="20" height="9" rx="2" />
        <rect class="slot" x="96" y="392" width="20" height="9" rx="2" />
        <rect class="slot" x="96" y="406" width="20" height="9" rx="2" />
        <rect class="slot" x="96" y="420" width="20" height="9" rx="2" />

        <rect class="slot" x="734" y="338" width="22" height="10" rx="2" />
        <rect class="slot" x="762" y="338" width="22" height="10" rx="2" />
        <rect class="slot" x="790" y="338" width="22" height="10" rx="2" />
        <rect class="slot" x="818" y="338" width="22" height="10" rx="2" />
      </svg>
    </div>
  </div>

  <div
    class="relative z-10 mx-auto grid w-full max-w-7xl gap-y-10 pt-[clamp(84px,10vw,126px)] pb-[clamp(56px,7vw,86px)] lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8"
  >
    <div class="lg:col-span-7">
      <div use:reveal class="hero-kicker-row mb-5" data-reveal>
        <span class="hero-kicker-rule" aria-hidden="true"></span>
        <p class="eyebrow mb-0">{t.hero.kicker}</p>
      </div>

      <h1
        use:reveal={{ y: 36 }}
        class="text-hero hero-title mb-5 max-w-[13ch] font-serif tracking-tight text-text-primary"
        data-reveal
      >
        {t.hero.title}
      </h1>

      <p
        use:reveal={{ delay: 0.08 }}
        class="text-body-lg mb-7 max-w-[35rem] text-text-secondary"
        data-reveal
      >
        {t.hero.subtitle}
      </p>

      <div
        use:reveal={{ delay: 0.14 }}
        class="mb-5 flex flex-wrap items-center gap-x-8 gap-y-4"
        data-reveal
      >
        <a
          href="#contact"
          onclick={(e) => {
            e.preventDefault();
            scrollToSection('contact');
          }}
          class="hero-primary-link"
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

      <p use:reveal={{ delay: 0.2 }} class="hero-note text-sm text-text-tertiary" data-reveal>
        {t.hero.note}
      </p>
    </div>

    <div class="hero-blueprint-spacer hidden lg:col-span-5 lg:block" aria-hidden="true"></div>

    <div
      use:stagger={{ selector: '.hero-proof-stat', stagger: 0.08, y: 28 }}
      class="hero-proof-band lg:col-span-12"
      aria-label="Indicadores de impacto"
    >
      <div class="hero-proof-grid">
        {#each t.hero.stats as stat}
          <div class="hero-proof-stat">
            <span class="hero-proof-rail" aria-hidden="true"></span>
            <div class="hero-proof-label">{stat.label}</div>
            <div class="hero-proof-value">{stat.value}</div>
          </div>
        {/each}
      </div>

      <p class="hero-proof-note text-sm text-text-secondary">{t.hero.cardNote}</p>
    </div>
  </div>
</section>

<style>
  .hero-kicker-row {
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }

  .hero-kicker-rule {
    width: 3rem;
    height: 1px;
    background: rgba(0, 80, 47, 0.22);
  }

  .hero-title {
    text-wrap: balance;
  }

  .hero-note {
    max-width: 34rem;
  }

  .hero-primary-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 0.32rem;
    border-bottom: 1.5px solid var(--color-accent-deep);
    color: var(--color-accent-deep);
    font-size: clamp(1rem, 0.96rem + 0.22vw, 1.14rem);
    font-weight: 600;
    text-decoration: none;
  }

  .hero-primary-link:hover {
    color: var(--color-text-primary);
    border-bottom-color: var(--color-text-primary);
  }

  .hero-secondary-link {
    color: var(--color-text-secondary);
    font-size: clamp(0.98rem, 0.96rem + 0.12vw, 1.06rem);
    text-decoration: none;
  }

  .hero-secondary-link:hover {
    color: var(--color-text-primary);
  }

  .hero-blueprint-spacer {
    min-height: clamp(300px, 32vw, 390px);
  }

  .hero-blueprint-field {
    position: absolute;
    top: clamp(94px, 15vh, 164px);
    right: max(1.75rem, calc((100vw - min(80rem, 100vw - 3rem)) / 2));
    width: min(44vw, 640px);
    height: clamp(300px, 42vw, 450px);
    opacity: 0.9;
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.14) 18%, rgba(0, 0, 0, 0.72) 44%, rgba(0, 0, 0, 0.96) 76%, transparent 100%);
  }

  .hero-blueprint-grid,
  .hero-blueprint-frame,
  .hero-blueprint-map {
    position: absolute;
    inset: 0;
  }

  .hero-blueprint-grid {
    background-image:
      linear-gradient(rgba(0, 80, 47, 0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 80, 47, 0.028) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.72) 66%, transparent 100%);
  }

  .hero-blueprint-frame::before,
  .hero-blueprint-frame::after {
    content: '';
    position: absolute;
    background: rgba(0, 80, 47, 0.12);
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
    stroke: rgba(0, 80, 47, 0.09);
    stroke-width: 1.2;
    stroke-dasharray: 5 10;
  }

  .hero-blueprint-map .route {
    stroke: rgba(0, 80, 47, 0.18);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero-blueprint-map .lane {
    stroke: rgba(0, 192, 139, 0.22);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero-blueprint-map .hub {
    fill: #fdfcf9;
    stroke: rgba(0, 80, 47, 0.34);
    stroke-width: 3;
  }

  .hero-blueprint-map .node {
    fill: rgba(0, 80, 47, 0.42);
  }

  .hero-blueprint-map .slot {
    fill: rgba(0, 80, 47, 0.04);
    stroke: rgba(0, 80, 47, 0.14);
    stroke-width: 1;
  }

  .hero-proof-band {
    border: 1px solid rgba(0, 80, 47, 0.12);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--color-bg-card) 76%, transparent);
    backdrop-filter: blur(4px);
  }

  .hero-proof-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hero-proof-stat {
    position: relative;
    padding: 1.45rem 1.6rem 1.35rem;
  }

  .hero-proof-stat:not(:first-child) {
    border-left: 1px solid rgba(0, 80, 47, 0.08);
  }

  .hero-proof-rail {
    position: absolute;
    top: 1.45rem;
    left: 1.05rem;
    bottom: 1.35rem;
    width: 2px;
    border-radius: 999px;
    background: rgba(0, 192, 139, 0.72);
  }

  .hero-proof-label {
    padding-left: 0.95rem;
    margin-bottom: 0.55rem;
    color: var(--color-text-tertiary);
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    max-width: 20ch;
  }

  .hero-proof-value {
    padding-left: 0.95rem;
    color: var(--color-accent-deep);
    font-family: var(--font-serif);
    font-size: clamp(2.2rem, 2.7vw, 3rem);
    line-height: 1;
    letter-spacing: var(--tracking-tight);
  }

  .hero-proof-note {
    border-top: 1px solid rgba(0, 80, 47, 0.08);
    padding: 1rem 1.6rem 1.1rem;
  }

  @media (max-width: 1024px) {
    .hero-blueprint-field {
      right: -2%;
      width: min(54vw, 540px);
      height: clamp(260px, 34vw, 340px);
      opacity: 0.7;
    }

    .hero-proof-grid {
      grid-template-columns: 1fr;
    }

    .hero-proof-stat:not(:first-child) {
      border-left: none;
      border-top: 1px solid rgba(0, 80, 47, 0.08);
    }
  }

  @media (max-width: 768px) {
    .hero-blueprint-field {
      top: 6.1rem;
      right: -18%;
      width: 78vw;
      height: 250px;
      opacity: 0.46;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.44) 58%, transparent 100%);
    }

    .hero-blueprint-grid {
      background-size: 32px 32px;
    }

    .hero-proof-band {
      border-radius: 0.95rem;
      background: rgba(255, 255, 255, 0.78);
      backdrop-filter: none;
    }

    .hero-proof-stat {
      padding: 1.2rem 1.25rem 1.1rem;
    }

    .hero-proof-rail {
      top: 1.2rem;
      left: 0.82rem;
      bottom: 1.1rem;
    }

    .hero-proof-label,
    .hero-proof-value {
      padding-left: 0.9rem;
    }

    .hero-proof-value {
      font-size: clamp(2rem, 9vw, 2.55rem);
    }

    .hero-proof-note {
      padding: 0.95rem 1.25rem 1rem;
    }
  }
</style>
