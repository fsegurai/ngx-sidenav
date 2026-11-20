import type { ManifestNavigationItem, SidenavSearchEntry } from 'ngx-sidenav';

/** Router path of the stress test page; the generated menu items link below it (`/stress/s0/s3`). */
export const STRESS_ROUTE = 'stress';

/** Small, fast, deterministic PRNG (mulberry32): same seed, same data. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORDS = ['alpha', 'beta', 'gamma', 'delta', 'omega', 'sigma', 'theta', 'kappa', 'lambda', 'zeta'];

/**
 * A `manifest.json`-shaped tree of `total` items and `depth` levels, filled breadth first. Routes are
 * `content/s<i>/s<j>/…` (map them with `stripPrefix: 'content/'`), so every route is unique.
 */
export function generateManifest(total: number, depth: number, seed = 42): ManifestNavigationItem[] {
  const random = createRandom(seed);
  const branching = Math.max(2, Math.ceil(total ** (1 / depth)));
  const roots: ManifestNavigationItem[] = [];
  let created = 0;
  let queue: [ManifestNavigationItem[], string, number][] = [[roots, 'content', 1]];

  while (queue.length && created < total) {
    const next: [ManifestNavigationItem[], string, number][] = [];
    for (const [siblings, parentRoute, level] of queue) {
      for (let i = 0; i < branching && created < total; i++) {
        created++;
        const route = `${parentRoute}/s${i}`;
        const item: ManifestNavigationItem = {
          label: `${WORDS[Math.floor(random() * WORDS.length)]} ${created}`,
          route,
          order: i,
        };
        siblings.push(item);
        if (level < depth) {
          item.children = [];
          next.push([item.children, route, level + 1]);
        }
      }
      if (created >= total) break;
    }
    queue = next;
  }

  // Drop the children arrays left empty when `total` was reached; mark the real parents
  const stack = [...roots];
  while (stack.length) {
    const item = stack.pop()!;
    if (!item.children?.length) {
      delete item.children;
      continue;
    }
    item.isParent = true;
    stack.push(...item.children);
  }
  return roots;
}

/** `total` search entries over a small vocabulary, so queries match many entries. */
export function generateSearchEntries(total: number, seed = 42): SidenavSearchEntry[] {
  const random = createRandom(seed);
  const word = () => WORDS[Math.floor(random() * WORDS.length)];
  const words = (count: number) => Array.from({ length: count }, word).join(' ');
  return Array.from({ length: total }, (_, i) => ({
    label: `${words(2)} ${i}`,
    route: `/${STRESS_ROUTE}/page/${i}`,
    headings: [words(2), words(3)],
    tags: [word()],
    description: words(6),
    excerpt: words(30),
  }));
}
