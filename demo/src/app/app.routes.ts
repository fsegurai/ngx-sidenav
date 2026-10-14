import type { Routes } from '@angular/router';
import { DOCS_ROUTE } from '@app/app.constant';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DOCS_ROUTE,
  },
  {
    // Every documentation page: the rest of the URL is the page path (`/docs/guides/theming`).
    path: DOCS_ROUTE,
    children: [{ path: '**', loadComponent: () => import('./docs/docs.component') }],
    data: { label: 'Docs' },
  },
  {
    path: 'render',
    loadComponent: () => import('./render/render.component'),
    data: { label: 'Theming' },
  },
  {
    path: 'playground',
    loadComponent: () => import('./playground/playground.component'),
    data: { label: 'Playground' },
  },
  {
    path: 'settings/component/default-menu',
    loadComponent: () => import('./stacking/default-menu.component'),
    data: { label: 'Component stacking' },
  },
  {
    path: 'settings/component/settings-menu',
    loadComponent: () => import('./stacking/settings-menu.component'),
    data: { label: 'Component stacking' },
  },
  {
    // The stress test page; its generated menu items link below it (`/stress/s0/s3`), so they keep the page open.
    path: 'stress',
    children: [{ path: '**', loadComponent: () => import('./stress/stress.component') }],
    data: { label: 'Stress test' },
  },
  {
    // The items of the JSON demo menus (`core/layouts/sidenav`) have no screens of their own.
    path: '**',
    loadComponent: () => import('./placeholder/placeholder.component'),
  },
];
