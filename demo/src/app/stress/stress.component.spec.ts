import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { appConfig } from '../app.config';
import { DOCS_ROOT } from '../app.constant';
import { StressMenu } from './stress-menu';

const MANIFEST = [{ label: 'Documentation Home', route: 'content/README', order: 0 }];

describe('StressComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideHttpClientTesting()] });
    fixture = TestBed.createComponent(AppComponent);
    element = fixture.nativeElement;
    document.body.appendChild(element);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${DOCS_ROOT}/manifest.json`).flush(MANIFEST);
    http.expectOne(`${DOCS_ROOT}/search-index.json`).flush([]);
    await fixture.whenStable();

    await TestBed.inject(Router).navigateByUrl('/stress');
    await settle(() => element.querySelector('app-stress h1') !== null);
  });

  afterEach(() => {
    fixture.destroy();
    element.remove();
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  async function settle(done: () => boolean): Promise<void> {
    await vi.waitFor(
      async () => {
        await fixture.whenStable();
        expect(done()).toBe(true);
      },
      { timeout: 20_000, interval: 10 },
    );
  }

  function stat(name: string): string {
    return element.querySelector(`[data-stat="${name}"]`)?.textContent?.trim() ?? '';
  }

  function select(name: string, value: string): void {
    const field = element.querySelector<HTMLSelectElement>(`app-stress select[name="${name}"]`)!;
    field.value = value;
    field.dispatchEvent(new Event('change'));
  }

  function button(text: string): HTMLButtonElement {
    return [...element.querySelectorAll<HTMLButtonElement>('app-stress button')].find(
      (candidate) => candidate.textContent?.trim() === text,
    )!;
  }

  function menuLabels(): string[] {
    return [...element.querySelectorAll('ngx-sidenav ngx-sidenav-link-item')].map(
      (item) => item.textContent?.trim() ?? '',
    );
  }

  it('renders the page, linked from the toolbar', () => {
    expect(element.querySelector('app-stress h1')?.textContent).toBe('Stress test');
    expect(element.querySelector('mat-toolbar a[href="/stress"]')?.classList).toContain('app-nav--active');
    expect(stat('long-tasks-unsupported')).toContain('does not report long tasks');
  });

  it('populates the sidenav with 1k generated items, then restores the previous menu when left', async () => {
    select('items', '1000');
    button('Load menu').click();
    await settle(() => stat('first-menu').endsWith('ms'));

    expect(stat('menu-items')).toBe('1,000 (depth 4)');
    const roots = TestBed.inject(StressMenu).items()!;
    expect(roots.length).toBeGreaterThan(1);
    expect(menuLabels().some((label) => label.includes(roots[0].label))).toBe(true);

    // A page without HTTP requests of its own (the docs pages fetch their Markdown)
    await TestBed.inject(Router).navigateByUrl('/elsewhere');
    await settle(() => element.querySelector('app-stress') === null);
    expect(TestBed.inject(StressMenu).items()).toBeUndefined();
    await settle(() => menuLabels().some((label) => label.includes('Documentation Home')));
  });

  it('labels the first-menu timing with what it measures', () => {
    select('items', '1000');
    button('Load menu').click();
    fixture.detectChanges();

    const term = element.querySelector('[data-stat="first-menu"]')?.previousElementSibling;
    expect(term?.textContent?.trim()).toBe('Mapped → first root row rendered');
  });

  it('measures the route index when it becomes ready, not after the first menu render', async () => {
    select('items', '1000');
    button('Load menu').click();
    await settle(() => stat('first-menu').endsWith('ms') && stat('index-ready-menu').endsWith('ms'));

    const stress = fixture.debugElement.query(By.css('app-stress')).componentInstance as {
      menuStats: () => { firstMenuMs?: number; indexReadyMs?: number } | null;
    };
    const stats = stress.menuStats()!;
    // A 1k menu is indexed synchronously when it becomes the root, before its rows render
    expect(stats.indexReadyMs!).toBeLessThanOrEqual(stats.firstMenuMs!);
  });

  it('does not report a query of a previous index as the latency of a rebuilt one', async () => {
    button('Build index').click();
    fixture.detectChanges();
    const query = element.querySelector<HTMLInputElement>('app-stress input[name="query"]')!;
    query.value = 'alpha gamma';
    query.dispatchEvent(new Event('input'));

    // Rebuilt while the first index was still being built: its query was never answered
    button('Build index').click();
    await settle(() => stat('index-ready').endsWith('ms'));
    expect(stat('query-latency')).toBe('–');
    expect(element.querySelector<HTMLInputElement>('app-stress input[name="query"]')?.value).toBe('');
  });

  it('searches on the main thread when Worker is not available, even with the worker toggle on', async () => {
    expect(typeof Worker).toBe('undefined');
    expect(stat('worker-unavailable')).toContain('main thread');
    expect(element.querySelector<HTMLInputElement>('app-stress input[name="worker"]')?.checked).toBe(true);

    button('Build index').click();
    await settle(() => stat('index-ready').endsWith('ms'));
    expect(stat('search-thread')).toBe('main thread');

    const query = element.querySelector<HTMLInputElement>('app-stress input[name="query"]')!;
    query.value = 'alpha gamma';
    query.dispatchEvent(new Event('input'));
    await settle(() => stat('query-latency').endsWith('ms'));
    expect(element.querySelectorAll('app-stress .stress-results li').length).toBeGreaterThan(0);
  });
});
