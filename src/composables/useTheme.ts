import { ref, onMounted, onUnmounted, type Ref } from 'vue';

interface UseThemeResult {
  /** Czy aktualnie aktywny jest motyw ciemny. */
  isDark: Ref<boolean>;
  /** Przełącza motyw i zapisuje wybór w localStorage. */
  toggleTheme: () => void;
}

/**
 * Wspólna logika przełącznika motywu (jasny/ciemny), używana przez `Header.vue`
 * na stronie głównej oraz przez `DodatekPage.vue`. Motyw ciemny jest domyślny;
 * jasny włącza się klasą `light` na `<html>`. Wybór jest zapamiętywany w
 * `localStorage['theme']`, w razie braku wartości używana jest preferencja
 * systemowa `prefers-color-scheme`, z nasłuchem jej zmian.
 */
export function useTheme(): UseThemeResult {
  const isDark = ref(true);
  let mediaQuery: MediaQueryList | undefined;

  const applyTheme = (dark: boolean) => {
    isDark.value = dark;
    document.documentElement.classList.toggle('light', !dark);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
      applyTheme(false);
    } else if (savedTheme === 'dark') {
      applyTheme(true);
    } else {
      applyTheme(prefersDark);
    }
  };

  const toggleTheme = () => {
    applyTheme(!isDark.value);
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  };

  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches);
    }
  };

  onMounted(() => {
    initTheme();
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', handleSystemThemeChange);
  });

  return { isDark, toggleTheme };
}
