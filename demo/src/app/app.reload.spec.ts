import { Location } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SidenavService } from 'ngx-sidenav';
import { AppComponent, LOCAL_STORAGE_MENU_SET_KEY } from './app.component';
import { appConfig } from './app.config';

const MANIFEST = [
  { label: 'Documentation Home', route: 'content/README', order: 0 },
  {
    label: 'Guides',
    route: 'content/guides',
    isParent: true,
    order: 2,
    children: [{ label: 'Theming', route: 'content/guides/theming', order: 1 }],
  },
];

/**
 * Simulates a full page reload on `url`: a fresh injector whose browser URL is already set, the router running its
 * initial navigation after the first render, and the docs manifest resolving afterwards.
 */
async function reload(url: string): Promise<{ fixture: ComponentFixture<AppComponent>; service: SidenavService }> {
  TestBed.configureTestingModule({
    providers: [...appConfig.providers, provideHttpClientTesting(), provideLocationMocks()],
  });
  TestBed.inject(Location).go(url);
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  await TestBed.inject(Router).initialNavigation();

  // Answer every request (manifest, search index, the Markdown page) until the application is idle
  const http = TestBed.inject(HttpTestingController);
  for (let round = 0; round < 5; round++) {
    for (const request of http.match(() => true)) {
      const url = request.request.url;
      request.flush(url.endsWith('manifest.json') ? MANIFEST : url.endsWith('.json') ? [] : '# Page');
    }
    await new Promise((resolve) => setTimeout(resolve));
  }
  // The rendered docs page keeps the zone-less app busy in jsdom (Markdown plugins), so no whenStable() here
  fixture.detectChanges();
  return { fixture, service: TestBed.inject(SidenavService) };
}

function levels(service: SidenavService): (string | undefined)[] {
  return service.stack().map((level) => level.title);
}

describe('AppComponent reload', () => {
  beforeEach(() => localStorage.clear());

  afterEach(() => localStorage.clear());

  it('reopens the docs level of the active page after a reload', async () => {
    const { fixture, service } = await reload('/docs/guides/theming');

    expect(levels(service)).toEqual([undefined, 'Guides']);
    await vi.waitFor(() => {
      fixture.detectChanges();
      const active = (fixture.nativeElement as HTMLElement).querySelector('ngx-sidenav-menu a.active');
      expect(active?.textContent ?? '').toContain('Theming');
    });
    fixture.destroy();
  });

  it('remembers the JSON menu set and reopens its nested level after a reload', async () => {
    localStorage.setItem(LOCAL_STORAGE_MENU_SET_KEY, '1');
    const { fixture, service } = await reload('/settings/notifications/email');

    expect(levels(service)).toEqual([undefined, 'Playground with large title width', 'Notifications']);
    expect(service.currentMenu()?.items.map((item) => item.label)).toContain('Email');
    fixture.destroy();
  });

  it('remembers the menu set chosen in the toolbar', async () => {
    const { fixture } = await reload('/settings/security');
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button[aria-label^="Show the"]')?.click();
    fixture.detectChanges();

    expect(localStorage.getItem(LOCAL_STORAGE_MENU_SET_KEY)).toBe('1');
    fixture.destroy();
  });
});
