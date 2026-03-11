export type ToastVariant = 'success' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

let nextId = 0;
let items = $state<ToastItem[]>([]);
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function dismiss(id: number) {
  const timer = timers.get(id);
  if (timer) { clearTimeout(timer); timers.delete(id); }
  items = items.filter(t => t.id !== id);
}

export const toastStore = {
  get items() { return items; },

  push(message: string, variant: ToastVariant = 'info') {
    const id = nextId++;
    items = [...items, { id, message, variant }];
    timers.set(id, setTimeout(() => dismiss(id), 4000));
  },

  dismiss,
};
