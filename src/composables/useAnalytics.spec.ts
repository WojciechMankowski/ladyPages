import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addGtag, consent } from 'vue-gtag';

// vue-gtag jest mockowane: sprawdzamy tylko, że composable woła właściwe
// funkcje API, bez ładowania prawdziwego skryptu gtag.js.
vi.mock('vue-gtag', () => ({
  addGtag: vi.fn(() => Promise.resolve()),
  consent: vi.fn(),
}));

const addGtagMock = vi.mocked(addGtag);
const consentMock = vi.mocked(consent);

async function loadWithGaId(id: string) {
  vi.resetModules();
  vi.stubEnv('VITE_GA_ID', id);
  return import('./useAnalytics');
}

beforeEach(() => {
  addGtagMock.mockClear();
  consentMock.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('useAnalytics — analyticsEnabled', () => {
  it('zwraca false, gdy VITE_GA_ID jest puste', async () => {
    const { useAnalytics } = await loadWithGaId('');
    expect(useAnalytics().analyticsEnabled()).toBe(false);
  });

  it('zwraca true, gdy VITE_GA_ID jest ustawione', async () => {
    const { useAnalytics } = await loadWithGaId('G-TEST123');
    expect(useAnalytics().analyticsEnabled()).toBe(true);
  });
});

describe('useAnalytics — grantAnalyticsConsent', () => {
  it('wstrzykuje gtag.js i ustawia analytics_storage=granted, gdy GA jest włączone', async () => {
    const { useAnalytics } = await loadWithGaId('G-TEST123');
    await useAnalytics().grantAnalyticsConsent();

    expect(addGtagMock).toHaveBeenCalledTimes(1);
    expect(consentMock).toHaveBeenCalledWith('update', { analytics_storage: 'granted' });
  });

  it('nie robi nic, gdy VITE_GA_ID jest puste', async () => {
    const { useAnalytics } = await loadWithGaId('');
    await useAnalytics().grantAnalyticsConsent();

    expect(addGtagMock).not.toHaveBeenCalled();
    expect(consentMock).not.toHaveBeenCalled();
  });
});

describe('useAnalytics — denyAnalyticsConsent', () => {
  it('ustawia analytics_storage=denied, gdy GA jest włączone', async () => {
    const { useAnalytics } = await loadWithGaId('G-TEST123');
    useAnalytics().denyAnalyticsConsent();

    expect(consentMock).toHaveBeenCalledWith('update', { analytics_storage: 'denied' });
    expect(addGtagMock).not.toHaveBeenCalled();
  });

  it('nie robi nic, gdy VITE_GA_ID jest puste', async () => {
    const { useAnalytics } = await loadWithGaId('');
    useAnalytics().denyAnalyticsConsent();

    expect(consentMock).not.toHaveBeenCalled();
  });
});
