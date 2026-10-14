import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { MarkdownComponent } from '@fsegurai/ngx-markdown';
import { ScrollspyNavLayoutComponent } from '@shared/scrollspy-nav-layout';

/** The CSS variables of the library, with a table of contents built from the section headings. */
@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrl: './render.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, ScrollspyNavLayoutComponent],
})
export default class RenderComponent {
  protected readonly headings = signal<Element[]>([]);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => this.headings.set([...host.querySelectorAll('section > h2[id]')]));
  }
}
