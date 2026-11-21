# 📦 Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

---

## [Unreleased]

No changes yet.

---

## [22.2.0] - 2026-11-21

Opt-in features for richer menus. Nothing changes until you use them: defaults render exactly as in 22.1.

### ✨ Added

- **Header and footer slots** — elements marked `ngxSidenavHeader` render above the search box and the menu,
  `ngxSidenavFooter` after the menu, pinned to the bottom of the panel; both are hidden while collapsed. Tokens
  `--ngx-sidenav-header-padding`, `--ngx-sidenav-footer-padding`, `--ngx-sidenav-footer-border-color`,
  `--ngx-sidenav-footer-background-color`.
- **Row end template** — `<ng-template ngxSidenavItemEnd let-item>` renders the end of every row (before the chevron of
  a parent) instead of the built-in badges: custom badges, counts or markers. `SidenavMenu` gets an `endTemplate` input.
- **Icon rail** — `collapsedMode="rail"` shows the icons of the current level's items while the sidenav is collapsed
  (side layout): a vertical toolbar with one tab stop and Up / Down / Home / End, labels as tooltips, the active route
  marked with `aria-current="page"`; a parent expands the sidenav and opens its level. Tokens
  `--ngx-sidenav-rail-width|-offset|-gap|-item-size|-item-background-color-hover|-item-background-color-active`, and an
  optional `rail` label (falls back to `navigation`).
- **`scrollToActive`** — keeps the active row in view after the items render and after each navigation, virtual
  viewport included (instant under `prefers-reduced-motion`).
- **`backContext`** — the back row shows the title of the level it returns to as its secondary line.

## [22.1.0] - 2026-11-20

### ⚠️ Upgrade notes ⚠️

> **This minor release changes markup and peer dependencies.** The library's major version tracks Angular's, so these
> changes ship in `22.1.0` instead of a new major. Read
> [Migrating from 22.0 to 22.1](README.md#migrating-from-220-to-221-angular-material-is-no-longer-required) (or the
> [22.1 migration guide](docs/22.1.0/content/migration/22-0-to-22-1.md)) before upgrading.

- **No Angular Material** — `@angular/material` is no longer a peer dependency; only `@angular/cdk` is needed. Remove
  Material if nothing else in your app uses it.
- **Markup** — `<mat-icon>` and `MatTooltip` are gone: the back arrow, chevron, toggle and external-link icons are
  inline SVG glyphs (same class names), tooltips use `SidenavTooltip` (CDK overlay, `.ngx-sidenav-tooltip`), and
  `iconType: 'material'` icons render as `<span class="material-symbols-outlined">`. Update styles and tests that
  targeted `mat-icon`, `.mat-mdc-tooltip` or `MatTooltip`; load the Material Symbols font only if you use ligatures.
- **Tooltip variables on `:root`** — the tooltip panel renders in the CDK overlay container, outside `<ngx-sidenav>`,
  so set `--ngx-sidenav-tooltip-*` on `:root` (or another ancestor of the overlay container).
- **Toggle icons** — `menuIconCollapse` / `menuIconExpand` default to `undefined` (built-in SVGs) instead of
  `'menu_open'` / `'menu'`; setting them still renders that Material Symbols ligature.
- **Overlay layout** — the new `mode="over"` (and `mode="auto"` below `handsetQuery`) makes the host
  `position: fixed` (`.ngx-sidenav--over`); override it with your own host selector, e.g. to start below a header.
  The default `mode="side"` keeps the previous layout.

### 🚀 Features

- **Item icon template** — `<ng-template ngxSidenavItemIcon let-item>` inside `<ngx-sidenav>` or
  `<ngx-sidenav-menu>` (or `SidenavMenu.iconTemplate`) renders every item icon with the app's own icon set.
- **Glyph templates** — `<ng-template ngxSidenavGlyph="back | chevron | external | expand | collapse">` inside
  `<ngx-sidenav>` or `<ngx-sidenav-menu>` replaces a built-in SVG glyph (wrapped in an `aria-hidden` element with the
  glyph's class plus `--custom`); it wins over `menuIconExpand` / `menuIconCollapse`.
- **Factory options** — `withManifest(() => options)` and `withSearchIndex(() => options)` are evaluated in an injection
  context, so options can `inject()` services (current project, version, signals); the object form is unchanged.
- **Responsive mode** — `mode` (`'side'` default, `'over'`, `'auto'`), `handsetQuery` (default
  `DEFAULT_SIDENAV_HANDSET_QUERY`, `(max-width: 959.98px)`, observed with the CDK `BreakpointObserver` only in `auto`)
  and `collapseOnNavigate` (default `false`) on `<ngx-sidenav>`. The overlay is fixed, shows the backdrop and traps
  focus; entering it collapses the panel and leaving it restores the previous state.
- **Theming tokens** — `--ngx-sidenav-rail-color`, the active-row indicator (`--ngx-sidenav-link-indicator-{color,width,
  inset,scale,radius,hover-opacity,hover-scale}`), `--ngx-sidenav-link-active-font-weight`, `--ngx-sidenav-item-radius`,
  `--ngx-sidenav-menu-icon-size` and `--ngx-sidenav-toggle-icon-size`; typography, spacing and radius variables for
  rows (`link-item-{font-size,font-weight,line-height,gap,summary-font-size,title-font-weight}`), badges
  (`menu-badge-{font-size,font-weight,padding,border-radius}`), the toggle (`toggle-{top,padding,border-radius,
  box-shadow,box-shadow-hover}`), the backdrop (`backdrop-color`), the resize grip (`resize-handle-icon-border-radius`),
  the search (`search-{font-size,option-border-radius,meta-font-size,label-font-weight,excerpt-font-size,
  status-font-size,mark-border-radius}`) and the panel (`font-family`). Defaults keep the current look; the README
  lists every variable with its default, the light/dark tokens and the class hooks.
- **Manifest page helpers** — `findManifestItem()`, `adjacentItems()` and `breadcrumbFor()`: pure functions over mapped
  items for the current page, previous/next links and breadcrumbs.
- **Manifest dates** — `fromManifestGenerator()` and `fromManifestGeneratorLazy()` copy `breadcrumbTitle`,
  `publishedAt` and `updatedAt` to the items (new optional `StackMenuItem` fields).

### 🐞 Fixes

- **Ctrl/Cmd+K coexistence** — with `[shortcut]="true"`, `<ngx-sidenav-search>` ignores a Ctrl/Cmd+K event that another
  handler already `preventDefault()`ed, so an app-wide search keeps the shortcut (the shortcut stays off by default).

### 🔧 Changes

- **Scrollbar variable** — the content scrollbar thumb reads `--ngx-sidenav-scrollbar-thumb-color[-hover]`;
  `--ngx-sidenav-content-background-color[-hover]` is deprecated and kept as a fallback.
- **Active row** — the accent line of the active row is an indicator drawn over the rail (`::before`) instead of the
  row border color; it looks the same with the default variables.

### 📝 Documentation

- **README** — "Migrating from 22.0 to 22.1", responsive layout, item icon and glyph templates, every CSS variable with
  its default (142), the light/dark tokens and the class hooks.
- **Docs** — versioned pages for `22.1.0`: what's new, a 22.0 to 22.1 migration guide, customization (CSS
  variables, class hooks, icon and glyph templates), responsive mode and manifest helpers; playground samples without
  Angular Material, plus custom icon templates and `mode="auto"`.

### 🔧 Infrastructure

- **Biome 2.6** — `biome.json` migrated with `biome migrate` (schema `2.6.8`); `*.md`, `*.yml`, `*.yaml` and `*.scss`
  are excluded in `files.includes` to keep the previous lint scope (Biome 2.6 checks them by default).
- **manifest-generator 1.2.0** — the docs manifests use `@fsegurai/manifest-generator` `^1.2.0`, exempt from
  `minimumReleaseAge` as a first-party package; the generated docs output is unchanged.
- **scrollspy 2.2.0** — the demo's table of contents uses `@fsegurai/scrollspy` `^2.2.0`, also exempt from
  `minimumReleaseAge`; no code change needed.
- **ngx-markdown 22.1.0** — the demo's documentation pages use `@fsegurai/ngx-markdown` `22.1.0`, exempt from
  `minimumReleaseAge` as a first-party package; no code change needed.
- **GitHub workflows** — aligned with the Arkenda conventions: header comments (Azure DevOps stays the source repository),
  read-only default permissions, job timeouts, Bun `1.4.3` with `--frozen-lockfile`, current action majors, and new
  `dependency-audit.yml` and `security-scan.yml` (CodeQL and Bun audit). `test.yml` now runs from `Checks` instead of
  `workflow_run`, the build uploads the library and demo for the PR artifacts comment, the labeler and Dependabot
  configurations were fixed, and `.github/zizmor.yml` sets the action pinning policy.
  The Angular libraries (ngx-codemirror, ngx-markdown, ngx-sidenav) share one workflow layout: every `run` step uses
  bash with `pipefail`, `bun audit` results go to the job summary, Biome checks the whole repository
  (`lint:check`), triage is never cancelled and requests the maintainer's review for bot accounts, and Dependabot
  ignores majors for Bun only.

### 🔐 Security

- **Update dependencies** — address potential vulnerabilities and/or improvements in development dependencies.
    - Peer Dependencies (`@fsegurai/ngx-sidenav`)
        - `@angular/material` - removed
    - Dependencies
        - `@angular/cdk`, `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`,
          `@angular/material`, `@angular/platform-browser`, `@angular/router` from `^22.2.2` to `^22.3.0`
        - `@fsegurai/ngx-markdown` from `22.0.0` to `22.1.0`
        - `@fsegurai/scrollspy` from `^2.1.0` to `^2.2.0`
        - `marked` from `18.1.0` to `18.2.1`
        - `tslib` from `^2.8.1` to `^2.9.1` (also in `@fsegurai/ngx-sidenav`)
    - Dev Dependencies
        - `@angular/build`, `@angular/compiler-cli`, `@angular/language-service` from `^22.2.2` to `^22.3.0`
        - `@angular/cli` from `~22.2.2` to `~22.3.0`
        - `@biomejs/biome` from `2.5.15` to `2.6.8`
        - `@fsegurai/manifest-generator` from `^1.1.0` to `^1.2.0`
        - `@types/node` from `^24.0.4` to `^26.6.6`
        - `@vitest/coverage-v8`, `vitest` from `^5.0.3` to `^5.1.1`
        - `concurrently` from `^10.0.6` to `^10.0.7`
        - `jsdom` from `^30.1.2` to `^31.0.1`
        - `ng-packagr` from `^22.2.4` to `^22.3.0`
    - `typescript` stays on `6.0.x`: Angular 22 requires `>=6.0 <6.1` (7.0.2 is available).

**Full Changelog**: https://github.com/fsegurai/ngx-sidenav/compare/v22.0.0...v22.1.0

---

## [22.0.0] - 2026-10-14

### ⚠️ BREAKING CHANGES ⚠️

See "Migrating from 20 to 22" in the README for a step-by-step guide.

- **Angular 22** — the library peer dependencies (`@angular/common`, `@angular/core`, `@angular/platform-browser`)
  now require `^22.0.0`; the workspace uses TypeScript `6.0` and Node.js `>=24.15`. **(Note**: This change is not
  backward compatible.)
- **New peer dependencies** — `@angular/router`, `@angular/cdk` and `@angular/material` (`^22.0.0`) are now declared
  peers: install them if they were only transitive before.
- **`opened` / `closed`** — they fired in the wrong direction. `opened` now emits when the panel expands and `closed`
  when it collapses; swap back handlers that compensated for the old behavior.
- **Slide flags are signals** — `SidenavService.isSlidingInFromLeft` and `isSlidingInFromRight` are read-only signals
  instead of booleans: call them.
- **Menu markup** — items without a `route`, parents and the back row render as `<button>`s; title items are
  non-interactive text and no longer pop the stack; disabled items use `aria-disabled` (disabled links lose their
  `href`); the panel is a `<nav>`; the focusable resize target is `hr.ngx-sidenav__resize-indicator`. Update custom
  styles and tests that targeted the old elements.
- **Escape** — collapses the panel only in backdrop (modal) mode.
- **`componentData`** — was ignored; each entry is now set on the pushed component with `ComponentRef.setInput()`, and
  keys that are not inputs are skipped with a warning.
- **Persisted width and state** — a width stored from a previous visit wins over `initialWidth` (clamped to
  `minWidth` / `maxWidth`), and a first visit starts expanded.
- **Stack restore** — the stack follows the active route: it is rebuilt from `Location.path()` (the base href, query
  string and fragment are ignored), root items replace a stack restored from storage, a route that is not in the menu
  keeps the levels shown before (or saved by the previous visit) instead of resetting to the root, and
  `restoreStackHybrid()` no longer replaces an existing stack.
- **Stored stack format (v2)** — `localStorage['ngx-sidenav-stack']` holds `{ "v": 2, "levels": [...] }`: the key of
  the item each level was opened from (its normalized route, or `label:<label>` without one), never the items. The
  levels are rebuilt from the live root items, so `restoreStackFromStorage(rootItems?)` takes the root menu (without
  it, the root already in the stack is used). A stack stored by 20.x is restored once, then rewritten as v2.
  `SerializableStackItem` is deprecated.

### 🚀 Features

- **`provideSidenav(config, ...features)`** — environment providers following the sibling libraries' feature pattern;
  `config.labels` overrides the labels. Only one feature of each kind is allowed.
- **`items` input** — `<ngx-sidenav [items]="menu">` sets the root menu (precedence: input, manifest, service stack);
  `[]` resets the root.
- **`withManifest()`** — builds the root menu from `@fsegurai/manifest-generator`'s `manifest.json` (a URL fetched with
  `httpResource`, a signal or a static value). The default mapper, `fromManifestGeneratorLazy()`, sorts by `order`,
  normalizes routes with `stripPrefix` / `routePrefix` and maps each level's `children` on first read;
  `fromManifestGenerator()` maps the whole tree eagerly, and a custom `mapper` supports any other schema.
  `SidenavManifestService` exposes `items`, `status`, `error` and `reload()`.
- **Split manifests** — `withManifest({ childrenSource: (item) => url })` gives items mapped without children a
  `loadChildren` that fetches and maps their own manifest.
- **`withSearchIndex()`** — loads `search-index.json` (or any schema through a `mapper`) and ranks entries case- and
  accent-insensitively across label, headings, tags and keywords, description and excerpt (`SidenavSearchService`,
  `rankSearchEntries()`, `highlightSegments()`, `slugifyHeading()`; heading slugs match `@fsegurai/ngx-markdown`
  heading ids). `debounceMs` (default `150`, `0` queries synchronously) runs one query per burst of keystrokes;
  `status()` reports `indexing` while a large index is built and `pending` tells when the results do not answer the
  current query yet.
- **`<ngx-sidenav-search>`** — WAI-ARIA combobox with highlighted matches, a live result count, an optional
  Ctrl/Cmd+K `shortcut`, heading-anchor navigation and stack sync after navigation. `<ngx-sidenav [search]="true">`
  renders it inside the panel.
- **Search in a Web Worker** — optional: `withSearchIndex({ worker: () => new Worker(…) })` builds and scans indexes
  above 2000 entries in a worker running `exposeSidenavWorker()` from the new Angular-free
  `@fsegurai/ngx-sidenav/worker` entry point. `status`, `pending`, debounce and cancellation are unchanged; without
  `Worker` (server, tests), when the factory throws or when the worker fails, the search falls back to the chunked
  main-thread path.
- **Lazy levels** — `StackMenuItem.loadChildren(signal?)` (a `Promise` or an `Observable`) loads a level when it is
  opened: a loading row (`aria-busy`, polite announcement), then the items, or an error row with a keyboard-accessible
  Retry button. Results are cached per item, concurrent requests are deduplicated, and leaving the level aborts the
  request. Routes under a lazy parent are found after a reload (up to 8 nested lazy levels), and stored levels go
  through lazy levels too. `SidenavService.pushLevel()` and `retryLevel()`; `MenuStackItem.status` / `error`;
  `<ngx-sidenav-menu [status]>`.
- **Source status and resilience** — `SidenavSourceStatus` (manifest and search) is `idle`, `loading`, `refreshing`
  (reloading with data present), `resolved` or `error` (no data). A failed reload keeps the last good data
  (stale-while-error: `status` stays `resolved`, `error` is set), and `retry: { attempts, delayMs }` retries transient
  failures (network, 408, 429, 5xx) with exponential backoff (off by default).
- **`SidenavService` additions** — `stack` (the current levels, read-only), `routeIndexReady` (whether the routes of
  the root menu are fully indexed), `reindex()` (for menus whose items were changed in place; items are otherwise
  treated as immutable) and `syncStackWithRoute()`. `ComponentStackItem.title` labels the back row of a component
  level.
- **Menu items** — `externalUrl` (new tab, accessible hint), `redirect` (absolute URLs render as external anchors),
  `deprecated` / `deprecatedAlternative` (badge and tooltip), `disabled`, `tooltip`, `summary` / `description`, plus
  `breadcrumb`, `keywords`, `order` and `layout` metadata.
- **Labels** — `SIDENAV_LABELS`, `DEFAULT_SIDENAV_LABELS` and `provideSidenavLabels()` make every rendered or announced
  text translatable, including `searchIndexing`, `loading`, `loadError` and `retry`.
- **Accessibility** — keyboard-accessible items, focus moves to the new level with a polite announcement, the toggle
  exposes `aria-expanded` / `aria-controls`, the resize handle is a focusable separator (RTL-aware arrows, Home, End),
  and backdrop mode traps and restores focus. New `--ngx-sidenav-focus-ring` variable.
- **Light and dark themes** — the sidenav and the search box ship light and dark defaults (`light-dark()` tokens with AA
  contrast). The scheme follows `.dark-theme` / `.light-theme` or `[data-theme]` on an ancestor, then
  `--ngx-sidenav-color-scheme`, then the page `color-scheme`. New `--ngx-sidenav-text-color`,
  `--ngx-sidenav-search-text-color`, `--ngx-sidenav-search-meta-text-color` and
  `--ngx-sidenav-search-excerpt-text-color` variables.

### 🐞 Fixes

- **Width and expanded state** — the persisted values were never applied on load.
- **Empty root** — an empty menu is no longer seeded as the root level.
- **Base href** — route restore works when the application is served under a base href.
- **Route-aware restore** — after a reload the sidenav opens the level of the active route for every source (`items`
  input, `withManifest()` resolving before or after the first render, a root pushed through `SidenavService`), and
  follows later navigations from outside the menu (links, back/forward). Navigating to the route of a parent whose
  level is open keeps that level open.
- **Component stacking** — route restore keeps pushed component levels on top instead of resetting to the root menu,
  component levels show the toggle and a back row, and slide animations run in one direction at a time.
- **Resize** — uses pointer events with listeners attached only while resizing, so touch works; the drag direction of
  a right-positioned sidenav is fixed.
- **Virtual scroll** — rows had variable heights (summary line, wrapped titles) while the viewport assumed 48px, so
  long menus scrolled to wrong offsets; virtual rows now have a fixed height, and their focus, hover and active
  outlines are drawn inside the row so the focus ring is not clipped.
- **`trackBy`** — keys use route identity and stay unique for duplicate labels.
- **SSR** — `SidenavService` guards `window` and storage access on the server.

### 🔧 Changes

- **Row height** — `<ngx-sidenav-menu>` binds `--ngx-sidenav-item-height` from its `itemHeight` input (48px by
  default, `DEFAULT_SIDENAV_ITEM_HEIGHT`); virtual scroll rows use it as their fixed height, and their titles and
  summaries stay on one line (truncated) instead of wrapping.
- **Host metadata** — host bindings moved to the `host` object; CSS variables for widths are scoped to the host and
  their fallbacks match the internal defaults (collapsed `30px`, expanded min `250px`, max `600px`).
- **Animations** — `@angular/animations` is no longer used.
- **Internals** — size defaults live in one constants file; the route normalizer and the source loader are shared by
  the manifest and the search index.
- **Demo** — dogfoods `provideSidenav` with `withManifest` and `withSearchIndex` from its versioned docs, renders
  `/docs/**` Markdown with heading anchors and a scrollspy table of contents (a missing page is tried as a folder
  `README`, other load errors are retryable), drops `@fsegurai/ngx-shared-docs`, and switches the sidenav and search
  box with its light/dark theme toggle.
- **Demo stress test** — a `/stress` page generates 1k–100k menu items and 5k–50k search entries, toggles the search
  worker, and reports, from the end of the mapping, the time until the first root row is rendered and until
  `routeIndexReady`, plus the index ready time, the latency of the last query (cleared when the index is rebuilt) and
  the long tasks.

### ⚡ Performance

See the [Performance and Large Datasets guide](docs/22.0.0/content/guides/performance.md) for the details,
the recommended settings by dataset size and the benchmarks. Measured on 100k menu items and 50k search entries: the
root menu is available in ≤ 1.1 ms (was 40–109 ms, blocking), a route lookup takes ≤ 0.06 ms (was 2–7 ms), a stack
save writes < 4 KB at idle time (was 20–60 ms and 6.2 MB), the first search keystroke takes ~10 ms (was ~205 ms,
blocking) and a query ~8–12 ms (was ~41–54 ms).

- **Route index** — routes of the root menu are indexed once per root (route → item and item → parent maps), so
  route syncs look a route up in O(depth) instead of searching the tree on every navigation. Large menus are indexed
  in the background in ~8 ms chunks (`scheduler.yield()`, `MessageChannel` or `setTimeout` fallback, cancelled when
  the root changes); until then the root level is shown, and a route not found yet is looked up again when the index
  completes.
- **Lazy mapping** — only the root level of a manifest is mapped up front; levels already in `order` are not copied
  or sorted, the route prefix is trimmed once, and a URL manifest or search index is mapped as the response arrives
  (`httpResource` `parse`), so the raw JSON is not retained.
- **Persistence by reference** — the stored stack is a few hundred bytes whatever the menu size (20.x serialized the
  whole tree on every push and pop, and could silently exceed the storage quota); writes are coalesced into one idle
  callback, skipped when unchanged, and flushed on `beforeunload` and on destroy.
- **Search index** — entries are normalized once, right after they load, into a flat per-field index with the label
  word starts precomputed. Up to 2000 entries it is built synchronously; larger indexes are built in ~8 ms background
  chunks (`indexing` status), tracked as pending tasks so `whenStable()` waits for them.
- **Search queries** — no `RegExp` per entry, each term stops at its best field, matched fields and the best heading
  are only computed for the kept results, and the best `limit` results are kept with a bounded insertion
  (O(M log k)) instead of sorting every match. Indexes above 5000 entries are scanned in chunks, and a newer query
  cancels the scan of a stale one; a failed scan reports `status() === 'error'` for that query and index while
  keeping the previous results. Same ranking and order as before.
- **Highlighting** — the excerpt is cut to its 140 characters window first and only that window is highlighted;
  characters are normalized through a small per-character cache.
- **Rows** — a `MatTooltip` is only created for rows with tooltip text; rows no longer get `will-change: transform` /
  `translateZ(0)` (one compositor layer per row); list svg icons are plain lazy images (`loading="lazy"`,
  `decoding="async"`) instead of `NgOptimizedImage`; the `routerLinkActive` options are one shared object.

### 📝 Documentation

- **README** — restructured: features, installation with peers and compatibility, configuration, "Migrating from 20
  to 22", usage (items, service, component stacking, manifest, custom schemas, search, large datasets, lazy levels,
  Web Worker), theming variables, API reference and accessibility. The Quick Start no longer projects content into
  `<ngx-sidenav>`.
- **Docs** — versioned pages for `22.0.0` (getting started, guides, API, migration) with manifest-generator
  front-matter, plus the generated `manifest.json` and `search-index.json`. Guides include theming, component
  stacking, lazy levels, the Web Worker and performance (how the library stays responsive, recommended settings, the
  measured before/after numbers and the benchmarks).
- **Contributing guide and agent guidelines** — updated for Angular 22, Vitest, Biome and the `provideX` pattern; the
  Junie guidelines were removed in favor of `.github/copilot-instructions.md`.

### 🔧 Infrastructure

- **Tests** — replace Karma and Jasmine with Vitest (jsdom) through `@angular/build:unit-test` for the library and the
  demo (`test-ci_cd:demo`, `test-local:demo`).
- **Benchmarks** — `bun run bench:lib` runs Vitest benchmarks (`lib/src/**/*.bench.ts`, `lib/vitest.bench.config.mts`)
  of the manifest mapper, the route index, the stack persistence payload, the search index build and queries, and the
  excerpt highlight, on 100k items and 50k entries generated at run time from a seed.
- **Linting** — replace ESLint with Biome (`lint:check`, `lint:fix`, `format`, `format:audit`); Husky `pre-commit` and
  `pre-push` hooks.
- **Workspace** — `@angular/build` builders, the demo consumes the built library (`dist/lib`), `check:lib-imports`
  guards relative imports, `type-check:demo` also checks the demo specs, and `generate:manifest` writes the docs
  manifest and search index.
- **CI** — the build workflow calls the existing `build:lib`, `build_post:lib`, `build:demo` and `build_post:demo`
  scripts (it referenced missing `postBuild:lib` and `gh-pages:*` scripts); the test workflow runs on `workflow_run`
  after a successful Build PR from this repository, checks out the PR head (`workflow_run.head_sha`) with read-only
  permissions and also runs the demo smoke tests; workflows and labeler aligned with the sibling libraries.
- **Azure DevOps and Appwrite** — build, PR and release pipelines (`pipelines/.ado`), Appwrite site Terraform with
  per-environment variables (`pipelines/infrastructure/appwrite/terraform`) and a `Makefile` with Trivy scan targets.

### 🔐 Security

- **Update dependencies** — address potential vulnerabilities and/or improvements in dependencies.
    - Peer Dependencies (`@fsegurai/ngx-sidenav`)
        - `@angular/common`, `@angular/core`, `@angular/platform-browser` from `^20.3.3` to `^22.0.0`
        - `@angular/router`, `@angular/cdk`, `@angular/material` - `^22.0.0` - now declared peers
    - Dependencies
        - `@angular/cdk`, `@angular/material` from `^20.2.7` to `^22.2.2`
        - `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`,
          `@angular/router` from `^20.3.3` to `^22.2.2`
        - `@fsegurai/ngx-markdown` from `^20.0.0` to `22.0.0`
        - `@fsegurai/scrollspy` from `1.0.0` to `^2.1.0`
        - `emoji-toolkit` from `^9.0.1` to `^11.0.0`
        - `marked-gfm-heading-id` from `^4.1.2` to `^4.1.4`
    - Dev Dependencies
        - `@angular/build` from `^20.3.4` to `^22.2.2`, `@angular/cli` from `~20.3.4` to `~22.2.2`
        - `@angular/compiler-cli`, `@angular/language-service` from `^20.3.3` to `^22.2.2`
        - `ng-packagr` from `^20.1.0` to `^22.2.4`
        - `typescript` from `~5.9.3` to `~6.0.3`
        - `cpy-cli` from `^6.0.0` to `^7.0.0`
- **Added dependencies**.
    - Dependencies
        - `marked` - `18.1.0` - peer dependency of `@fsegurai/ngx-markdown` 22, used by the demo.
    - Dev Dependencies
        - `vitest`, `@vitest/coverage-v8` - `^5.0.3` and `jsdom` - `^30.1.2` - unit tests and benchmarks.
        - `@biomejs/biome` - `2.5.15` - linting and formatting.
        - `husky` - `^9.1.7` - Git hooks.
        - `@fsegurai/manifest-generator` - `^1.1.0` - generates the docs manifest and search index.
        - `concurrently` - `^10.0.6` - runs the library watch build and the demo dev server together.
- **Removed dependencies** — removed unused dependencies.
    - Dependencies
        - `@angular/animations`, `@angular/platform-browser-dynamic`, `@fsegurai/ngx-shared-docs`, `ngx-sidenav`
          (`file:lib`)
    - Dev Dependencies
        - `karma` and its launchers and reporters, `jasmine-core`, `@types/jasmine`
        - `eslint`, `angular-eslint`, `typescript-eslint` and the ESLint plugins
        - `linklocal`, `rimraf`

**Full Changelog**: https://github.com/fsegurai/ngx-sidenav/commits/v22.0.0

---

## [20.0.0] - 2025-xx-xx

### ⚠️ BREAKING CHANGES ⚠️

- **Angular 20** — components now require Angular 20+ due to the use of signals and standalone architecture.
- **Zoneless** — removed the zone.js dependency for better performance and modern Angular practices.
- **Bindings** — removed support for `ngClass` and `ngStyle` in favor of class and style bindings.
- **Utilities** — updated utility function signatures for consistency.
- **Migrating from 0.x** — refactor to standalone components, replace `@Input` / `@Output` with signal-based
  `input()` / `output()`, use the native control flow (`@if`, `@for`) and align SCSS with the new theming structure.

### 🚀 Features

- **Sidenav Component** — a flexible and customizable sidenav component with resizing, collapsing, and positioning
  capabilities: configurable `minWidth`, `maxWidth`, `initialWidth` and `collapseWidth`, mouse and keyboard
  resizing with visual feedback, collapsible state with customizable expand/collapse icons, optional cache clearing
  on reload, and `opened`, `closed` and `resized` outputs.
- **SidenavMenu Component** — a hierarchical menu component supporting nested navigation with unlimited depth and
  breadcrumb-style parent tracking.
- **LinkItem Component** — a reusable link component for navigation items with router integration and active state
  detection.
- **Stack-based Navigation** — push/pop menu levels and custom components in the sidenav, similar to mobile app
  navigation patterns.
- **Custom Component Support** — render custom Angular components within the sidenav using `ComponentStackItem`, and
  pass data to them via `componentData`.
- **Resizable Sidenav** — interactive resizing with configurable min/max width constraints and keyboard navigation.
- **Multi-directional Support** — left/right positioning with RTL (right-to-left) text direction support.
- **Advanced Menu Features** — labels, badges, icons (Material, SVG, custom), tooltips, summaries, custom properties
  and menu item states.
- **ContentAreaDirective** — directive for managing dynamic content areas within the sidenav.
- **SidenavService** — centralized service for managing sidenav state, navigation stack, and component rendering.
- **Serializable State** — menu state persistence with `localStorage` support.
- **TypeScript Interfaces** — comprehensive type definitions for `StackMenuItem`, `ComponentStackItem`, and
  `MenuStackItem`.
- **Responsive Design** — backdrop support and responsive behavior for mobile and desktop experiences.

### 🔧 Changes

- **Standalone and signals** — refactored all components to use the Angular standalone architecture with signals and
  the `input()` and `output()` functions.
- **Control flow** — implemented the modern control flow syntax (`@if`, `@for`) in templates.
- **Theming** — enhanced SCSS structure with CSS custom properties for theming support.
- **Change detection** — optimized change detection using `ChangeDetectionStrategy.OnPush` across all components.
- **Accessibility** — improved keyboard navigation and focus management.

**Full Changelog**: https://github.com/fsegurai/ngx-sidenav/commits/v20.0.0

---

## ✅ Compatibility

| Angular | @fsegurai/ngx-sidenav |
|---------|-----------------------|
| 22      | 22.x                  |
| 20      | 20.x                  |

---

[unreleased]: https://github.com/fsegurai/ngx-sidenav/compare/v22.1.0...HEAD

[22.1.0]: https://github.com/fsegurai/ngx-sidenav/compare/v22.0.0...v22.1.0

[22.0.0]: https://github.com/fsegurai/ngx-sidenav/compare/v20.0.0...v22.0.0

[20.0.0]: https://github.com/fsegurai/ngx-sidenav/commits/v20.0.0
