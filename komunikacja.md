# Komunikacja: zmiana z "newslettera" na "listę oczekujących"

Cel: przestać komunikować cykliczny newsletter, a zamiast tego mówić o zapisie na
**listę oczekujących** (np. na kolejny produkt / kolejną edycję / premierę). Poniżej
wszystkie miejsca w kodzie, które trzeba zaktualizować, oraz decyzje do podjęcia
przed wdrożeniem.

## Do ustalenia przed startem prac
- [ ] Jak dokładnie ma się nazywać nowy komunikat? (np. "Lista oczekujących na
      kolejny ebook", "Zapisz się na listę oczekujących" — potrzebna finalna fraza,
      bo pojawia się w wielu miejscach jako cytat w cudzysłowie „Power Automate dla
      biura")
- [x] Czy funkcjonalnie coś się zmienia w MailerLite (inna lista/formularz), czy
      tylko copy na stronie? Jeśli inna lista/formularz — potrzebne nowe
      `ML_ACCOUNT_ID` / `ML_FORM_ID`.
- [ ] Czy sekcja `newsletter-details` w `Process.vue` ma zostać (ze zmienioną
      nazwą) czy zniknąć całkowicie, skoro nie ma już cyklicznej wysyłki co dwa
      tygodnie?

## Pliki i miejsca do zmiany treści (Polski copy)

### `src/components/Hero.vue`
- [ ] Linia 27: badge „Darmowy Ebook + Newsletter «Power Automate dla biura»” →
      zmienić na komunikat o liście oczekującej.

### `src/components/Process.vue`
- [ ] `id="newsletter-details"` (linia 48) — rozważyć zmianę id/nazwy sekcji.
- [ ] Klasa `.newsletter-details` / `.newsletter-banner` (linie 48, 50, 165, 170,
      233 w `<style scoped>`) — nazwy klas CSS do ew. przemianowania (kosmetyczne,
      niekonieczne, ale spójność nazewnictwa).
- [ ] Nagłówek „Newsletter «Power Automate dla biura»” (linia 53) → nowa nazwa.
- [ ] Opis „Pobranie ebooka to dopiero początek. Zostając na liście, otrzymujesz
      regularne wsparcie...” (linia 54-56) — przeformułować, jeśli nie ma już
      regularnej, cyklicznej wysyłki.
- [ ] Mini-feature „Co dwa tygodnie w skrzynce” / „Tylko jeden, konkretny i w pełni
      opisany przepływ...” (linie 61-64) — usunąć lub zmienić, jeśli znika
      cykliczność.

### `src/components/Contact.vue`
- [ ] FAQ, odpowiedź na „Ile to kosztuje?” (linia 27): „Ebook oraz newsletter
      «Power Automate dla biura» są całkowicie bezpłatne...” → zamienić
      "newsletter" na komunikat o liście oczekującej.
- [ ] Mikrokopia pod przyciskiem zapisu (linia 89): „Klikając przycisk zgadzasz
      się na zapis do darmowego newslettera. Wypiszesz się jednym kliknięciem.
      Zero spamu.” → zmienić na zgodę na zapis na listę oczekujących.

### Inne miejsca (weryfikacja / bez zmian funkcjonalnych)
- [ ] `paleta_landing_page_krystyna.html:119` — to plik referencyjny do palety
      kolorów (poza buildem wg CLAUDE.md), zawiera „Potwierdzenie zapisu do
      newslettera” jako opis swatcha — niski priorytet, ale do ujednolicenia
      jeśli plik jest nadal używany jako punkt odniesienia.
- [ ] `src/composables/useSubscribe.ts` — logika techniczna (MailerLite JSONP),
      komentarze w kodzie wspominają "MailerLite" i "subscription" — to nazwy
      techniczne/API, nie wymagają zmiany treści user-facing, ale sprawdzić czy
      nazwa listy w MailerLite również wymaga aktualizacji po stronie MailerLite.

## Po zmianie treści
- [ ] Przeszukać całość jeszcze raz (`grep -rni newsletter src/`) żeby potwierdzić,
      że nic nie zostało pominięte.
- [ ] `npm run build` — upewnić się, że `vue-tsc` przechodzi bez błędów po
      edycjach.
- [ ] Sprawdzić `public/_headers` (CSP) — zmiana treści nie powinna tego dotyczyć,
      ale zweryfikować gdyby zmieniał się endpoint MailerLite.
