import { computed, type ComputedRef } from 'vue';

/**
 * Klucz w localStorage, pod którym zapamiętujemy, że dana przeglądarka raz
 * weszła na stronę dodatku z prawidłowym linkiem (`?src=...`). Dzięki temu
 * powrót na goły adres `/dodatek` (np. z zakładki) nie odbiera dostępu.
 */
export const UNLOCK_STORAGE_KEY = 'bonus_unlocked';

/**
 * Wartości parametru `?src`, które odblokowują pełną treść dodatku.
 * `email` to kanoniczna wartość w linku z automatyzacji MailerLite; `ml` oraz
 * `newsletter` zostawiamy jako zapas na inne warianty linku.
 */
const ALLOWED_SRC = ['email', 'ml', 'newsletter'];

interface UseBonusAccessOptions {
  /** Query string, domyślnie `window.location.search`. */
  search?: string;
  /** Magazyn trwały, domyślnie `window.localStorage`. */
  storage?: Storage;
}

interface UseBonusAccessResult {
  /** Surowa (znormalizowana do małych liter) wartość `?src`, do analityki. */
  src: ComputedRef<string>;
  /** Czy pokazać pełną treść instrukcji. */
  hasAccess: ComputedRef<boolean>;
  /** Etykieta źródła do zdarzenia GA4: wartość `?src` albo `'direct'`. */
  sourceLabel: ComputedRef<string>;
}

function safeGet(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSet(storage: Storage | undefined, key: string, value: string): void {
  try {
    storage?.setItem(key, value);
  } catch {
    /* tryb prywatny / zablokowany storage — dostęp działa tylko w tej sesji */
  }
}

export function useBonusAccess(
  options: UseBonusAccessOptions = {},
): UseBonusAccessResult {
  const {
    search = typeof window !== 'undefined' ? window.location.search : '',
    storage = typeof window !== 'undefined' ? window.localStorage : undefined,
  } = options;

  const src = computed(() =>
    (new URLSearchParams(search).get('src') ?? '').trim().toLowerCase(),
  );

  const fromLink = computed(() => ALLOWED_SRC.includes(src.value));
  const remembered = safeGet(storage, UNLOCK_STORAGE_KEY) === '1';

  const hasAccess = computed(() => fromLink.value || remembered);

  // Efekt uboczny: wejście z prawidłowym linkiem utrwala odblokowanie.
  if (fromLink.value && !remembered) {
    safeSet(storage, UNLOCK_STORAGE_KEY, '1');
  }

  const sourceLabel = computed(() => src.value || 'direct');

  return { src, hasAccess, sourceLabel };
}
