<script lang="ts">
  import { lang, getContent } from '$lib/stores/lang.svelte';
  import { scrollToSection } from '$lib/animations/gsap';
  import BrandMark from './BrandMark.svelte';

  let { mobileOpen = $bindable(false) } = $props();

  let t = $derived(getContent());
  let scrolled = $state(false);
  let scrollProgress = $state(0);
  let activeSection = $state('');

  const sections = [
    { id: 'about', key: 'about' as const },
    { id: 'transformation', key: 'transformation' as const },
    { id: 'impact', key: 'impact' as const },
    { id: 'team', key: 'team' as const },
    { id: 'contact', key: 'contact' as const }
  ];

  let scrollRafPending = false;

  function handleScroll() {
    if (scrollRafPending) return;
    scrollRafPending = true;
    requestAnimationFrame(() => {
      scrolled = window.scrollY > 24;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      scrollRafPending = false;
    });
  }

  function scrollTo(id: string) {
    mobileOpen = false;
    activeSection = id;
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

  $effect(() => {
    if (typeof document === 'undefined') return;
    const ids = ['hero', ...sections.map((section) => section.id)];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id === 'hero' ? '' : entry.target.id;
          }
        }
      },
      { threshold: 0, rootMargin: '-12% 0px -55% 0px' }
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  });
</script>

<svelte:window onscroll={handleScroll} onkeydown={handleKeydown} />

<nav
  class="fixed top-0 left-0 right-0 z-50 px-container transition-[backdrop-filter,background-color,border-color] duration-300"
  class:backdrop-blur-sm={scrolled}
  style="background-color: {scrolled ? 'color-mix(in srgb, var(--color-bg-primary) 94%, white)' : 'transparent'}; border-bottom: {scrolled ? '1px solid var(--color-border-subtle)' : '1px solid transparent'};"
>
  <div
    class="absolute bottom-0 left-0 h-[2px] bg-[color:var(--color-accent)]"
    style="width: 100vw; transform: scaleX({scrollProgress / 100}); transform-origin: left;"
    aria-hidden="true"
  ></div>

  <div class="mx-auto grid max-w-7xl grid-cols-[minmax(132px,1fr)_auto_minmax(132px,1fr)] items-center gap-3 py-2.5">
    <a href="#hero" onclick={(e) => { e.preventDefault(); scrollToSection('hero'); }} class="flex items-center gap-3">
      <BrandMark />
    </a>

    <div class="hidden items-center justify-center gap-5 lg:flex">
      {#each sections as section}
        <a
          href="#{section.id}"
          onclick={(e) => { e.preventDefault(); scrollTo(section.id); }}
          aria-current={section.id === activeSection ? 'true' : undefined}
          class="text-label uppercase transition-colors duration-200 hover:text-text-primary {section.id === activeSection ? 'font-semibold text-[color:var(--color-accent-deep)]' : 'text-text-secondary'}"
        >
          {t.nav[section.key]}
        </a>
      {/each}
    </div>

    <div class="flex items-center justify-end gap-0.5 sm:gap-1">
      <button
        onclick={() => lang.toggle()}
        class="px-2.5 py-2 text-label uppercase text-text-tertiary transition-colors duration-200 hover:text-text-primary hover:underline underline-offset-4"
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

  {#if mobileOpen}
    <div
      bind:this={mobileMenuEl}
      id="mobile-menu"
      class="bg-[color:var(--color-bg-primary)] lg:hidden"
      style="border-top: 1px solid var(--color-border-subtle); margin-left: calc(-1 * var(--spacing-container)); margin-right: calc(-1 * var(--spacing-container));"
    >
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-container py-4">
        {#each sections as section}
          <a
            href="#{section.id}"
            onclick={(e) => { e.preventDefault(); scrollTo(section.id); }}
            aria-current={section.id === activeSection ? 'true' : undefined}
            class="py-3 text-label uppercase transition-colors duration-200 hover:text-text-primary {section.id === activeSection ? 'text-[color:var(--color-accent-deep)]' : 'text-text-secondary'}"
          >
            {t.nav[section.key]}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</nav>
