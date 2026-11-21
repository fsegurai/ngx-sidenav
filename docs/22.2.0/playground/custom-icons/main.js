// The playground has no build step: Angular compiles the templates in the browser (JIT),
// so the compiler must be loaded before anything else.
import '@angular/compiler';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, withHashLocation } from '@angular/router';
import { provideSidenav, Sidenav, SidenavGlyph, SidenavItemIcon } from '@fsegurai/ngx-sidenav';

// A tiny icon set of the app: SVG paths by name (24x24 viewBox). No icon font is loaded.
const PATHS = {
  home: 'M3 11 12 3l9 8v10h-6v-6H9v6H3z',
  chart: 'M4 20V10h4v10zm6 0V4h4v16zm6 0v-7h4v7z',
  gear: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 4-2.2.7-.6 1.5 1 2.1-1.4 1.4-2.1-1-1.5.6L13.5 21h-3l-.7-2.2-1.5-.6-2.1 1-1.4-1.4 1-2.1-.6-1.5L3 13.5v-3l2.2-.7.6-1.5-1-2.1 1.4-1.4 2.1 1 1.5-.6L10.5 3h3l.7 2.2 1.5.6 2.1-1 1.4 1.4-1 2.1.6 1.5L21 10.5z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 8c0-4 4-6 8-6s8 2 8 6z',
  arrow: 'M9 6l6 6-6 6',
  back: 'M15 6l-6 6 6 6',
  open: 'M4 6h16M4 12h10M4 18h16',
  close: 'M4 6h16M4 12h16M4 18h16M18 9l-3 3 3 3',
  link: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
};

// The app's own icon component; the sidenav only decides where it goes. Without a build step the input is declared
// in the metadata (`inputs`) rather than with `input()`.
const AppIcon = Component({
  selector: 'app-icon',
  inputs: ['name'],
  template: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path [attr.d]="path" />
    </svg>
  `,
  styles: [':host { display: inline-block; width: 100%; height: 100%; }'],
})(
  class {
    name = '';
    get path() {
      return PATHS[this.name] ?? PATHS.home;
    }
  },
);

// The `icon` of each item is a name of the app's icon set; no iconType is needed with an item icon template.
const menu = [
  { label: 'App', isTitle: true },
  { label: 'Home', icon: 'home', route: '/home' },
  { label: 'Reports', icon: 'chart', route: '/reports', badge: 2 },
  {
    label: 'Settings',
    icon: 'gear',
    isParent: true,
    children: [
      { label: 'Profile', icon: 'user', route: '/settings/profile' },
      { label: 'Billing', route: '/settings/billing' },
    ],
  },
  { label: 'Source code', icon: 'link', externalUrl: 'https://github.com/fsegurai/ngx-sidenav' },
];

const Page = Component({
  selector: 'app-page',
  template: `<p>Open <strong>Settings</strong>: the chevron and the back arrow come from the app's icon set too.</p>`,
})(class {});

const App = Component({
  selector: 'app-root',
  imports: [Sidenav, SidenavItemIcon, SidenavGlyph, AppIcon, RouterOutlet],
  template: `
    <div class="layout">
      <ngx-sidenav [items]="menu" [initialWidth]="260" [clearCacheOnReload]="true">
        <!-- Every item icon: let-item is the StackMenuItem. -->
        <ng-template ngxSidenavItemIcon let-item><app-icon [name]="item.icon" /></ng-template>
        <!-- Built-in glyphs: back, chevron, external, expand (toggle while collapsed), collapse (while expanded). -->
        <ng-template ngxSidenavGlyph="back"><app-icon name="back" /></ng-template>
        <ng-template ngxSidenavGlyph="chevron"><app-icon name="arrow" /></ng-template>
        <ng-template ngxSidenavGlyph="external"><app-icon name="link" /></ng-template>
        <ng-template ngxSidenavGlyph="expand"><app-icon name="open" /></ng-template>
        <ng-template ngxSidenavGlyph="collapse"><app-icon name="close" /></ng-template>
      </ngx-sidenav>
      <main>
        <h1>Custom icons and glyphs</h1>
        <router-outlet />
      </main>
    </div>
  `,
})(
  class {
    menu = menu;
  },
);

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([{ path: '**', component: Page }], withHashLocation()),
    provideSidenav(),
  ],
}).then(() => console.log('ngx-sidenav custom icons ready'));
