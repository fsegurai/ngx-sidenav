---
label: Lazy Levels and Resilient Sources
description: Load menu levels on demand with loadChildren, split manifests with childrenSource, and keep data through failed reloads with retry and backoff.
order: 10
tags: [ "guides", "lazy", "availability" ]
keywords: [ "loadChildren", "childrenSource", "retryLevel", "pushLevel", "stale-while-error", "refreshing", "retry", "backoff", "AbortSignal" ]
icon: cloud_download
badge: New
badgeColor: function
---

# Lazy Levels and Resilient Sources

Large or remote menus do not need to be loaded at once. A parent item can load its children when it is opened, and
URL sources keep working through flaky networks.

## Lazy levels with `loadChildren`

Give a parent item a `loadChildren` function instead of `children`:

```typescript
const items: StackMenuItem[] = [
  {
    label: 'API reference',
    route: '/api',
    loadChildren: (signal) => fetch('/api/menu.json', { signal }).then((response) => response.json()),
  },
];
```

`loadChildren(signal?)` returns a `Promise<StackMenuItem[]>` or an `Observable<StackMenuItem[]>` (its first value is
used). When the user opens the item:

1. The level opens right away with a **loading row** (the list has `aria-busy="true"`; "API reference menu, Loading…"
   is announced politely).
2. The items replace the loading row, and focus moves to the first one.
3. If the load fails, an **error row** shows the `loadError` label and a **Retry** button (a native button, so
   keyboard and screen reader users can activate it). The failure is announced politely.

| Behavior     | Detail                                                                                        |
|--------------|-----------------------------------------------------------------------------------------------|
| Cache        | Loaded children are cached per item; opening the item again shows them at once.               |
| Deduplication| Concurrent requests for the same item share one call.                                         |
| Cancellation | Going back before the children arrive aborts `signal` (an `Observable` is unsubscribed).       |
| Failures     | A failed load is not cached: Retry, or opening the item again, calls `loadChildren` again.    |
| Immutability | Items are never mutated: `children` stays unset, the loaded level lives in the cache.        |

`SidenavService.pushLevel(item)` opens a parent item the way the menu does (lazy or not), and `retryLevel()` loads a
failed level again. The level's `MenuStackItem` carries `status` (`loading` or `error`) and `error`; `<ngx-sidenav>`
binds them to `<ngx-sidenav-menu [status]>`.

## Route sync and persisted levels

The route index only knows the levels that are loaded. When the active route is not found (after a reload, or a
navigation from outside the menu), the sidenav looks for the **deepest lazy parent whose route is a prefix of the
route** (`/api` for `/api/core/signals`), loads it, and looks the route up again. Nested lazy levels are loaded one
after the other, up to 8 per restore.

Give lazy parents a `route` that prefixes the routes of their pages, so this hint works.

Stored levels (format 2) are keys (routes, or `label:` keys), so they work with lazy levels too: a stored level under a
lazy parent is restored once that parent is loaded.

## Split manifests with `childrenSource`

With `withManifest()`, a large manifest can be split into one file per section. `childrenSource` returns the URL of the
manifest holding the children of an item mapped without children:

```typescript
provideSidenav(
  {},
  withManifest({
    source: '/docs/manifest.json',
    mapperOptions: { stripPrefix: 'content/', routePrefix: '/docs' },
    childrenSource: (item) => (item.isParent ? `/docs/sections${item.route}.json` : undefined),
  }),
);
```

Such items get a `loadChildren` that fetches that URL with `HttpClient` and maps it like the root manifest; its items
may have a `childrenSource` too. `childrenSource` applies to the default mapper; a custom `mapper` sets `loadChildren`
on its items itself.

## Resilient sources

`withManifest()` and `withSearchIndex()` sources share one status model:

| `status`     | Meaning                                                                         |
|--------------|---------------------------------------------------------------------------------|
| `idle`       | No data yet (a signal source still `undefined`).                                |
| `loading`    | First load (or its retries); no data yet.                                       |
| `refreshing` | `reload()` (or its retries) is running; the current data is kept meanwhile.     |
| `resolved`   | Data is available.                                                              |
| `error`      | Loading failed and there is no data.                                            |

**Stale-while-error.** When a reload fails, the last good items (or search entries) are kept: `status()` stays
`resolved` and `error()` holds the failure. `status()` is `error` only when there is nothing to show.

**Retry with backoff.** Retries are off by default, so the error timing stays as before. Turn them on per source:

```typescript
withManifest({ source: '/docs/manifest.json', retry: { attempts: 3, delayMs: 500 } });
// Retries after 500 ms, 1 s, then 2 s.
```

Only transient failures are retried: network errors, HTTP 408, 429 and 5xx. A 404, or a response the mapper rejects,
fails right away. `reload()` drops a pending retry and starts with a fresh retry budget.

## Labels

| Key         | Default                    |
|-------------|----------------------------|
| `loading`   | `Loading…`                 |
| `loadError` | `Could not load this menu` |
| `retry`     | `Retry`                    |

See [Labels and i18n](i18n-labels.md) to translate them.
