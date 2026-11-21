import { ViewportScroller } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/** A URL with a scheme (`https:`, `mailto:`), protocol-relative (`//host`), absolute (`/page`) or a fragment. */
const NOT_RELATIVE = /^(?:[a-z][a-z\d+.-]*:|\/|#)/i;

/**
 * Anchors of the Markdown pages: relative `.md` links become routes, and the URL fragment is scrolled to once a
 * fetched page is rendered (the router scrolls on navigation, before the content exists).
 */
@Injectable({ providedIn: 'root' })
export class AnchorService {
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  /**
   * Configures the top offset used when scrolling to an anchor (the height of the fixed toolbar).
   * @param offset A position in screen coordinates (a tuple with x and y values), or a function returning it.
   */
  setOffset(offset: Parameters<ViewportScroller['setOffset']>[0]): void {
    this.viewportScroller.setOffset(offset);
  }

  /**
   * Turns a relative link to a Markdown file (`quick-start.md`, `../guides/theming.md#tokens`) into the route of that
   * page, resolved against the current URL. Other links are returned unchanged.
   * @param href The link of the Markdown source.
   * @returns The route, e.g. `/docs/guides/theming#tokens`.
   */
  resolveMarkdownLink(href: string): string {
    if (!href || NOT_RELATIVE.test(href)) return href;

    const hashIndex = href.indexOf('#');
    const path = hashIndex < 0 ? href : href.slice(0, hashIndex);
    if (!path.endsWith('.md')) return href;

    const currentPath = this.router.url.split(/[?#]/, 1)[0];
    const resolved = new URL(path.slice(0, -'.md'.length), `http://docs.local${currentPath}`).pathname;
    return hashIndex < 0 ? resolved : `${resolved}${href.slice(hashIndex)}`;
  }

  /**
   * Scrolls to the element of the current URL fragment, if any.
   */
  scrollToFragment(): void {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    if (fragment) this.viewportScroller.scrollToAnchor(fragment);
  }
}
