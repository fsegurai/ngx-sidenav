import type { StackMenuItem } from 'ngx-sidenav';

/** Options of {@link simulatedLoad}. */
export interface SimulatedLoadOptions {
  /** Network latency to simulate, in milliseconds. */
  readonly delayMs?: number;
  /** Fail the first call, so the Retry button of the level can be tried. */
  readonly failFirst?: boolean;
}

/**
 * A `loadChildren` that resolves `items` after a simulated latency, the way a real one would fetch them. It honors
 * the `AbortSignal` the sidenav passes (leaving the level before it resolves cancels the wait).
 */
export function simulatedLoad(
  items: StackMenuItem[],
  { delayMs = 800, failFirst = false }: SimulatedLoadOptions = {},
): (signal?: AbortSignal) => Promise<StackMenuItem[]> {
  let calls = 0;
  return (signal) =>
    new Promise<StackMenuItem[]>((resolve, reject) => {
      const shouldFail = failFirst && calls++ === 0;
      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort);
        if (shouldFail) reject(new Error('Simulated network failure: use Retry to load this level again.'));
        else resolve(items);
      }, delayMs);
      const onAbort = () => {
        clearTimeout(timer);
        reject(signal?.reason ?? new DOMException('The operation was aborted.', 'AbortError'));
      };
      if (signal?.aborted) onAbort();
      else signal?.addEventListener('abort', onAbort, { once: true });
    });
}

/** Items of the lazy API reference level (loaded on demand). */
const LAZY_API_ITEMS: StackMenuItem[] = [
  { label: 'Core', icon: 'hub', iconType: 'material', route: '/lazy/api/core' },
  { label: 'Signals', icon: 'sensors', iconType: 'material', route: '/lazy/api/signals' },
  {
    label: 'Router',
    icon: 'alt_route',
    iconType: 'material',
    route: '/lazy/api/router',
    // A nested lazy level
    loadChildren: simulatedLoad([
      { label: 'Guards', icon: 'shield', iconType: 'material', route: '/lazy/api/router/guards' },
      { label: 'Resolvers', icon: 'download', iconType: 'material', route: '/lazy/api/router/resolvers' },
    ]),
  },
];

/** Items of the flaky level: its first load fails. */
const FLAKY_ITEMS: StackMenuItem[] = [
  { label: 'Recovered page', icon: 'check_circle', iconType: 'material', route: '/lazy/flaky/recovered' },
];

/** The lazy section of the default JSON menu: levels whose items load on demand (`loadChildren`). */
export const lazyMenuItems: StackMenuItem[] = [
  { label: 'Lazy levels', route: '#', isTitle: true },
  {
    label: 'Lazy API reference',
    icon: 'cloud_download',
    iconType: 'material',
    route: '/lazy/api',
    badge: 'Lazy',
    badgeColor: 'directive',
    loadChildren: simulatedLoad(LAZY_API_ITEMS),
  },
  {
    label: 'Flaky section (fails once)',
    icon: 'sync_problem',
    iconType: 'material',
    route: '/lazy/flaky',
    loadChildren: simulatedLoad(FLAKY_ITEMS, { failFirst: true }),
  },
];
