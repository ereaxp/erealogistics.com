<script lang="ts">
  import { lineReveal } from '$lib/animations/actions';

  let { label, number }: { label: string; number: string } = $props();
</script>

<div class="mb-6 flex items-center justify-between gap-4">
  <p class="eyebrow">{label}</p>
  <span class="text-label" style="color: color-mix(in srgb, var(--color-accent-deep) 45%, transparent);">{number}</span>
</div>
<div use:lineReveal class="section-rule mb-10"></div>
