import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CookieConsent from './CookieConsent.vue';

describe('CookieConsent.vue', () => {
  beforeEach(() => {
    localStorage.clear();
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
});
