---
label: Custom Schemas
description: Feed the sidenav and the search box from any navigation format with custom mapper functions.
order: 6
tags: [ "guides", "manifest", "search" ]
keywords: [ "mapper", "schema", "StackMenuItem", "SidenavSearchEntry" ]
icon: schema
---

# Custom Schemas

Both features accept a `mapper` that turns your raw data into the library types.

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

A mapper that throws puts the feature in the `error` status; the error is available from the service.

The default mappers, `fromManifestGenerator()` and `fromManifestSearchIndex()`, are exported too, so you can
post-process their output inside your own mapper.
