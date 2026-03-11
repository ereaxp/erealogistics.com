<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { reveal, stagger } from '$lib/animations/actions';
  import { scrollToSection } from '$lib/animations/gsap';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { getContent } from '$lib/stores/lang.svelte';

  let t = $derived(getContent());
  let mobileOpen = $state(false);

  function handleDemoSubmit(event: SubmitEvent) {
    event.preventDefault();
    toastStore.push(t.contact.form.demoMessage);
  }
</script>

<Nav bind:mobileOpen />

<main inert={mobileOpen || undefined}>
  <Hero />

  <section id="about" class="px-container py-section">
    <div class="mx-auto max-w-7xl">
      <SectionHeader label={t.about.label} number="01" />
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div use:stagger={{ selector: '.about-paragraph', stagger: 0.1 }}>
          {#each t.about.paragraphs as paragraph}
            <p class="about-paragraph text-body text-text-secondary not-last:mb-5">{paragraph}</p>
          {/each}
        </div>

        <div use:reveal class="surface-card ambient-panel p-7 md:p-9" data-reveal>
          <p class="eyebrow mb-5">{t.brand.group}</p>
          <h2 class="text-h2 mb-5 max-w-[14ch] font-serif tracking-snug">{t.about.title}</h2>
          <p class="text-body-lg text-text-secondary">
            {@html t.about.closing}
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="methodology" class="px-container py-section-sm">
    <div class="mx-auto max-w-7xl rounded-[8px] bg-[linear-gradient(180deg,var(--color-accent-deep),var(--color-gradient-deep))] px-6 py-10 text-white shadow-[0_36px_90px_rgba(0,80,47,0.24)] md:px-10 md:py-12">
      <SectionHeader label={t.value.label} number="02" />
      <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div use:reveal class="max-w-[44rem]" data-reveal>
          <h2 class="text-h2 mb-5 max-w-[12ch] font-serif tracking-snug text-white">{t.value.title}</h2>
          <p class="text-body-lg text-white/80">{t.value.description}</p>
        </div>

        <div use:stagger={{ selector: '.value-item', stagger: 0.09 }} class="grid gap-4 sm:grid-cols-2">
          {#each t.value.items as item}
            <article class="value-item rounded-[6px] border border-white/14 bg-white/8 p-5">
              <h3 class="text-h3 mb-3 font-serif text-white">{item.title}</h3>
              <p class="text-body text-white/78">{item.text}</p>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section id="transformation" class="px-container py-section">
    <div class="mx-auto max-w-7xl">
      <SectionHeader label={t.transformation.label} number="03" />
      <div class="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <h2 use:reveal class="text-h2 max-w-[12ch] font-serif tracking-snug" data-reveal>{t.transformation.title}</h2>
        <p use:reveal={{ delay: 0.08 }} class="text-body-lg text-text-secondary" data-reveal>{t.transformation.description}</p>
      </div>

      <div use:stagger={{ selector: '.transformation-card', stagger: 0.08 }} class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {#each t.transformation.items as item}
          <article class="transformation-card surface-card flex h-full flex-col p-6">
            <div class="mb-6 flex items-center justify-between">
              <span class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-secondary font-serif text-lg text-accent-deep">{item.number}</span>
            </div>
            <h3 class="text-h3 mb-3 font-serif">{item.title}</h3>
            <p class="mb-5 flex-1 text-body text-text-secondary">{item.text}</p>
            <div class="divider-thin mb-4"></div>
            <p class="text-sm text-accent-deep">{item.impact}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="impact" class="px-container py-section">
    <div class="mx-auto max-w-7xl">
      <SectionHeader label={t.impact.label} number="04" />
      <div class="mb-10 max-w-[52rem]">
        <h2 use:reveal class="text-h2 mb-4 max-w-[11ch] font-serif tracking-snug" data-reveal>{t.impact.title}</h2>
        <p use:reveal={{ delay: 0.08 }} class="text-body-lg text-text-secondary" data-reveal>{t.impact.description}</p>
      </div>

      <div use:stagger={{ selector: '.impact-metric', stagger: 0.06 }} class="mb-10 grid gap-8 sm:grid-cols-3">
        {#each t.impact.items.slice(0, 3) as item}
          <div class="impact-metric">
            <div class="font-serif text-metric-lg tracking-tight text-accent-deep">{item.value}</div>
            <p class="mt-3 text-body text-text-secondary">{item.text}</p>
          </div>
        {/each}
      </div>

      <div use:stagger={{ selector: '.impact-secondary', stagger: 0.04 }} class="mb-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-border-subtle py-6">
        {#each t.impact.items.slice(3) as item}
          <div class="impact-secondary flex items-baseline gap-3">
            <span class="font-serif text-xl tracking-tight text-accent-deep">{item.value}</span>
            <span class="text-sm text-text-secondary">{item.text}</span>
          </div>
        {/each}
      </div>

      <div use:stagger={{ selector: '.case-card', stagger: 0.08 }} class="grid gap-4 md:grid-cols-2">
        {#each t.cases.items as item}
          <article class="case-card surface-card p-6 md:p-7">
            <div class="metric-chip mb-5 inline-flex text-sm font-semibold text-accent-deep">{item.highlight}</div>
            <h3 class="text-h3 mb-3 font-serif">{item.title}</h3>
            <p class="text-body text-text-secondary">{item.text}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="questions" class="px-container py-section-sm">
    <div class="mx-auto max-w-7xl surface-card ambient-panel px-6 py-8 md:px-10 md:py-10">
      <SectionHeader label={t.questions.label} number="05" />

      <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div use:reveal data-reveal>
          <h2 class="text-h2 mb-5 max-w-[12ch] font-serif tracking-snug">{t.questions.title}</h2>
          <p class="mb-6 text-body-lg text-text-secondary">{t.questions.description}</p>
          <p class="mb-6 text-body text-text-secondary">
            {@html t.questions.closing}
          </p>
          <a
            href="#contact"
            onclick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            class="button-primary lift-on-hover"
          >
            {t.questions.cta}
          </a>
        </div>

        <div use:stagger={{ selector: '.question-item', stagger: 0.05 }} class="grid gap-3 md:grid-cols-2">
          {#each t.questions.items as item}
            <div class="question-item flex gap-3 py-3">
              <div class="mt-2 h-2 w-2 flex-none rounded-full bg-accent"></div>
              <p class="text-body text-text-secondary">{item}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section id="team" class="px-container py-section">
    <div class="mx-auto max-w-7xl">
      <SectionHeader label={t.team.label} number="06" />
      <div class="mb-8 max-w-[52rem]">
        <h2 use:reveal class="text-h2 mb-4 max-w-[12ch] font-serif tracking-snug" data-reveal>{t.team.title}</h2>
      </div>

      <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div use:stagger={{ selector: '.team-paragraph', stagger: 0.08 }}>
          {#each t.team.paragraphs as paragraph}
            <p class="team-paragraph text-body text-text-secondary not-last:mb-5">{paragraph}</p>
          {/each}
        </div>

        <div use:reveal class="surface-card ambient-panel p-7 md:p-9" data-reveal>
          <h3 class="text-h3 mb-3 font-serif">{t.team.panelTitle}</h3>
          <p class="mb-6 text-body text-text-secondary">{t.team.panelText}</p>
          <div class="grid gap-3">
            {#each t.team.items as item}
              <div class="rounded-[4px] border border-border-subtle bg-white/72 p-4">
                <div class="mb-2 font-medium text-accent-deep">{item.title}</div>
                <p class="text-sm text-text-secondary">{item.text}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="px-container py-section-lg">
    <div class="mx-auto max-w-7xl">
      <SectionHeader label={t.contact.label} number="07" />
      <div class="mb-8 max-w-[52rem]">
        <h2 use:reveal class="text-h2 mb-4 max-w-[12ch] font-serif tracking-snug" data-reveal>{t.contact.title}</h2>
        <p use:reveal={{ delay: 0.08 }} class="text-body-lg text-text-secondary" data-reveal>{t.contact.description}</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <form onsubmit={handleDemoSubmit} class="surface-card p-7 md:p-9">
          <div class="grid gap-5 md:grid-cols-2">
            <label class="block text-sm font-medium text-text-primary">
              <span class="mb-2 block">{t.contact.form.nameLabel}</span>
              <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-4 py-3 outline-none" name="name" placeholder={t.contact.form.namePlaceholder} required />
            </label>

            <label class="block text-sm font-medium text-text-primary">
              <span class="mb-2 block">{t.contact.form.companyLabel}</span>
              <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-4 py-3 outline-none" name="company" placeholder={t.contact.form.companyPlaceholder} required />
            </label>

            <label class="block text-sm font-medium text-text-primary">
              <span class="mb-2 block">{t.contact.form.emailLabel}</span>
              <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-4 py-3 outline-none" name="email" type="email" placeholder={t.contact.form.emailPlaceholder} required />
            </label>

            <label class="block text-sm font-medium text-text-primary">
              <span class="mb-2 block">{t.contact.form.topicLabel}</span>
              <input class="w-full rounded-[4px] border border-border-subtle bg-bg-card px-4 py-3 outline-none" name="topic" placeholder={t.contact.form.topicPlaceholder} required />
            </label>
          </div>

          <label class="mt-5 block text-sm font-medium text-text-primary">
            <span class="mb-2 block">{t.contact.form.messageLabel}</span>
            <textarea class="min-h-[132px] w-full rounded-[4px] border border-border-subtle bg-bg-card px-4 py-3 outline-none" name="message" placeholder={t.contact.form.messagePlaceholder}></textarea>
          </label>

          <div class="mt-6 flex flex-wrap gap-3">
            <button class="button-primary lift-on-hover" type="submit">{t.contact.form.submit}</button>
            <a
              class="button-secondary"
              href={`mailto:${t.contact.email}?subject=${encodeURIComponent(t.contact.emailSubject)}`}
            >
              {t.contact.form.emailCta}
            </a>
          </div>

          <p class="mt-4 text-sm text-text-tertiary">{t.contact.form.note}</p>
        </form>

        <div class="grid gap-4">
          <div use:reveal class="surface-card ambient-panel p-7 md:p-9" data-reveal>
            <h3 class="text-h3 mb-4 font-serif">{t.contact.expectations.title}</h3>
            {#each t.contact.expectations.paragraphs as paragraph}
              <p class="text-body text-text-secondary not-last:mb-4">{paragraph}</p>
            {/each}

            <div class="mt-6 grid gap-3">
              {#each t.contact.expectations.bullets as bullet}
                <div class="flex items-center justify-between rounded-[4px] border border-border-subtle bg-white/72 px-4 py-3">
                  <span class="text-sm font-medium text-accent-deep">{bullet}</span>
                  <span aria-hidden="true" class="text-accent">✓</span>
                </div>
              {/each}
            </div>
          </div>

          <div use:reveal={{ delay: 0.08 }} class="surface-card-soft p-6" data-reveal>
            <p class="mb-3 text-sm text-text-secondary">{t.contact.disclaimer}</p>
            <a class="text-body font-medium text-accent-deep" href={`mailto:${t.contact.email}?subject=${encodeURIComponent(t.contact.emailSubject)}`}>
              {t.contact.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<Footer />
