// The playground has no build step: Angular compiles the templates in the browser (JIT),
// so the compiler must be loaded before anything else.
import '@angular/compiler';
import { Component, computed, DestroyRef, inject, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router, RouterOutlet, withHashLocation } from '@angular/router';
import { provideSidenav, Sidenav, SidenavManifestService, withManifest, withSearchIndex } from '@fsegurai/ngx-sidenav';

// What @fsegurai/manifest-generator writes to manifest.json: folders become parents, pages carry front-matter.
// `source` also accepts a URL or a signal; an inline value keeps the sample free of network requests.
const manifest = [
  { label: 'Introduction', route: 'content/README', icon: 'home', description: 'What Acme UI is and who it is for.' },
  {
    label: 'Getting Started',
    route: 'content/getting-started',
    isParent: true,
    icon: 'rocket_launch',
    children: [
      { label: 'Installation', route: 'content/getting-started/installation', icon: 'download' },
      { label: 'First component', route: 'content/getting-started/first-component', icon: 'bolt' },
    ],
  },
  {
    label: 'Guides',
    route: 'content/guides',
    isParent: true,
    icon: 'menu_book',
    children: [
      { label: 'Theming', route: 'content/guides/theming', icon: 'palette', badge: 'New', badgeColor: 'function' },
      { label: 'Forms', route: 'content/guides/forms', icon: 'edit_note' },
      { label: 'Accessibility', route: 'content/guides/accessibility', icon: 'accessibility_new' },
    ],
  },
  { label: 'Changelog', route: 'content/changelog', icon: 'history' },
];

// What manifest-generator writes to search-index.json: one entry per page, with headings and an excerpt.
const searchIndex = [
  {
    label: 'Introduction',
    route: 'content/README',
    description: 'What Acme UI is and who it is for.',
    headings: ['Why Acme UI', 'Browser support'],
    tags: ['overview'],
  },
  {
    label: 'Installation',
    route: 'content/getting-started/installation',
    description: 'Add the package and its peers.',
    headings: ['Package managers', 'Peer dependencies'],
    tags: ['setup'],
    breadcrumb: [
      { label: 'Getting Started', route: 'content/getting-started' },
      { label: 'Installation', route: 'content/getting-started/installation' },
    ],
  },
  {
    label: 'First component',
    route: 'content/getting-started/first-component',
    description: 'Render a button and a card.',
    headings: ['Import the module', 'Render a card'],
    tags: ['setup'],
    breadcrumb: [
      { label: 'Getting Started', route: 'content/getting-started' },
      { label: 'First component', route: 'content/getting-started/first-component' },
    ],
  },
  {
    label: 'Theming',
    route: 'content/guides/theming',
    description: 'Colors, typography and dark mode with CSS variables.',
    headings: ['Custom colors', 'Dark mode', 'Typography'],
    tags: ['css', 'theme'],
    excerpt: 'Every color is a CSS custom property, so a theme is a set of variables.',
    breadcrumb: [
      { label: 'Guides', route: 'content/guides' },
      { label: 'Theming', route: 'content/guides/theming' },
    ],
  },
  {
    label: 'Forms',
    route: 'content/guides/forms',
    description: 'Inputs, validation messages and form layout.',
    headings: ['Validation', 'Error messages'],
    tags: ['forms'],
    breadcrumb: [
      { label: 'Guides', route: 'content/guides' },
      { label: 'Forms', route: 'content/guides/forms' },
    ],
  },
  {
    label: 'Accessibility',
    route: 'content/guides/accessibility',
    description: 'Keyboard support, focus and screen readers.',
    headings: ['Keyboard', 'Focus management', 'Dark mode contrast'],
    tags: ['a11y'],
    breadcrumb: [
      { label: 'Guides', route: 'content/guides' },
      { label: 'Accessibility', route: 'content/guides/accessibility' },
    ],
  },
  {
    label: 'Changelog',
    route: 'content/changelog',
    description: 'Release notes.',
    headings: ['2.0.0', '1.4.0'],
    tags: ['releases'],
  },
];

// `content/guides/theming` becomes `/docs/guides/theming`.
const mapperOptions = { stripPrefix: 'content/', routePrefix: '/docs' };

// The same rules as slugifyHeading() for these simple headings: "Dark mode" → "dark-mode".
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-|-$/g, '');

// The docs page: it finds its entry in the search index and renders its headings with ids, so a search
// result that matched a heading (route#anchor) lands on it.
const DocPage = Component({
  selector: 'app-doc-page',
  template: `
    @if (page(); as page) {
      <h1>{{ page.label }}</h1>
      <p class="route">Route: <code>{{ url() }}</code></p>
      <p class="lead">{{ page.description }}</p>
      <div class="headings">
        @for (heading of page.headings ?? []; track heading) {
          <h2 [id]="slug(heading)">{{ heading }}</h2>
          <p>Content of the {{ heading }} section.</p>
        }
      </div>
    } @else {
      <h1>Not found</h1>
      <p class="route">Route: <code>{{ url() }}</code></p>
    }
    <p class="hint">Try the search box: "dark" matches the Theming and Accessibility headings, "setup" matches by tag.</p>
  `,
})(
  class {
    #router = inject(Router);
    url = signal(this.#router.url);
    slug = slug;
    page = computed(() => {
      const path =
        this.url()
          .split('#')[0]
          .replace(/^\/docs\/?/, '') || 'README';
      return searchIndex.find((entry) => entry.route === `content/${path}`);
    });
    constructor() {
      // The router reuses this component for every page, so the URL is followed in a signal (the app is zoneless).
      const subscription = this.#router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.url.set(event.urlAfterRedirects);
          const fragment = this.#router.parseUrl(event.urlAfterRedirects).fragment;
          if (fragment) setTimeout(() => document.getElementById(fragment)?.scrollIntoView());
        }
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
      <!-- No [items]: the sidenav renders the manifest; [search] adds the box fed by withSearchIndex. -->
      <ngx-sidenav [search]="true" [initialWidth]="280" [clearCacheOnReload]="true" />
      <main><router-outlet /></main>
    </div>
  `,
})(
  class {
    constructor() {
      const manifestService = inject(SidenavManifestService);
      // status(): idle, loading, resolved or error.
      setTimeout(() =>
        console.log('manifest status:', manifestService.status(), '-', manifestService.items().length, 'root items'),
      );
    }
  },
);

const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'docs/README' },
  { path: 'docs', children: [{ path: '**', component: DocPage }] },
];

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideSidenav(
      {},
      withManifest({ source: manifest, mapperOptions }),
      withSearchIndex({ source: searchIndex, mapperOptions, limit: 8, minQueryLength: 2 }),
    ),
  ],
}).then(() => console.log('ngx-sidenav manifest and search ready'));
