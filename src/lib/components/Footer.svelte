<script lang="ts">
  import { getContent } from '$lib/stores/lang.svelte';

  let t = $derived(getContent());
  const year = new Date().getFullYear();
</script>

<footer class="footer-document px-container py-8 relative">
  <div class="footer-border-double"></div>
  <div class="mx-auto max-w-7xl flex flex-col items-center gap-3">
    <div class="text-sm text-text-tertiary">
      &copy; {year} {t.footer.company}
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

</style>
