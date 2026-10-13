---
label: Documentation Home
description: Documentation for @fsegurai/ngx-sidenav 22.0.0-beta.0, a resizable, stack-based Angular sidenav that renders manifest-generator navigation and search.
order: 0
tags: [ "documentation", "overview", "angular" ]
keywords: [ "sidenav", "navigation", "manifest", "search" ]
icon: home
breadcrumbTitle: Home
---

# @fsegurai/ngx-sidenav Docs

`@fsegurai/ngx-sidenav` is a resizable, collapsible Angular sidenav built on a navigation **stack**: every level you
open is pushed on the stack, and the back row pops it. A level is either a menu of items or any Angular component.

| Building block | What it is |
|----------------|------------|
| `Sidenav` | `<ngx-sidenav>`: the panel, its toggle, resize handle, optional backdrop and search box. |
| `SidenavMenu` | `<ngx-sidenav-menu>`: renders one level of `StackMenuItem`s. |
| `LinkItem` | `<ngx-sidenav-link-item>`: one accessible row (link, button, title or parent). |
| `SidenavSearch` | `<ngx-sidenav-search>`: a combobox over a search index. |
| `SidenavService` | The stack, width and expanded state, shared by everything above. |
| `provideSidenav()` | Global configuration, with the `withManifest()` and `withSearchIndex()` features. |

## Quick path

1. [Install](getting-started/installation.md) the package and its Angular peers.
2. Follow the [Quick Start](getting-started/quick-start.md) to render a menu.
3. Point the sidenav at a [manifest](guides/manifest-generator.md) and turn on [search](guides/search-index.md).

## Sections

- **Getting Started**: installation and a first menu.
- **Guides**: declarative items, the programmatic service, component stacking, manifests, search, custom schemas,
  theming, accessibility and labels.
- **API Reference**: every exported component, service and provider.
- **Migration**: moving from 20.x to 22.x.

## Version

These pages document `22.0.0`, which requires Angular 22.
