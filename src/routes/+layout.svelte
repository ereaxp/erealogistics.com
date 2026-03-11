<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initSmoothScroll, destroySmoothScroll } from '$lib/animations/gsap';
  import { lang, getContent } from '$lib/stores/lang.svelte';
  import { base } from '$app/paths';
  import Toast from '$lib/components/ui/Toast.svelte';

  let { children } = $props();

  let t = $derived(getContent());
  let canonical = $derived(`https://erealogistics.com/${lang.current === 'en' ? '?lang=en' : ''}`);

  onMount(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  });
</script>

<svelte:head>
  <title>{t.seo.title}</title>
  <meta name="description" content={t.seo.description} />
  <link rel="icon" type="image/svg+xml" href="{base}/favicon.svg" />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={t.seo.title} />
  <meta property="og:description" content={t.seo.description} />
  <meta property="og:url" content="https://erealogistics.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content={lang.current === 'es' ? 'es_LA' : 'en_US'} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t.seo.title} />
  <meta name="twitter:description" content={t.seo.description} />
  <link rel="alternate" hreflang="es" href="https://erealogistics.com/?lang=es" />
  <link rel="alternate" hreflang="en" href="https://erealogistics.com/?lang=en" />
  <link rel="alternate" hreflang="x-default" href="https://erealogistics.com/" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.brand.name,
    description: t.seo.description,
    url: 'https://erealogistics.com/',
    parentOrganization: {
      '@type': 'Organization',
      name: t.footer.company
    }
  })}</script>`}
</svelte:head>

{@render children()}
<Toast />
