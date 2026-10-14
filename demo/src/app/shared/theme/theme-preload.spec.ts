import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_THEME, LOCAL_STORAGE_THEME_KEY } from '@app/app.constant';
import { Theme } from '@app/app.models';

/** The inline script of `demo/src/index.html` that applies the theme class before the app boots. */
function preloadScript(): string {
  // Relative to this spec (not to the working directory); node:path, as jsdom replaces the global URL
  const html = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../../index.html'), 'utf8');
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1];
  if (!script) throw new Error('index.html has no inline theme script');
  return script;
}

/** Runs the index.html script against the jsdom document, as the browser would before first paint. */
function runPreload(): void {
  new Function(preloadScript())();
}

describe('index.html theme preload', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = 'mat-app-background';
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('applies the default theme class when nothing is stored', () => {
    runPreload();
    expect(document.body.classList).toContain(`${DEFAULT_THEME}-theme`);
    expect(document.body.classList).toContain('mat-app-background');
  });

  it('applies the stored theme, using the ThemeService storage key', () => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, Theme.Dark);
    runPreload();
    expect(document.body.classList).toContain(`${Theme.Dark}-theme`);
    expect(document.body.classList).not.toContain(`${Theme.Light}-theme`);
  });

  it('ignores an unknown stored value', () => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, 'sepia');
    runPreload();
    expect(document.body.classList).toContain(`${DEFAULT_THEME}-theme`);
  });
});
