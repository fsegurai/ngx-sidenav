import type { StackMenuItem } from 'ngx-sidenav';
import { defaultMenuItems } from './default-json-sidenav';
import { simulatedLoad } from './lazy-json-sidenav';

const ITEMS: StackMenuItem[] = [{ label: 'Core', route: '/lazy/api/core' }];

describe('simulatedLoad', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves the items after the delay', async () => {
    const load = simulatedLoad(ITEMS, { delayMs: 500 });
    let result: StackMenuItem[] | undefined;
    void Promise.resolve(load()).then((items) => (result = items));

    await vi.advanceTimersByTimeAsync(499);
    expect(result).toBeUndefined();
    await vi.advanceTimersByTimeAsync(1);
    expect(result).toBe(ITEMS);
  });

  it('fails the first time only when failFirst is set, so Retry succeeds', async () => {
    const load = simulatedLoad(ITEMS, { delayMs: 100, failFirst: true });

    const first = expect(load()).rejects.toThrow(/simulated/i);
    await vi.advanceTimersByTimeAsync(100);
    await first;

    const second = load();
    await vi.advanceTimersByTimeAsync(100);
    await expect(second).resolves.toBe(ITEMS);
  });

  it('stops waiting when the signal aborts', async () => {
    const controller = new AbortController();
    const loading = simulatedLoad(ITEMS, { delayMs: 1000 })(controller.signal);
    controller.abort();
    await expect(loading).rejects.toMatchObject({ name: 'AbortError' });
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('default JSON menu', () => {
  it('has a lazy section: parents with loadChildren and no children', () => {
    const lazy = defaultMenuItems.filter((item) => typeof item.loadChildren === 'function');
    expect(lazy.map((item) => item.label)).toEqual(['Lazy API reference', 'Flaky section (fails once)']);
    expect(lazy.every((item) => !item.children)).toBe(true);
  });
});
