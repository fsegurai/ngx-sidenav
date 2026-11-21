---
label: Sidenav
description: Inputs and outputs of the ngx-sidenav component.
order: 1
tags: [ "api", "component" ]
keywords: [ "ngx-sidenav", "inputs", "outputs" ]
icon: view_sidebar
---

# Sidenav

`<ngx-sidenav>`: the resizable panel.

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `StackMenuItem[] \| undefined` | `undefined` | Root menu; falls back to the manifest, then the service stack. |
| `search` | `boolean` | `false` | Renders the search box (needs `withSearchIndex()`). |
| `minWidth` / `maxWidth` | `number` | `250` / `600` | Resize limits in pixels. |
| `initialWidth` | `number` | `300` | Width before any resize. |
| `collapseWidth` | `number` | `30` | Width when collapsed. |
| `canCollapse` / `canResize` | `boolean` | `true` | Show the toggle / the resize handle. |
| `position` | `'left' \| 'right'` | `'left'` | Side of the screen. |
| `direction` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction. |
| `mode` | `'side' \| 'over' \| 'auto'` | `'side'` | `side`: next to the content. `over`: fixed overlay with a backdrop, focus trap and Escape. `auto`: `over` while `handsetQuery` matches. See [Responsive Layout](../guides/responsive-layout.md). |
| `handsetQuery` | `string` | `'(max-width: 959.98px)'` | Media query of `mode="auto"` (`DEFAULT_SIDENAV_HANDSET_QUERY`). |
| `collapseOnNavigate` | `boolean` | `false` | Collapses the overlay after each router navigation; ignored in `side`. |
| `backdrop` | `boolean` | `false` | Modal mode with a backdrop and focus trap (implied by the overlay). |
| `clearCacheOnReload` | `boolean` | `false` | Ignore the saved state on load. |
| `collapsedMode` | `'strip' \| 'rail'` | `'strip'` | Collapsed look: the toggle only, or an icon rail of the current level (side layout). See [Menu Composition](../guides/menu-composition.md). |
| `scrollToActive` | `boolean` | `false` | Keeps the active row in view after rendering and after each navigation. |
| `backContext` | `boolean` | `false` | The back row shows the title of the level it returns to. |
| `menuIconCollapse` / `menuIconExpand` | `string \| undefined` | `undefined` | Toggle icons: built-in SVGs by default; a value renders that Material Symbols ligature. A `collapse` / `expand` glyph template wins. |

## Outputs

| Output | Payload | When |
|--------|---------|------|
| `opened` | `void` | The panel expanded. |
| `closed` | `void` | The panel collapsed. |
| `resized` | `number` | A resize ended, with the new width. |

## Content templates

| Template | Effect |
|----------|--------|
| `<ng-template ngxSidenavItemIcon let-item>` | Renders the icon of every item that has an `icon` (`SidenavItemIcon`). |
| `<ng-template ngxSidenavItemEnd let-item>` | Renders the end of every row instead of the built-in badges (`SidenavItemEnd`). |
| `<… ngxSidenavHeader>` / `<… ngxSidenavFooter>` | Content above the search box and menu / pinned below the menu, hidden while collapsed (`SidenavHeader`, `SidenavFooter`). |
| `<ng-template ngxSidenavGlyph="back \| chevron \| external \| expand \| collapse">` | Replaces a built-in SVG glyph (`SidenavGlyph`). |

See [Customization](../guides/customization.md) and [Menu Composition](../guides/menu-composition.md).
