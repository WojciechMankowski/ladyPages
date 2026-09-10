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

  it('w trybie "full" pokazuje adnotację o dopisywaniu kolejnych kroków', () => {
    const wrapper = mount(BonusContent, { props: { mode: 'full' } });
    expect(wrapper.find('.bonus-wip').exists()).toBe(true);
  });

  it('w trybie "teaser" nie pokazuje adnotacji o kolejnych krokach', () => {
    const wrapper = mount(BonusContent, { props: { mode: 'teaser' } });
    expect(wrapper.find('.bonus-wip').exists()).toBe(false);
  });
});
