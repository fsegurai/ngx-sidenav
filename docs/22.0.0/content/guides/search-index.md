---
label: Search Index
description: Add a ranked, keyboard-friendly search box backed by search-index.json with withSearchIndex.
order: 5
tags: [ "guides", "search" ]
keywords: [ "search-index.json", "withSearchIndex", "SidenavSearchService", "combobox", "debounceMs", "indexing" ]
icon: search
badge: New
badgeColor: function
---

# Search Index

## Enable search

```typescript
provideSidenav(
  {},
  withManifest({ source: 'docs/1.0.0/manifest.json', mapperOptions }),
  withSearchIndex({ source: 'docs/1.0.0/search-index.json', mapperOptions, limit: 10, minQueryLength: 2 }),
);
```

Then render the box inside the panel:

```html
<ngx-sidenav [search]="true" />
```

or anywhere else with `<ngx-sidenav-search [shortcut]="true" />` (Ctrl+K / Cmd+K focuses it).

## Options

| Option           | Default | Description                                                               |
|------------------|---------|---------------------------------------------------------------------------|
| `limit`          | `10`    | Maximum number of results                                                 |
| `minQueryLength` | `2`     | Shorter queries (trimmed) return no results                               |
| `debounceMs`     | `150`   | Delay between the last keystroke and the query; `0` queries synchronously |

A query too short to search clears the results right away, without waiting for the debounce.

## Indexing and large indexes

The entries are normalized once, right after they load, into a flat per-field index. Up to 2000 entries this happens
synchronously; larger indexes are built in small background chunks that yield to the browser. Meanwhile
`SidenavSearchService.status()` is `indexing`, `results()` stays empty and the box shows the `searchIndexing` label
(`Indexing…`).

Indexes above 5000 entries are scanned in chunks too: the previous results stay visible until the new ones are ready,
and a newer query cancels the scan of a stale one. `pending()` is `true` while the results do not answer the current
query yet.

## Ranking

Matches are scored by field: label, then headings, tags and keywords, then description, then excerpt. A label equal
to the whole query ranks first; ties keep the index order.

## Heading anchors

When a heading matched, the result navigates to `route#anchor`. The anchor is built with `slugifyHeading()`, the same
rules `@fsegurai/ngx-markdown` uses for `[headingIds]`, so `## Heading Anchors` lands on `#heading-anchors`.

## External results

Results whose route is an absolute URL (`https://...`) open in a new tab instead of using the router.

## Programmatic use

`SidenavSearchService` exposes `query`, `results`, `pending`, `status`, `entries`, `setQuery()`, `search(query)` and
`reload()`. `search(query)` is synchronous and not debounced: it scans the whole index in one go.
