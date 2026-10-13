---
label: Installation
description: Install @fsegurai/ngx-sidenav with its Angular peers and load the Material Symbols font.
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
| `@angular/cdk` | Focus trap of the backdrop mode and virtual scrolling of long menus. |
| `@angular/material` | `mat-icon` and tooltips. |

```bash
npm install @angular/router @angular/cdk @angular/material
```

## Icons

Material icons are rendered with the `material-symbols-outlined` class. Load the font once, for example in
`index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

## Next step

Render your first menu with the [Quick Start](quick-start.md).
