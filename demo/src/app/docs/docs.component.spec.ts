import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appConfig } from '@app/app.config';
import { docsFile } from '@app/app.constant';
import { slugifyHeading } from 'ngx-sidenav';

describe('DocsComponent', () => {
  let harness: RouterTestingHarness;
  let http: HttpTestingController;

  beforeEach(async () => {
    // The clipboard plugin needs the ClipboardJS global that angular.json loads as a script in the app.
    vi.stubGlobal('ClipboardJS', class {});
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideHttpClientTesting()] });
    harness = await RouterTestingHarness.create();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function respond(page: string, markdown: string | null): Promise<void> {
    const request = await vi.waitFor(() => {
      const [pending] = http.match(docsFile(page));
      if (!pending) throw new Error(`no request for ${docsFile(page)}`);
      return pending;
    });
    if (markdown === null) {
      // No stability wait: the 404 starts a navigation whose own request is still pending.
      request.flush('Not found', { status: 404, statusText: 'Not Found' });
      return;
    }
    request.flush(markdown);
    await harness.fixture.whenStable();
  }

  async function open(url: string, markdown: string): Promise<HTMLElement> {
    void harness.navigateByUrl(url);
    await respond(url.replace(/^\/docs\/?/, ''), markdown);
    return harness.routeNativeElement as HTMLElement;
  }

  it('renders the Markdown file of the route with a markdown component', async () => {
    const element = await open('/docs/guides/theming', '# Theming\n\nSome text.\n');

    const markdown = element.querySelector('markdown');
    expect(markdown).not.toBeNull();
    expect(markdown?.querySelector('h1')?.textContent).toBe('Theming');
  });

  it('gives headings the ids that search results link to', async () => {
    const heading = 'Options & Theming: `badgeColor` (v22)';
    const element = await open('/docs/guides/theming', `# Theming\n\n## ${heading}\n`);

    expect(element.querySelector('h2')?.id).toBe(slugifyHeading(heading));
  });

  it('strips the front-matter and renders the home page for /docs', async () => {
    const element = await open('/docs', '---\nlabel: Home\n---\n\n# Home\n');

    expect(element.querySelector('h1')?.textContent).toBe('Home');
    expect(element.textContent).not.toContain('label: Home');
  });

  it('opens the README of a folder route, then reports a missing page', async () => {
    void harness.navigateByUrl('/docs/guides');
    await respond('guides', null);
    await respond('guides/README', '# Guides\n');
    expect(TestBed.inject(Router).url).toBe('/docs/guides/README');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Guides');

    void harness.navigateByUrl('/docs/missing');
    await respond('missing', null);
    await respond('missing/README', null);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Page not found');
  });

  it('shows a retryable error for a failed request that is not a 404', async () => {
    void harness.navigateByUrl('/docs/guides/theming');
    const request = await vi.waitFor(() => {
      const [pending] = http.match(docsFile('guides/theming'));
      if (!pending) throw new Error('no request for the page');
      return pending;
    });
    request.flush('Server error', { status: 503, statusText: 'Service Unavailable' });
    await harness.fixture.whenStable();

    const element = harness.routeNativeElement as HTMLElement;
    expect(TestBed.inject(Router).url).toBe('/docs/guides/theming');
    expect(element.querySelector('h1')?.textContent).toBe('Page could not be loaded');
    http.expectNone(docsFile('guides/theming/README'));

    element.querySelector<HTMLButtonElement>('button.docs-retry')?.click();
    await respond('guides/theming', '# Theming\n');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Theming');
  });

  it('recovers from a missing page when navigating to an existing one', async () => {
    void harness.navigateByUrl('/docs/missing');
    await respond('missing', null);
    await respond('missing/README', null);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Page not found');

    void harness.navigateByUrl('/docs/guides/theming');
    await respond('guides/theming', '# Theming\n');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Theming');
  });
});
