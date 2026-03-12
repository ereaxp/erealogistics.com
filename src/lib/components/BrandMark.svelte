<script lang="ts">
  import { base } from '$app/paths';

  let { size = 44 }: { size?: number } = $props();
</script>

<img
  src="{base}/group-logo.svg"
  alt="EREA Consulting Group"
  width={Math.round(size * 2.397)}
  height={size}
  style="height: {size}px; width: auto; display: block;"
/>
