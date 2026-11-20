/// <reference lib="webworker" />
// Builds and searches large search indexes off the main thread: see `withSearchIndex({ worker })` in app.config.ts.
import { exposeSidenavWorker } from 'ngx-sidenav/worker';

exposeSidenavWorker();
