<script lang="ts">
  import { lang, getContent } from '$lib/stores/lang.svelte';
  import { scrollToSection } from '$lib/animations/gsap';
  import { sectionTracker } from '$lib/stores/sectionTracker.svelte';
  import BrandMark from './BrandMark.svelte';

  let { mobileOpen = $bindable(false) } = $props();

  let t = $derived(getContent());
  let scrolled = $state(false);

  // Map section IDs to nav content keys (only where they differ)
  const navKeyOverrides: Record<string, string> = {
    methodology: 'value',
  };

  const navSections = $derived(
    sectionTracker.sections.map((s) => ({
      id: s.id,
      key: (navKeyOverrides[s.id] ?? s.id) as keyof typeof t.nav,
    }))
  );

  let activeSection = $derived(sectionTracker.visible ? sectionTracker.activeSection.id : '');

  function handleScroll() {
    const next = window.scrollY > 24;
    if (next !== scrolled) scrolled = next;
  }

  function scrollTo(id: string) {
    mobileOpen = false;
    scrollToSection(id);
  }

  let hamburgerBtn = $state<HTMLButtonElement | null>(null);
  let mobileMenuEl = $state<HTMLElement | null>(null);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && mobileOpen) {
      mobileOpen = false;
      hamburgerBtn?.focus();
      return;
    }

    if (e.key === 'Tab' && mobileOpen && mobileMenuEl) {
      const focusable = mobileMenuEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  $effect(() => {
    if (mobileOpen && mobileMenuEl) {
      const firstLink = mobileMenuEl.querySelector<HTMLElement>('a[href], button');
      firstLink?.focus();
    }
  });
</script>

<svelte:window onscroll={handleScroll} onkeydown={handleKeydown} />

<nav
  class="fixed top-0 left-0 right-0 z-50 px-container transition-[backdrop-filter,background-color,border-color] duration-300"
  class:backdrop-blur-sm={scrolled}
  style="background-color: {scrolled ? 'color-mix(in srgb, var(--color-bg-primary) 94%, white)' : 'transparent'}; border-bottom: {scrolled ? '1px solid var(--color-border-subtle)' : '1px solid transparent'};"
>
  <div class="mx-auto grid max-w-7xl grid-cols-[minmax(132px,1fr)_auto_minmax(132px,1fr)] items-center gap-2 py-1.5">
    <a href="#hero" onclick={(e) => { e.preventDefault(); scrollToSection('hero'); }} class="flex items-center gap-3">
      <BrandMark />
    </a>

    <div class="hidden items-center justify-center gap-3 lg:flex">
      {#each navSections as section}
        <a
          href="#{section.id}"
          onclick={(e) => { e.preventDefault(); scrollTo(section.id); }}
          aria-current={section.id === activeSection ? 'location' : undefined}
          class="text-label uppercase transition-colors duration-200 hover:text-text-primary {section.id === activeSection ? 'font-semibold text-accent-deep' : 'text-text-secondary'}"
        >
          {t.nav[section.key]}
        </a>
      {/each}
    </div>

    <div class="flex items-center justify-end gap-2 sm:gap-3">
      <button
        onclick={() => lang.toggle()}
        class="nav-lang-toggle text-label uppercase text-text-tertiary transition-colors duration-200 hover:text-text-primary"
        aria-label={lang.current === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      >
        {lang.current === 'es' ? 'EN' : 'ES'}
      </button>

      <button
        bind:this={hamburgerBtn}
        class="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 border-none bg-transparent p-2 opacity-80 transition-opacity duration-200 hover:opacity-100 lg:hidden"
        onclick={() => (mobileOpen = !mobileOpen)}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span class="block h-[2px] w-5 bg-text-primary transition-all duration-300" style="transform: {mobileOpen ? 'rotate(45deg) translateY(4px)' : 'none'}"></span>
        <span class="block h-[2px] w-5 bg-text-primary transition-all duration-300" style="opacity: {mobileOpen ? 0 : 1}"></span>
        <span class="block h-[2px] w-5 bg-text-primary transition-all duration-300" style="transform: {mobileOpen ? 'rotate(-45deg) translateY(-4px)' : 'none'}"></span>
      </button>
    </div>
  </div>

  <div
    bind:this={mobileMenuEl}
    id="mobile-menu"
    class="mobile-menu lg:hidden"
    class:mobile-menu-open={mobileOpen}
    aria-hidden={!mobileOpen}
  >
    <div class="mobile-menu-inner bg-bg-primary" style="border-top: 1px solid var(--color-border-subtle); margin-left: calc(-1 * var(--spacing-container)); margin-right: calc(-1 * var(--spacing-container));">
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-container py-4">
        {#each navSections as section, i}
          <a
            href="#{section.id}"
            onclick={(e) => { e.preventDefault(); scrollTo(section.id); }}
            aria-current={section.id === activeSection ? 'location' : undefined}
            tabindex={mobileOpen ? 0 : -1}
            class="mobile-nav-link min-h-11 flex items-center text-label uppercase transition-colors duration-200 hover:text-text-primary {section.id === activeSection ? 'mobile-nav-link-active text-accent-deep' : 'text-text-secondary'}"
            style="transition-delay: {mobileOpen ? i * 40 : 0}ms;"
          >
            {t.nav[section.key]}
          </a>
        {/each}

        <a
          href="#contact"
          onclick={(e) => { e.preventDefault(); scrollTo('contact'); }}
          tabindex={mobileOpen ? 0 : -1}
          class="button-primary mt-2 w-full px-4 py-3 text-center text-sm"
          style="transition-delay: {mobileOpen ? navSections.length * 40 : 0}ms;"
        >
          {t.nav.cta}
        </a>
      </div>
    </div>
  </div>
</nav>

<style>
  .nav-lang-toggle {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: none;
  }

  .mobile-nav-link-active {
    border-left: 2px solid var(--color-accent);
    padding-left: 0.75rem;
  }

  .mobile-menu {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s var(--ease-out-expo);
  }

  .mobile-menu-open {
    grid-template-rows: 1fr;
  }

  .mobile-menu-inner {
    overflow: hidden;
  }

  .mobile-menu .mobile-nav-link,
  .mobile-menu :global(.button-primary) {
    opacity: 0;
    transform: translateY(-6px);
    transition: opacity 0.25s var(--ease-out-expo), transform 0.25s var(--ease-out-expo), color 0.2s ease;
  }

  .mobile-menu-open .mobile-nav-link,
  .mobile-menu-open :global(.button-primary) {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .mobile-menu {
      transition: none;
    }

    .mobile-menu .mobile-nav-link,
    .mobile-menu :global(.button-primary) {
      transition: color 0.2s ease;
      opacity: 1;
      transform: none;
    }
  }
</style>
