<script setup lang="ts">
/**
 * Treść instrukcji dodatku „Jak zamienić wiadomość z Teams w zadanie w Planerze".
 * Źródło tekstu: `Dodatek/main.md`.
 *
 * `mode="teaser"` pokazuje tylko wstęp i pierwszy krok (widok dla wejścia bez
 * prawidłowego linku `?src`). `mode="full"` pokazuje całość.
 */
withDefaults(defineProps<{ mode?: 'full' | 'teaser' }>(), { mode: 'full' });
</script>

<template>
  <div class="bonus-content">
    <p class="bonus-intro">
      Poniżej znajdziesz gotowy sposób na to, żeby wiadomość z Teams nie ginęła
      w rozmowie, tylko od razu stawała się zadaniem w Plannerze. Zaczynamy od
      przygotowania miejsca, w którym zadania będą lądować.
    </p>

    <section class="bonus-step">
      <h2>Krok 1. Utwórz zespół w Teams</h2>
      <ol>
        <li>
          Otwórz listę zespołów. Jeśli masz połączone czaty i zespoły, znajdziesz
          je w zakładce Czat. Jeśli masz je rozdzielone, wejdź w osobną zakładkę
          Zespoły.
        </li>
        <li>Obok napisu Zespoły kliknij ikonę kartki z długopisem.</li>
        <li>Wybierz Nowy zespół.</li>
        <li>Nadaj nazwę.</li>
        <li>Zostaw zespół jako prywatny. Ludzi zaprosisz później.</li>
        <li>Nazwij pierwszy kanał, na przykład Ogólny.</li>
        <li>Kliknij Utwórz.</li>
      </ol>
      <p class="bonus-note">
        Nie masz uprawnień do tworzenia zespołów albo nie chcesz zakładać nowego?
        Użyj zespołu, w którym już jesteś członkiem. Reszta instrukcji działa tak
        samo.
      </p>
      <p>Zespół jest gotowy. Teraz dodaj do niego Planner.</p>
    </section>

    <template v-if="mode === 'full'">
      <section class="bonus-step">
        <h2>Krok 2. Utwórz plan w Plannerze</h2>
        <p>
          Wejdź na
          <a href="https://planner.cloud.microsoft/webui/myplans" target="_blank" rel="noopener noreferrer">planner.cloud.microsoft/webui/myplans</a>.
          Kliknij tworzenie nowego planu, wybierz Plan podstawowy i potwierdź
          przyciskiem Utwórz plan podstawowy. Wpisz nazwę planu, a w polu
          „Udostępnij swojej grupie" wybierz z listy zespół stworzony przed
          chwilą.
        </p>
        <p class="bonus-note">
          Tego pola nie pomijaj. Bez niego plan trafia do twoich zadań
          osobistych, a przepływ z Teams go nie zobaczy.
        </p>
        <p>
          Kliknij Utwórz plan podstawowy. Plan pojawi się też w Teams,
          w zakładce twojego zespołu.
        </p>
      </section>

      <section class="bonus-step">
        <h2>Krok 3. Utwórz przepływ z wiadomości</h2>
        <p>
          Wróć do Teams. Wybierz jedną ze swoich wiadomości, tę, z której
          chcesz stworzyć zadanie w Plannerze, i wykonaj:
        </p>
        <ol>
          <li>Najedź na wiadomość, pojawi się pasek z emotkami reakcji.</li>
          <li>Kliknij ikonę trzech kropek.</li>
          <li>Wybierz Więcej działań.</li>
          <li>Wybierz Utwórz przepływ pracy.</li>
          <li>Wybierz szablon „Utwórz zadanie w programie Planner na podstawie wiadomości".</li>
          <li>Wybierz grupę (ten sam zespół, co w kroku 2).</li>
          <li>Wybierz planer.</li>
        </ol>
      </section>

      <section class="bonus-step">
        <h2>Krok 4. Przetestuj przepływ</h2>
        <p>
          Najedź na wybraną wiadomość — od razu powinieneś zauważyć przepływ
          o nazwie „Utwórz zadanie w programie Planner na podstawie
          wiadomości". Jeśli nie zauważysz go w tym miejscu, najedź na Więcej
          działań i szukaj pod tą samą nazwą.
        </p>
        <p>
          Kliknij w niego i uzupełnij dane w wyskakującym oknie. Teraz przejdź
          w Teams do aplikacji Planner i sprawdź, czy zadanie na podstawie
          wiadomości zostało dodane.
        </p>
      </section>

      <section class="bonus-step">
        <h2>Częste błędy</h2>
        <ol class="bonus-errors">
          <li><strong>Grupa nie ma jeszcze planu w Plannerze.</strong> Szablon szuka istniejącego planu przypiętego do zespołu, jeśli go nie ma, lista planów w kroku 7 jest pusta.</li>
          <li><strong>Kanał prywatny blokuje akcję.</strong> „Utwórz przepływ pracy" z wiadomości w kanale prywatnym często kończy się błędem uprawnień, bo połączenie Teams-Planner nie ma dostępu do takich kanałów.</li>
          <li><strong>Polityka DLP blokuje połączenie konektorów.</strong> Administrator może ustawić regułę Data Loss Prevention, która nie pozwala łączyć konektora Teams z Plannerem w jednym przepływie, wtedy zapis kończy się błędem.</li>
          <li><strong>Usunięcie wiadomości nie usuwa zadania.</strong> Zadanie w Plannerze i wiadomość w Teams nie są ze sobą powiązane po utworzeniu, skasowanie jednego nie wpływa na drugie.</li>
          <li><strong>Edycja wiadomości nie aktualizuje zadania.</strong> Opis zadania w Plannerze zostaje z treścią sprzed edycji, bo przepływ pobiera dane tylko raz, w momencie uruchomienia.</li>
          <li><strong>Kilkukrotne uruchomienie na tej samej wiadomości tworzy duplikaty.</strong> Teams nie sprawdza, czy zadanie z danej wiadomości już istnieje, więc powtórne kliknięcie „Utwórz przepływ pracy" doda drugie, identyczne zadanie.</li>
          <li><strong>Limit uruchomień w licencji.</strong> Przepływy z akcji na wiadomości liczą się do miesięcznego limitu w planie Power Automate, przy niskim planie licencyjnym (np. w ramach Microsoft 365) można go wyczerpać przy dużej liczbie zgłoszeń.</li>
        </ol>
      </section>

      <section class="bonus-step">
        <h2>Jak dopasować szablon do własnych potrzeb</h2>
        <ul>
          <li>Treść zadania po polsku, a nie po angielsku.</li>
          <li>Dodanie daty rozpoczęcia, np. „od dziś", „od jutra".</li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.bonus-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.bonus-intro {
  font-size: 1.02rem;
  color: var(--text-secondary);
}

.bonus-step h2 {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 14px;
}

.bonus-step ol,
.bonus-step ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 0 14px;
  padding-left: 22px;
}

.bonus-step li {
  color: var(--text-secondary);
  line-height: 1.6;
}

.bonus-step p {
  color: var(--text-secondary);
  margin-top: 10px;
}

.bonus-step a {
  color: var(--primary-text);
}

.bonus-note {
  border-left: 3px solid var(--primary);
  padding: 10px 0 10px 14px;
  background: rgba(232, 160, 32, 0.06);
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  font-size: 0.92rem;
}

.bonus-errors li strong {
  color: var(--text-primary);
}
</style>
