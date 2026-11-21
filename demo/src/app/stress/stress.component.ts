import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  createEnvironmentInjector,
  DestroyRef,
  DOCUMENT,
  type ElementRef,
  EnvironmentInjector,
  effect,
  Injector,
  inject,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { createSidenavWorker } from '@app/app.config';
import {
  fromManifestGeneratorLazy,
  provideSidenav,
  type SidenavSearchEntry,
  SidenavSearchService,
  SidenavService,
  withSearchIndex,
} from 'ngx-sidenav';
import { generateManifest, generateSearchEntries, STRESS_ROUTE } from './stress-data';
import { StressMenu } from './stress-menu';

/** Timings of the last generated menu, in milliseconds. */
interface MenuStats {
  readonly items: number;
  readonly depth: number;
  readonly generateMs: number;
  readonly mapMs: number;
  /** From the end of the mapping to the first render showing the first root row; `null` when no render showed it. */
  firstMenuMs?: number | null;
  indexReadyMs?: number;
}

/** Timings of the last built search index, in milliseconds. */
interface SearchStats {
  readonly entries: number;
  readonly worker: boolean;
  indexReadyMs?: number;
}

/** Renders a duration for the stats table. */
function ms(value: number | null | undefined): string {
  if (value === null) return 'not rendered';
  return value === undefined ? '…' : `${value.toFixed(1)} ms`;
}

/** Render checks for the first root row before giving up on the first-menu timing. */
const MAX_RENDER_CHECKS = 10;

/**
 * Stress test: generates large menus and search indexes (seeded, in the browser) and shows how long the sidenav
 * takes to render and index them, the query latency and the long tasks seen meanwhile. The generated menu replaces
 * the sidenav menu while the page is open.
 */
@Component({
  selector: 'app-stress',
  templateUrl: './stress.component.html',
  styleUrl: './stress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
})
export default class StressComponent {
  readonly #document = inject(DOCUMENT);
  readonly #injector = inject(Injector);
  readonly #environment = inject(EnvironmentInjector);
  readonly #sidenav = inject(SidenavService);
  readonly #menu = inject(StressMenu);
  private readonly queryInput = viewChild<ElementRef<HTMLInputElement>>('queryInput');
  #searchInjector: EnvironmentInjector | null = null;
  /** The generated menu whose route index is awaited, and when it was handed to the sidenav. */
  readonly #awaitedIndex = signal<{ readonly menu: readonly unknown[]; readonly at: number } | null>(null);
  #searchStartedAt: number | null = null;
  /** The query being timed, and the search instance it runs on (a rebuilt index does not answer it). */
  #timedQuery: { readonly search: SidenavSearchService; readonly at: number } | null = null;

  protected readonly itemOptions = [1_000, 10_000, 100_000];
  protected readonly depthOptions = [2, 3, 4, 5, 6];
  protected readonly indexOptions = [5_000, 50_000];
  protected readonly itemCount = signal(10_000);
  protected readonly depth = signal(4);
  protected readonly indexSize = signal(5_000);
  protected readonly useWorker = signal(true);
  /** `Worker` is missing on the server, in tests and in very old browsers: the library then searches on the main thread. */
  protected readonly workerSupported = typeof Worker !== 'undefined';

  protected readonly menuStats = signal<MenuStats | null>(null);
  protected readonly searchStats = signal<SearchStats | null>(null);
  protected readonly search = signal<SidenavSearchService | null>(null);
  protected readonly queryLatency = signal<number | null>(null);
  protected readonly topResults = computed(() => this.search()?.results().slice(0, 5) ?? []);
  /** Long tasks (over 50 ms) seen since the page opened; `null` where the browser does not report them. */
  protected readonly longTasks = signal<{ count: number; totalMs: number } | null>(null);
  protected readonly ms = ms;

  constructor() {
    // The route index of the generated menu (built in the background for large menus): timed as soon as the
    // generated menu is the sidenav root and its index is ready, independently of its first render
    effect(() => {
      const awaited = this.#awaitedIndex();
      if (!awaited) return;
      const root = this.#sidenav.stack()[0];
      const ready = this.#sidenav.routeIndexReady();
      if (!ready || root?.type !== 'menu' || root.items !== awaited.menu) return;
      const indexReadyMs = performance.now() - awaited.at;
      untracked(() => {
        this.#awaitedIndex.set(null);
        this.menuStats.update((stats) => stats && { ...stats, indexReadyMs });
      });
    });

    // The search index (sync, chunked or in the worker), then the latency of the last query
    effect(() => {
      const search = this.search();
      if (!search) return;
      const status = search.status();
      const pending = search.pending();
      search.results();
      const now = performance.now();
      untracked(() => {
        if (status === 'resolved' && this.#searchStartedAt !== null) {
          const indexReadyMs = now - this.#searchStartedAt;
          this.#searchStartedAt = null;
          this.searchStats.update((stats) => stats && { ...stats, indexReadyMs });
        }
        if (!pending && status === 'resolved' && this.#timedQuery?.search === search) {
          this.queryLatency.set(now - this.#timedQuery.at);
          this.#timedQuery = null;
        }
      });
    });

    const observer = isPlatformBrowser(inject(PLATFORM_ID)) ? this.#observeLongTasks() : null;
    inject(DestroyRef).onDestroy(() => {
      observer?.disconnect();
      this.#searchInjector?.destroy();
      // The sidenav shows the previous menu again
      this.#menu.items.set(undefined);
    });
  }

  protected loadMenu(): void {
    const items = this.itemCount();
    const depth = this.depth();
    const start = performance.now();
    const manifest = generateManifest(items, depth);
    const generated = performance.now();
    const menu = fromManifestGeneratorLazy(manifest, { stripPrefix: 'content/', routePrefix: `/${STRESS_ROUTE}` });
    const mapped = performance.now();
    this.menuStats.set({ items, depth, generateMs: generated - start, mapMs: mapped - generated });
    this.#awaitedIndex.set({ menu, at: mapped });
    this.#menu.items.set(menu);
    this.#awaitFirstMenu(menu[0]?.label ?? '', mapped, 1);
  }

  protected buildSearchIndex(): void {
    this.#searchInjector?.destroy();
    const entries = generateSearchEntries(this.indexSize());
    const worker = this.useWorker() && this.workerSupported;
    this.searchStats.set({ entries: entries.length, worker });
    // The query of the previous index is dropped: the new index starts without one
    const input = this.queryInput()?.nativeElement;
    if (input) input.value = '';
    this.queryLatency.set(null);
    this.#timedQuery = null;
    this.#searchStartedAt = performance.now();
    // A dedicated instance, so the docs search of the sidenav is not replaced
    this.#searchInjector = createEnvironmentInjector(
      [
        provideSidenav(
          {},
          withSearchIndex<SidenavSearchEntry[]>({
            source: entries,
            mapper: (raw) => raw,
            debounceMs: 0,
            worker: worker ? createSidenavWorker : undefined,
          }),
        ),
      ],
      this.#environment,
    );
    this.search.set(this.#searchInjector.get(SidenavSearchService));
  }

  protected onQuery(query: string): void {
    const search = this.search();
    if (!search) return;
    this.#timedQuery = { search, at: performance.now() };
    search.setQuery(query);
  }

  protected selectNumber(target: EventTarget | null, value: { set: (value: number) => void }): void {
    value.set(Number((target as HTMLSelectElement).value));
  }

  protected resetLongTasks(): void {
    this.longTasks.update((tasks) => tasks && { count: 0, totalMs: 0 });
  }

  /**
   * Records the time from the end of the mapping to the first render that shows the first root row of the generated
   * menu (a few renders may run before the sidenav's); `null` when none of the first renders shows it.
   */
  #awaitFirstMenu(label: string, start: number, check: number): void {
    afterNextRender(
      {
        read: () => {
          const labels = this.#document.querySelectorAll('ngx-sidenav .ngx-sidenav-link__label');
          // The text before the screen-reader hint, compared exactly ("alpha 1" is not "alpha 12")
          const rendered = [...labels].some((node) => node.firstChild?.textContent?.trim() === label);
          if (!rendered && check < MAX_RENDER_CHECKS) {
            this.#awaitFirstMenu(label, start, check + 1);
            return;
          }
          const firstMenuMs = rendered ? performance.now() - start : null;
          this.menuStats.update((stats) => stats && { ...stats, firstMenuMs });
        },
      },
      { injector: this.#injector },
    );
  }

  #observeLongTasks(): PerformanceObserver | null {
    if (typeof PerformanceObserver === 'undefined' || !PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
      return null;
    }
    this.longTasks.set({ count: 0, totalMs: 0 });
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const totalMs = entries.reduce((total, entry) => total + entry.duration, 0);
      this.longTasks.update(
        (tasks) => tasks && { count: tasks.count + entries.length, totalMs: tasks.totalMs + totalMs },
      );
    });
    observer.observe({ type: 'longtask', buffered: false });
    return observer;
  }
}
