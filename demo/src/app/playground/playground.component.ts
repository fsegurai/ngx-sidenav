import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MarkdownComponent, type MarkdownHeading } from '@fsegurai/ngx-markdown';
import { headingElements } from '@shared/scrollspy-nav';
import { ScrollspyNavLayoutComponent } from '@shared/scrollspy-nav-layout';

/** A long page to exercise the scrollspy table of contents next to the sidenav. */
@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, ScrollspyNavLayoutComponent],
})
export default class PlaygroundComponent {
  protected readonly headings = signal<Element[]>([]);

  protected onHeadings(headings: MarkdownHeading[]): void {
    this.headings.set(headingElements(headings, [1, 2]));
  }
}
