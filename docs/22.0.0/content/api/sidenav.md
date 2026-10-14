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
| `backdrop` | `boolean` | `false` | Modal mode with a backdrop and focus trap. |
| `clearCacheOnReload` | `boolean` | `false` | Ignore the saved state on load. |
| `menuIconCollapse` / `menuIconExpand` | `string` | `menu_open` / `menu` | Toggle icons. |

## Outputs

| Output | Payload | When |
|--------|---------|------|
| `opened` | `void` | The panel expanded. |
| `closed` | `void` | The panel collapsed. |
| `resized` | `number` | A resize ended, with the new width. |
