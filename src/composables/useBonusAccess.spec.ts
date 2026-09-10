import { describe, it, expect } from 'vitest';
import { useBonusAccess, UNLOCK_STORAGE_KEY } from './useBonusAccess';

// Minimalny, izolowany zamiennik localStorage do testów (bez jsdom Storage).
function fakeStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
  };
}

describe('useBonusAccess — wejście bez parametru', () => {
  it('nie daje dostępu i raportuje źródło "direct"', () => {
    const storage = fakeStorage();
    const { src, hasAccess, sourceLabel } = useBonusAccess({ search: '', storage });

    expect(hasAccess.value).toBe(false);
    expect(src.value).toBe('');
    expect(sourceLabel.value).toBe('direct');
    expect(storage.getItem(UNLOCK_STORAGE_KEY)).toBeNull();
  });
});

describe('useBonusAccess — wejście ze znanym ?src', () => {
  it('daje dostęp dla ?src=email i zapamiętuje odblokowanie', () => {
    const storage = fakeStorage();
    const { src, hasAccess, sourceLabel } = useBonusAccess({
      search: '?src=email',
      storage,
    });

    expect(hasAccess.value).toBe(true);
    expect(src.value).toBe('email');
    expect(sourceLabel.value).toBe('email');
    expect(storage.getItem(UNLOCK_STORAGE_KEY)).toBe('1');
  });

  it('normalizuje wielkość liter w ?src (EMAIL => email)', () => {
    const storage = fakeStorage();
    const { hasAccess } = useBonusAccess({ search: '?src=EMAIL', storage });

    expect(hasAccess.value).toBe(true);
  });

  it('akceptuje też zapasowe wartości ?src=ml i ?src=newsletter', () => {
    expect(
      useBonusAccess({ search: '?src=ml', storage: fakeStorage() }).hasAccess.value,
    ).toBe(true);
    expect(
      useBonusAccess({ search: '?src=newsletter', storage: fakeStorage() }).hasAccess
        .value,
    ).toBe(true);
  });
});

describe('useBonusAccess — nieznany ?src', () => {
  it('nie daje dostępu i nie rusza storage', () => {
    const storage = fakeStorage();
    const { src, hasAccess, sourceLabel } = useBonusAccess({
      search: '?src=facebook',
      storage,
    });

    expect(hasAccess.value).toBe(false);
    expect(src.value).toBe('facebook');
    expect(sourceLabel.value).toBe('facebook');
    expect(storage.getItem(UNLOCK_STORAGE_KEY)).toBeNull();
  });
});

describe('useBonusAccess — zapamiętane odblokowanie', () => {
  it('daje dostęp bez parametru, gdy storage ma zapis odblokowania', () => {
    const storage = fakeStorage({ [UNLOCK_STORAGE_KEY]: '1' });
    const { hasAccess, sourceLabel } = useBonusAccess({ search: '', storage });

    expect(hasAccess.value).toBe(true);
    // źródło nadal raportujemy jako "direct" — dostęp pochodzi z pamięci, nie z linku
    expect(sourceLabel.value).toBe('direct');
  });
});

describe('useBonusAccess — brak dostępu do storage', () => {
  it('nie wyrzuca, gdy storage rzuca wyjątkiem (tryb prywatny)', () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    } as unknown as Storage;

    expect(() =>
      useBonusAccess({ search: '?src=email', storage: throwingStorage }),
    ).not.toThrow();
    expect(
      useBonusAccess({ search: '?src=email', storage: throwingStorage }).hasAccess.value,
    ).toBe(true);
  });
});
