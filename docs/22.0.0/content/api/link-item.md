---
label: Link Item
description: The ngx-sidenav-link-item component used for every menu row.
order: 3
tags: [ "api", "component" ]
keywords: [ "ngx-sidenav-link-item", "routerLink", "externalUrl" ]
icon: link
---

# Link Item

`<ngx-sidenav-link-item>` renders one row as a link, a button or a title.

| Input | Type | Default |
|-------|------|---------|
| `routerLink` | `string \| string[] \| null` | `null` |
| `externalUrl` | `string \| null` | `undefined` |
| `routerLinkActiveOptions` | `{ exact: boolean }` | `{ exact: true }` |
| `label` | `string` | `''` |
| `summary` / `tooltip` | `string \| null` | `undefined` |
| `isTitle` / `isParent` / `isDisabled` | `boolean` | `false` |

| Output | When |
|--------|------|
| `activated` | A button row was activated by click, Enter or Space. |

Project your own content (icon, badge) inside the element; it is rendered next to the label.
