import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { DEFAULT_THEME, DOCS_ROOT, LOCAL_STORAGE_THEME_KEY } from './app.constant';

/** A tiny manifest-generator output: one page and one folder. */
const MANIFEST = [
  {
    label: 'Guides',
    route: 'content/guides',
    isParent: true,
    order: 2,
    children: [{ label: 'Theming', route: 'content/guides/theming', order: 1 }],
  },
  { label: 'Documentation Home', route: 'content/README', order: 0 },
];

const SEARCH_INDEX = [
  { label: 'Documentation Home', route: 'content/README' },
  { label: 'Theming', route: 'content/guides/theming', headings: ['Badges'], excerpt: 'CSS custom properties.' },
];

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    document.body.className = '';
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideHttpClientTesting()] });

    fixture = TestBed.createComponent(AppComponent);
    element = fixture.nativeElement;
    document.body.appendChild(element);
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${DOCS_ROOT}/manifest.json`).flush(MANIFEST);
    http.expectOne(`${DOCS_ROOT}/search-index.json`).flush(SEARCH_INDEX);
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    element.remove();
    localStorage.clear();
  });

  function menuLabels(): string[] {
    return [...element.querySelectorAll('ngx-sidenav-menu ngx-sidenav-link-item')].map(
      (item) => item.textContent?.trim() ?? '',
    );
  }

  it('creates the shell and applies the default theme', () => {
    expect(element.querySelector('mat-toolbar')).not.toBeNull();
    expect(document.body.classList).toContain(`${DEFAULT_THEME}-theme`);
    expect(localStorage.getItem(LOCAL_STORAGE_THEME_KEY)).toBe(DEFAULT_THEME);
  });

  it('keeps the toolbar title out of the global link color, so it stays readable on the primary toolbar', () => {
    const title = element.querySelector<HTMLAnchorElement>('mat-toolbar .lib-title');
    expect(title?.classList).toContain('docs-ignore-link-styling');
    expect(title?.textContent).toContain('@fsegurai/ngx-sidenav');
  });

  it('draws the toolbar logo and icons with currentColor, so they follow the toolbar text color', () => {
    const toolbar = element.querySelector('mat-toolbar') as HTMLElement;
    expect(toolbar.querySelector('img')).toBeNull();

    const logo = toolbar.querySelector('.lib-title svg.lib-logo');
    const githubLink = toolbar.querySelector('a[href="https://github.com/fsegurai/ngx-sidenav"]');
    expect(githubLink?.textContent?.trim()).toBe('GitHub repository');
    const github = githubLink?.querySelector('svg') ?? null;
    for (const svg of [logo, github]) {
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      const painted = [...(svg?.querySelectorAll('[fill], [stroke]') ?? [])];
      expect(painted.length).toBeGreaterThan(0);
      for (const shape of painted) {
        for (const attr of ['fill', 'stroke']) {
          const value = shape.getAttribute(attr);
          if (value !== null) expect(['currentColor', 'none']).toContain(value);
        }
      }
    }
  });

  it('renders the sidenav from the docs manifest, in manifest order', () => {
    const labels = menuLabels();
    expect(labels.findIndex((label) => label.includes('Documentation Home'))).toBe(0);
    expect(labels.findIndex((label) => label.includes('Guides'))).toBe(1);
  });

  it('switches to the JSON demo menus and back to the manifest', async () => {
    const toggle = element.querySelector<HTMLButtonElement>('button[aria-label^="Show the"]');
    toggle?.click();
    await fixture.whenStable();
    expect(menuLabels().some((label) => label.includes('Get Started'))).toBe(true);

    toggle?.click();
    await fixture.whenStable();
    toggle?.click();
    await fixture.whenStable();
    expect(menuLabels().some((label) => label.includes('Documentation Home'))).toBe(true);
  });

  it('opens a lazy level of the JSON demo menu: loading row, then the loaded items', async () => {
    element.querySelector<HTMLButtonElement>('button[aria-label^="Show the"]')?.click();
    await fixture.whenStable();
    const parent = [...element.querySelectorAll<HTMLButtonElement>('ngx-sidenav-menu button.ngx-sidenav-link')].find(
      (button) => button.textContent?.includes('Lazy API reference'),
    );
    parent?.click();
    fixture.detectChanges();

    expect(element.querySelector('.ngx-sidenav-menu__status--loading')?.textContent).toContain('Loading');
    await vi.waitFor(
      () => {
        fixture.detectChanges();
        expect(menuLabels().some((label) => label.includes('Signals'))).toBe(true);
      },
      { timeout: 3000 },
    );
    expect(element.querySelector('.ngx-sidenav-menu__status')).toBeNull();
  });

  it('finds a page with the search box of the sidenav', async () => {
    const input = element.querySelector<HTMLInputElement>('ngx-sidenav-search input');
    expect(input).not.toBeNull();

    input?.focus();
    (input as HTMLInputElement).value = 'badges';
    input?.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const options = [...element.querySelectorAll('[role="option"]')].map((option) => option.textContent ?? '');
    expect(options).toHaveLength(1);
    expect(options[0]).toContain('Theming');
    expect(options[0]).toContain('Badges');
  });
});
