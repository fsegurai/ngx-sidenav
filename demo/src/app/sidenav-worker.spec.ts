import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SidenavSearchService } from 'ngx-sidenav';
import { appConfig, createSidenavWorker } from './app.config';
import { DOCS_ROOT } from './app.constant';

/** More entries than the library searches synchronously: the worker would be used when available. */
const LARGE_INDEX = Array.from({ length: 2500 }, (_, i) => ({ label: `Page ${i}`, route: `content/page-${i}` }));

describe('search worker', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('creates a module worker for sidenav.worker', () => {
    const created: { url: string; options?: WorkerOptions }[] = [];
    vi.stubGlobal(
      'Worker',
      class {
        constructor(url: URL | string, options?: WorkerOptions) {
          created.push({ url: String(url), options });
        }
      },
    );
    createSidenavWorker();
    expect(created).toHaveLength(1);
    // The builder bundles sidenav.worker.ts as its own chunk (worker-<hash>.js) and rewrites the URL
    expect(created[0].url).toMatch(/worker/);
    expect(created[0].options).toEqual({ type: 'module' });
  });

  it('searches a large index on the main thread when Worker is not available', async () => {
    expect(typeof Worker).toBe('undefined');
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideHttpClientTesting()] });
    const search = TestBed.inject(SidenavSearchService);
    const http = TestBed.inject(HttpTestingController);
    await vi.waitFor(() => {
      TestBed.tick();
      http.expectOne(`${DOCS_ROOT}/search-index.json`).flush(LARGE_INDEX);
    });

    search.setQuery('page 1234');
    await vi.waitFor(
      () => {
        TestBed.tick();
        expect(search.pending()).toBe(false);
        expect(search.results()[0]?.entry.route).toMatch(/\/page-1234$/);
      },
      { timeout: 5000 },
    );
    expect(search.status()).toBe('resolved');
  });
});
