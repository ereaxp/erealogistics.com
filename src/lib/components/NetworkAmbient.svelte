<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gsap, ScrollTrigger, prefersReducedMotion } from '$lib/animations/gsap';

  let containerEl: HTMLDivElement;

  onMount(() => {
    if (!containerEl) return;

    // Use matchMedia so GSAP auto-kills ScrollTriggers when viewport goes below 1024px
    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': () => {
        if (prefersReducedMotion()) {
          const allGroups = containerEl.querySelectorAll('[class^="ambient-"]');
          allGroups.forEach((g) => { gsap.set(g, { opacity: 0 }); });
          gsap.set(containerEl.querySelector('.ambient-routes'), { opacity: 1 });
          gsap.set(containerEl.querySelector('.ambient-hubs-central'), { opacity: 1 });
          gsap.set(containerEl, { opacity: 0.04 });
          return;
        }

        gsap.set(containerEl, { opacity: 0 });

        ScrollTrigger.create({
          trigger: '#hero',
          start: 'bottom top',
          onEnterBack: () => gsap.to(containerEl, { opacity: 0, duration: 0.4 }),
          onLeave: () => gsap.to(containerEl, { opacity: 1, duration: 0.6 }),
        });

        const ticks = containerEl.querySelector('.ambient-ticks');
        const manifest = containerEl.querySelector('.ambient-manifest');
        const refs = containerEl.querySelector('.ambient-refs');
        const lanes = containerEl.querySelector('.ambient-lanes');
        const slots = containerEl.querySelector('.ambient-slots');
        const codes = containerEl.querySelector('.ambient-codes');
        const nodes = containerEl.querySelector('.ambient-nodes');
        const routes = containerEl.querySelector('.ambient-routes');
        const hubsOrigin = containerEl.querySelector('.ambient-hubs-origin');
        const hubsCentral = containerEl.querySelector('.ambient-hubs-central');
        const hubsDest = containerEl.querySelector('.ambient-hubs-dest');

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: 'body',
            start: () => {
              const hero = document.getElementById('hero');
              return hero ? `top+=${hero.offsetHeight}px top` : 'top top';
            },
            end: 'bottom bottom',
            scrub: true,
          },
        });

        masterTl.to([ticks, manifest, refs], { opacity: 0, duration: 0.2 }, 0);
        masterTl.to([lanes, slots], { opacity: 0, duration: 0.2 }, 0.2);
        masterTl.to([codes, nodes], { opacity: 0, duration: 0.2 }, 0.4);
        masterTl.to([hubsOrigin, routes], { opacity: 0, duration: 0.2 }, 0.6);
        masterTl.to(hubsDest, { opacity: 0, duration: 0.15 }, 0.8);
        masterTl.to(hubsCentral, { opacity: 0.5, duration: 0.2 }, 0.85);

        // matchMedia cleanup: GSAP auto-reverts all ScrollTriggers/tweens created in this scope
      },
    });
  });
</script>

<div
  bind:this={containerEl}
  class="ambient-network-wrapper"
  aria-hidden="true"
>
  <svg
    class="ambient-network"
    viewBox="0 0 440 960"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- ═══ TICK MARKS ═══ -->
    <g class="ambient-ticks">
      <!-- Top half ticks -->
      <line x1="52" y1="140" x2="58" y2="140" />
      <line x1="52" y1="200" x2="58" y2="200" />
      <line x1="147" y1="130" x2="153" y2="130" />
      <line x1="217" y1="180" x2="223" y2="180" />
      <line x1="217" y1="280" x2="223" y2="280" />
      <line x1="307" y1="140" x2="313" y2="140" />
      <line x1="387" y1="170" x2="393" y2="170" />
      <!-- Waist ticks -->
      <line x1="217" y1="430" x2="223" y2="430" />
      <line x1="217" y1="530" x2="223" y2="530" />
      <!-- Bottom half ticks -->
      <line x1="127" y1="670" x2="133" y2="670" />
      <line x1="57" y1="810" x2="63" y2="810" />
      <line x1="217" y1="700" x2="223" y2="700" />
      <line x1="217" y1="790" x2="223" y2="790" />
      <line x1="307" y1="710" x2="313" y2="710" />
      <line x1="377" y1="830" x2="383" y2="830" />
    </g>

    <!-- ═══ MANIFEST TABLE ═══ -->
    <g class="ambient-manifest">
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

    <!-- ═══ REFERENCE NUMBERS ═══ -->
    <g class="ambient-refs">
      <text x="42" y="180">045-84291763</text>
      <text x="340" y="240">MSCU4821903</text>
      <text x="42" y="410">LCL &gt; FCL</text>
      <text x="320" y="550">FOB CTG</text>
      <text x="42" y="720">DDP SCL</text>
      <text x="340" y="850">40HC</text>
    </g>

    <!-- ═══ SECONDARY LANES ═══ -->
    <g class="ambient-lanes">
      <path d="M55 80H55V130H100" />
      <path d="M390 110H400V170H360" />
      <path d="M140 270H80V310" />
      <path d="M320 340H380V390" />
      <path d="M220 460H280V500" />
      <path d="M220 460H160V500" />
      <path d="M220 460V500" />
      <path d="M130 740H70V780" />
      <path d="M310 760H370V800" />
      <path d="M60 880H60V920H100" />
      <path d="M380 880H400V920H360" />
    </g>

    <!-- ═══ CONTAINER SLOTS ═══ -->
    <g class="ambient-slots">
      <!-- Near collect-W hub -->
      <rect x="56" y="282" width="20" height="9" rx="1" />
      <rect x="80" y="282" width="20" height="9" rx="1" />
      <rect x="56" y="296" width="20" height="9" rx="1" />
      <rect x="80" y="296" width="20" height="9" rx="1" />
      <rect x="104" y="282" width="20" height="9" rx="1" />
      <!-- Near consolidation hub (waist) -->
      <rect x="248" y="440" width="20" height="9" rx="1" />
      <rect x="272" y="440" width="20" height="9" rx="1" />
      <rect x="296" y="440" width="20" height="9" rx="1" />
      <rect x="248" y="454" width="20" height="9" rx="1" />
      <rect x="272" y="454" width="20" height="9" rx="1" />
      <rect x="296" y="454" width="20" height="9" rx="1" />
      <!-- Near dist-N hub -->
      <rect x="334" y="672" width="20" height="9" rx="1" />
      <rect x="358" y="672" width="20" height="9" rx="1" />
      <rect x="382" y="672" width="20" height="9" rx="1" />
      <rect x="334" y="686" width="20" height="9" rx="1" />
      <rect x="358" y="686" width="20" height="9" rx="1" />
    </g>

    <!-- ═══ LOCATION CODES ═══ -->
    <g class="ambient-codes">
      <!-- Origins -->
      <text x="55" y="100">GYE</text>
      <text x="150" y="80">UIO</text>
      <text x="220" y="122">BOG</text>
      <text x="310" y="90">MDE</text>
      <text x="390" y="130">CLO</text>
      <!-- Collection / consolidation -->
      <text x="140" y="290">CTG</text>
      <text x="320" y="360">PTY</text>
      <text x="220" y="480">MIA</text>
      <!-- Distribution -->
      <text x="130" y="620">VCP</text>
      <text x="310" y="680">GIG</text>
      <!-- Destinations -->
      <text x="60" y="900">SCL</text>
      <text x="160" y="920">LIM</text>
      <text x="220" y="880">MVD</text>
      <text x="300" y="920">EZE</text>
      <text x="380" y="900">GRU</text>
    </g>

    <!-- ═══ WAYPOINT NODES ═══ -->
    <g class="ambient-nodes">
      <circle cx="100" cy="130" r="4" />
      <circle cx="360" cy="170" r="4" />
      <circle cx="80" cy="310" r="4" />
      <circle cx="380" cy="390" r="4" />
      <circle cx="280" cy="500" r="4" />
      <circle cx="160" cy="500" r="4" />
      <circle cx="130" cy="740" r="7" />
      <circle cx="310" cy="760" r="4" />
      <circle cx="70" cy="780" r="4" />
      <circle cx="370" cy="800" r="4" />
      <circle cx="100" cy="920" r="4" />
      <circle cx="360" cy="920" r="4" />
    </g>

    <!-- ═══ ROUTES ═══ -->
    <g class="ambient-routes">
      <!-- Converging top half (origins → waist) -->
      <path d="M55 80V270H140" />
      <path d="M150 60V100 L140 270" />
      <path d="M220 100V460" />
      <path d="M310 70V210 L320 340 L220 460" />
      <path d="M390 110V200 L320 340" />
      <!-- Diverging bottom half (waist → destinations) -->
      <path d="M220 500V600H130" />
      <path d="M220 500V580 L310 660" />
      <path d="M130 600V740" />
      <path d="M310 660V760 L300 900" />
      <path d="M130 740H60V880" />
      <path d="M130 740V760 L160 900" />
      <path d="M220 500V860" />
      <path d="M310 760L380 880" />
      <path d="M130 740V760 L60 880" />
    </g>

    <!-- ═══ ORIGIN HUBS ═══ -->
    <g class="ambient-hubs-origin">
      <circle cx="55" cy="80" r="8" />
      <circle cx="150" cy="60" r="8" />
      <circle cx="220" cy="100" r="9" />
      <circle cx="310" cy="70" r="8" />
      <circle cx="390" cy="110" r="8" />
      <!-- Collection hubs -->
      <circle cx="140" cy="270" r="10" />
      <circle cx="320" cy="340" r="10" />
    </g>

    <!-- ═══ CENTRAL HUBS ═══ -->
    <g class="ambient-hubs-central">
      <circle cx="220" cy="460" r="13" />
      <circle cx="220" cy="500" r="10" />
    </g>

    <!-- ═══ DESTINATION HUBS ═══ -->
    <g class="ambient-hubs-dest">
      <!-- Distribution hubs -->
      <circle cx="130" cy="600" r="10" />
      <circle cx="310" cy="660" r="10" />
      <!-- Bottom destinations -->
      <circle cx="60" cy="880" r="8" />
      <circle cx="160" cy="900" r="8" />
      <circle cx="220" cy="860" r="9" />
      <circle cx="300" cy="900" r="8" />
      <circle cx="380" cy="880" r="8" />
    </g>
  </svg>
</div>

<style>
  .ambient-network-wrapper {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
  }

  .ambient-network {
    fill: none;
    stroke: rgba(var(--color-brand-rgb), 0.06);
    stroke-width: 1;
    width: auto;
    height: 100%;
    max-height: 100vh;
  }

  .ambient-network circle {
    fill: rgba(var(--color-brand-rgb), 0.04);
    stroke: rgba(var(--color-brand-rgb), 0.06);
  }

  .ambient-network text {
    fill: rgba(var(--color-brand-rgb), 0.05);
    font-size: 7px;
    font-family: var(--font-sans);
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  .ambient-network rect {
    fill: rgba(var(--color-brand-rgb), 0.03);
    stroke: rgba(var(--color-brand-rgb), 0.05);
  }

  .ambient-network line {
    stroke: rgba(var(--color-brand-rgb), 0.05);
  }

  @media (max-width: 1023px) {
    .ambient-network-wrapper {
      display: none;
    }
  }
</style>
