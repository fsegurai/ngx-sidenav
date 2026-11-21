---
label: Sidenav Menu
description: The ngx-sidenav-menu component and the StackMenuItem interface.
order: 2
tags: [ "api", "component", "menu" ]
keywords: [ "ngx-sidenav-menu", "StackMenuItem", "virtual scroll" ]
icon: list_alt
---

# Sidenav Menu

`<ngx-sidenav-menu>` renders one menu level. `<ngx-sidenav>` uses it for the current level; you rarely need it alone.

## Inputs

| Input | Type | Default |
|-------|------|---------|
| `items` | `StackMenuItem[]` | `[]` |
| `parentLabel` / `parentBadge` / `parentBadgeColor` | header of a nested level | `undefined` |
| `virtualScrollThreshold` | `number` | `50` items |
| `virtualBufferSize` | `number` | `200` px |
| `itemHeight` | `number` | `48` px |

`itemHeight` is the virtual scroll item size. It is also bound to `--ngx-sidenav-item-height` on the host, which fixes
the height of every row once virtual scrolling is on: rows stay on one line (long titles and summaries are truncated),
so the rendered rows always match the item size. Change the height with the input, not the CSS variable.

## StackMenuItem

| Property | Type | Notes |
|----------|------|-------|
| `label` | `string` | Required. |
| `route` | `string` | Router link. |
| `children` | `StackMenuItem[]` | Opens a nested level. |
| `isTitle` / `isParent` | `boolean` | Section title / parent row. |
| `icon` / `iconType` | `string` / `'material' \| 'svg' \| 'custom'` | Leading icon. |
| `badge` / `badgeColor` | `string \| number` / `string` | Trailing badge. |
| `summary` / `description` | `string` | Secondary text. |
| `tooltip` | `string` | Hover and focus tooltip. |
| `disabled` | `boolean` | Rendered with `aria-disabled`. |
| `externalUrl` | `string` | Opens in a new tab. |
| `redirect` | `string` | Link target instead of `route`. |
| `deprecated` / `deprecatedAlternative` | `boolean` / `string` | Deprecated badge and hint. |
| `breadcrumb`, `keywords`, `tags`, `order`, `layout` | | Metadata for mappers and search. |
