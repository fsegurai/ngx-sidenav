import { DOCUMENT, Injectable, inject, type Signal, signal } from '@angular/core';
import { DEFAULT_THEME, LOCAL_STORAGE_THEME_KEY } from '@app/app.constant';
import { isTheme, Theme } from '@app/app.models';

/**
 * The light/dark theme of the demo: a signal, the `<theme>-theme` body class and the stored preference.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly _theme = signal<Theme>(DEFAULT_THEME);

  readonly theme: Signal<Theme> = this._theme.asReadonly();

  /**
   * Applies the stored theme, or the default one.
   */
  init(): void {
    const storedTheme = this.readStoredTheme();
    this.set(isTheme(storedTheme) ? storedTheme : DEFAULT_THEME);
  }

  /**
   * Toggles the theme between light and dark.
   */
  toggle(): void {
    this.set(this._theme() === Theme.Light ? Theme.Dark : Theme.Light);
  }

  /**
   * Sets the theme, its body class, and saves it to local storage.
   * @param theme The theme to set.
   */
  set(theme: Theme): void {
    this._theme.set(theme);
    const bodyClassList = this.document.body.classList;
    const removeClassList = /\w*-theme\b/.exec(bodyClassList.value);

    if (removeClassList) bodyClassList.remove(...removeClassList);

    bodyClassList.add(`${theme}-theme`);

    try {
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the theme still applies for this visit.
    }
  }

  /**
   * Reads the stored theme, tolerating unavailable storage.
   * @private - This method is private and should not be accessed outside of this class
   */
  private readStoredTheme(): string | null {
    try {
      return localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    } catch {
      return null;
    }
  }
}
