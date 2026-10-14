import { Injectable, signal } from '@angular/core';
import type { StackMenuItem } from 'ngx-sidenav';

/**
 * The menu of the stress test page. While it is set, the app sidenav renders it instead of the chosen menu set; the
 * page clears it when it is left, so the previous menu comes back.
 */
@Injectable({ providedIn: 'root' })
export class StressMenu {
  readonly items = signal<StackMenuItem[] | undefined>(undefined);
}
