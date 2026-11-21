---
label: Providers
description: provideSidenav, withManifest, withSearchIndex (object or factory options), the default mappers, the manifest page helpers and the label providers.
order: 6
tags: [ "api", "providers" ]
keywords: [ "provideSidenav", "withManifest", "withSearchIndex", "fromManifestGenerator", "fromManifestSearchIndex", "findManifestItem", "adjacentItems", "breadcrumbFor" ]
icon: extension
---

# Providers

## provideSidenav(config?, ...features)

| Argument | Type |
|----------|------|
| `config.labels` | `Partial<SidenavLabels>` |
| `features` | `withManifest()`, `withSearchIndex()`; one of each at most. |

## withManifest(options | () => options)

| Option | Type | Description |
|--------|------|-------------|
| `source` | `string \| Signal<T \| undefined> \| T` | URL, signal or value. |
| `mapper` | `(raw: T) => StackMenuItem[]` | Defaults to `fromManifestGenerator`. |
| `mapperOptions` | `{ stripPrefix?, routePrefix? }` | Options of the default mapper. |

Provides `SidenavManifestService` (`items`, `status`, `error`, `reload()`).

## withSearchIndex(options | () => options)

Same `source`, `mapper` (default `fromManifestSearchIndex`) and `mapperOptions`, plus `limit` (default `10`) and
`minQueryLength` (default `2`). Provides `SidenavSearchService`.

## Factory options

Both features also accept a factory (since 22.1.0). It is evaluated once in an injection context of the injector that
registers `provideSidenav()`, so the options can `inject()` services, tokens or signals; the object form is unchanged:

```typescript
provideSidenav(
  {},
  withManifest(() => ({ source: inject(DocsService).manifest, mapperOptions: { routePrefix: inject(DOCS_BASE) } })),
  withSearchIndex(() => ({ source: inject(DocsSearch).entries, mapper: (entries) => entries, limit: 10 })),
);
```

## Manifest page helpers

Pure functions over mapped items (`SidenavManifestService.items()` or a mapper result), since 22.1.0:

| Function | Returns |
|----------|---------|
| `findManifestItem(items, route)` | The item of a route, at any depth (depth-first, first match wins), or `undefined`. |
| `adjacentItems(items, route)` | `{ previous, next }` (`SidenavAdjacentItems`): reading order, depth-first, internal pages only. |
| `breadcrumbFor(items, route)` | The item's `breadcrumb`, or its ancestors (`breadcrumbTitle ?? label`). |

Routes are compared without leading/trailing slashes, query string or hash; external items are never matched, and
lazy levels that were not loaded are not searched.

## Labels

`SIDENAV_LABELS`, `DEFAULT_SIDENAV_LABELS` and `provideSidenavLabels(labels)` for component-level overrides.
