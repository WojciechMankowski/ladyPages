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
});

describe('DodatekPage.vue — wejście z prawidłowym linkiem (hasAccess)', () => {
  it('pokazuje pełną treść instrukcji i nie renderuje bramy zapisu', () => {
    mockHasAccess.value = true;
    const wrapper = mount(DodatekPage);

    expect(wrapper.find('.bonus-wip').exists()).toBe(true);
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

    // zajawka pokazuje pierwszy krok, ale nie adnotację o kolejnych krokach
    expect(wrapper.text()).toContain('Utwórz zespół w Teams');
    expect(wrapper.find('.bonus-wip').exists()).toBe(false);
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
