---
label: Labels and i18n
description: Translate every text rendered or announced by the sidenav with provideSidenav labels or provideSidenavLabels.
order: 9
tags: [ "guides", "i18n" ]
keywords: [ "labels", "translation", "SIDENAV_LABELS", "provideSidenavLabels" ]
icon: translate
---

# Labels and i18n

Every built-in text comes from the `SIDENAV_LABELS` token, English by default. Override any subset globally:

```typescript
provideSidenav({
  labels: {
    back: 'Atrás',
    navigation: 'Navegación lateral',
    searchPlaceholder: 'Buscar…',
    searchResultsCount: (count) => (count === 1 ? '1 resultado' : `${count} resultados`),
  },
});
```

or for one component subtree with `providers: [provideSidenavLabels({ back: 'Zurück' })]`.

## Keys

| Key | Default |
|-----|---------|
| `toggleExpand` / `toggleCollapse` | `Expand navigation` / `Collapse navigation` |
| `navigation` | `Side navigation` |
| `back` | `Back` |
| `resizeHandle` | `Resize navigation panel` |
| `levelAnnouncement` | `{label} menu` |
| `opensInNewTab` | `(opens in new tab)` |
| `deprecated` | `Deprecated` |
| `searchLabel` / `searchPlaceholder` | `Search` / `Search…` |
| `searchNoResults` | `No results` |
| `searchIndexing` | `Indexing…` |
| `searchResultsCount` | `{count} results` |
| `loading` | `Loading…` |
| `loadError` | `Could not load this menu` |
| `retry` | `Retry` |

`levelAnnouncement` and `searchResultsCount` accept a template string or a function.
