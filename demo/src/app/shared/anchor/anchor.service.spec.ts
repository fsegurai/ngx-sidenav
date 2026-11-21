import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AnchorService } from './anchor.service';

describe('AnchorService', () => {
  let anchor: AnchorService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([{ path: '**', children: [] }])],
    });
    await TestBed.inject(Router).navigateByUrl('/docs/getting-started/installation#peers');
    anchor = TestBed.inject(AnchorService);
  });

  it('resolves relative Markdown links against the current page', () => {
    expect(anchor.resolveMarkdownLink('quick-start.md')).toBe('/docs/getting-started/quick-start');
    expect(anchor.resolveMarkdownLink('../guides/theming.md#badges')).toBe('/docs/guides/theming#badges');
    expect(anchor.resolveMarkdownLink('README.md')).toBe('/docs/getting-started/README');
  });

  it('leaves other links unchanged', () => {
    for (const href of ['https://angular.dev', '/render', '#peers', 'mailto:me@example.com', 'logo.svg', '']) {
      expect(anchor.resolveMarkdownLink(href)).toBe(href);
    }
  });
});
