import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LinkItem } from 'ngx-sidenav';

/** A link of {@link StackedLinksComponent}. */
export interface StackedLink {
  readonly path: string;
  readonly icon: string;
  readonly name: string;
}

/**
 * A custom component pushed as a sidenav level. Its inputs are set from the `componentData` of the
 * `ComponentStackItem` (each entry goes through `ComponentRef.setInput()`).
 */
@Component({
  selector: 'app-stacked-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LinkItem, MatIconModule],
  template: `
    <!-- The title labels the links; the back row of the sidenav already shows it -->
    <nav class="stacked-links" [attr.aria-label]="title()">
      @for (link of links(); track link.path) {
        <ngx-sidenav-link-item [routerLink]="link.path" [label]="link.name">
          <mat-icon ngxSidenavLinkStart aria-hidden="true" class="material-symbols-outlined">{{ link.icon }}</mat-icon>
        </ngx-sidenav-link-item>
      }
    </nav>
  `,
  styles: `
    .stacked-links {
      display: flex;
      flex-direction: column;
    }
  `,
})
export class StackedLinksComponent {
  readonly title = input('Custom component');
  readonly links = input<StackedLink[]>([]);
}
