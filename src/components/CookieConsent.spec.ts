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
