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
