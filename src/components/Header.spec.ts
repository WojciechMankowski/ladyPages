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
