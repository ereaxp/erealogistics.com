<script lang="ts">
  import { sectionTracker } from '$lib/stores/sectionTracker.svelte';

  const year = new Date().getFullYear();
</script>

<div
  class="doc-footer"
  class:doc-footer-visible={sectionTracker.visible}
  aria-hidden="true"
>
  <span class="doc-footer-text" lang="en">§{sectionTracker.activeSection.num} {sectionTracker.activeSection.label}</span>
  <span class="doc-footer-sep doc-footer-text">·</span>
  <span class="doc-footer-text" lang="en">DOC: EREA-{year}</span>
  <span class="doc-footer-sep doc-footer-text">·</span>
  <span class="doc-footer-text" lang="en">PAGE {sectionTracker.activeIndex + 1}/{sectionTracker.sections.length}</span>
  <span class="doc-footer-sep doc-footer-text">·</span>
  <span class="doc-footer-text" lang="en">STATUS: {sectionTracker.activeSection.status}</span>
</div>

<style>
  .doc-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 32px;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: var(--color-bg-primary);
    border-top: 1px solid var(--color-border-subtle);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .doc-footer-visible {
    opacity: 1;
  }

  .doc-footer-text {
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
  }

  .doc-footer-sep {
    color: var(--color-brand-14);
  }

  @media (max-width: 1023px) {
    .doc-footer {
      display: none;
    }
  }
</style>
