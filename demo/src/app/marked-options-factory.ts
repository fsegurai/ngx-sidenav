import { type MarkedOptions, MarkedRenderer, type MarkedToken } from '@fsegurai/ngx-markdown';
import type { AnchorService } from '@shared/anchor';

/**
 * Marked options of the demo: links to other Markdown pages (`quick-start.md`) become the routes of those pages.
 * @param anchorService Resolves the links against the current route.
 * @returns The Marked options.
 */
export function markedOptionsFactory(anchorService: AnchorService): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.link = ({ href, title, tokens, text, raw }: MarkedToken.Link) =>
    MarkedRenderer.prototype.link.call(renderer, {
      type: 'link',
      raw,
      href: anchorService.resolveMarkdownLink(href),
      title,
      text,
      tokens,
    });

  return { renderer };
}
