<script lang="ts">
  import { getContent } from '$lib/stores/lang.svelte';
  import { scrollToSection } from '$lib/animations/gsap';
  import BrandMark from './BrandMark.svelte';

  let t = $derived(getContent());
  const year = new Date().getFullYear();
</script>

<footer class="footer-document px-container py-10 relative">
  <div class="footer-border-double"></div>
  <div class="mx-auto max-w-7xl flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
    <div class="flex items-center gap-4">
      <BrandMark size={38} />
      <div class="flex items-center gap-3">
        <div>
          <div class="font-medium text-text-primary">{t.brand.name}</div>
          <div class="text-sm text-text-secondary">{t.footer.tagline}</div>
        </div>
        <div class="footer-barcode" aria-hidden="true">
          {#each Array(10) as _, i}
            <span class="footer-bar" style:width="{i % 3 === 0 ? 2.5 : 1.2}px"></span>
          {/each}
        </div>
      </div>
    </div>

    <nav aria-label="Footer" class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
      <a href="#about" onclick={(e) => { e.preventDefault(); scrollToSection('about'); }} class="hover:text-text-primary">{t.footer.nav.about}</a>
      <a href="#transformation" onclick={(e) => { e.preventDefault(); scrollToSection('transformation'); }} class="hover:text-text-primary">{t.footer.nav.transformation}</a>
      <a href="#impact" onclick={(e) => { e.preventDefault(); scrollToSection('impact'); }} class="hover:text-text-primary">{t.footer.nav.impact}</a>
      <a href="#contact" onclick={(e) => { e.preventDefault(); scrollToSection('contact'); }} class="hover:text-text-primary">{t.footer.nav.contact}</a>
    </nav>

    <div class="flex items-center gap-4">
      <div class="text-sm text-text-tertiary">
        &copy; {year} {t.footer.company}
      </div>
      <span class="footer-doc-ref" aria-hidden="true">DOC: EREA-{year}</span>
    </div>
  </div>
</footer>

<style>
  .footer-border-double {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    border-top: 1.5px solid var(--color-brand-22);
    border-bottom: 1px dashed var(--color-brand-14);
    padding-top: 4px;
  }

  .footer-doc-ref {
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .footer-barcode {
    display: flex;
    align-items: stretch;
    gap: 1.5px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.22;
  }

  .footer-bar {
    display: block;
    background: var(--color-text-primary);
    border-radius: 0.5px;
  }

  @media (max-width: 768px) {
    .footer-barcode {
      display: none;
    }

    .footer-doc-ref {
      display: none;
    }
  }
</style>
