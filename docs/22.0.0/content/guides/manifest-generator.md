---
label: Manifest Generator
description: Build the sidenav from the manifest.json produced by @fsegurai/manifest-generator with provideSidenav and withManifest.
order: 4
tags: [ "guides", "manifest" ]
keywords: [ "manifest.json", "withManifest", "fromManifestGenerator", "front-matter" ]
icon: account_tree
badge: New
badgeColor: function
---

# Manifest Generator

[`@fsegurai/manifest-generator`](https://github.com/fsegurai/manifest-generator) turns a folder of Markdown files with
front-matter into `manifest.json` (navigation) and `search-index.json` (search). ngx-sidenav reads both natively.

## 1. Write the pages

```markdown
---
label: Installation
description: Install the package.
order: 1
tags: [ "getting-started" ]
icon: download
---

# Installation
```

Folders become parents; a folder's `README.md` or `index.md` front-matter labels the folder.

## 2. Generate

```bash
manifest-generator --route ./docs/1.0.0/content --output ./docs/1.0.0
```

## 3. Provide the manifest

```typescript
provideSidenav(
  {},
  withManifest({
    source: 'docs/1.0.0/manifest.json',
    mapperOptions: { stripPrefix: 'content/', routePrefix: '/docs' },
  }),
);
```

`source` may be a URL (fetched with `HttpClient`), a signal or a static array. `stripPrefix` removes the generated
`content/` part and `routePrefix` places the pages under your docs route, so `content/guides/theming` becomes
`/docs/guides/theming`. Absolute redirects and external URLs are kept as they are.

## 4. Render

Leave `items` unset: `<ngx-sidenav />` renders the manifest once it is loaded. A manifest fetched from a URL resolves
after the first render; on a reload the sidenav still opens the level of the active page (for example the Guides level
on `/docs/guides/theming`), and keeps following later navigations. `SidenavManifestService` exposes
`items`, `status` (`idle`, `loading`, `resolved`, `error`), `error` and `reload()`.

This documentation site is built exactly this way.
