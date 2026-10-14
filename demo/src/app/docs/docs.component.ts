import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCS_ROUTE, docsFile } from '@app/app.constant';
import { MarkdownComponent, type MarkdownError, type MarkdownHeading } from '@fsegurai/ngx-markdown';
import { AnchorService } from '@shared/anchor';
import { headingElements } from '@shared/scrollspy-nav';
import { ScrollspyNavLayoutComponent } from '@shared/scrollspy-nav-layout';
import { map } from 'rxjs';

/**
 * Renders the generated documentation: `/docs/<page>` loads `<page>.md` of the current docs version. A folder route
 * (`/docs/guides`) falls back to the folder `README`. Headings get ngx-markdown ids, the same anchors
 * `slugifyHeading()` builds for search results.
 */
@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, MatButtonModule, ScrollspyNavLayoutComponent],
})
export default class DocsComponent {
  private readonly router = inject(Router);
  private readonly anchor = inject(AnchorService);

  /** The page path under the docs route, e.g. `guides/theming` (empty for the home page). */
  protected readonly page = toSignal(
    inject(ActivatedRoute).url.pipe(map((segments) => segments.map((segment) => segment.path).join('/'))),
    { initialValue: '' },
  );
  protected readonly src = computed(() => docsFile(this.page()));
  protected readonly headings = signal<Element[]>([]);
  /** The source that failed to load and why; tied to `src()` so navigating to another page clears it. */
  private readonly failure = signal<{ readonly src: string; readonly kind: 'not-found' | 'error' } | null>(null);
  private readonly currentFailure = computed(() => {
    const failure = this.failure();
    return failure?.src === this.src() ? failure.kind : null;
  });
  protected readonly notFound = computed(() => this.currentFailure() === 'not-found');
  /** A transient failure (network, server error): the page may exist, so it can be retried. */
  protected readonly loadError = computed(() => this.currentFailure() === 'error');

  protected onHeadings(headings: MarkdownHeading[]): void {
    this.headings.set(headingElements(headings));
  }

  protected onReady(): void {
    this.failure.set(null);
    this.anchor.scrollToFragment();
  }

  /** Renders the markdown component again, which requests the page again. */
  protected retry(): void {
    this.failure.set(null);
  }

  /**
   * A missing page (404) is tried as a folder (its `README`), then reported as not found. Other HTTP errors are
   * transient and shown with a retry button. Rendering errors are logged.
   */
  protected onError(error: MarkdownError): void {
    if (!(error instanceof HttpErrorResponse)) {
      console.error('Docs page could not be rendered:', error);
      return;
    }
    this.headings.set([]);
    if (error.status !== HttpStatusCode.NotFound) {
      this.failure.set({ src: this.src(), kind: 'error' });
      return;
    }
    const page = this.page();
    if (page && !/(^|\/)README$/.test(page)) {
      void this.router.navigateByUrl(`/${DOCS_ROUTE}/${page}/README`, { replaceUrl: true });
      return;
    }
    this.failure.set({ src: this.src(), kind: 'not-found' });
  }
}
