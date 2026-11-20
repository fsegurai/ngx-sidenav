// The playground has no build step: Angular compiles the templates in the browser (JIT),
// so the compiler must be loaded before anything else.
import '@angular/compiler';
import { Component, computed, DestroyRef, inject, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router, RouterOutlet, withHashLocation } from '@angular/router';
import { provideSidenav, Sidenav } from '@fsegurai/ngx-sidenav';

// The page of every route: it shows the URL the menu navigated to. The router reuses this component for every
// path, so the URL is kept in a signal updated on each NavigationEnd (the app is zoneless).
const RoutePage = Component({
  selector: 'app-route-page',
  template: `
    <h1>{{ title() }}</h1>
    <p class="route">Route: <code>{{ url() }}</code></p>
  `,
})(
  class {
    #router = inject(Router);
    url = signal(this.#router.url);
    title = computed(() => {
      const last = this.url().split(/[/#]/).filter(Boolean).pop() ?? 'home';
      return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
    });
    constructor() {
      const subscription = this.#router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) this.url.set(event.urlAfterRedirects);
      });
      inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }
  },
);

// The menu: section titles, a nested level (Settings → Security → …), a badge, a tooltip,
// a summary line, a disabled row and an external link (opens in a new tab).
const menu = [
  { label: 'Workspace', isTitle: true },
  { label: 'Dashboard', icon: 'dashboard', iconType: 'material', route: '/dashboard' },
  {
    label: 'Reports',
    icon: 'bar_chart',
    iconType: 'material',
    route: '/reports',
    badge: 'New',
    badgeColor: 'function',
  },
  { label: 'Inbox', icon: 'inbox', iconType: 'material', route: '/inbox', badge: 3, tooltip: '3 unread messages' },
  {
    label: 'Settings',
    icon: 'settings',
    iconType: 'material',
    isParent: true,
    children: [
      { label: 'Profile', route: '/settings/profile', summary: 'Name, avatar and bio' },
      {
        label: 'Security',
        isParent: true,
        children: [
          { label: 'Password', route: '/settings/security/password' },
          { label: 'Two-factor', route: '/settings/security/two-factor' },
        ],
      },
      { label: 'Billing', route: '/settings/billing', disabled: true, tooltip: 'Only owners can see billing' },
    ],
  },
  { label: 'Links', isTitle: true },
  {
    label: 'GitHub',
    icon: 'open_in_new',
    iconType: 'material',
    externalUrl: 'https://github.com/fsegurai/ngx-sidenav',
  },
];

const App = Component({
  selector: 'app-root',
  imports: [Sidenav, RouterOutlet],
  template: `
    <div class="layout">
      <!-- clearCacheOnReload: every run starts from the root level (the sandbox has no storage anyway). -->
      <ngx-sidenav
        [items]="menu"
        [minWidth]="200"
        [maxWidth]="420"
        [initialWidth]="260"
        [clearCacheOnReload]="true"
        (opened)="log('opened')"
        (closed)="log('closed')"
        (resized)="log('resized to ' + $event + 'px')"
      />
      <main>
        <router-outlet />
        <section class="events">
          <h2>Sidenav outputs</h2>
          <ol>
            @for (event of events(); track $index) {
              <li>{{ event }}</li>
            } @empty {
              <li>Collapse, expand or drag the edge of the panel.</li>
            }
          </ol>
        </section>
      </main>
    </div>
  `,
})(
  class {
    menu = menu;
    events = signal([]);
    log(event) {
      console.log('sidenav:', event);
      this.events.update((list) => [...list.slice(-5), event]);
    }
  },
);

// Hash routes keep navigation inside the sandboxed preview; every path renders RoutePage.
const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', component: RoutePage },
];

bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection(), provideRouter(routes, withHashLocation()), provideSidenav()],
}).then(() => console.log('ngx-sidenav items menu ready'));
