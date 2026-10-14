---
label: Sidenav Service
description: SidenavService methods and signals, and the stack item types.
order: 5
tags: [ "api", "service" ]
keywords: [ "SidenavService", "MenuStackItem", "ComponentStackItem", "SidenavStackItem" ]
icon: settings
---

# Sidenav Service

`SidenavService` is provided in root.

## Methods

| Method | Description |
|--------|-------------|
| `push(item)` | Pushes a `MenuStackItem` or `ComponentStackItem`; resolves after the animation. |
| `pop()` | Pops the current level. |
| `restoreStackFromMenuRoot(items)` | Rebuilds the menu levels for the current route; component levels on top are kept. |
| `restoreStackFromStorage(items?)` / `restoreStackHybrid(items?)` | Restores the saved stack (without `items`, from the root menu already in the stack). |
| `syncStackWithRoute()` | Re-opens the levels leading to the current route. |
| `reindex()` | Rebuilds the route index after menu items were changed in place, then restores the stack for the current route. |
| `toggleSidenav()` / `setSidenavWidth(width)` | Expanded state and width. |
| `setConfig({ minWidth, maxWidth, initialWidth })` | Width limits. |
| `clearOnNextReload()` | Drops the saved state on the next load. |

## Signals

`stack` (all levels, root first), `currentMenu`, `canGoBack`, `isExpanded`, `sidenavWidth`, `minWidth`, `maxWidth`, `isSlidingInFromLeft`,
`isSlidingInFromRight`.

## Stack items

```typescript
type SidenavStackItem = MenuStackItem | ComponentStackItem;

interface MenuStackItem { type: 'menu'; items: StackMenuItem[]; title?: string; badge?: string | number; badgeColor?: string }
interface ComponentStackItem { type: 'component'; component: Type<unknown>; componentData?: Record<string, unknown>; title?: string }
```

`isMenuStackItem()` and `isComponentStackItem()` narrow a stack item.
