---
label: Responsive Layout
description: Overlay the page on small screens with mode, handsetQuery and collapseOnNavigate.
order: 7
tags: [ "guides", "layout", "responsive" ]
keywords: [ "mode", "over", "auto", "handsetQuery", "collapseOnNavigate", "mobile", "overlay" ]
icon: devices
---

# Responsive Layout

Since 22.1.0 `<ngx-sidenav>` can sit next to the content, overlay the page, or switch between both with a media
query:

```html
<ngx-sidenav [items]="menu" mode="auto" handsetQuery="(max-width: 999.98px)" [collapseOnNavigate]="true" />
```

| Input | Default | Effect |
|-------|---------|--------|
| `mode` | `'side'` | `side`: next to the content (as in 22.0). `over`: fixed overlay with a backdrop, focus trap and Escape. `auto`: `over` while `handsetQuery` matches, `side` otherwise. |
| `handsetQuery` | `'(max-width: 959.98px)'` | Media query of `auto` (`DEFAULT_SIDENAV_HANDSET_QUERY`), observed with the CDK `BreakpointObserver` only in `auto`. |
| `collapseOnNavigate` | `false` | Collapses the overlay after each router navigation; ignored in `side`. |

Entering the overlay collapses the panel; leaving it restores the expanded state it had before.

## Styling the overlay

The overlay host gets the `ngx-sidenav--over` class and is `position: fixed`:

| Variable | Default | Effect |
|----------|---------|--------|
| `--ngx-sidenav-over-inset-block` | `0` | Top and bottom offsets of the fixed panel. |
| `--ngx-sidenav-over-z-index` | `1000` | Stacking order above the page. |
| `--ngx-sidenav-over-background-color` | the container background | Panel background while it overlays. |
| `--ngx-sidenav-backdrop-color` | `rgba(0, 0, 0, 0.32)` | The backdrop behind the panel. |

To start below a fixed 64px header, offset the panel (or override the position with your own host selector):

```css
ngx-sidenav {
  --ngx-sidenav-over-inset-block: 64px 0;
}
```

The default `mode="side"` keeps the 22.0 layout, so nothing changes until you opt in.
