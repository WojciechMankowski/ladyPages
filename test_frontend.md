# Zestaw testów frontendowych — ledy_pages

## 0. Status i zakres

Projekt **nie ma** obecnie skonfigurowanego runnera testów, mockingu ani lintera (patrz `CLAUDE.md`) — jedyną automatyczną bramką jakości jest `npm run build` (type-check przez `vue-tsc`). Poniższy dokument to **manualny plan testów QA**, do wykonania ręcznie w przeglądarce (lub jako baza do napisania testów automatycznych, patrz sekcja 18).

Legenda priorytetów: **P0** — blokuje wydanie, **P1** — istotne, **P2** — kosmetyczne/nice-to-have.

Stan referencyjny (branch `cloudflare/workers-autoconfig`, po usunięciu `_redirects`):
- Sekcje w kolejności: Header, Hero, Specializations (`#ebook`), About (`#about`), Process (`#target-audience` + `#signup-reward`), Contact/FAQ (`#faq` + formularz `#contact`), Footer, MobileCta.
- Formularz zapisu (imię + e-mail → MailerLite JSONP) istnieje **dwukrotnie i niezależnie**: w Hero i w Contact, każdy z osobną instancją `useSubscribe()`.

---

## 1. Środowisko testowe

| # | Przypadek | Priorytet |
|---|---|---|
| 1.1 | Desktop Chrome, Firefox, Safari — najnowsze wersje | P0 |
| 1.2 | Mobile Safari (iOS) i Chrome (Android) | P0 |
| 1.3 | Viewporty: 360px, 390px, 768px, 1024px, 1440px, 1920px | P1 |
| 1.4 | Motyw ciemny (domyślny) i jasny (`html.light`), w każdej przeglądarce z 1.1 | P1 |
| 1.5 | `prefers-color-scheme: light` i `dark` na poziomie systemu, bez zapisanego `localStorage['theme']` | P1 |
| 1.6 | Nawigacja klawiaturą (Tab/Shift+Tab/Enter/Space), bez myszy | P0 |
| 1.7 | Czytnik ekranu (VoiceOver lub NVDA) — przejście przez całą stronę | P2 |
| 1.8 | Wolne/przerywane połączenie (DevTools → Network → Slow 3G / Offline) | P1 |

---

## 2. Header (`Header.vue`)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 2.1 | Załaduj stronę od góry | Header bez klasy `scrolled` | P2 |
| 2.2 | Przewiń stronę >50px w dół | Header dostaje klasę `scrolled` (zmiana tła/cienia) | P1 |
| 2.3 | Przewiń z powrotem <50px | Klasa `scrolled` znika | P2 |
| 2.4 | Kliknij `<WM />` (logo) | Przewinięcie do góry strony (`href="#"`), menu mobilne się zamyka jeśli było otwarte | P2 |
| 2.5 | Kliknij link „Co w ebooku?” | Płynne przejście do sekcji `#ebook` (Specializations) | P1 |
| 2.6 | Kliknij link „O mnie” | Przejście do `#about` | P1 |
| 2.7 | Kliknij link „FAQ” | Przejście do `#faq` (Contact) | P1 |
| 2.8 | Kliknij „Odbierz Ebook” w nagłówku | Przejście do `#contact` (formularz w Contact) | P1 |
| 2.9 | Motyw domyślny = ciemny, brak `localStorage['theme']`, system = dark | Ikona `Sun` widoczna (przełącz na jasny), `html` bez klasy `light` | P1 |
| 2.10 | Kliknij przełącznik motywu | `html` dostaje klasę `light`, ikona zmienia się na `Moon`, `localStorage['theme']='light'` | P0 |
| 2.11 | Odśwież stronę po 2.10 | Motyw jasny zostaje zachowany (odczyt z `localStorage`) | P0 |
| 2.12 | Wyczyść `localStorage`, ustaw system na jasny, przeładuj | Strona startuje w motywie jasnym bez interakcji użytkownika | P1 |
| 2.13 | Wyczyść `localStorage` (brak zapisanej wartości), zmień motyw systemowy na żywo (DevTools rendering emulation) | Strona reaguje na żywo na zmianę systemową | P2 |
| 2.14 | Ustaw ręcznie motyw, potem zmień motyw systemowy na żywo | Strona **nie** nadpisuje wyboru użytkownika (bo `localStorage['theme']` ustawione) | P1 |
| 2.15 | Zwęź okno < breakpoint mobilny | Pojawia się `mobile-nav-toggle` (ikona `Menu`), nawigacja ukryta | P0 |
| 2.16 | Kliknij `mobile-nav-toggle` | Menu się otwiera (klasa `active` na `.main-nav`), ikona zmienia się na `X`, `aria-expanded="true"` | P0 |
| 2.17 | Kliknij dowolny link w otwartym menu mobilnym | Menu się zamyka (`closeMenu`) po nawigacji | P1 |
| 2.18 | Otwórz menu mobilne, kliknij ponownie toggle | Menu się zamyka, ikona wraca do `Menu`, `aria-expanded="false"` | P1 |
| 2.19 | Nawigacja klawiaturą przez logo → linki → przełącznik motywu → CTA → toggle mobilny | Widoczny pierścień fokusu na każdym elemencie, kolejność logiczna | P1 |

---

## 3. Hero (`Hero.vue`) — formularz zapisu #1

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 3.1 | Załaduj sekcję Hero | Nagłówek, opis, formularz, obraz (`hero-visual`) widoczne; tekst wspomina premierę wiosną 2027 | P2 |
| 3.2 | Sprawdź `<picture>` obrazu Hero | Przeglądarka pobiera wariant AVIF jeśli wspierany, JPG jako fallback; brak błędu 404 dla żadnego z 4 wariantów (`450`/`900` × avif/jpg) | P1 |
| 3.3 | Wyślij formularz z pustymi polami | HTML5 `required` blokuje submit (natywny komunikat przeglądarki) na obu polach | P1 |
| 3.4 | Wpisz w pole „Twoje imię” pojedynczą literę, np. „A” | Po chwili (`watch`) pojawia się błąd „Imię powinno mieć co najmniej 2 znaki.” | P0 |
| 3.5 | Wyczyść pole imienia całkowicie po błędzie z 3.4 | Komunikat błędu znika (walidacja `watch` czyści błąd tylko gdy pole jest puste — HTML5 `required` i tak zablokuje submit) | P1 |
| 3.6 | Wpisz e-mail bez `@`, np. „test” | Błąd „Wprowadź poprawny adres e-mail (np. nazwa@domena.pl).” | P0 |
| 3.7 | Wpisz e-mail bez domeny, np. „test@firma” | Błąd walidacji (brak kropki po `@`) | P0 |
| 3.8 | Wpisz poprawny e-mail, np. „test@firma.pl” | Błąd znika natychmiast | P0 |
| 3.9 | Podczas błędu w polu — sprawdź atrybuty | `aria-invalid="true"`, klasa `input-error`, `aria-describedby` wskazuje na `<span id="hero-*-error">` z `role="alert"` | P1 |
| 3.10 | Wypełnij poprawnie imię + e-mail, kliknij „Chcę instrukcję i rabat” | Przycisk pokazuje „Wysyłanie...” + spinner (`Loader` z `animate-spin`), oba pola i przycisk stają się `disabled` | P0 |
| 3.11 | Symuluj sukces odpowiedzi MailerLite (`{success:true}` przez JSONP callback) | Komunikat sukcesu: „Gotowe! Sprawdź skrzynkę...”, pola imienia i e-maila czyszczą się, przycisk wraca do stanu domyślnego | P0 |
| 3.12 | Symuluj odpowiedź `{success:false}` lub inny kształt JSON | Komunikat błędu: „Wystąpił błąd podczas zapisu. Spróbuj ponownie później.”, pola **nie** są czyszczone, dane pozostają do poprawy | P0 |
| 3.13 | Zablokuj żądanie do `assets.mailerlite.com` (DevTools → block request URL) i wyślij formularz | `script.onerror` łapie błąd sieci, wyświetla się komunikat błędu, brak zawieszenia UI | P0 |
| 3.14 | Rzuć throttling tak, by żądanie trwało >15s (lub zablokuj bez erroru) | Po 15s timeout odrzuca Promise, wyświetla się komunikat błędu, przycisk odblokowuje się (nie zostaje trwale w stanie „Wysyłanie...”) | P0 |
| 3.15 | Podwójne szybkie kliknięcie „Wyślij” | Drugi submit nie wysyła duplikatu — przycisk jest `disabled` już po pierwszym kliknięciu (`isSubmitting`) | P1 |
| 3.16 | Wpisz w pole imienia znaki HTML/skrypt, np. `<script>alert(1)</script>` | Wartość renderowana jako zwykły tekst wszędzie (Vue escapuje interpolacje), brak wykonania skryptu, brak XSS | P0 |
| 3.17 | Sprawdź parametry żądania JSONP w Network | URL zawiera poprawne `fields[email]`, `fields[name]` (zurlencodowane), `ml-submit=1`, `anticsrf=true`, unikalny `callback=ml_jsonp_<timestamp>`; konto `2264313`, formularz `190235065838471016` | P1 |
| 3.18 | Animacja `fade-in` przy wejściu na stronę | Elementy `.hero .fade-in` (tytuł, podtytuł, formularz, wizualizacja) pojawiają się z opóźnieniem (`150ms * index`), przejście opacity+translateY | P2 |

---

## 4. Specializations — „Co w ebooku?” (`#ebook`)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 4.1 | Policz karty w gridzie | Dokładnie 8 kart: Wstęp + Rozdziały 1–6 + Bonus | P1 |
| 4.2 | Sprawdź ikony każdej karty | Każda karta ma unikalną ikonę Lucide (`BookOpen`, `Workflow`, `BookA`, `Compass`, `Wand2`, `Briefcase`, `Rocket`, `Gift`) i renderuje się bez błędu w konsoli | P2 |
| 4.3 | Sprawdź listy `Check` (punkty) w każdej karcie | Po 3 punkty na kartę, ikona `Check` przy każdym | P2 |
| 4.4 | Scroll do sekcji od dołu strony | Animacja reveal (`.spec-card` dostaje `.reveal.active` przez `IntersectionObserver` po wejściu w viewport) | P1 |
| 4.5 | Tryb ciemny vs jasny — kontrast kart względem tła sekcji | Karty czytelne w obu motywach (w jasnym tle karty białe, w ciemnym `--bg-glass-heavy`) | P1 |

---

## 5. About (`#about`)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 5.1 | Sprawdź `<picture>` avatara | AVIF/JPG w wariantach 380/760, `loading="lazy"`, `alt="Wojciech Mankowski"` | P2 |
| 5.2 | Sprawdź odznakę doświadczenia | „2 Lat w IT” widoczne na zdjęciu | P2 |
| 5.3 | Animacja reveal dla `.about-visual` i `.about-content` | Aktywuje się przy scrollu w viewport | P2 |

---

## 6. Process — dopasowanie i nagroda

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 6.1 | Sekcja „Czy to rozwiązanie jest dla Ciebie?” | Dwie kolumny: TAK (zielona ramka, ikona `Check`) i NIE (czerwona ramka, ikona `X`), poprawna liczba punktów (4 i 3) | P2 |
| 6.2 | Sekcja „Co dostaniesz po zapisie” | Dwa `mini-feature`: instrukcja Teams→Planner i kod rabatowy 30%, tekst wspomina „wiosną 2027” zgodnie z ustaleniami w `CLAUDE.md` | P1 |
| 6.3 | RWD < 900px | `.audience-grid` i `.features-grid-mini` przechodzą na jedną kolumnę | P1 |
| 6.4 | Animacja reveal `.audience-box` i `.mini-feature` | Aktywuje się przy scrollu | P2 |

---

## 7. Contact / FAQ (`#faq`) — formularz zapisu #2

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 7.1 | Powtórz testy 3.3–3.17 dla formularza w Contact (`#final-name`, `#final-email`, `#btn-submit`) | Identyczne zachowanie walidacji, stanu ładowania, sukcesu/błędu | P0 |
| 7.2 | Wypełnij formularz Hero, **nie wysyłaj**, przewiń do formularza Contact | Pola w Contact są puste — stan **nie jest współdzielony** między dwiema instancjami `useSubscribe()` (osobne wywołania composable) | P1 |
| 7.3 | Wyślij formularz Contact z sukcesem, następnie sprawdź formularz Hero | Formularz Hero pozostaje niezmieniony (własny, niezależny stan) | P1 |
| 7.4 | Sprawdź 4 pozycje FAQ | Pytania i odpowiedzi renderują się poprawnie, ikona `HelpCircle` przy każdym pytaniu | P2 |
| 7.5 | Animacja reveal `.faq-item` i `.contact-form-container` | Aktywuje się przy scrollu | P2 |
| 7.6 | Sprawdź kotwicę `#contact` | `div.contact-form-container` ma `id="contact"` — linki z Header i MobileCta trafiają dokładnie w formularz, nie na górę sekcji FAQ | P1 |

---

## 8. Footer

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 8.1 | Kliknij „O mnie” w stopce | Przechodzi do `#about` — działa | P1 |
| 8.2 | Kliknij „Specjalizacje” w stopce | ⚠️ **Prawdopodobny błąd**: link wskazuje `#specializations`, ale sekcja ma `id="ebook"` — kliknięcie nie przewinie do żadnej sekcji. Zweryfikować i zgłosić/naprawić. | **P0 (bug)** |
| 8.3 | Kliknij „Projekty” w stopce | ⚠️ **Prawdopodobny błąd**: link wskazuje `#projects`, taka sekcja **nie istnieje** w ogóle na stronie. Zweryfikować i zgłosić/naprawić lub usunąć link. | **P0 (bug)** |
| 8.4 | Kliknij „Proces” w stopce | ⚠️ **Prawdopodobny błąd**: link wskazuje `#process`, sekcja Process ma id `target-audience`/`signup-reward`, nie `process`. Zweryfikować i zgłosić/naprawić. | **P0 (bug)** |
| 8.5 | Kliknij „Kontakt” w stopce | Przechodzi do `#contact` — działa | P1 |
| 8.6 | Kliknij ikonę LinkedIn | Otwiera `linkedin.com/in/wojciechmankowski` w nowej karcie, `rel="noopener noreferrer"` obecne (ochrona przed `window.opener`) | P1 |
| 8.7 | Kliknij ikonę GitHub | Otwiera `github.com/wojciechmankowski` w nowej karcie, `rel="noopener noreferrer"` obecne | P1 |
| 8.8 | Sprawdź rok w stopce | „© 2026 Wojciech Mankowski” — zweryfikować czy ma być aktualizowany dynamicznie czy ręcznie co rok | P2 |

---

## 9. MobileCta (sticky pasek mobilny)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 9.1 | Na desktopie (>breakpoint) | Pasek `.mobile-cta-bar` niewidoczny niezależnie od scrolla (ukryty przez CSS na szerszych ekranach) | P1 |
| 9.2 | Na mobile, na górze strony (scrollY = 0) | Pasek niewidoczny (brak klasy `visible`) | P1 |
| 9.3 | Na mobile, przewiń poniżej 80% wysokości viewportu | Pasek pojawia się (klasa `visible`), z tekstem „Odbierz darmowy ebook” i ikoną strzałki | P0 |
| 9.4 | Przewiń z powrotem do góry | Pasek znika | P1 |
| 9.5 | Kliknij pasek | Przechodzi do `#contact` (formularz) | P0 |
| 9.6 | Sprawdź nakładanie się z innymi elementami (np. z natywnym paskiem przeglądarki mobilnej lub stopką) | Pasek nie zasłania treści formularza / nie jest zasłonięty | P2 |

---

## 10. Composable `useSubscribe` — testy jednostkowe (logika, niezależna od UI)

Jeśli/gdy zostanie dodany runner testów (patrz sekcja 18), poniższe powinny być pierwszymi testami jednostkowymi, bo cała logika biznesowa mieszka w jednym pliku (`src/composables/useSubscribe.ts`):

| # | Przypadek | Oczekiwany rezultat |
|---|---|---|
| 10.1 | `validateEmail('')` | zwraca komunikat „Adres e-mail jest wymagany.” |
| 10.2 | `validateEmail('a@b.c')` | zwraca `''` (poprawny) |
| 10.3 | `validateEmail('a@b')` (brak kropki) | zwraca komunikat błędu formatu |
| 10.4 | `validateEmail('a b@c.pl')` (spacja) | zwraca komunikat błędu formatu |
| 10.5 | `validateName('')` | zwraca „Imię jest wymagane.” |
| 10.6 | `validateName('  ')` (same spacje) | zwraca „Imię jest wymagane.” (trim) |
| 10.7 | `validateName('A')` | zwraca „Imię powinno mieć co najmniej 2 znaki.” |
| 10.8 | `validateName('Ala')` | zwraca `''` |
| 10.9 | `subscribe()` z pustymi polami | zwraca `false`, nie wywołuje `submitToMailerLite`, ustawia `statusType='error'` |
| 10.10 | `subscribe()` z poprawnymi danymi + mock sukcesu | zwraca `true`, czyści `name`/`email`, `statusType='success'` |
| 10.11 | `subscribe()` z poprawnymi danymi + mock odrzucenia (`success:false`) | zwraca `false`, **nie** czyści pól, `statusType='error'` |
| 10.12 | `subscribe()` + mock timeout (>15s) | odrzuca z `Error('timeout')`, `isSubmitting` wraca do `false` w `finally` |
| 10.13 | Dwa równoległe wywołania `submitToMailerLite` | każde ma unikalny `callbackName` (`Date.now()`-based) — nie kolidują się nawzajem w `window` |
| 10.14 | Po zakończeniu (sukces lub błąd) | tymczasowy `<script>` i `window[callbackName]` są usuwane (brak wycieku pamięci/DOM) |

---

## 11. Animacje scroll-reveal (globalne, `App.vue`)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 11.1 | Załaduj stronę, nie przewijaj | Elementy poniżej pierwszego ekranu nie mają jeszcze klasy `.active` | P2 |
| 11.2 | Przewijaj powoli w dół przez całą stronę | Każdy selektor z `elementsToReveal` (`.section-header`, `.spec-card`, `.about-visual`, `.about-content`, `.audience-box`, `.mini-feature`, `.testimonial-box`, `.faq-item`, `.contact-form-container`) dostaje `.active` dokładnie raz, gdy wjeżdża w viewport | P1 |
| 11.3 | Sprawdź `.testimonial-box` w selektorze | ⚠️ Zweryfikować: w bieżących komponentach nie widać elementu `.testimonial-box` w markupie (About/Process/Contact) — martwy selektor lub usunięta sekcja. Potwierdzić czy to zamierzone. | P2 (do wyjaśnienia) |
| 11.4 | `prefers-reduced-motion: reduce` włączone w systemie | Sprawdzić, czy animacje są ograniczane/wyłączane (obecnie brak widocznej obsługi w kodzie — potencjalny brak dostępności) | P2 |

---

## 12. Dostępność (a11y)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 12.1 | Tab jako pierwsza akcja po załadowaniu strony | Fokus trafia na „Przejdź do treści” (skip link), aktywacja przenosi fokus do `#main-content` | P1 |
| 12.2 | Wszystkie interaktywne elementy (linki, przyciski, inputy) osiągalne Tabem w logicznej kolejności | Brak pułapek fokusu, brak elementów pomijanych | P0 |
| 12.3 | Kontrast tekstu względem tła (WCAG AA) w obu motywach | Zweryfikować narzędziem (axe DevTools / Lighthouse) dla tekstu głównego, mikrokopii i błędów formularza | P1 |
| 12.4 | Czytnik ekranu odczytuje błędy formularza | `role="alert"` + `aria-live` (status sukcesu/błędu ma `aria-live="polite"`) — potwierdzić że błąd jest ogłaszany od razu po wystąpieniu | P1 |
| 12.5 | Czytnik ekranu + przełącznik motywu | `aria-label` zmienia się dynamicznie („Przełącz na tryb jasny”/„Przełącz na tryb ciemny”) i jest odczytywany poprawnie | P2 |
| 12.6 | Czytnik ekranu + menu mobilne | `aria-expanded`, `aria-controls="mainNav"` i `aria-label` toggle poprawnie odzwierciedlają stan | P2 |
| 12.7 | Lighthouse Accessibility audit | Wynik ≥ 90 | P1 |

---

## 13. Responsywność (RWD)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 13.1 | 360px (mały mobile) | Brak poziomego scrolla, formularz Hero (`.form-input-group`) w jednej kolumnie (breakpoint 600px) | P0 |
| 13.2 | 768px (tablet) | Layout przechodzi poprawnie między układem mobilnym a desktopowym bez nakładających się elementów | P1 |
| 13.3 | 1920px+ (duży desktop) | Treść ograniczona `max-width` kontenera, brak nadmiernego rozciągnięcia | P2 |
| 13.4 | Zmiana orientacji (portrait/landscape) na tablecie | Layout adaptuje się bez ucinania treści | P2 |
| 13.5 | Zoom przeglądarki 200% | Treść pozostaje czytelna i użyteczna (brak nakładania tekstu) | P2 |

---

## 14. Wydajność i zasoby

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 14.1 | Network tab — obraz Hero | Ładuje się wariant AVIF w przeglądarkach wspierających format, JPG jako fallback (Safari starsze wersje) | P1 |
| 14.2 | Avatar w About ma `loading="lazy"` | Nie ładuje się dopóki sekcja nie zbliży się do viewportu | P2 |
| 14.3 | Obraz Hero ma `fetchpriority="high"` | Ładowany priorytetowo (LCP candidate) | P1 |
| 14.4 | Lighthouse Performance audit (mobile, throttled) | Core Web Vitals w akceptowalnym zakresie (LCP, CLS, INP) | P1 |
| 14.5 | `npm run build` | Kończy się bez błędów typów (`vue-tsc -b`) i generuje `dist/` | P0 |

---

## 15. Bezpieczeństwo (frontend)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 15.1 | Sprawdź nagłówek CSP na wdrożonej stronie | `script-src` zawiera tylko `'self'` i `https://assets.mailerlite.com`; próba wstrzyknięcia zewnętrznego skryptu jest blokowana | P0 |
| 15.2 | Wpisz w pola formularza znaki specjalne HTML (`<img src=x onerror=alert(1)>`) | Brak wykonania — Vue escapuje interpolacje, wartość trafia tylko jako parametr URL do MailerLite (URL-encoded) | P0 |
| 15.3 | Sprawdź `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` na wdrożeniu | Nagłówki obecne zgodnie z `public/_headers` | P1 |
| 15.4 | Deploy na Cloudflare Pages | Brak błędu infinite-loop związanego z `_redirects` (usunięty celowo — nie dodawać ponownie reguły catch-all bez sprawdzenia aktualnej dokumentacji Cloudflare) | P0 |

---

## 16. Treści i zgodność z ustaleniami (`CLAUDE.md`)

| # | Krok | Oczekiwany rezultat | Priorytet |
|---|---|---|---|
| 16.1 | Tytuł ebooka w treści strony | Dokładnie „Power Automate od zera. Twój pierwszy krok w świat automatyzacji” — spójny we wszystkich miejscach (Hero, Specializations, Process) | P1 |
| 16.2 | Termin premiery | Konsekwentnie „wiosną 2027” we wszystkich miejscach na stronie | P1 |
| 16.3 | Forma rabatu | Tekst mówi o „kodzie rabatowym” wysyłanym na maila (nie o publicznym banerze „-30%”) — zgodnie z ustaleniem, że to promocja spersonalizowana | P1 |
| 16.4 | Bonus | Instrukcja „Jak zmienić wiadomość z Teams w zadanie w Planerze” opisana jako dostępna **od razu** po zapisie (nie dopiero przy premierze) — potwierdzić czy to ostateczna decyzja zgodnie z notatką w `CLAUDE.md` o dostarczeniu bonusu | P1 |
| 16.5 | Brak pauzy (—) w treściach | Zgodnie z zapamiętaną preferencją użytkownika — żadna treść na stronie nie zawiera znaku „—” | P2 |

---

## 17. Regresja — pełna ścieżka użytkownika (E2E manualny smoke test)

| # | Krok |
|---|---|
| 17.1 | Wejdź na stronę → zobacz Hero z motywem zgodnym z systemem |
| 17.2 | Przełącz motyw na jasny → odśwież → motyw zachowany |
| 17.3 | Kliknij w menu „Co w ebooku?” → wyląduj w Specializations |
| 17.4 | Przewiń przez wszystkie sekcje → animacje reveal działają, brak skoków layoutu (CLS) |
| 17.5 | Na mobile: sticky CTA pojawia się po przewinięciu Hero |
| 17.6 | Wypełnij formularz w Hero błędnymi danymi → zobacz błędy → popraw → wyślij → zobacz sukces |
| 17.7 | Przewiń do formularza w Contact → powtórz zapis niezależnie → sukces |
| 17.8 | Kliknij social media w stopce → otwierają się w nowych kartach |
| 17.9 | Sprawdź konsolę przeglądarki na każdym kroku | Brak błędów JS / ostrzeżeń Vue |

---

## 18. Rekomendacja: automatyzacja testów

Obecnie brak jakiegokolwiek runnera. Jeśli projekt ma rosnąć, warto rozważyć:

- **Vitest + @vue/test-utils** — testy jednostkowe dla `useSubscribe.ts` (sekcja 10) bez potrzeby przeglądarki; najwyższa wartość przy najmniejszym koszcie, bo cała logika biznesowa jest w jednym czystym pliku TS.
- **Playwright** — testy E2E dla krytycznych ścieżek (sekcja 17): wysyłka formularza (z zamockowanym endpointem MailerLite), przełącznik motywu, nawigacja mobilna, kotwice (w tym wykrycie zepsutych linków ze stopki — sekcja 8).
- **axe-core / @axe-core/playwright** — zautomatyzowanie części testów a11y z sekcji 12.

Żadne z powyższych nie jest obecnie zainstalowane — do decyzji użytkownika, zanim zostanie dodana nowa zależność/konfiguracja.
