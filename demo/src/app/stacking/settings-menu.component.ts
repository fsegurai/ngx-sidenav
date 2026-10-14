import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StackingPageComponent } from './stacking-page.component';

/** Pushes a custom component level with the "settings" links while the page is open. */
@Component({
  selector: 'app-settings-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StackingPageComponent],
  template: `<app-stacking-page title="Settings component menu" [links]="links" />`,
})
export default class SettingsMenuComponent {
  protected readonly links = [
    { path: '/settings/security', icon: 'security', name: 'Security' },
    { path: '/settings/notifications/email', icon: 'email', name: 'Email notifications' },
    { path: '/settings/component/default-menu', icon: 'swap_horiz', name: 'Default component menu' },
  ];
}
