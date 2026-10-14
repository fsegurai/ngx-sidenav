<p align="center" class="intro">
  <img alt="NGX Sidenav Logo" src="https://raw.githubusercontent.com/fsegurai/ngx-sidenav/main/demo/public/ngx-sidenav.png">
</p>

<p align="center" class="intro">
  <a href="https://github.com/fsegurai/ngx-sidenav">
      <img src="https://img.shields.io/azure-devops/build/fsegurai/93779823-473d-4fb3-a5b1-27aaa1a88ea2/30/main?label=Build%20Status&"
          alt="Build Main Status">
  </a>
  <a href="https://github.com/fsegurai/ngx-sidenav/releases/latest">
      <img src="https://img.shields.io/github/v/release/fsegurai/ngx-sidenav"
          alt="Latest Release">
  </a>
  <br>
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/fsegurai/ngx-sidenav">
  <img alt="Dependency status for repo" src="https://img.shields.io/librariesio/github/fsegurai/ngx-sidenav">
  <a href="https://opensource.org/licenses/MIT">
    <img alt="GitHub License" src="https://img.shields.io/github/license/fsegurai/ngx-sidenav">
  </a>
  <br>
  <img alt="Stars" src="https://img.shields.io/github/stars/fsegurai/ngx-sidenav?style=square&labelColor=343b41"/> 
  <img alt="Forks" src="https://img.shields.io/github/forks/fsegurai/ngx-sidenav?style=square&labelColor=343b41"/>
  <a href="https://www.npmjs.com/package/@fsegurai/ngx-sidenav">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dt/@fsegurai/ngx-sidenav">
  </a>
</p>

`@fsegurai/ngx-sidenav` is an [Angular](https://angular.dev/) side navigation built for documentation sites and
applications: a resizable, collapsible panel with stacked menu levels, custom component levels, search, and native
support for the `manifest.json` and `search-index.json` written by
[`@fsegurai/manifest-generator`](https://github.com/fsegurai/manifest-generator).

### Table of contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
    - [Migrating from 20 to 22](#migrating-from-20-to-22)
- [Usage](#usage)
    - [Menu items](#menu-items)
    - [Programmatic navigation](#programmatic-navigation)
    - [Component stacking](#component-stacking)
    - [Manifest Generator integration](#manifest-generator-integration)
    - [Custom schemas](#custom-schemas)
    - [Search](#search)
    - [Large datasets](#large-datasets)
    - [Lazy levels and resilient sources](#lazy-levels-and-resilient-sources)
    - [Web Worker](#web-worker)
- [Theming](#theming)
- [API reference](#api-reference)
- [Accessibility](#accessibility)
- [Demo application](#demo-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Stacked navigation** — parents open a new level; a back row returns.
- **Route-aware restore** — after a reload, and after every navigation from outside the menu (links in the page,
  back/forward, search), the level containing the active route opens, whatever the menu source.
- **Resizable and collapsible** — pointer (mouse, touch, pen) and keyboard resizing, persisted width and state.
- **Component levels** — push any standalone component as a level, with `componentData` set as its inputs.
- **Manifest driven** — `withManifest()` builds the menu from manifest-generator's `manifest.json`, a signal or any
  schema through a mapper.
- **Search** — `withSearchIndex()` and `<ngx-sidenav-search>`: accent-insensitive ranking, heading anchors, WAI-ARIA
  combobox.
- **Lazy levels** — `loadChildren` loads a level on demand (loading row, error row with Retry, cache), and URL
  sources keep their data through failed reloads, with optional retries.
- **Accessible and translatable** — keyboard support, focus management, live announcements, `SIDENAV_LABELS`.
- **Modern Angular** — signals, standalone components, OnPush, zoneless and SSR-safe.

## Installation

```bash
npm install @fsegurai/ngx-sidenav @angular/router @angular/cdk @angular/material
# or
bun add @fsegurai/ngx-sidenav @angular/router @angular/cdk @angular/material
```

| Peer dependency                                                 | Why                                                     |
|-----------------------------------------------------------------|---------------------------------------------------------|
| `@angular/core`, `@angular/common`, `@angular/platform-browser` | Components, signals and `httpResource`                  |
| `@angular/router`                                               | Menu links, route-driven stack and search navigation    |
| `@angular/cdk`                                                  | Backdrop focus trap and virtual scrolling of long menus |
| `@angular/material`                                             | `mat-icon` and tooltips                                 |
| `rxjs`                                                          | Angular peer                                            |

Material icons use the `material-symbols-outlined` class; load the font once, e.g. in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
```

### Compatibility

| Angular | @fsegurai/ngx-sidenav |
|---------|-----------------------|
| 22      | 22.x                  |
| 20      | 20.x                  |

The library is zoneless-compatible and works with `provideZonelessChangeDetection()`.

## Configuration

`provideSidenav()` is optional for a static menu. Use it for labels, manifests and search:

```typescript
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSidenav, withManifest, withSearchIndex } from '@fsegurai/ngx-sidenav';
import { routes } from './app.routes';

const mapperOptions = { stripPrefix: 'content/', routePrefix: '/docs' };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideSidenav(
      { labels: { back: 'Back to' } },
      withManifest({ source: 'docs/1.0.0/manifest.json', mapperOptions }),
      withSearchIndex({ source: 'docs/1.0.0/search-index.json', mapperOptions }),
    ),
  ],
};
```

| Piece                       | Purpose                                                                          |
|-----------------------------|----------------------------------------------------------------------------------|
| `provideSidenav(config, …)` | Environment providers. `config.labels` overrides the English labels.             |
| `withManifest(options)`     | Root menu from a manifest. See [Manifest Generator](#manifest-generator-integration). |
| `withSearchIndex(options)`  | Search index. See [Search](#search).                                             |
| `provideSidenavLabels()`    | Same as `config.labels`, also usable in component `providers`.                   |

Only one feature of each kind is allowed. `HttpClient` is provided in root by Angular 22; add `provideHttpClient()`
only to configure it (interceptors are honored).

### Labels

Every text rendered or announced is in `SidenavLabels` (`toggleExpand`, `toggleCollapse`, `navigation`, `back`,
`resizeHandle`, `levelAnnouncement`, `opensInNewTab`, `deprecated`, `searchLabel`, `searchPlaceholder`,
`searchNoResults`, `searchIndexing`, `searchResultsCount`, `loading`, `loadError`, `retry`). `levelAnnouncement` and `searchResultsCount` accept a template
(`'{label} menu'`, `'{count} results'`) or a function.

```typescript
providers: [provideSidenavLabels({ back: 'Atrás', searchResultsCount: (n) => `${n} resultados` })]
```

### Migrating from 20 to 22

1. Update Angular to 22 and install the new peers: `@angular/router`, `@angular/cdk`, `@angular/material`.
2. If you swapped `(opened)` and `(closed)` to compensate for the old behavior, swap them back.
3. Call `isSlidingInFromLeft()` / `isSlidingInFromRight()`: they are signals now.
4. Update custom styles and tests that targeted the old item, title, toggle or resize-handle markup (see below).
5. If you call `restoreStackFromStorage()` yourself, pass the root items (`restoreStackFromStorage(rootItems)`); do not
   read or write `localStorage['ngx-sidenav-stack']` directly, its format changed.
6. Optionally replace a hand-written menu with `[items]` or a generated manifest.

| Before (20.x)                                                  | Now (22.x)                                                         |
|----------------------------------------------------------------|--------------------------------------------------------------------|
| `opened` fired on collapse, `closed` on expand                 | `opened` fires on expand, `closed` on collapse                     |
| `isSlidingInFromLeft` / `isSlidingInFromRight` were booleans   | Read-only signals                                                  |
| Items without a route rendered as empty links                  | Buttons; parents and the back row are buttons too                  |
| Title items were links and could pop the stack                 | Non-interactive text                                               |
| Disabled links kept their `href`                               | `aria-disabled`, no `href`                                         |
| The resize handle itself was the focus target                  | `hr.ngx-sidenav__resize-indicator`; the panel is a `<nav>`         |
| Escape always collapsed the panel                              | Escape collapses only in backdrop (modal) mode                     |
| `componentData` was ignored                                    | Each entry is set as an input; other keys are skipped with a warning |
| `initialWidth` overrode the width chosen by the user           | The persisted width wins (clamped); a first visit starts expanded  |
| `restoreStackHybrid()` replaced an existing stack              | It only fills an empty stack                                       |
| Route restore ignored the base href                            | The route comes from `Location.path()`                             |
| A route not in the menu reset the stack to the root            | The levels shown before (or saved by the last visit) are kept      |
| The stored stack held the menu items (`SerializableStackItem`) | It holds level keys (`{ "v": 2, "levels": [...] }`), migrated once |

The full list is in the [CHANGELOG](CHANGELOG.md).

## Usage

### Menu items

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
  styles: `.layout { display: flex; min-height: 100vh; } main { flex: 1 1 0; min-width: 0; }`,
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
        { label: 'Security', route: '/settings/security', badge: 'New', badgeColor: 'function' },
      ],
    },
    { label: 'GitHub', externalUrl: 'https://github.com/fsegurai/ngx-sidenav' },
  ];
}
```

`<ngx-sidenav>` renders its own menu: pass items through `[items]`, a manifest or `SidenavService` (it has no content
projection). Root menu precedence: the `items` input, then `withManifest()`, then the service stack.

**Route-aware restore.** The stack follows the router, the same way for every source (`[items]`, a manifest that
resolves after the first render, or a root pushed through `SidenavService`):

- After a reload, and after each navigation (`NavigationEnd`: links in the page, back/forward, search), the level that
  contains the active route opens, its parents stacked below. On reload, `/settings/security` opens the Settings level.
- A navigation to a route already listed in the level shown keeps that level.
- When no item matches the route, the levels shown before (or saved by the previous visit) are kept while they still
  exist in the menu, otherwise the root is shown.
- Component levels pushed on top (component stacking) stay on top; the expanded state and width are persisted.

### Programmatic navigation

`SidenavService` is provided in root:

```typescript
import { inject } from '@angular/core';
import { SidenavService } from '@fsegurai/ngx-sidenav';

const sidenav = inject(SidenavService);

await sidenav.push({ type: 'menu', title: 'Reports', items: [{ label: 'Monthly', route: '/reports/monthly' }] });
await sidenav.pop();
sidenav.toggleSidenav();
sidenav.setSidenavWidth(320);
```

### Component stacking

Push any standalone component as a level. Each `componentData` entry is set with `ComponentRef.setInput()`; keys
that are not inputs are skipped with a warning.

```typescript
@Component({ selector: 'app-project-filters', template: `Filters for {{ projectId() }}` })
export class ProjectFilters {
  readonly projectId = input.required<number>();
}

// In the page that shows the level
constructor() {
  const sidenav = inject(SidenavService);
  afterNextRender(() => {
    const top = sidenav.stack().at(-1);
    // Already shown (e.g. the page was re-entered): do not stack it twice
    if (top && isComponentStackItem(top) && top.component === ProjectFilters) return;
    void sidenav.push({
      type: 'component',
      component: ProjectFilters,
      componentData: { projectId: 42 },
      title: 'Project filters', // label of the back row above the component
    });
  });
}
```

A component level shows the toggle and a back row (labelled with its `title`) above the component, and it stays
while links inside it navigate, until the back row is used. Do not pop it when the page is destroyed: following one
of its links destroys the page, and the sidenav would fall back to the previous (often the root) menu. Root items
that resolve or change later (a manifest, the `items` input) keep component levels on top. Component levels are not
saved to `localStorage`; menu levels are, by reference (the route or label of the item each level was opened
from), and rebuilt from the live root items on the next visit.

### Manifest Generator integration

1. Write Markdown pages with front-matter (`label`, `order`, `icon`, `badge`, …).
2. Generate the files:

   ```bash
   manifest-generator --route ./docs/1.0.0/content --output ./docs/1.0.0
   ```

3. Provide the manifest and leave `items` unset (`<ngx-sidenav />`):

   ```typescript
   provideSidenav(
     {},
     withManifest({
       source: 'docs/1.0.0/manifest.json',
       mapperOptions: { stripPrefix: 'content/', routePrefix: '/docs' },
     }),
   );
   ```

| Option                        | Effect                                                                               |
|-------------------------------|--------------------------------------------------------------------------------------|
| `source`                      | A URL (fetched with `httpResource`), a signal (`undefined` = not ready) or an array  |
| `mapperOptions.stripPrefix`   | Removes a leading part of every route, e.g. `content/`                              |
| `mapperOptions.routePrefix`   | Prefix (string) or function applied after `stripPrefix`: `content/a` → `/docs/a`     |
| `mapper`                      | Replaces the default `fromManifestGenerator` mapper                                  |
| `childrenSource`              | Split manifests: URL of the manifest holding an item's children (lazy level)         |
| `retry`                       | `{ attempts, delayMs }`: retries of a transient failure with backoff (off by default) |

Items are sorted by `order`; absolute `redirect`s and `externalUrl`s are kept. `SidenavManifestService` exposes
`items`, `status` (`idle` · `loading` · `refreshing` · `resolved` · `error`), `error` and `reload()`. A failed reload
keeps the last good items (`status` stays `resolved`, `error` is set).

### Custom schemas

Both features accept a `mapper` for any other schema:

```typescript
interface BookChapter { title: string; slug: string; sections?: BookChapter[] }

const toItems = (chapters: BookChapter[]): StackMenuItem[] =>
  chapters.map((chapter) => ({
    label: chapter.title,
    route: `/book/${chapter.slug}`,
    children: chapter.sections && toItems(chapter.sections),
  }));

provideSidenav(
  {},
  withManifest<BookChapter[]>({ source: 'book.json', mapper: toItems }),
  withSearchIndex<BookChapter[]>({
    source: 'book.json',
    mapper: (chapters) => chapters.map((c) => ({ label: c.title, route: `/book/${c.slug}` })),
  }),
);
```

A mapper that throws sets the feature `status` to `error`. `fromManifestGenerator()`, `fromManifestGeneratorLazy()` (the
default of `withManifest()`: children mapped on first read) and `fromManifestSearchIndex()` are exported for
post-processing inside your own mapper.

### Search

```typescript
withSearchIndex({ source: 'docs/1.0.0/search-index.json', mapperOptions, limit: 10, minQueryLength: 2, debounceMs: 150 })
```

| Option           | Default | Description                                                                          |
|------------------|---------|--------------------------------------------------------------------------------------|
| `limit`          | `10`    | Maximum number of results                                                            |
| `minQueryLength` | `2`     | Shorter queries (trimmed) return no results                                          |
| `debounceMs`     | `150`   | Delay between the last keystroke and the query; `0` queries synchronously            |
| `retry`          | off     | `{ attempts, delayMs }`: retries of a transient failure with exponential backoff     |

```html
<!-- inside the panel -->
<ngx-sidenav [search]="true" />

<!-- or anywhere else; Ctrl+K / Cmd+K focuses it -->
<ngx-sidenav-search [shortcut]="true" (navigated)="onResult($event)" />
```

- Ranking by field: label, headings, tags and keywords, description, excerpt. Case- and accent-insensitive.
- A heading match navigates to `route#anchor`, built with `slugifyHeading()` (the same ids as `@fsegurai/ngx-markdown`
  `[headingIds]`).
- Absolute result routes open in a new tab.
- `SidenavSearchService` exposes `query`, `results`, `pending`, `entries`, `status`, `error`, `setQuery()`,
  `search(query)` and `reload()` for custom UIs. `status()` is `indexing` while a large index is built in the
  background (the box shows the `searchIndexing` label); `pending()` is `true` while the results do not answer the
  current query yet (debounce, chunked scan).

### Large datasets

Menus with tens of thousands of items stay responsive:

- `withManifest()` maps only the root level up front; deeper levels are mapped when opened.
- The routes of the root menu are indexed in the background, in small chunks that yield to the browser, so the root
  level renders right away. `SidenavService.routeIndexReady` tells when the index is complete; a route deep in the
  menu is opened as soon as the index reaches it.
- The stored stack only holds level keys (a few hundred bytes), and writes are batched when the browser is idle.
- Menu items are treated as immutable: after changing items in place (`children.push(…)`), call
  `SidenavService.reindex()`.
- The search index is normalized right after it loads (in background chunks above 2000 entries), queries are
  debounced, and indexes above 5000 entries are scanned in chunks; a newer query cancels a stale one.

A custom `mapper` may return the whole tree: it is indexed the same way. Prefer stable `route`s on parent items, so
stored levels and route syncs find them even when labels change.

Measured on 100k menu items and 50k search entries:

| Operation | Before | After |
|-----------|--------|-------|
| Root menu available | 40–109 ms, blocking | ≤ 1.1 ms |
| Route lookup on navigation | 2–7 ms | ≤ 0.06 ms |
| Stack save | 20–60 ms, 6.2 MB | < 4 KB, idle-time write |
| Search: first keystroke | ~205 ms, blocking | ~10 ms |
| Search queries `a` / `al` / `alp` | 54 / 44 / 41 ms | 7.8 / 10.3 / 12.3 ms |

Recommended settings by dataset size, benchmarks (`bun run bench:lib`) and the demo stress test page (`/stress`) are
in the [Performance and Large Datasets guide](docs/22.0.0/content/guides/performance.md).

### Lazy levels and resilient sources

A parent item can load its children when it is opened:

```typescript
{ label: 'API', route: '/api', loadChildren: (signal) => fetch('/api/menu.json', { signal }).then((r) => r.json()) }
```

- `loadChildren(signal?)` returns a `Promise` or an `Observable` of `StackMenuItem[]`. The level shows a loading row
  (`aria-busy`, announced politely), then the items, or an error row with a Retry button.
- Results are cached per item and concurrent requests are shared; leaving the level before it resolves aborts `signal`.
- A route under a lazy parent is found after a reload: the deepest lazy parent whose `route` prefixes it is loaded
  first (up to 8 nested levels). Stored levels work the same way.
- `withManifest({ childrenSource: (item) => url })` splits a manifest into one file per section.
- URL sources keep the last good data when a reload fails (`status` stays `resolved`, `error` is set), report
  `refreshing` while reloading, and retry transient failures (network, 408, 429, 5xx) with `retry: { attempts, delayMs }`.

See the [Lazy Levels guide](docs/22.0.0/content/guides/lazy-levels.md).

### Web Worker

Large search indexes can be built and scanned off the main thread. Create a worker file:

```typescript
// search.worker.ts
import { exposeSidenavWorker } from '@fsegurai/ngx-sidenav/worker';

exposeSidenavWorker();
```

and pass its factory to `withSearchIndex()`:

```typescript
withSearchIndex({
  source: '/docs/search-index.json',
  mapperOptions,
  worker: () => new Worker(new URL('./search.worker', import.meta.url), { type: 'module' }),
})
```

- The worker is only used for indexes above 2000 entries; smaller ones are searched synchronously.
- The source is still loaded and mapped on the main thread (interceptors, `retry`, `reload()` and `entries()` keep
  working), then the mapped entries are copied to the worker once. A custom `mapper` runs on the main thread too.
- `status`, `pending`, debounce and cancellation behave as without the worker; `search()` (synchronous) builds a
  main-thread index on first use.
- Without `Worker` (server rendering, unit tests), when the factory throws (e.g. a CSP), or when the worker fails, the
  search falls back to the chunked main-thread path (a warning is logged once in dev mode). The worker is terminated
  when the application is destroyed.
- `ngx-sidenav/worker` does not import Angular, so the worker bundle only contains the search core. With the Angular
  CLI, set `webWorkerTsConfig` (a tsconfig with `"lib": ["es2022", "webworker"]`) to type-check the worker file.

See the [Web Worker guide](docs/22.0.0/content/guides/web-worker.md).

## Theming

The sidenav and its search box ship light and dark defaults (WCAG AA text contrast in both). The scheme is chosen by:

1. an ancestor with `.dark-theme` / `[data-theme='dark']` or `.light-theme` / `[data-theme='light']`;
2. otherwise `--ngx-sidenav-color-scheme` (`light`, `dark` or `light dark`) when set;
3. otherwise the page `color-scheme`, so `:root { color-scheme: light dark; }` follows `prefers-color-scheme`.

The defaults use the CSS `light-dark()` function; browsers without it get the light values. Every color and spacing
is also a CSS custom property, which wins over the defaults. Set them on any ancestor (`:root`, a theme class):

```css
.dark-theme {
  --ngx-sidenav-container-background-color: #1e1e2e;
  --ngx-sidenav-link-item-text-color: #cdd6f4;
  --ngx-sidenav-link-item-text-color-active: #89b4fa;
  --ngx-sidenav-link-item-border-left-color-active: #89b4fa;
  --ngx-sidenav-focus-ring: #89b4fa;
}
```

| Area          | Variables (prefix `--ngx-sidenav-`)                                                                                                                                                                                     |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Panel         | `color-scheme`, `text-color`, `container-background-color`, `content-background-color`, `content-background-color-hover`, `padding-inline`, `padding-block`, `focus-ring`                                         |
| Width         | `min-width`, `expanded-min-width`, `max-width` (set from the `collapseWidth`, `minWidth`, `maxWidth` inputs)                                                                                                         |
| Items         | `link-item-text-color[-hover\|-active]`, `link-item-background-color[-hover\|-active]`, `link-item-border-left-color[-hover\|-active]`, `link-item-box-shadow-color-{hover,active}`, `link-item-outline-color-{hover,active}`, `link-item-padding`, `link-item-margin-left`, `link-item-expanded-min-width`, `link-item-summary-opacity`, `link-item-disabled-opacity`, `link-item-external-icon-size` |
| Parents/titles | `link-item-parent-background-color`, `link-item-parent-text-color`, `link-item-title-background-color`, `link-item-title-text-color`                                                                                 |
| Menu          | `menu-back-background-color`, `menu-back-blur`, `menu-viewport-padding`, `menu-badge-text-transform`, `menu-badge-deprecated-color`, `item-height` (set from the `itemHeight` input: the fixed height of virtual scroll rows) |
| Toggle        | `toggle-background-color[-hover]`, `toggle-border-color[-hover]`, `toggle-icon-color`, `toggle-outline-color`                                                                                                        |
| Resize handle | `resize-handle-indicator-background-color[-hover]`, `resize-handle-indicator-line-background-color`, `resize-handle-icon-indicator-{color,background-color,border-color}[-hover]`, `resize-handle-icon-indicator-line-{color,background-color,border-color}`, `resize-handle-icon-outline-color` |
| Search        | `search-text-color`, `search-input-{text-color,background-color,border-color,border-color-hover,border-radius,padding-block,padding-inline,placeholder-color}`, `search-icon-color`, `search-outline-color`, `search-listbox-{background-color,border-color,border-radius,box-shadow,max-height,z-index}`, `search-option-{padding,text-color,background-color-hover,background-color-active,outline-color-active}`, `search-mark-{background-color,text-color}`, `search-meta-text-color`, `search-excerpt-text-color`, `search-meta-opacity`, `search-excerpt-opacity`, `search-margin-block-end` |

**Badges** — `badgeColor: 'function'` reads `--badge-function`. Built-in names: `class`, `constant`, `decorator`,
`directive`, `element`, `enum`, `function`, `interface`, `pipe`, `impure-pipe`, `module`, `alias`, `block`,
`deprecated`, `custom`.

## API reference

### `<ngx-sidenav>` (`Sidenav`)

| Input                | Type                           | Default         | Description                                              |
|----------------------|--------------------------------|-----------------|----------------------------------------------------------|
| `items`              | `StackMenuItem[] \| undefined` | `undefined`     | Root menu; `[]` resets to an empty menu                  |
| `search`             | `boolean`                      | `false`         | Renders `<ngx-sidenav-search>` (needs `withSearchIndex`) |
| `collapseWidth`      | `number`                       | `30`            | Collapsed width (px)                                     |
| `minWidth`           | `number`                       | `250`           | Minimum expanded width (px)                              |
| `maxWidth`           | `number`                       | `600`           | Maximum width (px)                                       |
| `initialWidth`       | `number`                       | `300`           | First-visit width; a persisted width wins                |
| `clearCacheOnReload` | `boolean`                      | `false`         | Drops the saved stack on the next reload                 |
| `position`           | `'left' \| 'right'`            | `'left'`        | Side of the page                                         |
| `direction`          | `'ltr' \| 'rtl'`               | `'ltr'`         | Text direction of the panel                              |
| `backdrop`           | `boolean`                      | `false`         | Modal mode: backdrop, focus trap, Escape to collapse     |
| `canCollapse`        | `boolean`                      | `true`          | Shows the toggle button                                  |
| `canResize`          | `boolean`                      | `true`          | Shows the resize handle                                  |
| `menuIconCollapse`   | `string`                       | `'menu_open'`   | Toggle icon while expanded                               |
| `menuIconExpand`     | `string`                       | `'menu'`        | Toggle icon while collapsed                              |

| Output    | Payload  | When                         |
|-----------|----------|------------------------------|
| `opened`  | `void`   | The panel expands            |
| `closed`  | `void`   | The panel collapses          |
| `resized` | `number` | The width changed (px)       |

### `<ngx-sidenav-search>` (`SidenavSearch`)

| Member               | Kind   | Description                                               |
|----------------------|--------|-----------------------------------------------------------|
| `shortcut`           | input  | `boolean`, default `false`: Ctrl+K / Cmd+K focuses the box |
| `navigated`          | output | `SidenavSearchResult`, once its navigation succeeded      |
| `focus()`            | method | Focuses the box                                           |

### `<ngx-sidenav-menu>` and `<ngx-sidenav-link-item>`

Rendered by `<ngx-sidenav>`; exported for custom layouts. `SidenavMenu` inputs: `items`, `parentLabel`, `parentBadge`,
`parentBadgeColor`, `virtualScrollThreshold` (`50`), `virtualBufferSize` (`200`), `itemHeight` (`48`, the virtual scroll
item size and the fixed height of virtual rows, exposed as `--ngx-sidenav-item-height`). `LinkItem`
inputs: `routerLink`, `externalUrl`, `routerLinkActiveOptions`, `isTitle`, `isParent`, `isDisabled`, `label`,
`summary`, `tooltip`; output `activated`.

### `SidenavService`

| Method                                                 | Description                                                  |
|--------------------------------------------------------|--------------------------------------------------------------|
| `push(item)`                                           | Pushes a `MenuStackItem` or `ComponentStackItem`; resolves after the animation |
| `pushLevel(item)` / `retryLevel()`                     | Opens a parent item's level (loading lazy children); loads a failed lazy level again |
| `pop()`                                                | Pops the current level (no-op on the root)                   |
| `restoreStackFromMenuRoot(items)`                      | Rebuilds the menu levels for the current route; component levels on top are kept |
| `restoreStackFromStorage(items?)` / `restoreStackHybrid(items?)` | Restores the saved levels from the root `items`; hybrid only fills an empty stack |
| `syncStackWithRoute()`                                 | Re-opens the levels leading to the current route (no-op when the level shown lists it); `<ngx-sidenav>` calls it after every navigation |
| `toggleSidenav()` / `setSidenavWidth(width)`           | Expanded state and width                                     |
| `setConfig({ minWidth, maxWidth, initialWidth })`      | Width limits                                                 |
| `clearOnNextReload()`                                  | Drops the saved stack on the next load                       |

Signals: `stack`, `currentMenu`, `canGoBack`, `routeIndexReady`, `isExpanded`, `sidenavWidth`, `minWidth`, `maxWidth`, `isSlidingInFromLeft`,
`isSlidingInFromRight`.

### `StackMenuItem`

| Property                                   | Description                                                      |
|--------------------------------------------|------------------------------------------------------------------|
| `label`                                    | Text of the item (required)                                      |
| `route`                                    | Router link; items without one render as buttons                 |
| `children`, `isParent`                     | Child level opened on click                                      |
| `loadChildren`                             | `(signal?) => Promise \| Observable` of the children (lazy level) |
| `isTitle`                                  | Section title (not interactive)                                  |
| `icon`, `iconType`                         | Icon name; `'material'`, `'svg'` or `'custom'`                   |
| `badge`, `badgeColor`                      | Badge text and color name                                        |
| `summary`, `description`, `tooltip`        | Secondary text and tooltip                                       |
| `disabled`                                 | Rendered with `aria-disabled`                                    |
| `externalUrl`                              | Absolute URL opened in a new tab; wins over `route`              |
| `redirect`                                 | Link target when the page moved                                  |
| `deprecated`, `deprecatedAlternative`      | "Deprecated" badge; the alternative is shown in the tooltip      |
| `breadcrumb`, `keywords`, `tags`, `order`, `layout` | Metadata for mappers and search (not rendered)          |

Other exports: `MenuStackItem`, `ComponentStackItem`, `SidenavStackItem`, `isMenuStackItem()`,
`isComponentStackItem()`, `ContentAreaDirective`, `SidenavManifestService`, `SidenavSearchService`,
`fromManifestGenerator()`, `fromManifestSearchIndex()`, `rankSearchEntries()`, `highlightSegments()`,
`normalizeSearchText()`, `slugifyHeading()`, `SIDENAV_LABELS`, `DEFAULT_SIDENAV_LABELS`.

## Accessibility

| Area   | Behavior                                                                                                   |
|--------|------------------------------------------------------------------------------------------------------------|
| Panel  | `<nav>` with an accessible name; the toggle exposes `aria-expanded` and `aria-controls`                     |
| Resize | Focusable separator: arrow keys resize (RTL-aware), Home / End jump to the limits                           |
| Modal  | With `backdrop`, focus is trapped while expanded and restored on close; Escape collapses                    |
| Menu   | Links are links, parents and route-less items are buttons, titles are text; disabled items keep their tooltip |
| Levels | Opening or leaving a level moves focus into it and is announced politely                                   |
| Links  | External links announce "opens in new tab"                                                                  |
| Search | WAI-ARIA combobox: Arrow keys, Home / End, Enter, Escape; result count in a live region; matches in `<mark>` |

## Demo application

The demo dogfoods the library: its menu and search come from its own docs, generated with manifest-generator.

```bash
git clone https://github.com/fsegurai/ngx-sidenav.git
cd ngx-sidenav
bun install
bun start            # library watch build + demo at http://localhost:4200
```

## Contributing

Contributions are welcome. Read the [contributing guide](CONTRIBUTING.md) for setup, tests (Vitest), linting (Biome)
and the commit convention.

## License

Licensed under [MIT](https://opensource.org/licenses/MIT).
