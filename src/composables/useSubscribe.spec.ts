import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { useSubscribe } from './useSubscribe';

// Symuluje wywołanie JSONP: MailerLite normalnie odpowiada, wywołując
// window[callbackName](response) po załadowaniu wstrzykniętego <script>.
// W testach przechwytujemy dodanie <script> do document.body i sami
// wywołujemy zarejestrowany callback zamiast robić prawdziwy request sieciowy.
function triggerJsonpResponse(response: unknown) {
  const script = document.body.querySelector('script[src*="mailerlite.com"]') as HTMLScriptElement | null;
  if (!script) throw new Error('Skrypt JSONP nie został wstrzyknięty do document.body');
  const url = new URL(script.src);
  const callbackName = url.searchParams.get('callback')!;
  (window as Record<string, any>)[callbackName](response);
}

function triggerJsonpNetworkError() {
  const script = document.body.querySelector('script[src*="mailerlite.com"]') as HTMLScriptElement | null;
  if (!script) throw new Error('Skrypt JSONP nie został wstrzyknięty do document.body');
  script.onerror?.(new Event('error'));
}

afterEach(() => {
  document.body.querySelectorAll('script[src*="mailerlite.com"]').forEach((el) => el.remove());
});

describe('useSubscribe — walidacja', () => {
  it('1.1 pusty e-mail zwraca komunikat "Adres e-mail jest wymagany."', async () => {
    const { email, emailError, subscribe } = useSubscribe();
    email.value = '';
    await subscribe();
    expect(emailError.value).toBe('Adres e-mail jest wymagany.');
  });

  it('1.2 e-mail bez "@" zwraca komunikat o niepoprawnym formacie', async () => {
    const { email, emailError } = useSubscribe();
    email.value = 'test';
    await nextTick();
    expect(emailError.value).toContain('poprawny adres e-mail');
  });

  it('1.3 e-mail bez kropki po domenie ("test@firma") jest niepoprawny', async () => {
    const { email, emailError } = useSubscribe();
    email.value = 'test@firma';
    await nextTick();
    expect(emailError.value).not.toBe('');
  });

  it('1.4 poprawny e-mail ("test@firma.pl") nie zgłasza błędu', async () => {
    const { email, emailError } = useSubscribe();
    email.value = 'test@firma.pl';
    await nextTick();
    expect(emailError.value).toBe('');
  });

  it('1.5 puste imię zwraca "Imię jest wymagane."', async () => {
    const { name, nameError, subscribe } = useSubscribe();
    name.value = '';
    await subscribe();
    expect(nameError.value).toBe('Imię jest wymagane.');
  });

  it('1.6 imię złożone z samych spacji jest traktowane jak puste (trim)', async () => {
    const { name, nameError, subscribe } = useSubscribe();
    name.value = '   ';
    await subscribe();
    expect(nameError.value).toBe('Imię jest wymagane.');
  });

  it('1.7 imię jednoliterowe zwraca "co najmniej 2 znaki"', async () => {
    const { name, nameError } = useSubscribe();
    name.value = 'A';
    await nextTick();
    expect(nameError.value).toBe('Imię powinno mieć co najmniej 2 znaki.');
  });

  it('1.8 imię dwuliterowe lub dłuższe nie zgłasza błędu', async () => {
    const { name, nameError } = useSubscribe();
    name.value = 'Ala';
    await nextTick();
    expect(nameError.value).toBe('');
  });

  it('1.9 brak zaznaczonej zgody blokuje submit z komunikatem o zgodzie', async () => {
    const { name, email, consent, consentError, subscribe } = useSubscribe();
    name.value = 'Ala';
    email.value = 'ala@firma.pl';
    consent.value = false;
    const result = await subscribe();
    expect(result).toBe(false);
    expect(consentError.value).toBe('Zaznacz zgodę, aby otrzymać materiały.');
  });

  it('1.10 zaznaczenie zgody czyści consentError na żywo', async () => {
    const { name, email, consent, consentError, subscribe } = useSubscribe();
    name.value = 'Ala';
    email.value = 'ala@firma.pl';
    await subscribe(); // ustawia consentError, bo consent jest false
    expect(consentError.value).not.toBe('');

    consent.value = true;
    await nextTick();

    expect(consentError.value).toBe('');
  });
});

describe('useSubscribe — subscribe()', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('1.11 subscribe() z pustymi polami zwraca false i nie wstrzykuje <script> do MailerLite', async () => {
    const { subscribe } = useSubscribe();
    const result = await subscribe();
    expect(result).toBe(false);
    expect(document.body.querySelector('script[src*="mailerlite.com"]')).toBeNull();
  });

  it('1.12 subscribe() z poprawnymi danymi i odpowiedzią {success:true} czyści pola i ustawia statusType="success"', async () => {
    const { name, email, consent, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    triggerJsonpResponse({ success: true });
    const result = await promise;

    expect(result).toBe(true);
    expect(name.value).toBe('');
    expect(email.value).toBe('');
    expect(consent.value).toBe(false);
    expect(statusType.value).toBe('success');
  });

  it('1.13 subscribe() z odpowiedzią {success:false} NIE czyści pól i ustawia statusType="error"', async () => {
    const { name, email, consent, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    triggerJsonpResponse({ success: false });
    const result = await promise;

    expect(result).toBe(false);
    expect(name.value).toBe('Krystyna');
    expect(email.value).toBe('krystyna@firma.pl');
    expect(statusType.value).toBe('error');
  });

  it('1.14 subscribe() + błąd sieci (script.onerror) ustawia statusType="error" i odblokowuje przycisk', async () => {
    const { name, email, consent, isSubmitting, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    triggerJsonpNetworkError();
    await promise;

    expect(statusType.value).toBe('error');
    expect(isSubmitting.value).toBe(false);
  });

  it('1.15 subscribe() + timeout 15s odrzuca i odblokowuje isSubmitting w finally', async () => {
    const { name, email, consent, isSubmitting, statusType, subscribe } = useSubscribe();
    name.value = 'Krystyna';
    email.value = 'krystyna@firma.pl';
    consent.value = true;

    const promise = subscribe();
    await vi.advanceTimersByTimeAsync(15000);
    await promise;

    expect(statusType.value).toBe('error');
    expect(isSubmitting.value).toBe(false);
  });

  it('1.16 dwa równoległe wywołania subscribe() używają różnych callbackName (brak kolizji w window)', async () => {
    const first = useSubscribe();
    const second = useSubscribe();
    first.name.value = 'Ala';
    first.email.value = 'ala@firma.pl';
    first.consent.value = true;
    second.name.value = 'Ola';
    second.email.value = 'ola@firma.pl';
    second.consent.value = true;

    first.subscribe();
    second.subscribe();

    const scripts = document.body.querySelectorAll('script[src*="mailerlite.com"]');
    expect(scripts.length).toBe(2);
    const [urlA, urlB] = Array.from(scripts).map(
      (s) => new URL((s as HTMLScriptElement).src).searchParams.get('callback')
    );
    expect(urlA).not.toBe(urlB);
  });

  it('1.17 po zakończeniu (sukces) tymczasowy <script> i window[callbackName] są usuwane', async () => {
    const { name, email, consent, subscribe } = useSubscribe();
    name.value = 'Ala';
    email.value = 'ala@firma.pl';
    consent.value = true;

    const promise = subscribe();
    const script = document.body.querySelector('script[src*="mailerlite.com"]') as HTMLScriptElement;
    const callbackName = new URL(script.src).searchParams.get('callback')!;

    triggerJsonpResponse({ success: true });
    await promise;

    expect(document.body.querySelector('script[src*="mailerlite.com"]')).toBeNull();
    expect((window as Record<string, any>)[callbackName]).toBeUndefined();
  });
});
