<script lang="ts">
  import { base } from '$app/paths';

  let { size = 44 }: { size?: number } = $props();
</script>

<img
  src="{base}/group-logo.svg"
  alt="EREA Consulting Group"
  style="height: {size}px; width: auto; display: block;"
/>
