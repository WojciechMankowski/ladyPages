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
