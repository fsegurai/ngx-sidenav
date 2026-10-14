---
label: Component Stacking
description: Push your own Angular components as sidenav levels and pass them inputs with componentData.
order: 3
tags: [ "guides", "components" ]
keywords: [ "ComponentStackItem", "componentData", "setInput" ]
icon: layers
---

# Component Stacking

A level can be any standalone component. Push a `ComponentStackItem`:

```typescript
await sidenav.push({
  type: 'component',
  component: ProjectFilters,
  componentData: { projectId: 42 },
  title: 'Project filters', // label of the back row above the component
});
```

While a component level is shown, the sidenav keeps its toggle and renders a back row (labelled with `title`) above
the component; the back row returns to the previous level.

Each `componentData` entry is forwarded with `ComponentRef.setInput()`, so it reaches signal inputs:

```typescript
@Component({ selector: 'app-project-filters', template: `Filters for {{ projectId() }}` })
export class ProjectFilters {
  readonly projectId = input.required<number>();
}
```

Keys that are not inputs are skipped with a console warning.

## Lifecycle tip

Push the level once the page is rendered, and skip it when it is already shown:

```typescript
constructor() {
  const sidenav = inject(SidenavService);
  afterNextRender(() => {
    const top = sidenav.stack().at(-1);
    if (top && isComponentStackItem(top) && top.component === ProjectFilters) return;
    void sidenav.push({ type: 'component', component: ProjectFilters, title: 'Project filters' });
  });
}
```

Do not pop the level when the page is destroyed: following a link of the component destroys the page, and the
sidenav would jump back to the previous (often the root) menu. The level stays until the back row is used. Root
items that resolve or change later (a manifest, the `items` input) rebuild the menu levels and keep component levels
on top.

Component levels are not serialized to `localStorage`; only menu levels are.
