import type { MarkdownHeading } from '@fsegurai/ngx-markdown';

/**
 * The elements of the rendered headings of the given levels, for the scrollspy table of contents.
 * @param headings The `headings` output of `<markdown [headingIds]="true">`.
 * @param levels The heading levels to keep.
 * @returns The heading elements found in the page.
 */
export function headingElements(headings: readonly MarkdownHeading[], levels: readonly number[] = [2, 3]): Element[] {
  return headings.flatMap((heading) => (heading.element && levels.includes(heading.level) ? [heading.element] : []));
}
