---
label: Quick Start
description: Render a resizable sidenav with nested menu items in a standalone, zoneless Angular application.
order: 2
tags: [ "getting-started", "quick-start" ]
keywords: [ "standalone", "items input", "router" ]
icon: bolt
---

# Quick Start

## 1. Provide the router

The sidenav links are router links, so the application needs `provideRouter()`:

```typescript
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSidenav } from '@fsegurai/ngx-sidenav';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideRouter(routes), provideSidenav()],
};
```

`provideSidenav()` is optional for a static menu; it becomes useful for labels, manifests and search.

## 2. Render the sidenav

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav, type StackMenuItem } from '@fsegurai/ngx-sidenav';

@Component({
  selector: 'app-root',
  imports: [Sidenav, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="layout">
      <ngx-sidenav [items]="menu" [minWidth]="200" [maxWidth]="420" />
      <main><router-outlet /></main>
    </div>
  `,
})
export class App {
  protected readonly menu: StackMenuItem[] = [
    { label: 'Workspace', isTitle: true },
    { label: 'Dashboard', icon: 'dashboard', iconType: 'material', route: '/dashboard' },
    {
      label: 'Settings',
      icon: 'settings',
      iconType: 'material',
      isParent: true,
      children: [
        { label: 'Profile', route: '/settings/profile' },
        { label: 'Security', route: '/settings/security' },
      ],
    },
  ];
}
```

Clicking **Settings** pushes its children as a new level; the back row returns to the root. On reload, the stack
is rebuilt for the current route, so `/settings/security` opens the Settings level directly.

## 3. Lay it out

The host width is controlled by the sidenav (collapsed, or the resized width), so a simple flex or grid row works:

```css
.layout { display: flex; min-height: 100vh; }
.layout main { flex: 1 1 0; min-width: 0; }
```

## Next steps

- Load the menu from a [manifest](../guides/manifest-generator.md).
- Add a [search box](../guides/search-index.md).
