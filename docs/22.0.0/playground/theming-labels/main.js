// The playground has no build step: Angular compiles the templates in the browser (JIT),
// so the compiler must be loaded before anything else.
import '@angular/compiler';
import { Component, effect, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, withHashLocation } from '@angular/router';
import { provideSidenav, Sidenav } from '@fsegurai/ngx-sidenav';

// Every text the sidenav renders or announces comes from its labels; override any subset.
const labels = {
  back: 'Atrás',
  navigation: 'Navegación lateral',
  toggleExpand: 'Expandir navegación',
  toggleCollapse: 'Contraer navegación',
  resizeHandle: 'Cambiar el ancho del panel',
  levelAnnouncement: 'Menú {label}',
  opensInNewTab: '(se abre en una pestaña nueva)',
};

const menu = [
  { label: 'Tienda', isTitle: true },
  { label: 'Inicio', icon: 'storefront', iconType: 'material', route: '/inicio' },
  { label: 'Pedidos', icon: 'receipt_long', iconType: 'material', route: '/pedidos', badge: 12 },
  {
    label: 'Catálogo',
    icon: 'category',
    iconType: 'material',
    isParent: true,
    children: [
      { label: 'Productos', route: '/catalogo/productos' },
      { label: 'Categorías', route: '/catalogo/categorias' },
      { label: 'Ofertas', route: '/catalogo/ofertas', badge: 'Nuevo', badgeColor: 'function' },
    ],
  },
  { label: 'Ayuda', icon: 'help', iconType: 'material', externalUrl: 'https://github.com/fsegurai/ngx-sidenav' },
];

// The scheme of the preview (the Arkodex theme): the switch starts on it, and only on it the page and the sidenav
// take the --pg-* colors (styles.css).
const previewScheme = document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';

const Page = Component({
  selector: 'app-page',
  template: `<p class="route">Open <strong>Catálogo</strong>: the back row reads "Atrás".</p>`,
})(class {});

const App = Component({
  selector: 'app-root',
  imports: [Sidenav, RouterOutlet],
  template: `
    <div
      class="layout"
      [class.right]="position() === 'right'"
      [class.ocean]="theme() === 'ocean'"
      [class.app-theme]="theme() === previewScheme"
    >
      <ngx-sidenav
        [items]="menu"
        [position]="position()"
        [direction]="direction()"
        [initialWidth]="260"
        [clearCacheOnReload]="true"
      />
      <main [attr.dir]="direction()">
        <h1>Theming and labels</h1>
        <router-outlet />

        <fieldset>
          <legend>Theme</legend>
          @for (option of themes; track option) {
            <label><input type="radio" name="theme" [checked]="theme() === option" (change)="theme.set(option)" /> {{ option }}</label>
          }
        </fieldset>

        <fieldset>
          <legend>Layout</legend>
          <label><input type="checkbox" [checked]="position() === 'right'" (change)="togglePosition()" /> Position right</label>
          <label><input type="checkbox" [checked]="direction() === 'rtl'" (change)="toggleDirection()" /> Right-to-left text</label>
        </fieldset>
      </main>
    </div>
  `,
})(
  class {
    menu = menu;
    themes = ['light', 'dark', 'ocean'];
    previewScheme = previewScheme;
    theme = signal(previewScheme);
    position = signal('left');
    direction = signal('ltr');

    constructor() {
      // Light and dark: the sidenav follows [data-theme] on an ancestor. "ocean" is light/dark-independent:
      // its CSS variables (styles.css) win over the defaults, here on top of the dark scheme.
      effect(() => {
        document.documentElement.dataset['theme'] = this.theme() === 'light' ? 'light' : 'dark';
        console.log('theme:', this.theme());
      });
    }

    togglePosition() {
      this.position.update((value) => (value === 'left' ? 'right' : 'left'));
    }

    toggleDirection() {
      this.direction.update((value) => (value === 'ltr' ? 'rtl' : 'ltr'));
    }
  },
);

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([{ path: '**', component: Page }], withHashLocation()),
    provideSidenav({ labels }),
  ],
}).then(() => console.log('ngx-sidenav theming and labels ready'));
