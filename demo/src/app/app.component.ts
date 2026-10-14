import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TOOLBAR_HEIGHT } from '@app/app.constant';
import { Theme } from '@app/app.models';
import { defaultMenuItems } from '@app/core/layouts/sidenav/default-json-sidenav';
import { settingsMenuItems } from '@app/core/layouts/sidenav/settings-json-sidenav';
import { StressMenu } from '@app/stress/stress-menu';
import { AnchorService } from '@shared/anchor';
import { ThemeService } from '@shared/theme';
import { Sidenav, type StackMenuItem } from 'ngx-sidenav';

/** A menu set of the toolbar toggle. `items: undefined` lets the sidenav render the docs manifest. */
interface MenuSet {
  readonly name: string;
  readonly items: StackMenuItem[] | undefined;
}

/** Demo-only: remembers the menu set chosen in the toolbar, so a reload shows the same menu. */
export const LOCAL_STORAGE_MENU_SET_KEY = 'ngx-sidenav-demo:menu-set';

export const MENU_SETS: readonly MenuSet[] = [
  { name: 'Docs (manifest)', items: undefined },
  { name: 'Default JSON menu', items: defaultMenuItems },
  { name: 'Settings JSON menu', items: settingsMenuItems },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, RouterLinkActive, RouterOutlet, Sidenav],
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly stressMenu = inject(StressMenu);

  protected readonly isDark = computed(() => this.themeService.theme() === Theme.Dark);
  /** Fixed: the sidenav sticks to the viewport; floating: it scrolls with the page. */
  protected readonly menuFixed = signal(true);
  protected readonly menuSetIndex = signal(readMenuSetIndex());
  protected readonly menuSet = computed(() => MENU_SETS[this.menuSetIndex()]);
  /** The menu of the stress test page while it is open, otherwise the chosen menu set. */
  protected readonly sidenavItems = computed(() => this.stressMenu.items() ?? this.menuSet().items);
  protected readonly nextMenuSet = computed(() => MENU_SETS[(this.menuSetIndex() + 1) % MENU_SETS.length]);

  constructor() {
    inject(AnchorService).setOffset([0, TOOLBAR_HEIGHT]);
    this.themeService.init();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleMenuMode(): void {
    this.menuFixed.update((fixed) => !fixed);
  }

  toggleMenuSet(): void {
    this.menuSetIndex.update((index) => (index + 1) % MENU_SETS.length);
    try {
      localStorage.setItem(LOCAL_STORAGE_MENU_SET_KEY, String(this.menuSetIndex()));
    } catch {
      // Storage unavailable (private mode, quota): the choice simply is not remembered.
    }
  }
}

/** The menu set stored by a previous visit, or the first one (docs manifest). */
function readMenuSetIndex(): number {
  try {
    const index = Number(localStorage.getItem(LOCAL_STORAGE_MENU_SET_KEY));
    return Number.isInteger(index) && index >= 0 && index < MENU_SETS.length ? index : 0;
  } catch {
    return 0;
  }
}
