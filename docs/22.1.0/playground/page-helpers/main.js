// The playground has no build step: Angular compiles the templates in the browser (JIT),
// so the compiler must be loaded before anything else.
import '@angular/compiler';
import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router, RouterLink, RouterOutlet, withHashLocation } from '@angular/router';
import {
  adjacentItems,
  breadcrumbFor,
  findManifestItem,
  fromManifestGenerator,
  provideSidenav,
  Sidenav,
} from '@fsegurai/ngx-sidenav';

// What @fsegurai/manifest-generator writes to manifest.json: folders become parents, pages carry front-matter
// (`breadcrumbTitle`, `publishedAt`, `updatedAt`, `order`). Levels are sorted by `order` when mapped.
const manifest = [
  {
    label: 'Introduction',
    route: 'content/README',
    breadcrumbTitle: 'Home',
    icon: 'home',
    description: 'What Acme UI is and who it is for.',
    publishedAt: '2026-01-12',
    order: 1,
  },
  {
    label: 'Getting Started',
    route: 'content/getting-started',
    breadcrumbTitle: 'Start',
    isParent: true,
    icon: 'rocket_launch',
    description: 'From an empty project to a first screen.',
    order: 2,
    children: [
      // Listed out of order on purpose: `order` puts Installation first.
      {
        label: 'Your first component',
        route: 'content/getting-started/first-component',
        breadcrumbTitle: 'First component',
        icon: 'bolt',
        description: 'Render a button and a card.',
        publishedAt: '2026-02-03',
        updatedAt: '2026-10-21',
        order: 2,
      },
      {
        label: 'Installation',
        route: 'content/getting-started/installation',
        icon: 'download',
        description: 'Add the package and its peers.',
        publishedAt: '2026-01-12',
        updatedAt: '2026-11-02',
        order: 1,
      },
    ],
  },
  {
    label: 'Guides',
    route: 'content/guides',
    isParent: true,
    icon: 'menu_book',
    description: 'Task-oriented guides.',
    order: 3,
    children: [
      {
        label: 'Theming with CSS variables',
        route: 'content/guides/theming',
        breadcrumbTitle: 'Theming',
        icon: 'palette',
        description: 'Colors, typography and dark mode.',
        publishedAt: '2026-03-18',
        badge: 'New',
        badgeColor: 'function',
      },
      {
        label: 'Forms',
        route: 'content/guides/forms',
        icon: 'edit_note',
        description: 'Inputs, validation messages and form layout.',
        publishedAt: '2026-04-07',
        // An explicit breadcrumb (manifest-generator writes one per page) wins over the ancestor chain.
        breadcrumb: [
          { label: 'Docs', route: 'content/README' },
          { label: 'Guides', route: 'content/guides' },
          { label: 'Forms', route: 'content/guides/forms' },
        ],
      },
    ],
  },
  // External items open a new tab and are skipped by adjacentItems() and the other helpers.
  { label: 'GitHub', icon: 'open_in_new', externalUrl: 'https://github.com/fsegurai/ngx-sidenav', order: 4 },
  { label: 'Changelog', route: 'content/changelog', icon: 'history', publishedAt: '2026-11-19', order: 5 },
];

// `content/guides/theming` becomes `/docs/guides/theming`. The helpers are pure functions over these mapped items.
const items = fromManifestGenerator(manifest, { stripPrefix: 'content/', routePrefix: '/docs' });

// The docs page: everything around the content comes from the helpers, given the current URL.
const DocPage = Component({
  selector: 'app-doc-page',
  imports: [RouterLink, DatePipe],
  template: `
    @if (page(); as page) {
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          @for (crumb of crumbs(); track crumb.route; let last = $last) {
            <li>
              @if (last) {
                <span aria-current="page">{{ crumb.label }}</span>
              } @else {
                <a [routerLink]="crumb.route">{{ crumb.label }}</a>
              }
            </li>
          }
        </ol>
      </nav>
      <h1>{{ page.label }}</h1>
      <p class="meta">
        @if (page.publishedAt) {
          <span>Published {{ page.publishedAt | date: 'mediumDate' }}</span>
        }
        @if (page.updatedAt) {
          <span>Updated {{ page.updatedAt | date: 'mediumDate' }}</span>
        }
        <span>Route: <code>{{ url() }}</code></span>
      </p>
      <p class="lead">{{ page.description }}</p>

      <nav class="pager" aria-label="Previous and next pages">
        @if (adjacent().previous; as previous) {
          <a class="previous" [routerLink]="previous.route">
            <small>Previous</small>
            <span>{{ previous.label }}</span>
          </a>
        }
        @if (adjacent().next; as next) {
          <a class="next" [routerLink]="next.route">
            <small>Next</small>
            <span>{{ next.label }}</span>
          </a>
        }
      </nav>

      <dl class="helpers">
        <dt><code>findManifestItem(items, url)</code></dt>
        <dd>{{ page.label }}</dd>
        <dt><code>breadcrumbFor(items, url)</code></dt>
        <dd>{{ page.breadcrumb ? "the page's own breadcrumb" : 'ancestors, labelled with breadcrumbTitle or label' }}</dd>
        <dt><code>adjacentItems(items, url)</code></dt>
        <dd>{{ adjacent().previous?.label ?? 'none' }} ← → {{ adjacent().next?.label ?? 'none' }}</dd>
      </dl>
    } @else {
      <h1>Not found</h1>
      <p class="meta">findManifestItem() found no page for <code>{{ url() }}</code>.</p>
    }
    <p class="hint">
      Walk the docs with Previous and Next: they follow the menu's reading order (parents included, GitHub skipped).
      Forms has its own breadcrumb; the other pages build it from their ancestors.
    </p>
  `,
})(
  class {
    #router = inject(Router);
    url = signal(this.#router.url);
    // router.url can be passed as is: the helpers ignore a query string, a hash and extra slashes.
    page = computed(() => findManifestItem(items, this.url()));
    crumbs = computed(() => breadcrumbFor(items, this.url()));
    adjacent = computed(() => adjacentItems(items, this.url()));
    constructor() {
      // The router reuses this component for every page, so the URL is followed in a signal (the app is zoneless).
      const subscription = this.#router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) this.url.set(event.urlAfterRedirects);
      });
      inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }
  },
);

const App = Component({
  selector: 'app-root',
  imports: [Sidenav, RouterOutlet],
  template: `
    <div class="layout">
      <ngx-sidenav [items]="items" [initialWidth]="280" [clearCacheOnReload]="true" />
      <main><router-outlet /></main>
    </div>
  `,
})(
  class {
    items = items;
  },
);

const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'docs/README' },
  { path: 'docs', children: [{ path: '**', component: DocPage }] },
];

bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection(), provideRouter(routes, withHashLocation()), provideSidenav()],
}).then(() => console.log('ngx-sidenav page helpers ready'));
