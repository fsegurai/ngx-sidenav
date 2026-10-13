---
label: Providers
description: provideSidenav, withManifest, withSearchIndex, the default mappers and the label providers.
order: 6
tags: [ "api", "providers" ]
keywords: [ "provideSidenav", "withManifest", "withSearchIndex", "fromManifestGenerator", "fromManifestSearchIndex" ]
icon: extension
---

# Providers

## provideSidenav(config?, ...features)

| Argument | Type |
|----------|------|
| `config.labels` | `Partial<SidenavLabels>` |
| `features` | `withManifest()`, `withSearchIndex()`; one of each at most. |

## withManifest(options)

| Option | Type | Description |
|--------|------|-------------|
| `source` | `string \| Signal<T \| undefined> \| T` | URL, signal or value. |
| `mapper` | `(raw: T) => StackMenuItem[]` | Defaults to `fromManifestGenerator`. |
| `mapperOptions` | `{ stripPrefix?, routePrefix? }` | Options of the default mapper. |

Provides `SidenavManifestService` (`items`, `status`, `error`, `reload()`).

## withSearchIndex(options)

Same `source`, `mapper` (default `fromManifestSearchIndex`) and `mapperOptions`, plus `limit` (default `10`) and
`minQueryLength` (default `2`). Provides `SidenavSearchService`.

## Labels

`SIDENAV_LABELS`, `DEFAULT_SIDENAV_LABELS` and `provideSidenavLabels(labels)` for component-level overrides.
