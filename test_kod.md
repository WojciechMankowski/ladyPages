# Testy automatyczne (kod) — ledy_pages

## 0. Status

**Zaimplementowane i uruchamialne.** Kod poniżej to kopia dokumentacyjna testów, które faktycznie żyją w projekcie jako prawdziwe pliki:

- `src/composables/useSubscribe.spec.ts`, `src/composables/useAnalytics.spec.ts`, `src/composables/useBonusAccess.spec.ts`, `src/composables/useTheme.spec.ts` — testy jednostkowe (Vitest)
- `src/components/{Header,Hero,Contact,Footer,MobileCta,CookieConsent}.spec.ts`, `src/pages/{DodatekPage,BonusContent}.spec.ts` — testy komponentów (Vitest + `@vue/test-utils`, `jsdom`)
- `e2e/signup.spec.ts`, `e2e/dodatek.spec.ts` — testy E2E (Playwright, `playwright.config.ts`)

Uruchamianie:

```bash
npm test            # Vitest: testy jednostkowe + komponentów (vitest run)
npm run test:watch  # Vitest w trybie watch
npx playwright test # E2E — sam odpala dev server na porcie 4173 (webServer w playwright.config.ts)
```

Podczas pisania testów wykryto i naprawiono dwa realne błędy w kodzie produkcyjnym:
1. **`useSubscribe.ts`**: `callbackName` budowany tylko z `Date.now()` mógł kolidować przy dwóch wywołaniach w tej samej milisekundzie — dodano losowy sufiks.
2. **`Footer.vue`**: linki „Specjalizacje”/„Proces” wskazywały na nieistniejące id (`#specializations`, `#process`), a link „Projekty” prowadził do sekcji, która nigdy nie istniała na stronie — poprawiono na `#ebook`/`#target-audience` i usunięto martwy link (zgodnie z bugami P0 opisanymi w `test_frontend.md`, sekcja 8).

Manualny plan QA (do wykonania ręcznie w przeglądarce, szerszy zakres — a11y, RWD, wydajność) jest osobno w `test_frontend.md`.

Legenda: **[UNIT]** — Vitest, czysta logika, bez przeglądarki. **[COMPONENT]** — Vitest + `@vue/test-utils`, jsdom. **[E2E]** — Playwright, prawdziwa przeglądarka.

---

## 1. Testy jednostkowe — `src/composables/useSubscribe.ts` [UNIT]

Cała logika biznesowa (walidacja, zapis przez JSONP, stany ładowania/błędu) mieszka w jednym czystym pliku TS — najwyższa wartość testowa przy najmniejszym koszcie. 17 przypadków, wszystkie zielone.

```ts
// src/composables/useSubscribe.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { useSubscribe } from './useSubscribe';

// Symuluje wywołanie JSONP: MailerLite normalnie odpowiada, wywołując
// window[callbackName](response) po załadowaniu wstrzykniętego <script>.
// W testach przechwytujemy dodanie <script> do document.body i sami
// wywołujemy zarejestrowany callback zamiast robić prawdziwy request sieciowy.
function triggerJsonpResponse(response: unknown) {
  const script = document.body.querySelector('script[src*="mailerlite.com"]') as HTMLScriptElement | null;
  if (!script) throw new Error('Skrypt JSONP nie został wstrzyknięty do document.body');
  const url = new URL(script.src);
  const callbackName = url.searchParams.get('callback')!;
  (window as Record<string, any>)[callbackName](response);
}

function triggerJsonpNetworkError() {
  const script = document.body.querySelector('script[src*="mailerlite.com"]') as HTMLScriptElement | null;
  if (!script) throw new Error('Skrypt JSONP nie został wstrzyknięty do document.body');
  script.onerror?.(new Event('error'));
}

afterEach(() => {
  document.body.querySelectorAll('script[src*="mailerlite.com"]').forEach((el) => el.remove());
});

describe('useSubscribe — walidacja', () => {
  it('1.1 pusty e-mail zwraca komunikat "Adres e-mail jest wymagany."', async () => {
    const { email, emailError, subscribe } = useSubscribe();
    email.value = '';
    await subscribe();
    expect(emailError.value).toBe('Adres e-mail jest wymagany.');
  });

  it('1.2 e-mail bez "@" zwraca komunikat o niepoprawnym formacie', async () => {
    const { email, emailError } = useSubscribe();
    email.value = 'test';
    await nextTick();
    expect(emailError.value).toContain('poprawny adres e-mail');
  });

  it('1.3 e-mail bez kropki po domenie ("test@firma") jest niepoprawny', async () => {
    const { email, emailError } = useSubscribe();
    email.value = 'test@firma';
    await nextTick();
    expect(emailError.value).not.toBe('');
  });

  it('1.4 poprawny e-mail ("test@firma.pl") nie zgłasza błędu', async () => {
    const { email, emailError } = useSubscribe();
    email.value = 'test@firma.pl';
    await nextTick();
    expect(emailError.value).toBe('');
  });

  it('1.5 puste imię zwraca "Imię jest wymagane."', async () => {
    const { name, nameError, subscribe } = useSubscribe();
    name.value = '';
    await subscribe();
    expect(nameError.value).toBe('Imię jest wymagane.');
  });

  it('1.6 imię złożone z samych spacji jest traktowane jak puste (trim)', async () => {
    const { name, nameError, subscribe } = useSubscribe();
    name.value = '   ';
    await subscribe();
    expect(nameError.value).toBe('Imię jest wymagane.');
  });

  it('1.7 imię jednoliterowe zwraca "co najmniej 2 znaki"', async () => {
    const { name, nameError } = useSubscribe();
    name.value = 'A';
    await nextTick();
    expect(nameError.value).toBe('Imię powinno mieć co najmniej 2 znaki.');
  });

  it('1.8 imię dwuliterowe lub dłuższe nie zgłasza błędu', async () => {
    const { name, nameError } = useSubscribe();
    name.value = 'Ala';
    await nextTick();
    expect(nameError.value).toBe('');
  });

  it('1.9 brak zaznaczonej zgody blokuje submit z komunikatem o zgodzie', async () => {
    const { name, email, consent, consentError, subscribe } = useSubscribe();
    name.value = 'Ala';
    email.value = 'ala@firma.pl';
    consent.value = false;
    const result = await subscribe();
    expect(result).toBe(false);
    expect(consentError.value).toBe('Zaznacz zgodę, aby otrzymać materiały.');
  });

  it('1.10 zaznaczenie zgody czyści consentError na żywo', async () => {
    const { name, email, consent, consentError, subscribe } = useSubscribe();
    name.value = 'Ala';
    email.value = 'ala@firma.pl';
    await subscribe(); // ustawia consentError, bo consent jest false
    expect(consentError.value).not.toBe('');

    consent.value = true;
    await nextTick();

    expect(consentError.value).toBe('');
  });
});

describe('useSubscribe — subscribe()', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('1.11 subscribe() z pustymi polami zwraca false i nie wstrzykuje <script> do MailerLite', async () => {
    const { subscribe } = useSubscribe();
    const result = await subscribe();
    expect(result).toBe(false);
    expect(document.body.querySelector('script[src*="mailerlite.com"]')).toBeNull();
  });

  it('1.12 subscribe() z poprawnymi danymi i odpowiedzią {success:true} czyści pola i ustawia statusType="success"', async () => {
    const { name, email, consent, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    triggerJsonpResponse({ success: true });
    const result = await promise;

    expect(result).toBe(true);
    expect(name.value).toBe('');
    expect(email.value).toBe('');
    expect(consent.value).toBe(false);
    expect(statusType.value).toBe('success');
  });

  it('1.13 subscribe() z odpowiedzią {success:false} NIE czyści pól i ustawia statusType="error"', async () => {
    const { name, email, consent, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    triggerJsonpResponse({ success: false });
    const result = await promise;

    expect(result).toBe(false);
    expect(name.value).toBe('Krystyna');
    expect(email.value).toBe('krystyna@firma.pl');
    expect(statusType.value).toBe('error');
  });

  it('1.14 subscribe() + błąd sieci (script.onerror) ustawia statusType="error" i odblokowuje przycisk', async () => {
    const { name, email, consent, isSubmitting, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    triggerJsonpNetworkError();
    await promise;

    expect(statusType.value).toBe('error');
    expect(isSubmitting.value).toBe(false);
  });

  it('1.15 subscribe() + timeout 15s odrzuca i odblokowuje isSubmitting w finally', async () => {
    const { name, email, consent, isSubmitting, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    await vi.advanceTimersByTimeAsync(15000);
    await promise;

    expect(statusType.value).toBe('error');
    expect(isSubmitting.value).toBe(false);
  });

  it('1.16 dwa równoległe wywołania subscribe() używają różnych callbackName (brak kolizji w window)', async () => {
    const first = useSubscribe();
    const second = useSubscribe();
    first.name.value = 'Ala';
    first.email.value = 'ala@firma.pl';
    first.consent.value = true;
    second.name.value = 'Ola';
    second.email.value = 'ola@firma.pl';
    second.consent.value = true;

    first.subscribe();
    second.subscribe();

    const scripts = document.body.querySelectorAll('script[src*="mailerlite.com"]');
    expect(scripts.length).toBe(2);
    const [urlA, urlB] = Array.from(scripts).map(
      (s) => new URL((s as HTMLScriptElement).src).searchParams.get('callback')
    );
    expect(urlA).not.toBe(urlB);
  });

  it('1.17 po zakończeniu (sukces) tymczasowy <script> i window[callbackName] są usuwane', async () => {
    const { name, email, consent, subscribe } = useSubscribe();
    name.value = 'Ala';
    email.value = 'ala@firma.pl';
    consent.value = true;

    const promise = subscribe();
    const script = document.body.querySelector('script[src*="mailerlite.com"]') as HTMLScriptElement;
    const callbackName = new URL(script.src).searchParams.get('callback')!;

    triggerJsonpResponse({ success: true });
    await promise;

    expect(document.body.querySelector('script[src*="mailerlite.com"]')).toBeNull();
    expect((window as Record<string, any>)[callbackName]).toBeUndefined();
  });
});
```

---

## 2. Testy komponentów [COMPONENT]

`@vue/test-utils` `mount()`, środowisko `jsdom`. 23 testy pokrywające Header, Hero, Contact, Footer, MobileCta i CookieConsent — wszystkie zielone.

```ts
// src/components/Header.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Header from './Header.vue';

function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('Header.vue', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light');
    mockMatchMedia(true);
  });

  it('2.1 renderuje logo i 3 linki nawigacji (Co w ebooku? / O mnie / FAQ)', () => {
    const wrapper = mount(Header);
    const links = wrapper.findAll('.nav-link');
    expect(links).toHaveLength(3);
    expect(links.map((l) => l.text())).toEqual(['Co w ebooku?', 'O mnie', 'FAQ']);
  });

  it('2.2 klik w .mobile-nav-toggle otwiera menu i ustawia aria-expanded="true"', async () => {
    const wrapper = mount(Header);
    const toggle = wrapper.get('.mobile-nav-toggle');
    expect(toggle.attributes('aria-expanded')).toBe('false');

    await toggle.trigger('click');

    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('.main-nav').classes()).toContain('active');
  });

  it('2.3 klik w link nawigacji zamyka otwarte menu mobilne', async () => {
    const wrapper = mount(Header);
    await wrapper.get('.mobile-nav-toggle').trigger('click');
    expect(wrapper.get('.main-nav').classes()).toContain('active');

    await wrapper.get('.nav-link').trigger('click');

    expect(wrapper.get('.main-nav').classes()).not.toContain('active');
  });

  it('2.4 klik w przełącznik motywu dodaje klasę "light" na <html> i zapisuje localStorage', async () => {
    const wrapper = mount(Header);
    // domyślnie ciemny motyw (mockMatchMedia(true) symuluje prefers-color-scheme: dark)
    await wrapper.get('.theme-toggle').trigger('click');

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('2.5 scroll strony >50px dodaje klasę "scrolled" do <header>', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    const wrapper = mount(Header);
    expect(wrapper.get('header').classes()).not.toContain('scrolled');

    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();

    expect(wrapper.get('header').classes()).toContain('scrolled');
  });
});
```

```ts
// src/components/Hero.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Hero from './Hero.vue';

describe('Hero.vue — formularz zapisu', () => {
  it('2.6 wpisanie imienia jednoliterowego pokazuje błąd walidacji', async () => {
    const wrapper = mount(Hero);
    await wrapper.get('#hero-name').setValue('A');

    expect(wrapper.get('#hero-name-error').text()).toBe('Imię powinno mieć co najmniej 2 znaki.');
    expect(wrapper.get('#hero-name').attributes('aria-invalid')).toBe('true');
  });

  it('2.7 wpisanie niepoprawnego e-maila pokazuje błąd walidacji', async () => {
    const wrapper = mount(Hero);
    await wrapper.get('#hero-email').setValue('test');

    expect(wrapper.get('#hero-email-error').text()).toContain('poprawny adres e-mail');
  });

  it('2.8 przycisk submit ma disabled i pokazuje "Wysyłanie..." podczas isSubmitting', async () => {
    const wrapper = mount(Hero);
    await wrapper.get('#hero-name').setValue('Krystyna');
    await wrapper.get('#hero-email').setValue('krystyna@firma.pl');
    await wrapper.get('#hero-consent').setValue(true);

    await wrapper.get('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    const button = wrapper.get('button[type="submit"]');
    expect(button.attributes('disabled')).toBeDefined();
    expect(button.text()).toContain('Wysyłanie...');

    // Sprzątanie: rozwiązujemy zawisły JSONP request (jsdom nie ładuje
    // zewnętrznych <script src>), żeby nie zostawić otwartego 15s setTimeout.
    const script = document.body.querySelector('script[src*="mailerlite.com"]') as HTMLScriptElement;
    const callbackName = new URL(script.src).searchParams.get('callback')!;
    (window as Record<string, any>)[callbackName]({ success: true });
  });

  it('2.9 submit bez zaznaczonej zgody nie czyści formularza i pokazuje błąd zgody', async () => {
    const wrapper = mount(Hero);
    await wrapper.get('#hero-name').setValue('Krystyna');
    await wrapper.get('#hero-email').setValue('krystyna@firma.pl');
    // #hero-consent świadomie pozostaje niezaznaczony

    await wrapper.get('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(wrapper.get('#hero-consent-error').text()).toBe('Zaznacz zgodę, aby otrzymać materiały.');
    expect((wrapper.get('#hero-name').element as HTMLInputElement).value).toBe('Krystyna');
  });
});
```

```ts
// src/components/Contact.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Contact from './Contact.vue';
import Hero from './Hero.vue';

describe('Contact.vue', () => {
  it('2.10 renderuje dokładnie 4 pozycje FAQ', () => {
    const wrapper = mount(Contact);
    expect(wrapper.findAll('.faq-item')).toHaveLength(4);
  });

  it('2.11 formularz Contact ma stan niezależny od formularza Hero (osobne instancje useSubscribe)', async () => {
    const heroWrapper = mount(Hero);
    const contactWrapper = mount(Contact);

    await heroWrapper.get('#hero-name').setValue('Krystyna');

    expect((contactWrapper.get('#final-name').element as HTMLInputElement).value).toBe('');
  });
});
```

```ts
// src/components/Footer.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Footer from './Footer.vue';

describe('Footer.vue', () => {
  it('2.12 linki social (LinkedIn/GitHub) mają target="_blank" i rel="noopener noreferrer"', () => {
    const wrapper = mount(Footer);
    const socialLinks = wrapper.findAll('.footer-socials a');
    expect(socialLinks).toHaveLength(2);
    socialLinks.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
    });
  });

  it('2.13 linki stopki wskazują wyłącznie na id sekcji, które faktycznie istnieją na stronie', () => {
    // Sekcje istniejące w App.vue mają id: #about, #ebook (Specializations),
    // #target-audience/#signup-reward (Process), #faq/#contact (Contact).
    // Wcześniej stopka linkowała do #specializations, #projects, #process — żadne
    // z nich nie istniało w markupie (patrz test_frontend.md, sekcja 8: bugi P0).
    // Naprawione w Footer.vue: #specializations→#ebook, #process→#target-audience,
    // link "Projekty" usunięty (sekcja nigdy nie istniała na stronie).
    const wrapper = mount(Footer);
    const hrefs = wrapper.findAll('.footer-links a').map((a) => a.attributes('href'));
    const existingSectionIds = ['#about', '#ebook', '#target-audience', '#signup-reward', '#faq', '#contact'];

    hrefs
      .filter((href) => href?.startsWith('#'))
      .forEach((href) => {
        expect(existingSectionIds).toContain(href);
      });
  });
});
```

```ts
// src/components/MobileCta.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MobileCta from './MobileCta.vue';

describe('MobileCta.vue', () => {
  it('2.14 niewidoczny (brak klasy "visible") gdy scrollY = 0', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    const wrapper = mount(MobileCta);
    expect(wrapper.get('a').classes()).not.toContain('visible');
  });

  it('2.15 widoczny po przewinięciu powyżej 80% wysokości viewportu', async () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    const wrapper = mount(MobileCta);

    Object.defineProperty(window, 'scrollY', { value: 700, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await wrapper.vm.$nextTick();

    expect(wrapper.get('a').classes()).toContain('visible');
  });
});
```

```ts
// src/components/CookieConsent.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CookieConsent from './CookieConsent.vue';

const grantAnalyticsConsent = vi.fn();
const denyAnalyticsConsent = vi.fn();

vi.mock('../composables/useAnalytics', () => ({
  useAnalytics: () => ({
    grantAnalyticsConsent,
    denyAnalyticsConsent,
    analyticsEnabled: () => true,
  }),
}));

describe('CookieConsent.vue', () => {
  beforeEach(() => {
    localStorage.clear();
    grantAnalyticsConsent.mockClear();
    denyAnalyticsConsent.mockClear();
  });

  it('2.16 baner jest widoczny przy pierwszej wizycie (brak zapisanej decyzji)', async () => {
    const wrapper = mount(CookieConsent);
    // "visible" jest ustawiane w onMounted, więc DOM aktualizuje się dopiero
    // po kolejnym flushu (mounted hook uruchamia się synchronicznie, ale
    // wynikające z niego ponowne wyrenderowanie v-if jest asynchroniczne).
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.cookie-consent').exists()).toBe(true);
  });

  it('2.17 klik "Akceptuj" zapisuje localStorage["cookie-consent"]="accepted" i ukrywa baner', async () => {
    const wrapper = mount(CookieConsent);
    await wrapper.vm.$nextTick();
    await wrapper.findAll('button')[1].trigger('click'); // "Akceptuj"

    expect(localStorage.getItem('cookie-consent')).toBe('accepted');
    expect(wrapper.find('.cookie-consent').exists()).toBe(false);
  });

  it('2.18 klik "Odrzuć" zapisuje localStorage["cookie-consent"]="rejected" i ukrywa baner', async () => {
    const wrapper = mount(CookieConsent);
    await wrapper.vm.$nextTick();
    await wrapper.findAll('button')[0].trigger('click'); // "Odrzuć"

    expect(localStorage.getItem('cookie-consent')).toBe('rejected');
    expect(wrapper.find('.cookie-consent').exists()).toBe(false);
  });

  it('2.19 baner NIE pojawia się ponownie, gdy decyzja jest już zapisana w localStorage', async () => {
    localStorage.setItem('cookie-consent', 'rejected');
    const wrapper = mount(CookieConsent);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.cookie-consent').exists()).toBe(false);
  });

  it('2.20 klik "Akceptuj" włącza zgodę na Google Analytics', async () => {
    const wrapper = mount(CookieConsent);
    await wrapper.vm.$nextTick();
    await wrapper.findAll('button')[1].trigger('click'); // "Akceptuj"

    expect(grantAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(denyAnalyticsConsent).not.toHaveBeenCalled();
  });

  it('2.21 klik "Odrzuć" wyłącza zgodę na Google Analytics', async () => {
    const wrapper = mount(CookieConsent);
    await wrapper.vm.$nextTick();
    await wrapper.findAll('button')[0].trigger('click'); // "Odrzuć"

    expect(denyAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(grantAnalyticsConsent).not.toHaveBeenCalled();
  });

  it('2.22 zapisana zgoda "accepted" włącza Google Analytics już przy zamontowaniu', async () => {
    localStorage.setItem('cookie-consent', 'accepted');
    mount(CookieConsent);
    await Promise.resolve();

    expect(grantAnalyticsConsent).toHaveBeenCalledTimes(1);
  });

  it('2.23 zapisana decyzja "rejected" nie włącza Google Analytics przy zamontowaniu', async () => {
    localStorage.setItem('cookie-consent', 'rejected');
    mount(CookieConsent);
    await Promise.resolve();

    expect(grantAnalyticsConsent).not.toHaveBeenCalled();
  });
});
```

---

## 2a. Testy jednostkowe — `src/composables/useAnalytics.ts` [UNIT]

Cienki wrapper na `vue-gtag`: `analyticsEnabled()` (czy `VITE_GA_ID` ustawione), `grantAnalyticsConsent()` (wstrzyknięcie `gtag.js` przez `addGtag()` + `consent('update', { analytics_storage: 'granted' })`) oraz `denyAnalyticsConsent()`. `vue-gtag` jest mockowane — nie ładujemy prawdziwego skryptu. 6 przypadków, wszystkie zielone.

```ts
// src/composables/useAnalytics.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addGtag, consent } from 'vue-gtag';

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
```

---

## 2b. Testy jednostkowe — `src/composables/useBonusAccess.ts` [UNIT]

Logika dostępu do strony dodatku (`/dodatek`). Odczytuje parametr `?src`, porównuje ze zbiorem `ALLOWED_SRC` (`email`, `ml`, `newsletter`), normalizuje wielkość liter. Prawidłowe wejście utrwala odblokowanie w `localStorage` pod `bonus_unlocked=1`, więc powrót na goły adres nie odbiera dostępu. `search` i `storage` są wstrzykiwane w opcjach (fake `Storage`), więc test nie potrzebuje nawigacji jsdom. Odczyt/zapis storage jest w `try/catch` (tryb prywatny). 8 przypadków.

```ts
// src/composables/useBonusAccess.spec.ts
import { describe, it, expect } from 'vitest';
import { useBonusAccess, UNLOCK_STORAGE_KEY } from './useBonusAccess';

// Minimalny, izolowany zamiennik localStorage do testów (bez jsdom Storage).
function fakeStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
  };
}

describe('useBonusAccess — wejście bez parametru', () => {
  it('nie daje dostępu i raportuje źródło "direct"', () => {
    const storage = fakeStorage();
    const { src, hasAccess, sourceLabel } = useBonusAccess({ search: '', storage });

    expect(hasAccess.value).toBe(false);
    expect(src.value).toBe('');
    expect(sourceLabel.value).toBe('direct');
    expect(storage.getItem(UNLOCK_STORAGE_KEY)).toBeNull();
  });
});

describe('useBonusAccess — wejście ze znanym ?src', () => {
  it('daje dostęp dla ?src=email i zapamiętuje odblokowanie', () => {
    const storage = fakeStorage();
    const { src, hasAccess, sourceLabel } = useBonusAccess({
      search: '?src=email',
      storage,
    });

    expect(hasAccess.value).toBe(true);
    expect(src.value).toBe('email');
    expect(sourceLabel.value).toBe('email');
    expect(storage.getItem(UNLOCK_STORAGE_KEY)).toBe('1');
  });

  it('normalizuje wielkość liter w ?src (EMAIL => email)', () => {
    const storage = fakeStorage();
    const { hasAccess } = useBonusAccess({ search: '?src=EMAIL', storage });

    expect(hasAccess.value).toBe(true);
  });

  it('akceptuje też zapasowe wartości ?src=ml i ?src=newsletter', () => {
    expect(
      useBonusAccess({ search: '?src=ml', storage: fakeStorage() }).hasAccess.value,
    ).toBe(true);
    expect(
      useBonusAccess({ search: '?src=newsletter', storage: fakeStorage() }).hasAccess
        .value,
    ).toBe(true);
  });
});

describe('useBonusAccess — nieznany ?src', () => {
  it('nie daje dostępu i nie rusza storage', () => {
    const storage = fakeStorage();
    const { src, hasAccess, sourceLabel } = useBonusAccess({
      search: '?src=facebook',
      storage,
    });

    expect(hasAccess.value).toBe(false);
    expect(src.value).toBe('facebook');
    expect(sourceLabel.value).toBe('facebook');
    expect(storage.getItem(UNLOCK_STORAGE_KEY)).toBeNull();
  });
});

describe('useBonusAccess — zapamiętane odblokowanie', () => {
  it('daje dostęp bez parametru, gdy storage ma zapis odblokowania', () => {
    const storage = fakeStorage({ [UNLOCK_STORAGE_KEY]: '1' });
    const { hasAccess, sourceLabel } = useBonusAccess({ search: '', storage });

    expect(hasAccess.value).toBe(true);
    expect(sourceLabel.value).toBe('direct');
  });
});

describe('useBonusAccess — brak dostępu do storage', () => {
  it('nie wyrzuca, gdy storage rzuca wyjątkiem (tryb prywatny)', () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    } as unknown as Storage;

    expect(() =>
      useBonusAccess({ search: '?src=email', storage: throwingStorage }),
    ).not.toThrow();
    expect(
      useBonusAccess({ search: '?src=email', storage: throwingStorage }).hasAccess.value,
    ).toBe(true);
  });
});
```

---

## 2c. Testy komponentów — strona dodatku [COMPONENT]

`src/pages/BonusContent.vue` (treść instrukcji, tryb `full` / `teaser`) oraz `src/pages/DodatekPage.vue` (shell: rozgałęzienie dostępu + brama zapisu). W teście `DodatekPage` mockujemy `vue-gtag` (`event()` w `onMounted`) oraz `../composables/useBonusAccess`, żeby sterować `hasAccess` bez nawigacji. Formularz bramy reużywa `useSubscribe` (te same walidacje, id z prefiksem `bonus-`).

```ts
// src/pages/BonusContent.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BonusContent from './BonusContent.vue';

describe('BonusContent.vue', () => {
  it('renderuje wstęp i pierwszy krok z numerowaną listą', () => {
    const wrapper = mount(BonusContent);

    expect(wrapper.find('.bonus-intro').exists()).toBe(true);
    const steps = wrapper.findAll('.bonus-step');
    expect(steps.length).toBeGreaterThanOrEqual(1);
    expect(steps[0].find('ol').exists()).toBe(true);
    expect(steps[0].text()).toContain('Utwórz zespół w Teams');
  });

  it('w trybie "full" pokazuje wszystkie kroki, częste błędy i dopasowanie szablonu', () => {
    const wrapper = mount(BonusContent, { props: { mode: 'full' } });

    const steps = wrapper.findAll('.bonus-step');
    expect(steps.length).toBeGreaterThanOrEqual(4);
    expect(wrapper.text()).toContain('Utwórz plan w Plannerze');
    expect(wrapper.text()).toContain('Utwórz przepływ z wiadomości');
    expect(wrapper.text()).toContain('Przetestuj przepływ');

    expect(wrapper.find('.bonus-errors').exists()).toBe(true);
    expect(wrapper.find('.bonus-errors').findAll('li').length).toBe(7);
    expect(wrapper.text()).toContain('Kilkukrotne uruchomienie na tej samej wiadomości tworzy duplikaty');

    expect(wrapper.text()).toContain('Jak dopasować szablon do własnych potrzeb');
    expect(wrapper.text()).toContain('Treść zadania po polsku');
  });

  it('w trybie "teaser" nie pokazuje kroków poza pierwszym ani sekcji błędów', () => {
    const wrapper = mount(BonusContent, { props: { mode: 'teaser' } });

    expect(wrapper.findAll('.bonus-step').length).toBe(1);
    expect(wrapper.find('.bonus-errors').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Utwórz plan w Plannerze');
  });
});
```

```ts
// src/pages/DodatekPage.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';

vi.mock('vue-gtag', () => ({
  event: vi.fn(),
  addGtag: vi.fn(() => Promise.resolve()),
  consent: vi.fn(),
}));

const mockHasAccess = ref(false);
vi.mock('../composables/useBonusAccess', () => ({
  useBonusAccess: () => ({
    src: ref(''),
    hasAccess: mockHasAccess,
    sourceLabel: ref('direct'),
  }),
}));

// useTheme (przełącznik motywu w nagłówku) woła window.matchMedia — jsdom go nie
// implementuje domyślnie, więc mockujemy tak samo, jak w Header.spec.ts.
function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

import DodatekPage from './DodatekPage.vue';

beforeEach(() => {
  mockHasAccess.value = false;
  localStorage.clear();
  document.documentElement.classList.remove('light');
  mockMatchMedia(true);
});

describe('DodatekPage.vue — przełącznik motywu', () => {
  it('renderuje przełącznik motywu w nagłówku i przełącza klasę "light" na <html>', async () => {
    const wrapper = mount(DodatekPage);
    const toggle = wrapper.get('.theme-toggle');

    await toggle.trigger('click');

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});

describe('DodatekPage.vue — wejście z prawidłowym linkiem (hasAccess)', () => {
  it('pokazuje pełną treść instrukcji i nie renderuje bramy zapisu', () => {
    mockHasAccess.value = true;
    const wrapper = mount(DodatekPage);

    expect(wrapper.find('.bonus-errors').exists()).toBe(true);
    expect(wrapper.find('.bonus-gate').exists()).toBe(false);
    expect(wrapper.find('#bonus-email').exists()).toBe(false);
  });
});

describe('DodatekPage.vue — wejście bez linku (brak dostępu)', () => {
  it('pokazuje zajawkę oraz formularz zapisu z polami bonus-*', () => {
    const wrapper = mount(DodatekPage);

    expect(wrapper.find('.bonus-gate').exists()).toBe(true);
    expect(wrapper.find('#bonus-name').exists()).toBe(true);
    expect(wrapper.find('#bonus-email').exists()).toBe(true);
    expect(wrapper.find('#bonus-consent').exists()).toBe(true);

    expect(wrapper.text()).toContain('Utwórz zespół w Teams');
    expect(wrapper.find('.bonus-errors').exists()).toBe(false);
  });

  it('waliduje formularz zapisu bez zaznaczonej zgody', async () => {
    const wrapper = mount(DodatekPage);

    await wrapper.get('#bonus-name').setValue('Krystyna');
    await wrapper.get('#bonus-email').setValue('krystyna@firma.pl');
    await wrapper.get('.bonus-form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(wrapper.get('#bonus-consent-error').text()).toBe(
      'Zaznacz zgodę, aby otrzymać materiały.',
    );
  });
});
```

---

## 2d. Testy jednostkowe — `src/composables/useTheme.ts` [UNIT]

Wspólna logika przełącznika motywu (jasny/ciemny), wydzielona z `Header.vue` i reużyta w `DodatekPage.vue`. Bazuje na `onMounted`/`onUnmounted`, więc testujemy ją przez mały komponent-hosta zamiast wołać composable bezpośrednio.

```ts
// src/composables/useTheme.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useTheme } from './useTheme';

function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

const Host = defineComponent({
  setup() {
    const { isDark, toggleTheme } = useTheme();
    return () =>
      h('button', { class: 'toggle', onClick: toggleTheme }, isDark.value ? 'dark' : 'light');
  },
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light');
  });

  it('bez zapisanego motywu i bez preferencji systemowej "dark" startuje w trybie jasnym', () => {
    mockMatchMedia(false);
    mount(Host);

    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('bez zapisanego motywu, z preferencją systemową "dark" startuje w trybie ciemnym', () => {
    mockMatchMedia(true);
    mount(Host);

    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('respektuje zapisany w localStorage motyw "light" mimo preferencji systemowej "dark"', () => {
    localStorage.setItem('theme', 'light');
    mockMatchMedia(true);
    mount(Host);

    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('toggleTheme przełącza klasę "light" na <html> i zapisuje wybór w localStorage', async () => {
    mockMatchMedia(true);
    const wrapper = mount(Host);

    await wrapper.get('.toggle').trigger('click');

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
```

---

## 3. Testy E2E [E2E]

Playwright, ścieżki krytyczne oparte na sekcji 17 („Regresja”) z `test_frontend.md`. Żądanie do MailerLite jest przechwytywane przez `page.route()`. 5 scenariuszy w `signup.spec.ts` + 4 w `dodatek.spec.ts`.

```ts
// e2e/signup.spec.ts
import { test, expect, type Page } from '@playwright/test';

// Baner cookies (z-index 2100, fixed na dole) nakłada się na inne elementy
// interaktywne (np. linki w pełnoekranowym menu mobilnym), więc w testach,
// które nie dotyczą samego baneru, odrzucamy go od razu po wejściu na stronę.
async function dismissCookieBanner(page: Page) {
  const banner = page.locator('.cookie-consent');
  if (await banner.isVisible().catch(() => false)) {
    await banner.getByRole('button', { name: 'Akceptuj' }).click();
  }
}

test.describe('Zapis do formularza (Hero)', () => {
  test('3.1 błędne dane → poprawa → sukces, MailerLite zamockowany', async ({ page }) => {
    // Przechwytujemy wywołanie JSONP i sami wywołujemy callback z sukcesem,
    // zamiast robić prawdziwy request do assets.mailerlite.com.
    await page.route('https://assets.mailerlite.com/jsonp/**', async (route) => {
      const url = new URL(route.request().url());
      const callback = url.searchParams.get('callback');
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `${callback}({success:true})`,
      });
    });

    await page.goto('/');
    await dismissCookieBanner(page);

    await page.fill('#hero-name', 'A');
    await page.fill('#hero-email', 'zly-email');
    await expect(page.locator('#hero-name-error')).toHaveText('Imię powinno mieć co najmniej 2 znaki.');
    await expect(page.locator('#hero-email-error')).toContainText('poprawny adres e-mail');

    await page.fill('#hero-name', 'Krystyna');
    await page.fill('#hero-email', 'krystyna@firma.pl');
    await page.check('#hero-consent');
    await page.click('.hero-inline-form button[type="submit"]');

    // .form-status renderuje się jako rodzeństwo <form>, wewnątrz wspólnego
    // .hero-form-container — nie jest zagnieżdżony w .hero-inline-form.
    await expect(page.locator('.hero-form-container .form-status.success')).toContainText('Gotowe!');
    await expect(page.locator('#hero-name')).toHaveValue('');
  });
});

test.describe('Motyw jasny/ciemny', () => {
  // Wymuszamy znany punkt startowy (ciemny), bo domyślny colorScheme
  // Playwrighta to "light" — bez tego klik przełącznika mógłby zdjąć
  // klasę "light" zamiast ją dodać.
  test.use({ colorScheme: 'dark' });

  test('3.2 zmiana motywu zostaje zachowana po przeładowaniu strony', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
    await expect(page.locator('html')).not.toHaveClass(/light/);

    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveClass(/light/);

    await page.reload();

    await expect(page.locator('html')).toHaveClass(/light/);
  });
});

test.describe('Nawigacja mobilna', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('3.3 otwarcie menu, klik linku nawiguje do sekcji i zamyka menu', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);

    await page.click('.mobile-nav-toggle');
    await expect(page.locator('.main-nav')).toHaveClass(/active/);

    await page.locator('.nav-link', { hasText: 'O mnie' }).click();

    await expect(page.locator('.main-nav')).not.toHaveClass(/active/);
    await expect(page).toHaveURL(/#about$/);
  });
});

test.describe('Zgoda na cookies', () => {
  test('3.4 akceptacja baneru cookies nie pojawia się ponownie po reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.cookie-consent')).toBeVisible();

    await page.click('.cookie-consent button:has-text("Akceptuj")');
    await expect(page.locator('.cookie-consent')).toHaveCount(0);

    await page.reload();

    await expect(page.locator('.cookie-consent')).toHaveCount(0);
  });
});

test.describe('Niezależność formularzy Hero i Contact', () => {
  test('3.5 wypełnienie formularza Hero bez wysyłki nie wpływa na formularz Contact', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
    await page.fill('#hero-name', 'Krystyna');
    await page.fill('#hero-email', 'krystyna@firma.pl');

    await page.locator('#final-name').scrollIntoViewIfNeeded();

    await expect(page.locator('#final-name')).toHaveValue('');
    await expect(page.locator('#final-email')).toHaveValue('');
  });
});
```

### `e2e/dodatek.spec.ts` — strona dodatku `/dodatek`

W dev/E2E strona jest pod `/dodatek.html` (czysty URL `/dodatek` to funkcja Cloudflare Pages na produkcji). Sprawdza obie ścieżki wejścia (`?src=email` vs goły adres), utrwalanie odblokowania w `localStorage`, wysyłkę formularza bramy na zmockowanym MailerLite oraz `meta robots noindex`.

```ts
// e2e/dodatek.spec.ts
import { test, expect, type Page } from '@playwright/test';

async function dismissCookieBanner(page: Page) {
  const banner = page.locator('.cookie-consent');
  if (await banner.isVisible().catch(() => false)) {
    await banner.getByRole('button', { name: 'Akceptuj' }).click();
  }
}

async function mockMailerLite(page: Page) {
  await page.route('https://assets.mailerlite.com/jsonp/**', async (route) => {
    const url = new URL(route.request().url());
    const callback = url.searchParams.get('callback');
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `${callback}({success:true})`,
    });
  });
}

test.describe('Strona dodatku — wejście z ?src', () => {
  test('4.1 ?src=email pokazuje pełną instrukcję bez bramy zapisu', async ({ page }) => {
    await page.goto('/dodatek.html?src=email');
    await dismissCookieBanner(page);

    await expect(page.locator('h1')).toHaveText(
      'Jak zamienić wiadomość z Teams w zadanie w Planerze',
    );
    await expect(page.locator('.bonus-errors')).toBeVisible();
    await expect(page.locator('.bonus-gate')).toHaveCount(0);

    await page.goto('/dodatek.html');
    await expect(page.locator('.bonus-gate')).toHaveCount(0);
    await expect(page.locator('.bonus-errors')).toBeVisible();
  });
});

test.describe('Strona dodatku — wejście bez ?src', () => {
  test('4.2 goły adres pokazuje zajawkę i formularz zapisu', async ({ page }) => {
    await page.goto('/dodatek.html');
    await dismissCookieBanner(page);

    await expect(page.locator('.bonus-gate')).toBeVisible();
    await expect(page.locator('#bonus-name')).toBeVisible();
    await expect(page.getByText('Utwórz zespół w Teams')).toBeVisible();
    await expect(page.locator('.bonus-errors')).toHaveCount(0);
  });

  test('4.3 wypełnienie formularza zapisu kończy się komunikatem sukcesu', async ({ page }) => {
    await mockMailerLite(page);
    await page.goto('/dodatek.html');
    await dismissCookieBanner(page);

    await page.fill('#bonus-name', 'Krystyna');
    await page.fill('#bonus-email', 'krystyna@firma.pl');
    await page.check('#bonus-consent');
    await page.click('.bonus-form button[type="submit"]');

    await expect(page.locator('.bonus-form .form-status.success')).toContainText(
      'Gotowe!',
    );
  });
});

test.describe('Strona dodatku — SEO', () => {
  test('4.4 strona ma meta robots noindex', async ({ page }) => {
    await page.goto('/dodatek.html');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
  });
});
```
