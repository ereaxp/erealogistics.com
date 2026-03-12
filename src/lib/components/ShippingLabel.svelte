<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gsap, prefersReducedMotion } from '$lib/animations/gsap';
  import { encodeCode128Positioned } from '$lib/utils/barcode';

  let { name, company, email, onComplete }: { name: string; company: string; email: string; onComplete: () => void } = $props();

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const ref = `ELS-${year}-${month}${day}-${hour}${minute}`;

  const barcodeInput = `${ref}-${email}`;
  const { bars, totalWidth } = encodeCode128Positioned(barcodeInput);

  let labelEl: HTMLDivElement;
  let rows: NodeListOf<HTMLElement>;
  let tl: gsap.core.Timeline | undefined;
  let rmTimer: ReturnType<typeof setTimeout> | undefined;

  onMount(() => {
    rows = labelEl.querySelectorAll<HTMLElement>('.sl-row');

    if (prefersReducedMotion()) {
      gsap.set(labelEl, { opacity: 1 });
      gsap.set(rows, { opacity: 1 });
      rmTimer = setTimeout(onComplete, 100);
      return;
    }

    gsap.set(labelEl, { opacity: 0, y: 6 });
    gsap.set(rows, { opacity: 0, x: -4 });

    tl = gsap.timeline();
    tl.to(labelEl, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    tl.to(rows, { opacity: 1, x: 0, duration: 0.25, stagger: 0.06, ease: 'power2.out' }, '-=0.1');
    tl.call(onComplete, undefined, '+=1.6');
  });

  onDestroy(() => {
    if (tl) tl.kill();
    if (rmTimer) clearTimeout(rmTimer);
  });
</script>

<div bind:this={labelEl} class="sl" lang="en">
  <div class="sl-header">
    <span class="sl-header-title">SHIPMENT CONFIRMATION</span>
    <span class="sl-header-ref">DOC: {ref}</span>
    <span class="sl-header-status">DISPATCHED</span>
  </div>
  <div class="sl-body">
    <div class="sl-row sl-grid-row">
      <span class="sl-field-label">ORIGIN</span>
      <span class="sl-field-value">EREA LOGISTICS SERVICES</span>
    </div>
    <div class="sl-row sl-grid-row">
      <span class="sl-field-label">DESTINATION</span>
      <span class="sl-field-value">{name}, {company}</span>
    </div>
    <div class="sl-row sl-grid-row">
      <span class="sl-field-label">CONTACT</span>
      <span class="sl-field-value">{email}</span>
    </div>
    <div class="sl-row sl-grid-row">
      <span class="sl-field-label">DATE</span>
      <span class="sl-field-value">{year}-{month}-{day} {hour}:{minute} UTC</span>
    </div>
    <div class="sl-row sl-barcode-row" aria-hidden="true">
      <svg viewBox="0 0 {totalWidth} 24" width="100%" height="24" preserveAspectRatio="none">
        {#each bars as bar}
          {#if bar.black}
            <rect x={bar.x} y="0" width={bar.width} height="24" fill="currentColor" />
          {/if}
        {/each}
      </svg>
    </div>
  </div>
  <div class="sl-footer">
    <span>EREA CONSULTING GROUP</span>
    <span>STATUS: CONFIRMED</span>
    <span>REV: 01</span>
  </div>
</div>

<style>
  .sl {
    width: 100%;
    opacity: 0;
  }

  .sl-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .sl-header-title {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-text-primary);
  }

  .sl-header-ref {
    font-size: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-36);
    font-variant-numeric: tabular-nums;
  }

  .sl-header-status {
    margin-left: auto;
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent-deep);
  }

  .sl-body {
    padding: 0;
  }

  .sl-grid-row {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
    align-items: baseline;
  }

  .sl-row {
    padding: 0.4rem 1rem;
    border-bottom: 1px dashed var(--color-brand-10);
  }

  .sl-row:last-child {
    border-bottom: none;
  }

  .sl-field-label {
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-brand-36);
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
  }

  .sl-field-value {
    font-size: 0.85rem;
    color: var(--color-text-primary);
    font-weight: 500;
    text-transform: uppercase;
  }

  .sl-barcode-row {
    padding: 0.5rem 1rem;
    color: var(--color-text-primary);
    opacity: 0.6;
  }

  .sl-footer {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.4rem 1rem;
    border-top: 1px solid var(--color-border-subtle);
    font-size: 0.48rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
  }
</style>
