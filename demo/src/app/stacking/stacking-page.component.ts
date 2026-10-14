import { afterNextRender, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { isComponentStackItem, SidenavService, type SidenavStackItem } from 'ngx-sidenav';
import { type StackedLink, StackedLinksComponent } from './stacked-links.component';

/**
 * Component stacking showcase: shows {@link StackedLinksComponent} as a sidenav level with `componentData` once
 * the page is rendered. The level stays while its links are followed (they leave this page) until the back row
 * of the sidenav is used.
 */
@Component({
  selector: 'app-stacking-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>{{ title() }}</h1>
    <p>
      The sidenav now shows <strong>a custom Angular component</strong> instead of a menu. It was pushed with
      <code>SidenavService.push()</code> as a <code>ComponentStackItem</code>, and each <code>componentData</code>
      entry (here <code>title</code> and <code>links</code>) is set as an input of the component.
    </p>
    <p>
      Its links keep the level visible while you navigate; the back row of the sidenav returns to the previous
      level.
    </p>
  `,
})
export class StackingPageComponent {
  private readonly sidenav = inject(SidenavService);

  readonly title = input.required<string>();
  readonly links = input.required<StackedLink[]>();

  constructor() {
    afterNextRender(() => this.showLevel());
  }

  /**
   * Shows this page's level without stacking duplicates: nothing to do when it is already shown, a pop when it is
   * the level below (e.g. browser back from the page that stacked on top of it), a push otherwise.
   */
  private showLevel(): void {
    const stack = this.sidenav.stack();
    if (this.isOwnLevel(stack.at(-1))) return;
    if (this.isOwnLevel(stack.at(-2))) {
      void this.sidenav.pop();
      return;
    }
    void this.sidenav.push({
      type: 'component',
      component: StackedLinksComponent,
      componentData: { title: this.title(), links: this.links() },
      title: this.title(),
    });
  }

  private isOwnLevel(level: SidenavStackItem | undefined): boolean {
    return (
      !!level &&
      isComponentStackItem(level) &&
      level.component === StackedLinksComponent &&
      level.title === this.title()
    );
  }
}
