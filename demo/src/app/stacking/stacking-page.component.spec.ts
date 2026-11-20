import { TestBed } from '@angular/core/testing';
import { isComponentStackItem, SidenavService } from 'ngx-sidenav';
import { StackedLinksComponent } from './stacked-links.component';
import { StackingPageComponent } from './stacking-page.component';

describe('StackingPageComponent', () => {
  function sidenav(): SidenavService {
    return TestBed.inject(SidenavService);
  }

  function create(title: string) {
    const fixture = TestBed.createComponent(StackingPageComponent);
    fixture.componentRef.setInput('title', title);
    fixture.componentRef.setInput('links', []);
    return fixture;
  }

  /** The stack as `menu` for menu levels and the title of each stacked links component. */
  function levels(): unknown[] {
    return sidenav()
      .stack()
      .map((item) => (isComponentStackItem(item) ? item.title : 'menu'));
  }

  function pushLevel(title: string): void {
    void sidenav().push({
      type: 'component',
      component: StackedLinksComponent,
      componentData: { title, links: [] },
      title,
    });
  }

  beforeEach(() => {
    localStorage.clear();
    void sidenav().push({ type: 'menu', items: [] });
  });

  afterEach(() => localStorage.clear());

  it('pushes its component level once rendered', async () => {
    const fixture = create('Stacking');
    await fixture.whenStable();

    expect(levels()).toEqual(['menu', 'Stacking']);
  });

  it('keeps its level when a link of the stacked component leaves the page', async () => {
    const fixture = create('Stacking');
    await fixture.whenStable();

    fixture.destroy();
    expect(levels()).toEqual(['menu', 'Stacking']);
  });

  it('does not stack its level twice when it is already shown', async () => {
    pushLevel('Stacking');
    const fixture = create('Stacking');
    await fixture.whenStable();

    expect(levels()).toEqual(['menu', 'Stacking']);
  });

  it('returns to its level instead of stacking a duplicate (browser back)', async () => {
    pushLevel('Default');
    pushLevel('Settings');
    const fixture = create('Default');
    await fixture.whenStable();

    expect(levels()).toEqual(['menu', 'Default']);
  });

  it('does not touch the stack when destroyed before its first render', () => {
    const fixture = create('Stacking');

    fixture.destroy();
    expect(levels()).toEqual(['menu']);
  });
});
