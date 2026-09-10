import { addGtag, consent } from 'vue-gtag';

/**
 * Measurement ID GA4 (np. `G-XXXXXXXXXX`) z pliku `.env` (`VITE_GA_ID`).
 * Puste = analityka całkowicie wyłączona (skrypt gtag.js nie jest ładowany).
 */
const GA_ID = (import.meta.env.VITE_GA_ID ?? '').trim();

/**
 * Wiąże baner zgody cookies z wtyczką vue-gtag.
 *
 * vue-gtag jest inicjowane w `main.ts` z `initMode: 'manual'` oraz
 * `consentMode: 'denied'`, więc gtag.js nie ładuje się, dopóki użytkownik
 * nie zaakceptuje plików cookies. Dopiero `grantAnalyticsConsent()`
 * wstrzykuje skrypt i podnosi zgodę `analytics_storage`.
 */
export function useAnalytics() {
  function analyticsEnabled(): boolean {
    return GA_ID.length > 0;
  }

  async function grantAnalyticsConsent(): Promise<void> {
    if (!analyticsEnabled()) return;
    await addGtag();
    consent('update', { analytics_storage: 'granted' });
  }

  function denyAnalyticsConsent(): void {
    if (!analyticsEnabled()) return;
    consent('update', { analytics_storage: 'denied' });
  }

  return { analyticsEnabled, grantAnalyticsConsent, denyAnalyticsConsent };
}
