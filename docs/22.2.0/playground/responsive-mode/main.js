// The playground has no build step: Angular compiles the templates in the browser (JIT),
// so the compiler must be loaded before anything else.
import '@angular/compiler';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, withHashLocation } from '@angular/router';
import { DEFAULT_SIDENAV_HANDSET_QUERY, provideSidenav, Sidenav } from '@fsegurai/ngx-sidenav';

const menu = [
  { label: 'Docs', isTitle: true },
  { label: 'Introduction', route: '/introduction' },
  { label: 'Installation', route: '/installation' },
  {
    label: 'Guides',
    isParent: true,
    children: [
      { label: 'Theming', route: '/guides/theming' },
      { label: 'Customization', route: '/guides/customization' },
      { label: 'Responsive layout', route: '/guides/responsive-layout' },
    ],
  },
];

const Page = Component({
  selector: 'app-page',
  template: `<p class="route">Pick a page: with "collapse on navigate", the overlay closes after the navigation.</p>`,
})(class {});

const App = Component({
  selector: 'app-root',
  imports: [Sidenav, RouterOutlet],
  template: `
    <div class="layout">
      <!--
        mode="auto": side-by-side while the preview is wide, an overlay (fixed, backdrop, focus trap, Escape)
        while handsetQuery matches. Resize the preview, or pick a narrower query below.
      -->
      <ngx-sidenav
        [items]="menu"
        [mode]="mode()"
        [handsetQuery]="query()"
        [collapseOnNavigate]="collapseOnNavigate()"
        [initialWidth]="260"
        [clearCacheOnReload]="true"
      />
      <main>
        <h1>Responsive mode</h1>
        <router-outlet />

        <fieldset>
          <legend>mode</legend>
          @for (option of modes; track option) {
            <label><input type="radio" name="mode" [checked]="mode() === option" (change)="mode.set(option)" /> {{ option }}</label>
          }
        </fieldset>

        <fieldset>
          <legend>handsetQuery (auto)</legend>
          @for (option of queries; track option) {
            <label><input type="radio" name="query" [checked]="query() === option" (change)="query.set(option)" /> <code>{{ option }}</code></label>
          }
        </fieldset>

        <fieldset>
          <legend>Overlay</legend>
          <label><input type="checkbox" [checked]="collapseOnNavigate()" (change)="collapseOnNavigate.set(!collapseOnNavigate())" /> collapseOnNavigate</label>
        </fieldset>
      </main>
    </div>
  `,
})(
  class {
    menu = menu;
    modes = ['side', 'over', 'auto'];
    queries = [DEFAULT_SIDENAV_HANDSET_QUERY, '(max-width: 599.98px)', '(min-width: 0px)'];
    mode = signal('auto');
    query = signal(DEFAULT_SIDENAV_HANDSET_QUERY);
    collapseOnNavigate = signal(true);
  },
);

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([{ path: '**', component: Page }], withHashLocation()),
    provideSidenav(),
  ],
}).then(() => console.log('ngx-sidenav responsive mode ready'));
