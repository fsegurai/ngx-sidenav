---
label: Performance and Large Datasets
description: How ngx-sidenav stays responsive with 100k menu items and 50k search entries, the recommended settings by dataset size, measured numbers and how to benchmark.
order: 12
tags: [ "guides", "performance", "search" ]
keywords: [ "large datasets", "performance", "benchmark", "bench:lib", "routeIndexReady", "fromManifestGeneratorLazy", "virtual scroll", "debounceMs", "Web Worker", "stress test", "long tasks" ]
icon: speed
badge: New
badgeColor: function
---

# Performance and Large Datasets

ngx-sidenav is built to keep the main thread free while it loads, indexes and searches large menus: 100k menu items
and 50k search entries render their first level in about a millisecond, and typing never waits for the whole index.
This guide explains how, which settings to use for your dataset size, and how to measure it yourself.

## How the library stays responsive

| Technique | What it does | Where |
|-----------|--------------|-------|
| **Chunked work** | Long loops (route index, search index, large queries) run in ~8 ms chunks and yield to the browser between them (`scheduler.yield()`, then `MessageChannel`, then `setTimeout`). A newer input cancels the stale work. | Route index, search index, search queries |
| **Lazy mapping** | `withManifest()` maps only the root level of `manifest.json` (`fromManifestGeneratorLazy`); a level is mapped the first time it is opened or indexed, then kept. | `withManifest()` |
| **Route index** | Two maps (route → item, item → parent) built once per root menu, in the background for large menus. A route sync is a lookup in O(depth) instead of a tree search on every navigation. `SidenavService.routeIndexReady` tells when it is complete. | `SidenavService` |
| **Persistence by reference** | The stored stack only holds level keys (routes, or labels without a route): a few hundred bytes whatever the menu size. Writes are coalesced into one idle callback and skipped when unchanged. | Stack persistence |
| **Search index** | Entries are normalized once, right after they load, into a flat per-field index (synchronously up to 2000 entries, in background chunks above, `indexing` status meanwhile). | `withSearchIndex()` |
| **Debounce and top-k** | Queries are debounced (`debounceMs`, 150 by default), only the best `limit` results are kept (no full sort), and indexes above 5000 entries are scanned in chunks. Only the 140 characters excerpt window is highlighted. | `SidenavSearchService` |
| **Fixed-row virtual scroll** | Levels with 50 items or more (`virtualScrollThreshold`) render through the CDK virtual viewport with fixed row heights matching its `itemSize`, so only the visible rows exist and scrolling does not drift. | `<ngx-sidenav-menu>` |
| **Lazy levels** | `loadChildren` loads a level only when it is opened (with loading, error and retry rows), so a huge tree can ship as a small root plus per-section files. | [Lazy Levels](lazy-levels.md) |
| **Optional worker** | `withSearchIndex({ worker })` builds and scans indexes above 2000 entries in a Web Worker, with a transparent fallback to the main thread. | [Web Worker Search](web-worker.md) |

Menu items are treated as immutable: after changing items in place (`children.push(…)`), call
`SidenavService.reindex()`.

## Recommended settings by dataset size

| Dataset | Menu | Search | Notes |
|---------|------|--------|-------|
| Up to ~2k items / 2k entries | Defaults | Defaults | Everything is indexed synchronously; nothing to tune. |
| ~2k–20k items / entries | Defaults (`withManifest()` maps lazily) | Defaults; `debounceMs` 150–250 | The route index and the search index build in the background (`routeIndexReady`, `indexing`). |
| ~20k–100k items / entries | Split the tree with `loadChildren` (one file per section) | `worker` on; `limit` ≤ 20; `minQueryLength` 2 or 3 | Keep stable `route`s on parent items so stored levels and route syncs find them. |
| Over 100k items | Lazy levels are required: ship only the root and load sections on demand | `worker` on; consider a server-side search behind a custom `source` | Mapping, indexing and a first render scale with what is loaded, not with the full catalog. |

Rules of thumb:

- Prefer `withManifest()` or `fromManifestGeneratorLazy` over eager `fromManifestGenerator` for large manifests.
- Keep levels long rather than deep where it suits the content: long levels are virtualized, deep ones need more
  clicks and more lazy loads.
- A one-letter query matches almost everything: `minQueryLength` 2 (the default) avoids scanning for it.
- The worker only helps above 2000 entries; below that the library searches synchronously and never starts it.

## Measured numbers

Before and after the large-dataset work, on 100k menu items (depth 4) and 50k search entries.

| Operation | Before | After |
|-----------|--------|-------|
| Root menu available | 40–109 ms, blocking | ≤ 1.1 ms |
| Route index (100k items) | n/a (tree search per navigation) | 128–137 ms in 13–14 background chunks |
| Route lookup on navigation | 2–7 ms | ≤ 0.06 ms |
| Stack save | 20–60 ms, 6.2 MB (could exceed the storage quota) | < 4 KB, idle-time write |
| Search: first keystroke (50k entries) | ~205 ms, blocking | ~10 ms |
| Search queries `a` / `al` / `alp` (50k) | 54 / 44 / 41 ms | 7.8 / 10.3 / 12.3 ms |
| Search index build (50k) | on the first keystroke | 181 ms in 19 background chunks (longest 10.8 ms) |
| Worker bundle (demo) | n/a | 6.58 kB chunk, no Angular code |

### Benchmarks (`bun run bench:lib`)

Medians (p50) from `vitest bench` in Node.js on a developer machine; the fixtures are generated at run time from a
seed. Absolute values depend on the machine and include some Vitest module-runner overhead, so compare rows rather
than reading them as browser timings.

| Benchmark | Median |
|-----------|--------|
| `fromManifestGeneratorLazy`, 100k items (root level) | 0.016 ms |
| `fromManifestGenerator`, 100k items (whole tree, eager) | 40.7 ms |
| `RouteIndex.build`, 100k items, one go | 69.3 ms |
| `RouteIndex.build`, 100k items, 8 ms chunks until ready | 77.8 ms |
| `RouteIndex.findPath` (deepest / last route) | 0.0001 ms |
| Depth-first route search (the previous lookup, last route) | 25.9 ms |
| Stack save, v2 level keys | 0.0008 ms |
| Stack save, legacy levels by value | 25.4 ms |
| `createSearchIndexSync`, 50k entries | 279.9 ms |
| `createSearchIndex`, 50k entries, 8 ms chunks | 292.8 ms |
| `querySearchIndex` `a` / `al` / `alp` / `theming 4`, 50k entries | 5.5 / 10.3 / 13.9 / 14.3 ms |
| `excerptSegments`, 2k characters (window only) | 0.115 ms |

The chunked builds cost a few percent more in total than the one-go builds; in exchange the browser can render and
handle input between chunks.

## Benchmark it yourself

```bash
bun run bench:lib
```

The benchmarks live next to the code (`lib/src/**/*.bench.ts`) and run with `lib/vitest.bench.config.mts`, separately
from the unit tests: the mapper, the route index, the stack persistence payload, the search index build and queries,
and the excerpt highlight. Each file compares the current implementation with the one it replaced where it applies.

## Stress test page

The demo application has a **Stress test** page (`/stress`, linked from the toolbar and the default JSON menu):

- **Menu** — generate 1k, 10k or 100k items at a chosen depth; the sidenav shows the generated menu while the page is
  open (the previous menu comes back when you leave). It reports the generation and mapping time, then two timings
  measured from the end of the mapping: until the first root row is rendered, and until `routeIndexReady` turns
  `true` for the generated menu.
- **Search** — build a 5k or 50k entries index, with or without the Web Worker (the page falls back to the main
  thread where `Worker` is not available), and type queries to see the latency of the last one and the top results.
  Rebuilding the index clears the query and its latency.
- **Long tasks** — counts the tasks over 50 ms reported by the browser (`PerformanceObserver` `longtask`, where
  supported) since the page opened.

```bash
bun run start   # then open http://localhost:4200/stress
```

For a full picture, record a trace in the browser Performance panel while loading the menu and typing: there should
be no long task from the library, with or without the worker.
