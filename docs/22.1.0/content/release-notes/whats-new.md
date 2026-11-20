---
label: What's New in 22.1.0
description: The highlights of 22.1.0, a minor release without Angular Material, with customization through CSS variables, class hooks and templates, a responsive overlay mode, factory providers and manifest page helpers.
order: 1
tags: [ "release-notes", "22.1.0" ]
keywords: [ "what's new", "angular material", "customization", "mode", "handsetQuery", "withManifest", "findManifestItem" ]
icon: auto_awesome
---

# What's New in 22.1.0

> **⚠️ Upgrade notes.** `@angular/material` is no longer a peer dependency and the internal markup changed
> (`mat-icon` and `MatTooltip` are gone). Read [From 22.0 to 22.1](../migration/22-0-to-22-1.md) before upgrading.

## No Angular Material

The library only needs `@angular/cdk`. The back arrow, chevron, toggle and external-link icons are inline SVG glyphs
that follow `currentColor`; tooltips use `SidenavTooltip`, a CDK overlay directive styled by
`--ngx-sidenav-tooltip-*`; `iconType: 'material'` icons render as a Material Symbols `<span>` (load the font only if
you use them).

## Bring your own icons and glyphs

```html
<ngx-sidenav [items]="menu">
  <ng-template ngxSidenavItemIcon let-item><app-icon [name]="item.icon" aria-hidden="true" /></ng-template>
  <ng-template ngxSidenavGlyph="chevron"><app-icon name="chevron-right" /></ng-template>
</ngx-sidenav>
```

See [Customization](../guides/customization.md).

## More theming variables

142 CSS variables, all listed with their defaults in the README: the rail (`--ngx-sidenav-rail-color`), the
active-row indicator (`--ngx-sidenav-link-indicator-*`), the scrollbar (`--ngx-sidenav-scrollbar-thumb-color[-hover]`),
the tooltip (`--ngx-sidenav-tooltip-*`), icon sizes (`--ngx-sidenav-menu-icon-size` `20px`,
`--ngx-sidenav-menu-icon-box-size` `24px`, `--ngx-sidenav-toggle-icon-size`), and typography, spacing and radius of
rows, badges, the toggle, the backdrop, the resize grip and the search. See [Theming](../guides/theming.md).

## Responsive overlay

```html
<ngx-sidenav [items]="menu" mode="auto" [collapseOnNavigate]="true" />
```

`mode` (`side`, `over`, `auto`), `handsetQuery` and `collapseOnNavigate`. See
[Responsive Layout](../guides/responsive-layout.md).

## Factory providers

```typescript
provideSidenav(
  {},
  withManifest(() => ({ source: inject(DocsService).manifest })),
  withSearchIndex(() => ({ source: inject(DocsSearch).entries, mapper: (entries) => entries })),
);
```

The factory runs in an injection context. See [Providers](../api/providers.md#factory-options).

## Manifest page helpers

`findManifestItem()`, `adjacentItems()` and `breadcrumbFor()` build the current page, previous/next links and
breadcrumbs from the mapped items; `fromManifestGenerator()` now copies `breadcrumbTitle`, `publishedAt` and
`updatedAt`. See [Manifest Generator](../guides/manifest-generator.md#6-page-helpers).

## Shortcut coexistence

With `[shortcut]="true"`, `<ngx-sidenav-search>` ignores a Ctrl/Cmd+K event that another handler already
`preventDefault()`ed, so an app-wide search keeps the shortcut. It stays off by default.

The full list is in the [CHANGELOG](https://github.com/fsegurai/ngx-sidenav/blob/main/CHANGELOG.md).
