---
label: Accessibility
description: Keyboard support, ARIA roles and focus management of the sidenav, menu and search box.
order: 8
tags: [ "guides", "accessibility" ]
keywords: [ "a11y", "keyboard", "aria", "focus trap", "screen reader" ]
icon: accessibility
---

# Accessibility

## Panel

- The panel is a `<nav>` with an accessible name (`labels.navigation`).
- The toggle button exposes `aria-expanded` and `aria-controls`.
- The resize handle is a focusable separator: arrow keys resize, Home and End jump to the limits.
- In backdrop mode the panel is modal: focus is trapped and restored on close, and Escape collapses it.

## Menu

- Links are links, parents and route-less items are buttons, titles are plain text.
- Opening a level announces it politely (`labels.levelAnnouncement`) and moves focus into it; the back row returns.
- Disabled items use `aria-disabled` so their tooltip stays reachable.
- External links announce `labels.opensInNewTab`.

## Search

The box follows the WAI-ARIA combobox pattern with list autocomplete:

| Key | Action |
|-----|--------|
| Arrow Down / Up | Move the active option (wrapping). |
| Home / End | First / last option. |
| Enter | Open the active option, or the first one. |
| Escape | Close the list, then clear the query. |

The result count is announced in a polite live region; matches are highlighted with `<mark>`.
