import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';

// vue-gtag: onMounted w DodatekPage woła event(); CookieConsent (przez useAnalytics)
// importuje addGtag/consent. Mockujemy wszystko, żeby nie ładować gtag.js.
vi.mock('vue-gtag', () => ({
  event: vi.fn(),
  addGtag: vi.fn(() => Promise.resolve()),
  consent: vi.fn(),
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

// useBonusAccess podmieniamy per-test, żeby sterować dostępem bez nawigacji jsdom.
// Nazwa z prefiksem `mock` — wymóg hoistingu vi.mock.
const mockHasAccess = ref(false);
vi.mock('../composables/useBonusAccess', () => ({
  useBonusAccess: () => ({
    src: ref(''),
    hasAccess: mockHasAccess,
    sourceLabel: ref('direct'),
  }),
}));

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

    // zajawka pokazuje tylko pierwszy krok, nie dalszą część instrukcji
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
