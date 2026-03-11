<script lang="ts">
  import { getContent } from '$lib/stores/lang.svelte';
  import { scrollToSection } from '$lib/animations/gsap';
  import BrandMark from './BrandMark.svelte';

  let t = $derived(getContent());
</script>

<footer class="px-container py-10 relative">
  <div class="divider-thin absolute top-0 left-0 right-0"></div>
  <div class="mx-auto max-w-7xl flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
    <div class="flex items-center gap-4">
      <BrandMark size={38} />
      <div>
        <div class="font-medium text-text-primary">{t.brand.name}</div>
        <div class="text-sm text-text-secondary">{t.footer.tagline}</div>
      </div>
    </div>

    <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
      <a href="#about" onclick={(e) => { e.preventDefault(); scrollToSection('about'); }} class="hover:text-text-primary">{t.footer.nav.about}</a>
      <a href="#transformation" onclick={(e) => { e.preventDefault(); scrollToSection('transformation'); }} class="hover:text-text-primary">{t.footer.nav.transformation}</a>
      <a href="#impact" onclick={(e) => { e.preventDefault(); scrollToSection('impact'); }} class="hover:text-text-primary">{t.footer.nav.impact}</a>
      <a href="#contact" onclick={(e) => { e.preventDefault(); scrollToSection('contact'); }} class="hover:text-text-primary">{t.footer.nav.contact}</a>
    </div>

    <div class="text-sm text-text-tertiary">
      © {new Date().getFullYear()} {t.footer.company}
    </div>
  </div>
</footer>
