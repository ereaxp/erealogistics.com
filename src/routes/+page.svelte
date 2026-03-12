<script lang="ts">
  import { onMount } from 'svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import DocumentFooter from '$lib/components/DocumentFooter.svelte';
  import NetworkAmbient from '$lib/components/NetworkAmbient.svelte';

  import ShipmentTracker from '$lib/components/ShipmentTracker.svelte';
  import ShippingLabel from '$lib/components/ShippingLabel.svelte';
  import { reveal, stagger } from '$lib/animations/actions';
  import { gsap, ScrollTrigger, scrollToSection, prefersReducedMotion } from '$lib/animations/gsap';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { getContent } from '$lib/stores/lang.svelte';
  import { sectionTracker } from '$lib/stores/sectionTracker.svelte';

  let t = $derived(getContent());
  let mobileOpen = $state(false);
  let auditChecked = $state<boolean[]>([]);
  let auditCount = $derived(auditChecked.filter(Boolean).length);
  let routeConnectors = $state<HTMLDivElement[]>([]);
  const currentYear = new Date().getFullYear();

  let showLabel = $state(false);
  let labelData = $state({ name: '', company: '', email: '' });
  let formSubmitting = $state(false);

  function handleDemoSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (formSubmitting) return;
    formSubmitting = true;
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const formName = (data.get('name') as string) || '';
    const formCompany = (data.get('company') as string) || '';
    const formEmail = (data.get('email') as string) || '';
    const formTopic = (data.get('topic') as string) || '';
    const formMessage = (data.get('message') as string) || '';

    labelData = { name: formName, company: formCompany, email: formEmail };
    showLabel = true;

    const body = `${t.contact.form.nameLabel}: ${formName}\n${t.contact.form.companyLabel}: ${formCompany}\n${t.contact.form.emailLabel}: ${formEmail}\n${t.contact.form.topicLabel}: ${formTopic}\n\n${formMessage}`;
    const mailto = `mailto:${t.contact.email}?subject=${encodeURIComponent(t.contact.emailSubject)}&body=${encodeURIComponent(body)}`;
    const mailWindow = window.open(mailto, '_blank');
    if (!mailWindow) {
      // Popup blocked or no mail client — try direct navigation as fallback
      window.location.href = mailto;
    }
    toastStore.push(t.contact.form.emailSent, 'info');
    setTimeout(() => { formSubmitting = false; }, 3000);
  }

  function handleLabelComplete() {
    setTimeout(() => { showLabel = false; }, 1800);
  }

  function animateConnector(el: HTMLDivElement) {
    const line = el.querySelector('.route-line line') as SVGLineElement;
    const dot = el.querySelector('.route-dot') as HTMLElement;
    if (!line || !dot) return null;

    const length = line.getTotalLength();
    const containerH = el.offsetHeight;
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(dot, { y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 70%',
        scrub: true,
      },
    });

    tl.to(line, { strokeDashoffset: 0, ease: 'none' }, 0);
    tl.to(dot, { y: containerH, ease: 'none' }, 0);
    return tl;
  }

  let auditItemCount = $derived(t.questions.items.length);
  $effect(() => {
    // Reset when item count changes; stable across language switches when count is equal
    auditChecked = new Array(auditItemCount).fill(false);
  });

  onMount(() => {
    sectionTracker.init();

    let timelines: (gsap.core.Timeline | null)[] = [];
    if (!prefersReducedMotion()) {
      timelines = routeConnectors.map(el => el ? animateConnector(el) : null);
    }

    return () => {
      timelines.forEach(tl => tl?.kill());
      sectionTracker.destroy();
    };
  });
</script>

{#snippet routeConnector(index: number)}
  <div class="route-connector" aria-hidden="true" bind:this={routeConnectors[index]}>
    <svg class="route-line" viewBox="0 0 2 100" preserveAspectRatio="none">
      <line x1="1" y1="0" x2="1" y2="100" stroke="var(--color-accent-deep)" stroke-width="1" />
    </svg>
    <div class="route-dot"></div>
  </div>
{/snippet}

<Nav bind:mobileOpen />
<ShipmentTracker />

<main id="main" inert={mobileOpen || undefined}>
  <Hero />

  {@render routeConnector(0)}

  <section id="about" class="px-container py-section-sm text-center" aria-labelledby="about-heading">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow mb-8">{t.about.label}</p>

      <h2 id="about-heading" use:reveal class="text-h2 mx-auto mb-12 max-w-[62rem] font-serif tracking-snug" data-reveal>
        {t.about.title}
      </h2>

      <div use:stagger={{ selector: '.about-block', stagger: 0.1 }} class="mx-auto max-w-[52rem]">
        <p class="about-block about-body-lg text-text-primary mb-6">
          {@html t.about.paragraphs[0]}
        </p>
        <p class="about-block about-body-lg text-text-primary">
          {t.about.paragraphs[1]}
        </p>
      </div>

      <p use:reveal class="about-closing-text mx-auto mt-10 max-w-[52rem]" data-reveal>
        {@html t.about.closing}
      </p>

      <div use:reveal class="about-discipline-strip mt-10" data-reveal aria-label={t.about.disciplinesLabel}>
        {#each t.about.disciplines as d, i}
          {#if i > 0}<span class="about-discipline-sep" aria-hidden="true">&middot;</span>{/if}
          <span class="about-discipline">{d}</span>
        {/each}
      </div>
    </div>
  </section>

  {@render routeConnector(1)}

  <section id="methodology" class="px-container py-section-sm" aria-labelledby="methodology-heading">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow mb-8">{t.value.label}</p>

      <h2 id="methodology-heading" use:reveal class="text-h2 mb-5 font-serif tracking-snug" data-reveal>{t.value.title}</h2>
      <p use:reveal={{ delay: 0.08 }} class="text-body-lg text-text-secondary mb-12 max-w-[52rem]" data-reveal>{t.value.description}</p>

      <div use:stagger={{ selector: '.value-field', stagger: 0.06 }} class="value-manifest" role="table" aria-label="Capabilities">
        <div class="value-manifest-header" role="row" lang="en">
          <span class="value-manifest-col" role="columnheader">REF</span>
          <span class="value-manifest-col" role="columnheader">CAPABILITY</span>
          <span class="value-manifest-col" role="columnheader">SCOPE</span>
          <span class="value-manifest-col value-manifest-col-status" role="columnheader">STATUS</span>
        </div>
        {#each t.value.items as item, i}
          <div class="value-field" role="row">
            <span class="value-field-ref" aria-hidden="true" lang="en">CAP-0{i + 1}</span>
            <div role="cell"><h3 class="value-field-title">{item.title}</h3></div>
            <div role="cell"><p class="value-field-scope text-text-secondary">{item.text}</p></div>
            <span class="value-field-status" aria-hidden="true" lang="en">ACTIVE</span>
          </div>
        {/each}
        <div class="value-manifest-footer" aria-hidden="true" lang="en">
          <span>DOC: ELS-CAP-{currentYear}</span>
          <span>REV: 02</span>
          <span>{t.value.items.length} OF {t.value.items.length} CAPABILITIES</span>
        </div>
      </div>
    </div>
  </section>

  {@render routeConnector(2)}

  <section id="transformation" class="px-container py-section-sm" aria-labelledby="transformation-heading">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow mb-5">{t.transformation.label}</p>
      <h2 id="transformation-heading" use:reveal class="text-h2 mb-4 font-serif tracking-snug" data-reveal>{t.transformation.title}</h2>
      <p use:reveal={{ delay: 0.08 }} class="text-body-lg text-text-secondary mb-8 max-w-[52rem]" data-reveal>{t.transformation.description}</p>

      <div use:stagger={{ selector: '.tf-item', stagger: 0.06 }} class="tf-grid">
        {#each t.transformation.items as item}
          <div class="tf-item">
            <div class="tf-item-num" aria-hidden="true">{item.number}</div>
            <h3 class="tf-item-title">{item.title}</h3>
            <p class="tf-item-text text-text-secondary">{item.text}</p>
            <p class="tf-item-impact">{item.impact}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section id="impact" class="px-container py-section-sm" aria-labelledby="impact-heading">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow mb-5">{t.impact.label}</p>
      <h2 id="impact-heading" use:reveal class="text-h2 mb-4 font-serif tracking-snug" data-reveal>{t.impact.title}</h2>
      <p use:reveal={{ delay: 0.08 }} class="text-body-lg text-text-secondary mb-10 max-w-[52rem]" data-reveal>{t.impact.description}</p>

      <div use:stagger={{ selector: '.kpi-cell', stagger: 0.05 }} class="kpi-scorecard">
        {#each t.impact.items as item, i}
          <div class="kpi-cell">
            <span class="kpi-cell-ref" aria-hidden="true" lang="en">KPI-0{i + 1}</span>
            <div class="kpi-cell-value">{item.value}</div>
            <p class="kpi-cell-label">{item.text}</p>
          </div>
        {/each}
      </div>

      <div class="mt-14">
        <p class="eyebrow mb-5">{t.cases.label}</p>
        <p use:reveal class="text-body-lg text-text-secondary mb-8 max-w-[52rem]" data-reveal>{t.cases.description}</p>
        <div use:stagger={{ selector: '.case-record', stagger: 0.06 }} class="case-grid">
          {#each t.cases.items as item}
            <article class="case-record">
              <div class="case-record-stat">{item.highlight}</div>
              <h3 class="case-record-title">{item.title}</h3>
              <p class="case-record-text text-text-secondary">{item.text}</p>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section id="questions" class="questions-section px-container py-section-sm" aria-labelledby="questions-heading">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow mb-5">{t.questions.label}</p>
      <h2 id="questions-heading" use:reveal class="text-h2 mb-8 font-serif tracking-snug" data-reveal>{t.questions.title}</h2>

      <div class="grid gap-8 lg:grid-cols-[1.28fr_0.72fr] lg:items-start">
        <div class="questions-audit-doc">
          <div class="questions-audit-header" lang="en">
            <span class="questions-audit-header-title">EXECUTIVE AUDIT</span>
            <span class="questions-audit-header-ref" aria-hidden="true">DOC: ELS-AUD-{currentYear}</span>
            <span class="questions-audit-header-count">{auditCount}/{t.questions.items.length}</span>
          </div>
          <div use:stagger={{ selector: '.question-item', stagger: 0.05 }} class="questions-audit-body">
            {#each t.questions.items as item, i}
              <button
                class="question-item questions-audit-row"
                class:questions-audit-row-checked={auditChecked[i]}
                onclick={() => { auditChecked[i] = !auditChecked[i]; }}
                type="button"
                aria-pressed={auditChecked[i]}
              >
                <span class="questions-audit-check" aria-hidden="true">{auditChecked[i] ? '✓' : '☐'}</span>
                <span class="text-body text-text-secondary flex-1 text-left">{item}</span>
              </button>
            {/each}
          </div>
          <div class="questions-audit-footer" lang="en">
            <span class="questions-audit-footer-meta" aria-hidden="true">STATUS: {auditCount === 0 ? 'PENDING REVIEW' : auditCount >= 3 ? 'ACTION REQUIRED' : 'IN REVIEW'}</span>
            <span class="questions-audit-footer-meta" aria-hidden="true">REV: 01</span>
          </div>
        </div>

        <div use:reveal data-reveal>
          <p class="mb-5 text-body text-text-secondary">{t.questions.description}</p>
          <p class="text-body text-text-secondary">
            {@html t.questions.closing}
          </p>
          {#if auditCount >= 3}
            <a
              href="#contact"
              onclick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              class="button-primary mt-6"
            >
              {t.questions.cta} →
            </a>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <section id="team" class="px-container py-section-sm" aria-labelledby="team-heading">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow mb-5">{t.team.label}</p>

      <div class="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 id="team-heading" use:reveal class="text-h2 mb-8 font-serif tracking-snug" data-reveal>{t.team.title}</h2>
          <div use:stagger={{ selector: '.team-paragraph', stagger: 0.08 }}>
            {#each t.team.paragraphs as paragraph}
              <p class="team-paragraph text-body-lg text-text-secondary not-last:mb-5">{paragraph}</p>
            {/each}
          </div>
        </div>

        <div use:reveal data-reveal>
          <h3 class="text-h3 mb-2 font-serif">{t.team.panelTitle}</h3>
          <p class="mb-4 text-body text-text-secondary">{t.team.panelText}</p>
          <div class="workflow-steps">
            {#each t.team.items as item, i}
              <div class="workflow-step">
                <span class="workflow-step-badge">{String(i + 1).padStart(2, '0')}</span>
                <div class="workflow-step-content">
                  <div class="mb-2 font-medium text-accent-deep">{item.title}</div>
                  <p class="text-sm text-text-secondary">{item.text}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="px-container py-section-sm" aria-labelledby="contact-heading">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow mb-5">{t.contact.label}</p>
      <h2 id="contact-heading" use:reveal class="text-h2 mb-3 font-serif tracking-snug" data-reveal>{t.contact.title}</h2>
      <p use:reveal={{ delay: 0.08 }} class="text-body-lg text-text-secondary mb-6" data-reveal>{t.contact.description}</p>

      <div class="grid gap-6 lg:grid-cols-[1.28fr_0.72fr] lg:items-start">
        <div class="relative">
        <form onsubmit={handleDemoSubmit} class="contact-form">
          <div class="contact-form-header" lang="en">
            <span class="contact-form-header-title">CONTACT FORM</span>
            <span class="contact-form-header-ref" aria-hidden="true">DOC: ELS-CTF-{currentYear}</span>
            <span class="contact-form-header-time">
              <svg class="inline-block flex-none" width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="6"/><path d="M7 4v3l2 1.5"/></svg>
              {t.contact.form.timeEstimate}
            </span>
          </div>
          <div class="contact-form-body">
            <div class="grid gap-3 md:grid-cols-2">
              <label class="block text-sm font-medium text-text-primary">
                <span class="mb-1 block">{t.contact.form.nameLabel}</span>
                <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-3 py-2.5" name="name" autocomplete="name" placeholder={t.contact.form.namePlaceholder} required maxlength={120} />
              </label>

              <label class="block text-sm font-medium text-text-primary">
                <span class="mb-1 block">{t.contact.form.companyLabel}</span>
                <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-3 py-2.5" name="company" autocomplete="organization" placeholder={t.contact.form.companyPlaceholder} required maxlength={120} />
              </label>

              <label class="block text-sm font-medium text-text-primary">
                <span class="mb-1 block">{t.contact.form.emailLabel}</span>
                <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-3 py-2.5" name="email" type="email" autocomplete="email" placeholder={t.contact.form.emailPlaceholder} required maxlength={254} />
              </label>

              <label class="block text-sm font-medium text-text-primary">
                <span class="mb-1 block">{t.contact.form.topicLabel}</span>
                <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-3 py-2.5" name="topic" placeholder={t.contact.form.topicPlaceholder} required maxlength={200} />
              </label>
            </div>

            <label class="mt-3 block text-sm font-medium text-text-primary">
              <span class="mb-1 block">{t.contact.form.messageLabel}</span>
              <textarea class="min-h-[56px] w-full rounded-[4px] border border-border-subtle bg-bg-card px-3 py-2.5" name="message" placeholder={t.contact.form.messagePlaceholder} maxlength={2000}></textarea>
            </label>

            <div class="mt-4 flex flex-wrap items-center gap-3">
              <button class="contact-send-btn" type="submit" disabled={formSubmitting}>
                {t.contact.form.emailCta} →
              </button>
              <a href="mailto:{t.contact.email}" class="contact-email-fallback">{t.contact.email}</a>
            </div>
          </div>
          <div class="contact-form-footer" lang="en">
            <span>DOC: ELS-CTF-{currentYear}</span>
            <span>REV: 01</span>
          </div>
        </form>
        {#if showLabel}
          <div class="contact-label-overlay" role="status" aria-label="Shipment confirmation">
            <ShippingLabel name={labelData.name} company={labelData.company} email={labelData.email} onComplete={handleLabelComplete} />
          </div>
        {/if}
        </div>

        <div use:reveal data-reveal>
          <h3 class="mb-2 text-[1.15rem] font-semibold">{t.contact.expectations.title}</h3>
          {#each t.contact.expectations.paragraphs as paragraph}
            <p class="text-body text-text-secondary not-last:mb-3">{paragraph}</p>
          {/each}

          <div class="mt-4 border-t border-brand-10">
            {#each t.contact.expectations.bullets as bullet}
              <div class="flex items-center gap-2 border-b border-dashed border-brand-10 py-2">
                <span class="text-sm font-medium text-accent-deep">{bullet}</span>
                <span aria-hidden="true" class="ml-auto text-xs text-accent">✓</span>
              </div>
            {/each}
          </div>

        </div>
      </div>
    </div>
  </section>
</main>

<Footer />
<NetworkAmbient />
<DocumentFooter />

<style>
  /* ── Route connector ── */
  .route-connector {
    position: relative;
    height: clamp(60px, 8vw, 120px);
    display: flex;
    justify-content: center;
    pointer-events: none;
  }
  .route-line {
    width: 1px;
    height: 100%;
  }
  .route-dot {
    position: absolute;
    top: 0;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-accent-deep);
    margin-left: -3px;
    will-change: transform;
  }

  /* ── About section ── */
  .about-body-lg :global(a) {
    color: var(--color-accent-deep);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid var(--color-brand-22);
    transition: border-color 0.2s ease;
  }

  .about-body-lg :global(a:hover) {
    border-bottom-color: var(--color-accent-deep);
  }

  .about-body-lg :global(a.external-link)::after {
    content: '↗';
    display: inline-block;
    font-size: 0.72em;
    margin-left: 0.2em;
    opacity: 0.55;
    transition: opacity 0.2s ease;
  }

  .about-body-lg :global(a.external-link:hover)::after {
    opacity: 1;
  }

  .about-body-lg :global(.sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .about-body-lg {
    font-size: clamp(1.12rem, 1rem + 0.45vw, 1.35rem);
    line-height: 1.55;
  }

  .about-closing-text {
    font-family: var(--font-sans);
    font-size: clamp(1.5rem, 2vw, 1.85rem);
    line-height: 1.4;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .about-closing-text :global(strong) {
    font-weight: 700;
    color: var(--color-accent-deep);
  }

  .about-discipline-strip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding-block: 1rem;
    border-top: 1px solid var(--color-brand-14);
    border-bottom: 1px solid var(--color-brand-14);
  }

  .about-discipline {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-accent-deep);
  }

  .about-discipline-sep {
    color: var(--color-brand-22);
    font-size: 0.85rem;
  }

  /* ── Value manifest ── */
  .value-manifest {
    border: 1px solid var(--color-border-subtle);
    border-top: 2px solid var(--color-accent-deep);
  }

  .value-manifest-header {
    display: none;
  }

  @media (min-width: 768px) {
    .value-manifest-header {
      display: grid;
      grid-template-columns: 4.5rem minmax(auto, 0.8fr) 1.6fr 5rem;
      gap: 0;
      padding: 0.45rem 1rem;
      background: var(--color-bg-secondary);
      border-bottom: 1px solid var(--color-border-subtle);
    }
  }

  .value-manifest-col {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--color-brand-36);
    text-transform: uppercase;
  }

  .value-manifest-col-status {
    text-align: right;
  }

  .value-field {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.25rem;
    padding: 1rem;
    border-bottom: 1px dashed var(--color-brand-10);
    transition: background-color 0.15s ease;
  }

  .value-field:last-of-type {
    border-bottom: none;
  }

  @media (hover: hover) {
    .value-field:hover {
      background: var(--color-brand-3);
    }
  }

  @media (min-width: 768px) {
    .value-field {
      grid-template-columns: 4.5rem minmax(auto, 0.8fr) 1.6fr 5rem;
      gap: 0;
      align-items: baseline;
    }
  }

  .value-field-ref {
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
    padding-top: 0.1rem;
  }

  .value-field-title {
    font-size: clamp(1rem, 1.1vw, 1.15rem);
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text-primary);
  }

  .value-field-scope {
    font-size: clamp(0.92rem, 0.9rem + 0.15vw, 1.02rem);
  }

  .value-field-status {
    font-size: 0.5rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-accent-deep);
    text-align: right;
    display: none;
  }

  @media (min-width: 768px) {
    .value-field-status {
      display: block;
    }
  }

  .value-manifest-footer {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.4rem 1rem;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-subtle);
    font-size: 0.48rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
  }

  /* ── Transformation grid ── */
  .tf-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    border-top: 2px solid var(--color-accent-deep);
  }

  .tf-item {
    padding: 1rem 0;
    border-bottom: 1px dashed var(--color-brand-14);
  }

  .tf-item-num {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-accent-deep);
    margin-bottom: 0.5rem;
    font-variant-numeric: tabular-nums;
  }

  .tf-item-title {
    font-family: var(--font-sans);
    font-size: clamp(0.95rem, 1vw, 1.08rem);
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-text-primary);
    margin-bottom: 0.4rem;
  }

  .tf-item-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .tf-item-impact {
    font-size: 0.8rem;
    color: var(--color-accent-deep);
    margin-top: 0.5rem;
    font-weight: 500;
  }

  @media (min-width: 640px) {
    .tf-grid {
      grid-template-columns: 1fr 1fr;
    }

    .tf-item:nth-child(even) {
      padding-left: 1rem;
      border-left: 1px dashed var(--color-brand-14);
    }

    .tf-item:nth-child(odd) {
      padding-right: 1rem;
    }
  }

  @media (min-width: 1024px) {
    .tf-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .tf-item:nth-child(even) {
      padding-left: 0;
      border-left: none;
    }

    .tf-item:nth-child(odd) {
      padding-right: 0;
    }

    .tf-item {
      padding: 1rem 1rem 1rem 0;
    }

    .tf-item:not(:nth-child(3n+1)) {
      padding-left: 1rem;
      border-left: 1px dashed var(--color-brand-14);
    }

    .tf-item:nth-child(3n+1) {
      padding-right: 1rem;
    }
  }

  /* ── KPI scorecard ── */
  .kpi-scorecard {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-top: 2px solid var(--color-accent-deep);
    border-left: 1px solid var(--color-brand-10);
  }

  @media (min-width: 768px) {
    .kpi-scorecard {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .kpi-cell {
    padding: 1.25rem 1rem;
    border-right: 1px solid var(--color-brand-10);
    border-bottom: 1px solid var(--color-brand-10);
    transition: background-color 0.15s ease;
  }

  @media (hover: hover) {
    .kpi-cell:hover {
      background: var(--color-brand-3);
    }
  }

  .kpi-cell-ref {
    display: block;
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-brand-28);
    margin-bottom: 0.6rem;
    font-variant-numeric: tabular-nums;
  }

  .kpi-cell-value {
    font-family: var(--font-serif);
    font-size: clamp(1.8rem, 2.5vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-accent-deep);
    line-height: 1;
    margin-bottom: 0.6rem;
  }

  .kpi-cell-label {
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--color-text-secondary);
  }

  /* ── Case grid ── */
  .case-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    border-top: 2px solid var(--color-accent-deep);
  }

  @media (min-width: 768px) {
    .case-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .case-record {
    padding: 1.25rem 0;
    border-bottom: 1px dashed var(--color-brand-10);
  }

  @media (min-width: 768px) {
    .case-record {
      padding: 1.25rem;
    }

    .case-record:nth-child(odd) {
      padding-left: 0;
      padding-right: 1.25rem;
    }

    .case-record:nth-child(even) {
      border-left: 1px dashed var(--color-brand-10);
      padding-left: 1.25rem;
      padding-right: 0;
    }
  }

  .case-record-stat {
    font-family: var(--font-serif);
    font-size: clamp(1.1rem, 1.3vw, 1.3rem);
    font-weight: 700;
    color: var(--color-accent-deep);
    letter-spacing: -0.01em;
    margin-bottom: 0.4rem;
  }

  .case-record-title {
    font-family: var(--font-sans);
    font-size: clamp(0.95rem, 1vw, 1.05rem);
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.3;
    margin-bottom: 0.3rem;
  }

  .case-record-text {
    font-size: 0.88rem;
    line-height: 1.5;
  }

  /* ── Questions: Audit document ── */
  .questions-section {
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-brand-10);
    border-bottom: 1px solid var(--color-brand-10);
  }

  .questions-audit-doc {
    border: 1.5px solid var(--color-border-medium);
    background: var(--color-bg-card);
  }

  .questions-audit-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    background: var(--color-bg-card);
    border-top: 2px solid var(--color-accent-deep);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .questions-audit-header-title {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-text-primary);
  }

  .questions-audit-header-ref {
    font-size: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-36);
    font-variant-numeric: tabular-nums;
  }

  .questions-audit-header-count {
    margin-left: auto;
    font-size: 0.48rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-brand-36);
    border: 1px solid var(--color-border-subtle);
    padding: 0.1rem 0.4rem;
    line-height: 1.3;
  }

  .questions-audit-body {
    display: grid;
    grid-template-columns: 1fr;
  }

  .questions-audit-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    min-height: 44px;
    border: none;
    border-bottom: 1px dashed var(--color-brand-10);
    background: transparent;
    cursor: pointer;
    width: 100%;
    font-family: inherit;
    transition: background-color 0.15s ease;
  }

  .questions-audit-row:last-of-type {
    border-bottom: none;
  }

  @media (hover: hover) {
    .questions-audit-row:hover {
      background: var(--color-brand-3);
    }
  }

  .questions-audit-row-checked {
    background: var(--color-brand-3);
  }

  .questions-audit-row-checked .questions-audit-check {
    color: var(--color-accent);
  }

  .questions-audit-check {
    font-size: 1.15rem;
    line-height: 1;
    color: var(--color-brand-36);
    flex-shrink: 0;
    transition: color 0.15s ease;
  }

  .questions-audit-footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.4rem 0.75rem;
    background: var(--color-bg-card);
    border-top: 1px solid var(--color-border-subtle);
  }

  .questions-audit-footer-meta {
    font-size: 0.48rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
  }

  .contact-label-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-card);
    border: 1.5px solid var(--color-border-medium);
    border-top: 2px solid var(--color-accent-deep);
  }

  .contact-send-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.65rem 1.25rem;
    min-height: 44px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-bg-card);
    background: var(--color-accent-deep);
    border: none;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.15s ease;
  }

  @media (hover: hover) {
    .contact-send-btn:hover:not(:disabled) {
      background: var(--color-gradient-deep);
    }
  }

  .contact-send-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .contact-email-fallback {
    font-size: 0.78rem;
    color: var(--color-text-tertiary);
    text-decoration: none;
    border-bottom: 1px dashed var(--color-brand-22);
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  @media (hover: hover) {
    .contact-email-fallback:hover {
      color: var(--color-accent-deep);
      border-color: var(--color-accent-deep);
    }
  }

  /* ── Contact form document ── */
  .contact-form {
    border: 1.5px solid var(--color-border-medium);
    background: var(--color-bg-card);
  }

  .contact-form-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    background: var(--color-bg-secondary);
    border-top: 2px solid var(--color-accent-deep);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .contact-form-header-title {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-text-primary);
  }

  .contact-form-header-ref {
    font-size: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-36);
    font-variant-numeric: tabular-nums;
  }

  .contact-form-header-time {
    margin-left: auto;
    font-size: 0.56rem;
    font-weight: 500;
    color: var(--color-brand-36);
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .contact-form-body {
    padding: 0.85rem 1rem;
  }

  .contact-form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 1rem;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-subtle);
    font-size: 0.48rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-brand-28);
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 767px) {
    .route-connector {
      height: 40px;
    }

    .route-line {
      display: none;
    }

    .route-dot {
      top: 50%;
      margin-left: -2.5px;
      width: 5px;
      height: 5px;
    }

    /* Static dashed line flanking the dot */
    .route-connector::before,
    .route-connector::after {
      content: '';
      position: absolute;
      left: 50%;
      width: 0;
      border-left: 1px dashed var(--color-brand-22);
      transform: translateX(-50%);
    }

    .route-connector::before {
      top: 0;
      height: calc(50% - 8px);
    }

    .route-connector::after {
      bottom: 0;
      height: calc(50% - 8px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .route-dot {
      display: none;
    }
    .route-line line {
      stroke-dasharray: none !important;
      stroke-dashoffset: 0 !important;
    }
  }
</style>
