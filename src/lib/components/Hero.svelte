<script lang="ts">
  import { onMount } from 'svelte';
  import { getContent } from '$lib/stores/lang.svelte';
  import { reveal, stagger, countUp } from '$lib/animations/actions';
  import { scrollToSection, prefersReducedMotion, STAGGER } from '$lib/animations/gsap';
  import { gsap } from 'gsap';

  let t = $derived(getContent());
  let blueprintSvg: SVGSVGElement;
  let scrollPromptVisible = $state(true);
  const currentYear = new Date().getFullYear();

  function handleScroll() {
    if (scrollPromptVisible && window.scrollY > 80) {
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

    const routesIn = blueprintSvg.querySelectorAll('.route-in');
    const routesOut = blueprintSvg.querySelectorAll('.route-out');
    const lanes = blueprintSvg.querySelectorAll('.lane');
    const hubsOrigin = blueprintSvg.querySelectorAll('.hub-origin');
    const hubCentral = blueprintSvg.querySelectorAll('.hub-central');
    const hubsDestination = blueprintSvg.querySelectorAll('.hub-destination');
    const nodes = blueprintSvg.querySelectorAll('.node');
    const labels = blueprintSvg.querySelectorAll('.hub-label');
    const locationCodes = blueprintSvg.querySelectorAll('.location-code');
    const refNumbers = blueprintSvg.querySelectorAll('.ref-number');
    const manifestRows = blueprintSvg.querySelectorAll('.manifest-rows');
    const handlingMark = blueprintSvg.querySelectorAll('.handling-mark');

    const setDashHidden = (el: Element) => {
      const length = (el as SVGPathElement).getTotalLength();
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    };

    routesIn.forEach(setDashHidden);
    routesOut.forEach(setDashHidden);
    lanes.forEach(setDashHidden);

    gsap.set([hubsOrigin, hubCentral, hubsDestination, nodes], { scale: 0, transformOrigin: 'center center' });
    gsap.set(labels, { opacity: 0, y: 4 });
    gsap.set([locationCodes, refNumbers, manifestRows, handlingMark], { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.5 });

    // Phase 1: Origins appear, converging routes draw downward
    tl.to(hubsOrigin, {
      scale: 1,
      duration: 0.35,
      stagger: STAGGER.tight,
      ease: 'back.out(1.8)',
    });

    tl.to(routesIn, {
      strokeDashoffset: 0,
      duration: 1.0,
      stagger: STAGGER.loose,
      ease: 'power2.inOut',
    }, '-=0.15');

    // Phase 2: Central hub pops as routes arrive
    tl.to(hubCentral, {
      scale: 1,
      duration: 0.4,
      ease: 'back.out(2.5)',
    }, '-=0.3');

    // Phase 3: Diverging routes draw outward, destinations appear
    tl.to(routesOut, {
      strokeDashoffset: 0,
      duration: 1.0,
      stagger: STAGGER.loose,
      ease: 'power2.inOut',
    }, '-=0.15');

    tl.to(hubsDestination, {
      scale: 1,
      duration: 0.35,
      stagger: STAGGER.tight,
      ease: 'back.out(1.8)',
    }, '-=0.4');

    // Phase 4: Supporting details cascade in
    tl.to(lanes, {
      strokeDashoffset: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.inOut',
    }, '-=0.6');

    tl.to(nodes, {
      scale: 1,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.out',
    }, '-=0.5');

    tl.to(labels, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out',
    }, '-=0.3');

    tl.to(locationCodes, {
      opacity: 1,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power2.out',
    }, '-=0.2');

    tl.to(refNumbers, {
      opacity: 1,
      duration: 0.35,
      stagger: 0.05,
      ease: 'power2.out',
    }, '-=0.2');

    tl.to([manifestRows, handlingMark], {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.15');

    return () => { tl.kill(); };
  });
</script>

<svelte:window onscroll={handleScroll} />

<section id="hero" class="hero-section relative overflow-hidden px-container">
  <!-- Document margin signals -->
  <div class="hero-doc-margin" aria-hidden="true">
    <span class="hero-doc-margin-mark hero-doc-margin-top"></span>
    <span class="hero-doc-margin-mark hero-doc-margin-mid"></span>
    <span class="hero-doc-margin-mark hero-doc-margin-bot"></span>
    <span class="hero-doc-fold" aria-hidden="true"></span>
  </div>

  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="hero-blueprint-field">
      <div class="hero-blueprint-grid"></div>
      <div class="hero-blueprint-frame"></div>
      <svg bind:this={blueprintSvg} class="hero-blueprint-map" viewBox="0 0 440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="rgba(0,80,47,0.40)" />
          </marker>
        </defs>

        <!-- ═══ GUIDE LINES ═══ -->
        <!-- Vertical guides -->
        <path class="guide" d="M70 30V930" />
        <path class="guide" d="M220 30V930" />
        <path class="guide" d="M370 30V930" />
        <!-- Horizontal guides — mark the five topology zones -->
        <path class="guide" d="M40 120H400" />
        <path class="guide" d="M40 320H400" />
        <path class="guide" d="M40 460H400" />
        <path class="guide" d="M40 620H400" />
        <path class="guide" d="M40 800H400" />

        <!-- ═══ ROUTES — converging top half (origins → waist) ═══ -->
        <path class="route route-in" d="M55 80V270H140V270V460H220" marker-end="url(#arrowhead)" />
        <path class="route route-in" d="M150 60V200H140V270" marker-end="url(#arrowhead)" />
        <path class="route route-in" d="M220 100V460" marker-end="url(#arrowhead)" />
        <path class="route route-in" d="M310 70V210H320V340H220V460" marker-end="url(#arrowhead)" />
        <path class="route route-in" d="M390 110V220H320V340" marker-end="url(#arrowhead)" />

        <!-- ═══ ROUTES — diverging bottom half (waist → destinations) ═══ -->
        <path class="route route-out" d="M220 500V600H130V740H60V880" marker-end="url(#arrowhead)" />
        <path class="route route-out" d="M130 740V760H160V900" marker-end="url(#arrowhead)" />
        <path class="route route-out" d="M220 500V860" marker-end="url(#arrowhead)" />
        <path class="route route-out" d="M220 500V580H310V660V760H300V900" marker-end="url(#arrowhead)" />
        <path class="route route-out" d="M310 760H380V880" marker-end="url(#arrowhead)" />

        <!-- ═══ LANES — secondary branch connections ═══ -->
        <path class="lane" d="M55 80H55V130H100" />
        <path class="lane" d="M390 110H400V170H360" />
        <path class="lane" d="M140 270H80V310" />
        <path class="lane" d="M320 340H380V390" />
        <path class="lane" d="M220 460H280V500" />
        <path class="lane" d="M220 460H160V500" />
        <path class="lane" d="M130 740H70V780" />
        <path class="lane" d="M310 760H370V800" />
        <path class="lane" d="M60 880H60V920H100" />
        <path class="lane" d="M380 880H400V920H360" />

        <!-- ═══ TICK MARKS along routes ═══ -->
        <!-- Top half ticks -->
        <line class="tick" x1="52" y1="140" x2="58" y2="140" />
        <line class="tick" x1="52" y1="200" x2="58" y2="200" />
        <line class="tick" x1="147" y1="130" x2="153" y2="130" />
        <line class="tick" x1="217" y1="180" x2="223" y2="180" />
        <line class="tick" x1="217" y1="280" x2="223" y2="280" />
        <line class="tick" x1="307" y1="140" x2="313" y2="140" />
        <line class="tick" x1="387" y1="170" x2="393" y2="170" />
        <!-- Waist ticks -->
        <line class="tick" x1="217" y1="430" x2="223" y2="430" />
        <line class="tick" x1="217" y1="530" x2="223" y2="530" />
        <!-- Bottom half ticks -->
        <line class="tick" x1="127" y1="670" x2="133" y2="670" />
        <line class="tick" x1="57" y1="810" x2="63" y2="810" />
        <line class="tick" x1="217" y1="700" x2="223" y2="700" />
        <line class="tick" x1="217" y1="790" x2="223" y2="790" />
        <line class="tick" x1="307" y1="710" x2="313" y2="710" />
        <line class="tick" x1="377" y1="830" x2="383" y2="830" />

        <!-- ═══ HUB LABELS ═══ -->
        <!-- Top origins -->
        <text class="hub-label" x="55" y="68">SUPPLIER</text>
        <text class="hub-label" x="150" y="48">FACTORY</text>
        <text class="hub-label" x="220" y="88">WAREHOUSE</text>
        <text class="hub-label" x="310" y="58">PLANT</text>
        <text class="hub-label" x="390" y="98">VENDOR</text>
        <!-- Collection hubs -->
        <text class="hub-label" x="140" y="258">COLLECT</text>
        <text class="hub-label" x="320" y="328">STAGING</text>
        <!-- Waist — consolidation -->
        <text class="hub-label" x="220" y="448">CONSOL</text>
        <text class="hub-label" x="220" y="512">X-DOCK</text>
        <!-- Distribution hubs -->
        <text class="hub-label" x="130" y="588">DECON</text>
        <text class="hub-label" x="310" y="648">DIST</text>
        <!-- Bottom destinations -->
        <text class="hub-label" x="60" y="868">RETAIL</text>
        <text class="hub-label" x="160" y="888">DC-SUR</text>
        <text class="hub-label" x="220" y="848">PORT</text>
        <text class="hub-label" x="300" y="888">DC-NORTE</text>
        <text class="hub-label" x="380" y="868">E-COMM</text>

        <!-- ═══ HUB CIRCLES ═══ -->
        <!-- Top origins (wide spread y:60-110) -->
        <circle class="hub hub-origin" cx="55" cy="80" r="8" />
        <circle class="hub hub-origin" cx="150" cy="60" r="8" />
        <circle class="hub hub-origin" cx="220" cy="100" r="9" />
        <circle class="hub hub-origin" cx="310" cy="70" r="8" />
        <circle class="hub hub-origin" cx="390" cy="110" r="8" />
        <!-- Collection hubs (y:270, 340) -->
        <circle class="hub hub-origin" cx="140" cy="270" r="10" />
        <circle class="hub hub-origin" cx="320" cy="340" r="10" />
        <!-- Waist — consolidation + cross-dock (y:460, 500) -->
        <circle class="hub hub-central" cx="220" cy="460" r="13" />
        <circle class="hub hub-central" cx="220" cy="500" r="10" />
        <!-- Distribution hubs (y:600, 660) -->
        <circle class="hub hub-destination" cx="130" cy="600" r="10" />
        <circle class="hub hub-destination" cx="310" cy="660" r="10" />
        <!-- Bottom destinations (wide spread y:860-900) -->
        <circle class="hub hub-destination" cx="60" cy="880" r="8" />
        <circle class="hub hub-destination" cx="160" cy="900" r="8" />
        <circle class="hub hub-destination" cx="220" cy="860" r="9" />
        <circle class="hub hub-destination" cx="300" cy="900" r="8" />
        <circle class="hub hub-destination" cx="380" cy="880" r="8" />

        <!-- ═══ WAYPOINT NODES (small) ═══ -->
        <circle class="node" cx="100" cy="130" r="4" />
        <circle class="node" cx="360" cy="170" r="4" />
        <circle class="node" cx="80" cy="310" r="4" />
        <circle class="node" cx="380" cy="390" r="4" />
        <circle class="node" cx="280" cy="500" r="4" />
        <circle class="node" cx="160" cy="500" r="4" />
        <circle class="node" cx="130" cy="740" r="4" />
        <circle class="node" cx="310" cy="760" r="4" />
        <circle class="node" cx="70" cy="780" r="4" />
        <circle class="node" cx="370" cy="800" r="4" />
        <circle class="node" cx="100" cy="920" r="4" />
        <circle class="node" cx="360" cy="920" r="4" />

        <!-- ═══ CONTAINER SLOT CLUSTERS ═══ -->
        <!-- Near collect-W hub -->
        <rect class="slot" x="56" y="282" width="20" height="9" rx="1" />
        <rect class="slot" x="80" y="282" width="20" height="9" rx="1" />
        <rect class="slot" x="56" y="296" width="20" height="9" rx="1" />
        <rect class="slot" x="80" y="296" width="20" height="9" rx="1" />
        <rect class="slot" x="104" y="282" width="20" height="9" rx="1" />

        <!-- Near consolidation hub (waist) -->
        <rect class="slot" x="248" y="440" width="20" height="9" rx="1" />
        <rect class="slot" x="272" y="440" width="20" height="9" rx="1" />
        <rect class="slot" x="296" y="440" width="20" height="9" rx="1" />
        <rect class="slot" x="248" y="454" width="20" height="9" rx="1" />
        <rect class="slot" x="272" y="454" width="20" height="9" rx="1" />
        <rect class="slot" x="296" y="454" width="20" height="9" rx="1" />

        <!-- Near dist-N hub -->
        <rect class="slot" x="334" y="672" width="20" height="9" rx="1" />
        <rect class="slot" x="358" y="672" width="20" height="9" rx="1" />
        <rect class="slot" x="382" y="672" width="20" height="9" rx="1" />
        <rect class="slot" x="334" y="686" width="20" height="9" rx="1" />
        <rect class="slot" x="358" y="686" width="20" height="9" rx="1" />

        <!-- ═══ LOCATION CODES (LATAM 3-letter) ═══ -->
        <!-- Origins -->
        <text class="location-code" x="55" y="100">GYE</text>
        <text class="location-code" x="150" y="80">UIO</text>
        <text class="location-code" x="220" y="122">BOG</text>
        <text class="location-code" x="310" y="90">MDE</text>
        <text class="location-code" x="390" y="130">CLO</text>
        <!-- Collection / consolidation -->
        <text class="location-code" x="140" y="290">CTG</text>
        <text class="location-code" x="320" y="360">PTY</text>
        <text class="location-code" x="220" y="480">MIA</text>
        <!-- Distribution -->
        <text class="location-code" x="130" y="620">VCP</text>
        <text class="location-code" x="310" y="680">GIG</text>
        <!-- Destinations -->
        <text class="location-code" x="60" y="900">SCL</text>
        <text class="location-code" x="160" y="920">LIM</text>
        <text class="location-code" x="220" y="880">MVD</text>
        <text class="location-code" x="300" y="920">EZE</text>
        <text class="location-code" x="380" y="900">GRU</text>

        <!-- ═══ REFERENCE NUMBERS in whitespace ═══ -->
        <text class="ref-number" x="42" y="180">045-84291763</text>
        <text class="ref-number" x="340" y="240">MSCU4821903</text>
        <text class="ref-number" x="42" y="410">LCL &gt; FCL</text>
        <text class="ref-number" x="320" y="550">FOB CTG</text>
        <text class="ref-number" x="42" y="720">DDP MEX</text>
        <text class="ref-number" x="340" y="850">40HC</text>

        <!-- ═══ MANIFEST TABLE ═══ -->
        <g class="manifest-rows">
          <line x1="42" y1="550" x2="150" y2="550" />
          <line x1="42" y1="558" x2="150" y2="558" />
          <line x1="42" y1="566" x2="150" y2="566" />
          <line x1="42" y1="574" x2="150" y2="574" />
          <line x1="42" y1="582" x2="150" y2="582" />
          <line x1="42" y1="590" x2="150" y2="590" />
          <!-- Column dividers -->
          <line x1="80" y1="548" x2="80" y2="592" stroke-dasharray="2 2" />
          <line x1="118" y1="548" x2="118" y2="592" stroke-dasharray="2 2" />
        </g>

        <!-- ═══ HANDLING MARK — this side up ═══ -->
        <g class="handling-mark">
          <polygon points="370,140 385,120 400,140" />
          <line x1="366" y1="144" x2="404" y2="144" />
        </g>
      </svg>
    </div>
  </div>

  <div
    class="hero-content relative z-10 mx-auto grid w-full max-w-7xl items-center gap-y-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0"
  >
    <!-- Left column: narrative -->
    <div class="flex flex-col lg:col-span-7">
      <div use:reveal class="hero-doc-ref-strip mb-6" data-reveal aria-hidden="true">
        <span class="hero-doc-ref-id">EREA / LOGISTICS</span>
        <span class="hero-doc-ref-dash">—</span>
        <span class="hero-doc-ref-class">PRACTICE BRIEF</span>
        <span class="hero-doc-ref-date">{currentYear}</span>
      </div>

      <div use:reveal class="hero-kicker-block mb-5" data-reveal>
        <div class="hero-kicker-row">
          <span class="hero-kicker-rule" aria-hidden="true"></span>
          <p class="hero-brand-name mb-0">{t.hero.kicker}</p>
        </div>
        <p class="hero-kicker-sub">{t.hero.kickerSub}</p>
      </div>

      <h1
        use:reveal={{ y: 28 }}
        class="hero-title mb-6 max-w-[26ch] font-serif font-bold text-text-primary"
        data-reveal
      >
        {t.hero.title}
      </h1>

      <p
        use:reveal={{ delay: 0.08 }}
        class="hero-subtitle mb-8 max-w-[32rem] text-text-secondary"
        data-reveal
      >
        {t.hero.subtitle}
      </p>

      <div
        use:reveal={{ delay: 0.14 }}
        class="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3"
        data-reveal
      >
        <a
          href="#contact"
          onclick={(e) => {
            e.preventDefault();
            scrollToSection('contact');
          }}
          class="hero-cta-primary"
        >
          <span class="hero-cta-ref" aria-hidden="true">OPS</span>
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

      <div use:reveal={{ delay: 0.2 }} class="hero-manifest-strip mt-4" data-reveal>
        <span class="hero-manifest-strip-label" aria-hidden="true">ROUTING</span>
        <span class="hero-manifest-strip-rule" aria-hidden="true"></span>
        {#each t.hero.notePills as pill, i}
          <span class="hero-manifest-strip-item">
            <span class="hero-manifest-strip-code" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {pill}
          </span>
        {/each}
      </div>
    </div>

    <!-- Right column: metrics manifest panel -->
    <div
      use:stagger={{ selector: '.hero-proof-stat', stagger: 0.08, y: 20 }}
      class="hero-proof-band lg:col-span-5 lg:row-start-1 lg:col-start-8 lg:self-start lg:mt-4"
      role="region"
      aria-label="Indicadores de impacto"
    >
      <div class="hero-proof-header">
        <span class="hero-proof-header-title">{t.hero.statusBadge}</span>
        <span class="hero-proof-header-ref" aria-hidden="true">REF: ELS-{currentYear}</span>
        <span class="hero-proof-header-class" aria-hidden="true">FIELD DATA</span>
      </div>

      <div class="hero-proof-meta" aria-hidden="true">
        <span class="hero-proof-meta-field">DOC: OPS-RPT-{currentYear}-Q1</span>
        <span class="hero-proof-meta-sep">|</span>
        <span class="hero-proof-meta-field">CLASS: OPERATIONAL</span>
        <span class="hero-proof-meta-sep">|</span>
        <span class="hero-proof-meta-field">REV: 04</span>
      </div>

      <div class="hero-proof-grid">
        {#each t.hero.stats as stat, i}
          {@const parsed = parseStatValue(stat.value)}
          <div class="hero-proof-stat">
            <div class="hero-proof-field-head">
              <span class="hero-proof-ref" aria-hidden="true">KPI-0{i + 1}</span>
              <span class="hero-proof-label">{stat.label}</span>
              <span class="hero-proof-field-reg" aria-hidden="true">§{i + 1}.{(i + 1) * 2}</span>
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
        <span class="hero-proof-page" aria-hidden="true">1/1</span>
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
    height: 1.5px;
    background: var(--color-brand-42);
  }

  .hero-brand-name {
    font-size: 0.92rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent-deep);
    line-height: 1;
  }

  .hero-kicker-sub {
    margin: 0;
    padding-left: calc(2.4rem + 0.75rem);
    font-size: 0.84rem;
    color: var(--color-text-secondary);
    line-height: 1.3;
  }

  /* ── Headline ── */
  .hero-title {
    font-size: clamp(2.4rem, 4vw, 3.5rem);
    line-height: 1.08;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  /* ── Subtitle ── */
  .hero-subtitle {
    font-size: clamp(1.02rem, 0.98rem + 0.25vw, 1.18rem);
    line-height: 1.48;
    letter-spacing: -0.008em;
  }

  /* ── Manifest routing strip ── */
  .hero-manifest-strip {
    display: flex;
    align-items: center;
    gap: 0;
    border-top: 1px solid var(--color-brand-14);
    border-bottom: 1px solid var(--color-brand-14);
    padding: 0.4rem 0;
  }

  .hero-manifest-strip-label {
    font-family: var(--font-sans);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: var(--color-brand-28);
    text-transform: uppercase;
    flex-shrink: 0;
    padding-right: 0.6rem;
  }

  .hero-manifest-strip-rule {
    width: 1px;
    height: 18px;
    background: var(--color-brand-16);
    flex-shrink: 0;
  }

  .hero-manifest-strip-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.15rem 0.65rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    border-right: 1px solid var(--color-brand-10);
    line-height: 1;
  }

  .hero-manifest-strip-item:last-child {
    border-right: none;
  }

  .hero-manifest-strip-code {
    font-family: var(--font-sans);
    font-size: 0.56rem;
    font-weight: 700;
    color: var(--color-brand-36);
    font-variant-numeric: tabular-nums;
  }

  /* ── Hero CTA — document action ── */
  .hero-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem 0.55rem 0;
    font-size: 0.92rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--color-bg-card);
    background: var(--color-accent-deep);
    border: none;
    border-left: 3.5px solid var(--color-accent);
    text-decoration: none;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .hero-cta-ref {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 0.5rem;
    margin-right: 0.15rem;
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-accent);
    background: rgba(255, 255, 255, 0.08);
    align-self: stretch;
  }

  .hero-cta-primary:hover {
    background: var(--color-gradient-deep);
    border-left-color: var(--color-accent-soft);
  }

  .hero-cta-primary:active {
    background: var(--color-accent-deep);
  }

  .hero-cta-arrow {
    display: inline-block;
    transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .hero-cta-primary:hover .hero-cta-arrow {
    transform: translateX(3px);
  }

  .hero-cta-primary:active .hero-cta-arrow {
    transform: translateX(1px);
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
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: min(48vw, 580px);
    height: 100%;
    opacity: 1;
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.3) 18%, rgba(0, 0, 0, 0.65) 38%, rgba(0, 0, 0, 0.65) 62%, rgba(0, 0, 0, 0.3) 82%, transparent 100%),
      linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 8%, rgba(0, 0, 0, 0.85) 25%, rgba(0, 0, 0, 0.85) 75%, rgba(0, 0, 0, 0.5) 92%, transparent 100%);
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
  }

  .hero-blueprint-grid,
  .hero-blueprint-frame,
  .hero-blueprint-map {
    position: absolute;
    inset: 0;
  }

  .hero-blueprint-grid {
    background-image:
      linear-gradient(rgba(var(--color-brand-rgb), 0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(var(--color-brand-rgb), 0.055) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.78) 66%, transparent 100%);
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
    font-weight: 600;
    text-transform: uppercase;
    fill: rgba(var(--color-brand-rgb), 0.40);
    text-anchor: middle;
  }

  .hero-blueprint-map .location-code {
    font-family: var(--font-sans);
    font-size: 7.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    fill: rgba(var(--color-brand-rgb), 0.34);
    text-anchor: middle;
  }

  .hero-blueprint-map .ref-number {
    font-family: var(--font-sans);
    font-size: 7px;
    letter-spacing: 0.04em;
    fill: rgba(var(--color-brand-rgb), 0.24);
    font-variant-numeric: tabular-nums;
  }

  .hero-blueprint-map .manifest-rows line {
    stroke: rgba(var(--color-brand-rgb), 0.18);
    stroke-width: 0.75;
  }

  .hero-blueprint-map .handling-mark polygon {
    fill: none;
    stroke: rgba(var(--color-brand-rgb), 0.22);
    stroke-width: 1.2;
  }

  .hero-blueprint-map .handling-mark line {
    stroke: rgba(var(--color-brand-rgb), 0.22);
    stroke-width: 1.2;
  }

  /* ── Document margin signals ── */
  .hero-doc-margin {
    position: absolute;
    left: clamp(8px, 1.5vw, 20px);
    top: 0;
    bottom: 0;
    width: 1px;
    pointer-events: none;
    z-index: 1;
  }

  .hero-doc-margin-mark {
    position: absolute;
    left: 0;
    width: 8px;
    height: 1px;
    background: var(--color-brand-22);
  }

  .hero-doc-margin-top {
    top: 18%;
  }

  .hero-doc-margin-mid {
    top: 50%;
  }

  .hero-doc-margin-bot {
    top: 82%;
  }

  .hero-doc-fold {
    position: absolute;
    right: auto;
    left: 0;
    top: 50%;
    width: 1px;
    height: 24px;
    transform: translateY(-50%);
    background: var(--color-brand-28);
  }

  .hero-doc-fold::before {
    content: '⊢';
    position: absolute;
    top: 50%;
    left: 4px;
    transform: translateY(-50%);
    font-size: 0.5rem;
    color: var(--color-brand-22);
  }

  /* ── Document reference strip ── */
  .hero-doc-ref-strip {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .hero-doc-ref-id {
    font-family: var(--font-sans);
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--color-brand-36);
    text-transform: uppercase;
  }

  .hero-doc-ref-dash {
    font-size: 0.56rem;
    color: var(--color-brand-16);
  }

  .hero-doc-ref-class {
    font-family: var(--font-sans);
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--color-brand-28);
    text-transform: uppercase;
  }

  .hero-doc-ref-date {
    font-family: var(--font-sans);
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-brand-22);
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }

  /* ── Hero section layout ── */
  .hero-section {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    padding-top: clamp(48px, 5vw, 64px);
  }

  .hero-content {
    flex: 1;
    align-content: center;
  }

  /* ── Metrics manifest panel ── */
  .hero-proof-band {
    background: var(--color-bg-card);
    border: 1.5px solid var(--color-brand-22);
    position: relative;
    z-index: 2;
  }

  /* Corner crop marks — document registration (asymmetric) */
  .hero-proof-band::before,
  .hero-proof-band::after {
    content: '';
    position: absolute;
    pointer-events: none;
    z-index: 1;
  }

  .hero-proof-band::before {
    top: -8px;
    left: -8px;
    width: 24px;
    height: 24px;
    border-top: 2px solid var(--color-brand-42);
    border-left: 2px solid var(--color-brand-42);
  }

  .hero-proof-band::after {
    bottom: -5px;
    right: -5px;
    width: 14px;
    height: 14px;
    border-bottom: 1.5px solid var(--color-brand-28);
    border-right: 1.5px solid var(--color-brand-28);
  }

  /* Stamped document header */
  .hero-proof-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1rem;
    background: var(--color-brand-5);
    border-top: 2px solid var(--color-brand-36);
    border-bottom: 1.5px solid var(--color-brand-22);
  }

  .hero-proof-header-title {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-accent-deep);
  }

  .hero-proof-header-ref {
    font-size: 0.56rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-36);
    font-variant-numeric: tabular-nums;
  }

  .hero-proof-header-class {
    margin-left: auto;
    font-size: 0.5rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent-deep);
    border: 1px solid var(--color-brand-28);
    padding: 0.1rem 0.4rem;
    line-height: 1.3;
  }

  .hero-proof-meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 1rem;
    border-bottom: 1px dashed var(--color-brand-14);
    background: var(--color-brand-3);
  }

  .hero-proof-meta-field {
    font-family: var(--font-sans);
    font-size: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--color-brand-36);
    font-variant-numeric: tabular-nums;
  }

  .hero-proof-meta-sep {
    font-size: 0.5rem;
    color: var(--color-brand-16);
  }

  .hero-proof-grid {
    display: grid;
    grid-template-columns: 1fr;
    padding: 0;
  }

  .hero-proof-stat {
    position: relative;
    padding: 1rem 1rem 1.1rem;
    min-height: 7rem;
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
    margin-bottom: 0.45rem;
  }

  .hero-proof-ref {
    font-family: var(--font-sans);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-bg-card);
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

  .hero-proof-field-reg {
    font-family: var(--font-sans);
    font-size: 0.48rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--color-brand-22);
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }

  .hero-proof-value-row {
    display: flex;
    align-items: baseline;
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
    padding: 0.6rem 1rem;
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
    flex: 1;
  }

  .hero-proof-page {
    font-family: var(--font-sans);
    font-size: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  /* ── Scroll prompt ── */
  .scroll-prompt {
    display: flex;
    justify-content: center;
    padding-bottom: clamp(0.8rem, 1.5vh, 1.5rem);
    padding-top: clamp(0.5rem, 1vh, 1rem);
    color: var(--color-text-tertiary);
    opacity: 0.6;
    transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    animation: scroll-bob 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
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
      width: min(56vw, 480px);
      height: 100%;
      opacity: 0.6;
      mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.25) 15%, rgba(0, 0, 0, 0.55) 35%, rgba(0, 0, 0, 0.55) 65%, rgba(0, 0, 0, 0.25) 85%, transparent 100%),
        linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 0.8) 28%, rgba(0, 0, 0, 0.8) 72%, rgba(0, 0, 0, 0.5) 90%, transparent 100%);
      -webkit-mask-composite: source-in;
    mask-composite: intersect;
    }
  }

  @media (max-width: 768px) {
    .hero-section {
      min-height: auto;
    }

    .hero-doc-margin {
      display: none;
    }

    .hero-manifest-strip {
      flex-wrap: wrap;
      gap: 0.2rem;
    }

    .hero-manifest-strip-rule {
      display: none;
    }

    .hero-manifest-strip-item {
      border-right: none;
      padding: 0.15rem 0.4rem;
    }

    .hero-doc-ref-date {
      margin-left: 0;
    }

    .hero-blueprint-field {
      top: 0;
      width: 70vw;
      height: 100%;
      opacity: 0.25;
      mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.3) 80%, transparent 100%),
        linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 15%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.5) 85%, transparent 100%);
      -webkit-mask-composite: source-in;
    mask-composite: intersect;
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
    .hero-cta-primary {
      transition: none;
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
