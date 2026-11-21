---
label: Programmatic Service
description: Drive the navigation stack from code with SidenavService: push, pop, restore and route sync.
order: 2
tags: [ "guides", "service" ]
keywords: [ "SidenavService", "push", "pop", "stack" ]
icon: code
---

# Programmatic Service

`SidenavService` (provided in root) owns the stack, the width and the expanded state.

## Push and pop levels

```typescript
import { inject } from '@angular/core';
import { SidenavService } from '@fsegurai/ngx-sidenav';

const sidenav = inject(SidenavService);

await sidenav.push({
  type: 'menu',
  title: 'Reports',
  items: [
    { label: 'Daily', route: '/reports/daily' },
    { label: 'Monthly', route: '/reports/monthly' },
  ],
});

await sidenav.pop();
```

`push()` and `pop()` resolve once the slide animation is over.

## Restore the stack

| Method | Use |
|--------|-----|
| `restoreStackFromMenuRoot(items)` | Rebuild the menu levels for the current route from root items (component levels on top are kept). |
| `restoreStackFromStorage()` | Restore the stack saved in `localStorage`. |
| `restoreStackHybrid(items?)` | Storage first, root items otherwise. |
| `syncStackWithRoute()` | Re-open the levels that lead to the current route (no-op when the level shown already lists it). |
| `clearOnNextReload()` | Forget the saved state on the next load. |

You rarely call these yourself: `<ngx-sidenav>` restores the stack for the active route after a reload and after every
router navigation (`NavigationEnd`), including a root you pushed with `push()`. When no item matches the route, the
levels shown before, or saved by the previous visit, are kept while they still exist in the menu; component levels on
top are always kept.

## State signals

`stack`, `currentMenu`, `canGoBack`, `isExpanded`, `sidenavWidth`, `minWidth` and `maxWidth` are read-only signals, so
templates and `computed()`s stay in sync without subscriptions. `toggleSidenav()` and `setSidenavWidth()` change the
state.
