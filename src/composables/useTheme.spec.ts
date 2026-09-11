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

// Komponent-hosta, bo useTheme opiera się na onMounted/onUnmounted.
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
