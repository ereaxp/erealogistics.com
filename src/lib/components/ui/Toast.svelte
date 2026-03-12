<script lang="ts">
  import { toastStore } from '$lib/stores/toast.svelte';
</script>

{#if toastStore.items.length > 0}
  <div class="toast-container" aria-live="polite" role="status">
    {#each toastStore.items as toast (toast.id)}
      <div
        class="toast-item"
        class:toast-success={toast.variant === 'success'}
        class:toast-warning={toast.variant === 'warning'}
      >
        <p class="toast-message">{toast.message}</p>
        <button
          class="toast-dismiss"
          onclick={() => toastStore.dismiss(toast.id)}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/>
          </svg>
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }
  @media (min-width: 1024px) {
    .toast-container {
      bottom: 48px;
    }
  }
  .toast-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    min-width: 220px;
    max-width: 360px;
    background: var(--color-bg-card);
    border: 0.5px solid var(--color-border-subtle);
    border-radius: 4px;
    box-shadow: 0 4px 16px var(--color-brand-10);
    pointer-events: auto;
    animation: toast-in 0.3s var(--ease-out-expo);
    border-left: 3px solid var(--color-text-tertiary);
  }
  .toast-success {
    border-left-color: var(--color-accent);
  }
  .toast-warning {
    border-left-color: var(--color-score-danger);
  }
  .toast-message {
    flex: 1;
    font-size: 0.82rem;
    line-height: 1.45;
    color: var(--color-text-primary);
  }
  .toast-dismiss {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    margin: -10px -10px -10px 0;
    border-radius: 2px;
    color: var(--color-text-tertiary);
    cursor: pointer;
    transition: color 0.15s;
    background: none;
    border: none;
  }
  @media (hover: hover) {
    .toast-dismiss:hover {
      color: var(--color-text-primary);
    }
  }
  @keyframes toast-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .toast-item {
      animation: none;
    }
  }
  @media (max-width: 639px) {
    .toast-container {
      right: 12px;
      left: 12px;
      bottom: 16px;
      align-items: center;
    }
    .toast-item {
      max-width: 100%;
      width: 100%;
    }
  }
</style>
