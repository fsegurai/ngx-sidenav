import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

/**
 * The page of every item of the JSON demo menus: they showcase deep nesting, badges and icons, not real screens,
 * so each of their routes lands here and shows which item was opened.
 */
@Component({
  selector: 'app-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <h1>Demo menu item</h1>
    <p>
      <code>/{{ path() }}</code> belongs to one of the JSON demo menus, which showcase nesting, icons and badges. It
      has no page of its own: open the sidenav to see the active item and the restored menu level.
    </p>
    <p><a routerLink="/docs">Back to the documentation</a></p>
  `,
})
export default class PlaceholderComponent {
  protected readonly path = toSignal(
    inject(ActivatedRoute).url.pipe(map((segments) => segments.map((segment) => segment.path).join('/'))),
    { initialValue: '' },
  );
}
