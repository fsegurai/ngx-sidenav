---
label: Theming
description: Light and dark defaults, and CSS custom properties to restyle the sidenav, its search box, toggle, resize handle and badges.
order: 8
tags: [ "guides", "theming" ]
keywords: [ "css variables", "dark mode", "light-dark", "color-scheme", "search", "badges", "tooltip", "icon size" ]
icon: palette
---

# Theming

## Light and dark

The sidenav, its menu and its search box ship light and dark defaults; their text meets WCAG AA (4.5:1) in both.
The scheme is chosen by, in order:

1. an ancestor with `.dark-theme` / `[data-theme='dark']` or `.light-theme` / `[data-theme='light']`;
2. `--ngx-sidenav-color-scheme` (`light`, `dark` or `light dark`) when it is set;
3. the page `color-scheme`, so the sidenav follows `prefers-color-scheme` once the page opts in:

```css
:root {
  color-scheme: light dark;
}
```

A theme toggle only has to switch a class or attribute on `<html>` or `<body>`:

```typescript
document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
```

The defaults use the CSS `light-dark()` function; browsers without it get the light values.

## Custom colors

Every color is also a CSS custom property, which wins over the defaults, so a theme is a set of variables on any
ancestor:

```css
.dark-theme {
  --ngx-sidenav-container-background-color: #1e1e2e;
  --ngx-sidenav-link-item-text-color: #cdd6f4;
  --ngx-sidenav-link-item-text-color-active: #89b4fa;
  --ngx-sidenav-link-item-border-left-color-active: #89b4fa;
  --ngx-sidenav-search-listbox-background-color: #181825;
  --ngx-sidenav-focus-ring: #89b4fa;
}
```

## Main variables

| Area | Variables |
|------|-----------|
| Scheme | `--ngx-sidenav-color-scheme` |
| Panel | `--ngx-sidenav-text-color`, `--ngx-sidenav-container-background-color`, `--ngx-sidenav-focus-ring`, `--ngx-sidenav-font-family` |
| Scrollbar | `--ngx-sidenav-scrollbar-thumb-color`, `--ngx-sidenav-scrollbar-thumb-color-hover` (the old `--ngx-sidenav-content-background-color[-hover]` still works as a fallback) |
| Rail | `--ngx-sidenav-rail-color`: the vertical line along the rows |
| Active indicator | `--ngx-sidenav-link-indicator-{color,width,inset,scale,radius,hover-opacity,hover-scale}`, `--ngx-sidenav-link-active-font-weight` |
| Items | `--ngx-sidenav-link-item-text-color`, `-hover`, `-active` variants, `--ngx-sidenav-link-item-background-color-hover`, `--ngx-sidenav-item-radius`, `--ngx-sidenav-link-item-{font-size,font-weight,line-height,gap,summary-font-size,title-font-weight}` |
| Icon sizes | `--ngx-sidenav-menu-icon-size` (`20px`, the glyph), `--ngx-sidenav-menu-icon-box-size` (`24px`, the box it sits in), `--ngx-sidenav-toggle-icon-size` (`24px`), `--ngx-sidenav-link-item-external-icon-size` (`16px`) |
| Badges | `--ngx-sidenav-menu-badge-{font-size,font-weight,padding,border-radius}` |
| Tooltip | `--ngx-sidenav-tooltip-{background-color,text-color,font-family,font-size,line-height,padding,border-radius,max-width,box-shadow,color-scheme}`; set them on `:root`, the panel renders in the CDK overlay container |
| Overlay | `--ngx-sidenav-over-inset-block`, `--ngx-sidenav-over-z-index`, `--ngx-sidenav-over-background-color`, `--ngx-sidenav-backdrop-color` |
| Row height | `--ngx-sidenav-item-height`: the fixed height of virtual scroll rows, set from the `itemHeight` input of `<ngx-sidenav-menu>` (48px by default); change the input rather than the variable |
| Toggle | `--ngx-sidenav-toggle-background-color`, `--ngx-sidenav-toggle-icon-color`, `--ngx-sidenav-toggle-border-color`, `--ngx-sidenav-toggle-{top,padding,border-radius,box-shadow,box-shadow-hover}` |
| Resize handle | `--ngx-sidenav-resize-handle-indicator-background-color`, `--ngx-sidenav-resize-handle-icon-indicator-color` |
| Search input | `--ngx-sidenav-search-text-color`, `--ngx-sidenav-search-input-{text-color,background-color,border-color,border-color-hover,placeholder-color}`, `--ngx-sidenav-search-icon-color`, `--ngx-sidenav-search-outline-color` |
| Search results | `--ngx-sidenav-search-listbox-{background-color,border-color,box-shadow}`, `--ngx-sidenav-search-option-{text-color,background-color-hover,background-color-active,outline-color-active}`, `--ngx-sidenav-search-mark-{background-color,text-color}`, `--ngx-sidenav-search-meta-text-color` (breadcrumb, heading, empty state), `--ngx-sidenav-search-excerpt-text-color` |

When you override a background, override the text on it too and keep 4.5:1 contrast. The README lists all 142
variables with their defaults, the light/dark tokens and the class hooks; icons, glyphs and markup-level overrides are
in [Customization](customization.md).

## Badges

`badgeColor: 'class'` reads `--badge-class`. Built-in names: `class`, `constant`, `decorator`, `directive`,
`element`, `enum`, `function`, `interface`, `pipe`, `impure-pipe`, `module`, `alias`, `block`, `deprecated` and
`custom`. Any other name works once you define its variable.
