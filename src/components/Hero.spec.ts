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
