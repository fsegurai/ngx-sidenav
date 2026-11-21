---
label: Customization
description: Bring your own icons, glyphs and styles with item icon templates, glyph templates, class hooks, icon sizes and the CDK tooltip.
order: 9
tags: [ "guides", "customization", "theming" ]
keywords: [ "icons", "glyphs", "templates", "ngxSidenavItemIcon", "ngxSidenavGlyph", "class hooks", "tooltip" ]
icon: tune
---

# Customization

Since 22.1.0 the sidenav has no Angular Material dependency: every glyph is an inline SVG that follows
`currentColor`, and every visual detail is reachable through a CSS variable, a stable class or a template. Colors and
sizes are in [Theming](theming.md); this page covers what replaces markup.

## Item icons

By default `iconType: 'svg'` renders an `<img>` and `iconType: 'material'` a Material Symbols ligature
(`<span class="material-symbols-outlined">`, which needs the font). To use your own icon set, place an
`ngxSidenavItemIcon` template inside `<ngx-sidenav>` (or `<ngx-sidenav-menu>`); it renders the icon of every item that
has an `icon`:

```html
<ngx-sidenav [items]="menu">
  <ng-template ngxSidenavItemIcon let-item>
    <app-icon [name]="item.icon" aria-hidden="true" />
  </ng-template>
</ngx-sidenav>
```

Import `SidenavItemIcon` next to `Sidenav`. The context is the item (`let-item`, also `let-item="item"`); keep the
icon decorative, the label already names the item. `<ngx-sidenav-menu>` also takes the template through its
`iconTemplate` input.

## Glyphs

The fixed glyphs are `back` (back row), `chevron` (parent rows), `external` (external links), `expand` (toggle while
collapsed) and `collapse` (toggle while expanded). Replace any of them with an `ngxSidenavGlyph` template:

```html
<ngx-sidenav [items]="menu">
  <ng-template ngxSidenavGlyph="chevron"><app-icon name="chevron-right" /></ng-template>
  <ng-template ngxSidenavGlyph="expand"><app-icon name="panel-open" /></ng-template>
  <ng-template ngxSidenavGlyph="collapse"><app-icon name="panel-close" /></ng-template>
</ngx-sidenav>
```

Import `SidenavGlyph`. The output is wrapped in an `aria-hidden` element with the built-in glyph's class plus
`--custom` (for example `ngx-sidenav-menu__icon--chevron ngx-sidenav-menu__icon--custom`), and the template gets the
glyph name as `let-name`. A glyph template wins over `menuIconExpand` / `menuIconCollapse`.

## Icon sizes

| Variable | Default | Sizes |
|----------|---------|-------|
| `--ngx-sidenav-menu-icon-size` | `20px` | The item, back and chevron glyphs. |
| `--ngx-sidenav-menu-icon-box-size` | `24px` | The box the menu icons sit in (the glyph is centered in it). |
| `--ngx-sidenav-toggle-icon-size` | `24px` | The toggle glyph. |
| `--ngx-sidenav-link-item-external-icon-size` | `16px` | The external-link glyph. |

```css
:root {
  --ngx-sidenav-menu-icon-size: 18px;
  --ngx-sidenav-menu-icon-box-size: 22px;
}
```

## Class hooks

Every element has a stable BEM class, so plain CSS (global styles, or `::ng-deep` from a component) can restyle what
the variables do not cover:

| Element | Classes |
|---------|---------|
| Host | `ngx-sidenav`, state classes `is-expanded`, `resizing`, `sidenav-right`, `ngx-sidenav--over` |
| Panel | `ngx-sidenav__container` (`<nav>`), `ngx-sidenav__content`, `ngx-sidenav__search`, `ngx-sidenav__backdrop` |
| Toggle | `ngx-sidenav__toggle` (`--expanded`, `--rotated`), `ngx-sidenav__toggle-icon` (`--custom` for a glyph template) |
| Resize handle | `ngx-sidenav__resize-handle` (`--resizing`), `ngx-sidenav__resize-indicator` (`<hr>`), `ngx-sidenav__resize-icon` |
| Menu | `ngx-sidenav-menu` (`--virtual`), `ngx-sidenav-menu__back`, `__item-wrapper`, `__viewport`, `__icon` (`--back`, `--chevron`, `--svg`, `--custom`), `__badge` (`--<badgeColor>`, `--deprecated`), `__status` (`--loading`, `--error`), `__spinner`, `__retry` |
| Row | `ngx-sidenav-link` (`--title`, `--parent`, `--external`, `--disabled`, `.active`), `ngx-sidenav-link__content`, `__label`, `__summary`, `__external-icon` (`--custom`), `__sr-only` |
| Tooltip | `ngx-sidenav-tooltip` (panel), `ngx-sidenav-tooltip-pane` (CDK overlay pane) |
| Search | `ngx-sidenav-search` and its `ngx-sidenav-search__*` elements |

## Tooltip

Row and resize-handle tooltips use `SidenavTooltip`, a small CDK overlay directive (`[ngxSidenavTooltip]`, with
`ngxSidenavTooltipPosition`: `above`, `below`, `left` or `right`). It shows on hover and keyboard focus and hides on
leave, blur and Escape. The panel renders in the CDK overlay container, outside `<ngx-sidenav>`, so set the
`--ngx-sidenav-tooltip-*` variables on `:root`:

```css
:root {
  --ngx-sidenav-tooltip-background-color: #1e1e2e;
  --ngx-sidenav-tooltip-text-color: #cdd6f4;
  --ngx-sidenav-tooltip-border-radius: 6px;
}
```

You can use the directive on your own elements too:

```html
<button type="button" ngxSidenavTooltip="Coming soon" ngxSidenavTooltipPosition="right">Reports</button>
```
