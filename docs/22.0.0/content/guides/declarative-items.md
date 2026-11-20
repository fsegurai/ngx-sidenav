---
label: Declarative Items
description: Describe the menu as StackMenuItem objects: titles, parents, badges, tooltips, disabled, external and deprecated items.
order: 1
tags: [ "guides", "menu" ]
keywords: [ "StackMenuItem", "badge", "children", "externalUrl", "redirect" ]
icon: list
---

# Declarative Items

Bind an array of `StackMenuItem` to `<ngx-sidenav [items]>`. Whenever the array changes, the stack is rebuilt for the
current route.

## Item kinds

| Shape | Renders as |
|-------|-----------|
| `{ label, isTitle: true }` | A section title (not focusable). |
| `{ label, route }` | A router link. |
| `{ label, children }` | A parent button that pushes `children` as a new level. |
| `{ label }` without `route` | A button (for example, wired by your own code). |
| `{ label, externalUrl }` | A link opened in a new tab, with an "opens in new tab" hint. |

## Optional properties

```typescript
const items: StackMenuItem[] = [
  { label: 'Reports', route: '/reports', badge: 'New', badgeColor: 'function' },
  { label: 'Billing', route: '/billing', disabled: true, tooltip: 'Upgrade to enable billing' },
  { label: 'Overview', route: '/overview', summary: 'Key metrics at a glance' },
  { label: 'Old page', route: '/old', deprecated: true, deprecatedAlternative: 'Use Overview' },
  { label: 'Moved', route: '/moved', redirect: '/overview' },
  { label: 'GitHub', externalUrl: 'https://github.com/fsegurai/ngx-sidenav' },
];
```

- `badgeColor` selects a `--badge-<color>` CSS variable (see [Theming](theming.md)).
- `disabled` items stay focusable with `aria-disabled`, so their tooltip is still reachable.
- `redirect` changes where the item links; `route` still identifies it for the active state.

## Precedence

The root menu comes from the `items` input first, then from `withManifest()`, then from the stack built with
`SidenavService`. Passing `undefined` falls back to the next source; an empty array renders an empty menu.
