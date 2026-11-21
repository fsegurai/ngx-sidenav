---
label: Menu Composition
description: Header and footer slots, a row end template for custom badges, a collapsed icon rail, active-row scrolling and back-row context.
order: 10
tags: [ "guides", "customization", "22.2.0" ]
keywords: [ "ngxSidenavHeader", "ngxSidenavFooter", "ngxSidenavItemEnd", "collapsedMode", "rail", "scrollToActive", "backContext", "badges" ]
icon: dashboard_customize
---

# Menu Composition

Since 22.2.0 the panel can carry more than the menu. Every piece is opt-in: without them the sidenav renders exactly
as before.

```html
<ngx-sidenav
    [items]="menu"
    [search]="true"
    collapsedMode="rail"
    [scrollToActive]="true"
    [backContext]="true">
  <header ngxSidenavHeader>
    <app-project-badge /> <app-version-picker />
  </header>

  <ng-template ngxSidenavItemIcon let-item><app-icon [name]="item.icon" aria-hidden="true" /></ng-template>

  <ng-template ngxSidenavItemEnd let-item>
    @if (item.deprecated) { <span class="badge badge--warn">Deprecated</span> }
    @if (item.children?.length) { <span class="count">{{ item.children?.length }}</span> }
  </ng-template>

  <footer ngxSidenavFooter>Last updated Nov 18 · <a href="https://example.com/edit">Edit page</a></footer>
</ngx-sidenav>
```

Import `SidenavHeader`, `SidenavFooter`, `SidenavItemEnd` (and `SidenavItemIcon`) next to `Sidenav`.

## Header and footer

| Slot | Where | Tokens |
|------|-------|--------|
| `[ngxSidenavHeader]` | Above the search box and the menu | `--ngx-sidenav-header-padding` (`0 0 0.75rem`) |
| `[ngxSidenavFooter]` | After the menu; at the bottom of a short menu and pinned (sticky) under a long one | `--ngx-sidenav-footer-padding` (`0.75rem 0 0`), `--ngx-sidenav-footer-border-color`, `--ngx-sidenav-footer-background-color` |

Both are hidden while the sidenav is collapsed. With either slot present the panel content becomes a flex column so
the footer can sit at the bottom; the menu takes the remaining height.

## Row end

`<ng-template ngxSidenavItemEnd let-item>` renders after the label of every row, before the chevron of a parent, and
**replaces** the built-in badges, the deprecated one included. Use it for your own badge styles, child counts or
"New" / "Updated" markers computed from item metadata (`publishedAt`, `updatedAt`, or any extra key). The context is
the item, as `let-item` or `let-item="item"`.

## Icon rail

`collapsedMode="rail"` keeps a narrow column of icons when the sidenav is collapsed in side layout:

- the items of the current level that have an `icon`, in order; titles between them become separators, items without
  an icon are left out;
- a leaf navigates (external URLs open in a new tab), a parent expands the sidenav and opens its level;
- labels show as tooltips and name the controls; the active route is highlighted and has `aria-current="page"`;
- one tab stop: Arrow Down / Up, Home and End move between the controls.

The overlay layout (`mode="over"`, or `auto` below `handsetQuery`) keeps the collapsed strip.

| Token | Default |
|-------|---------|
| `--ngx-sidenav-rail-width` | `52px` |
| `--ngx-sidenav-rail-offset` | `48px` (below the toggle) |
| `--ngx-sidenav-rail-gap` | `4px` |
| `--ngx-sidenav-rail-item-size` | `36px` |
| `--ngx-sidenav-rail-item-background-color-hover` / `-active` | the hover / active row colors |

Icon size follows `--ngx-sidenav-menu-icon-size`; colors follow the link item text tokens.

## Active row and back-row context

- `scrollToActive` scrolls the row of the active route into view after the items render and after each navigation
  (`block: 'nearest'`, instant under `prefers-reduced-motion`); long levels scroll the virtual viewport to it.
- `backContext` adds the title of the level the back row returns to as its secondary line, e.g. **Components** over
  *API reference*. Nothing is added when it returns to an untitled root.
