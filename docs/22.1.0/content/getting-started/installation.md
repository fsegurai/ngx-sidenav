---
label: Installation
description: Install @fsegurai/ngx-sidenav with its Angular peers; Angular Material is not required.
order: 1
tags: [ "getting-started", "installation" ]
keywords: [ "npm", "bun", "peer dependencies", "material symbols" ]
icon: download
---

# Installation

Install the library with your package manager:

```bash
npm install @fsegurai/ngx-sidenav
# or
bun add @fsegurai/ngx-sidenav
```

## Peer dependencies

The package expects these Angular 22 packages in your application:

| Package | Why |
|---------|-----|
| `@angular/core`, `@angular/common` | Components, signals and `httpResource`. |
| `@angular/router` | Menu links, route-driven stack sync and search navigation. |
| `@angular/cdk` | Tooltips (overlay), focus trap of the overlay and backdrop modes, the `mode="auto"` breakpoint and virtual scrolling of long menus. |

```bash
npm install @angular/router @angular/cdk
```

Angular Material is **not** required (since 22.1.0). Keep it only if your application uses it.

## Icons

The built-in glyphs (back arrow, chevron, toggle, external link) are inline SVGs: no icon font is needed. Item icons
with `iconType: 'material'` render as `<span class="material-symbols-outlined">`; only if you use them, load the font
once, for example in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

Or render item icons with your own icon set through an
[item icon template](../guides/customization.md#item-icons).

## Next step

Render your first menu with the [Quick Start](quick-start.md).
