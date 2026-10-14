import { Theme } from '@app/app.models';
import type { ManifestMapperOptions } from 'ngx-sidenav';

export const DEFAULT_THEME = Theme.Light;
export const LOCAL_STORAGE_THEME_KEY = 'ngx-sidenav:theme';

/** Height in pixels of the fixed toolbar (Material's default desktop toolbar row): the offset of anchor scrolling. */
export const TOOLBAR_HEIGHT = 64;

/** The documentation version rendered by the demo: the single source for every docs URL. */
export const DOCS_VERSION = '22.0.0';

/** Folder of the generated docs, served as an asset (angular.json maps the repository `docs/` to `/docs`). */
export const DOCS_ROOT = `docs/${DOCS_VERSION}`;

/** Router path of the documentation pages. */
export const DOCS_ROUTE = 'docs';

/**
 * Maps manifest-generator routes (`content/guides/theming`) to demo routes (`/docs/guides/theming`), for both the
 * menu and the search index, so their URLs always match.
 */
export const DOCS_MAPPER_OPTIONS: ManifestMapperOptions = { stripPrefix: 'content/', routePrefix: `/${DOCS_ROUTE}` };

/**
 * The Markdown file of a docs page.
 * @param page The page path under the docs route, e.g. `guides/theming` (empty for the home page).
 * @returns The asset URL, e.g. `docs/22.0.0/content/guides/theming.md`.
 */
export function docsFile(page: string): string {
  return `${DOCS_ROOT}/content/${page || 'README'}.md`;
}
