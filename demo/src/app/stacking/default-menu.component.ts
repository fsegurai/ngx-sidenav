import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StackingPageComponent } from './stacking-page.component';

/** Pushes a custom component level with the "default" links while the page is open. */
@Component({
  selector: 'app-default-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StackingPageComponent],
  template: `<app-stacking-page title="Default component menu" [links]="links" />`,
})
export default class DefaultMenuComponent {
  protected readonly links = [
    { path: '/docs/guides/component-stacking', icon: 'menu_book', name: 'Component stacking guide' },
    { path: '/render', icon: 'palette', name: 'Theming' },
    { path: '/settings/component/settings-menu', icon: 'swap_horiz', name: 'Settings component menu' },
  ];
}
