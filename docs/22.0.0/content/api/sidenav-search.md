---
label: Sidenav Search
description: The ngx-sidenav-search combobox, SidenavSearchService and the search types.
order: 4
tags: [ "api", "component", "search" ]
keywords: [ "ngx-sidenav-search", "SidenavSearchService", "rankSearchEntries", "slugifyHeading" ]
icon: manage_search
badge: New
badgeColor: function
---

# Sidenav Search

## `<ngx-sidenav-search>`

| Member | Type | Description |
|--------|------|-------------|
| `shortcut` input | `boolean` (`false`) | Ctrl+K / Cmd+K focuses the box. |
| `navigated` output | `SidenavSearchResult` | The selected result after a successful navigation. |
| `focus()` | method | Focuses the box. |

## SidenavSearchService

Provided by `withSearchIndex()`.

| Member | Type |
|--------|------|
| `query` | `Signal<string>` |
| `results` | `Signal<SidenavSearchResult[]>` |
| `entries` | `Signal<SidenavSearchEntry[] \| undefined>` |
| `status` | `Signal<'idle' \| 'loading' \| 'resolved' \| 'error'>` |
| `error` | `Signal<unknown>` |
| `minQueryLength` | `number` |
| `setQuery(query)`, `search(query)`, `reload()` | methods |

## Helpers

- `rankSearchEntries(entries, query, options)`: the pure ranking used by the service.
- `highlightSegments(text, terms)`: splits text into matched and unmatched segments.
- `normalizeSearchText(text)`: lowercase, accent-free text used for matching.
- `slugifyHeading(heading)`: the anchor of a heading, identical to `@fsegurai/ngx-markdown` heading ids.
