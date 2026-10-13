---
label: Web Worker Search
description: Build and scan large search indexes off the main thread with the ngx-sidenav/worker entry point, with a transparent fallback to the main thread.
order: 11
tags: [ "guides", "search", "performance" ]
keywords: [ "Web Worker", "exposeSidenavWorker", "withSearchIndex", "worker", "webWorkerTsConfig", "fallback", "large datasets" ]
icon: memory
badge: New
badgeColor: function
---

# Web Worker Search

By default, a large search index is built and scanned on the main thread, in small chunks that yield to the browser.
That keeps typing responsive, but the work still shares the thread with rendering. For very large indexes (tens of
thousands of pages), the index can live in a Web Worker instead.

The worker is **optional**: without it, nothing changes.

## 1. Create the worker file

```typescript
// src/app/search.worker.ts
/// <reference lib="webworker" />
import { exposeSidenavWorker } from '@fsegurai/ngx-sidenav/worker';

exposeSidenavWorker();
```

`@fsegurai/ngx-sidenav/worker` is a separate entry point that does not import Angular: the worker bundle only contains
the search core (normalization, index, ranking).

With the Angular CLI, type-check worker files with their own tsconfig and reference it from `angular.json`
(`"webWorkerTsConfig": "tsconfig.worker.json"` in the build options):

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "lib": ["es2022", "webworker"], "types": [] },
  "include": ["src/**/*.worker.ts"]
}
```

Exclude `src/**/*.worker.ts` from `tsconfig.app.json`.

## 2. Pass the factory to `withSearchIndex()`

```typescript
provideSidenav(
  {},
  withSearchIndex({
    source: '/docs/search-index.json',
    mapperOptions: { stripPrefix: 'content/' },
    worker: () => new Worker(new URL('./search.worker', import.meta.url), { type: 'module' }),
  }),
);
```

The application builder bundles the worker as its own chunk because of the `new Worker(new URL(…, import.meta.url))`
pattern. The factory is called once, the first time an index needs the worker.

## What runs where

| Step                            | Without worker                           | With worker                                  |
|---------------------------------|------------------------------------------|----------------------------------------------|
| Load the source (`HttpClient`)  | Main thread                              | Main thread                                  |
| Map it (`mapper`/default)       | Main thread                              | Main thread                                  |
| Build the index (> 2000)        | Main thread, background chunks           | Worker                                       |
| Scan a query (> 5000 entries)   | Main thread, chunks, cancelled when stale | Worker, cancelled when stale                 |
| Small indexes (≤ 2000)          | Synchronous                              | Synchronous (the worker is not used)         |

The source stays on the main thread on purpose: interceptors, `retry`, `reload()` and `entries()` keep working, and a
custom `mapper` (a function) cannot be sent to a worker anyway. The mapped entries are copied to the worker once per
load; results come back as positions and are mapped to the very entry objects of `entries()`.

`status()` (`indexing` while the worker builds), `pending()`, the debounce and the cancellation of stale queries
behave exactly as without the worker. The synchronous `search()` builds a main-thread index on its first call.

## Fallback

The search falls back to the chunked main-thread path, transparently, when:

- `Worker` does not exist: server rendering, unit tests (jsdom);
- the factory throws, e.g. a Content Security Policy without `worker-src`;
- the worker fails: a script that cannot load, an error event, a message that cannot be read, or an index the worker
  cannot build.

A warning is logged once in dev mode, and the failed worker is terminated. The worker is also terminated when the
injector of the service is destroyed.

## The protocol

`exposeSidenavWorker()` answers plain, structured-cloneable messages: `init` (the entries, or a `url` of a
manifest-generator `search-index.json` to fetch and map in the worker, plus `limit` and `minQueryLength`), `query`
and `cancel`. It replies with `ready`, `results` and `error`. The message types are exported from
`@fsegurai/ngx-sidenav/worker` for custom clients.

## Trade-offs

- Copying the entries to the worker takes a moment on the main thread (one structured clone per load). For indexes of
  a few thousand pages, the default chunked path is usually enough.
- Results arrive one message later than a main-thread scan; the box shows the previous results meanwhile.
- The menu (`withManifest()`) does not use a worker: its levels are mapped lazily when opened, so there is little work
  to move, and lazily mapped levels cannot be sent across threads.
