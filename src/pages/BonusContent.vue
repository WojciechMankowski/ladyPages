<script setup lang="ts">
/**
 * Treść instrukcji dodatku „Jak zamienić wiadomość z Teams w zadanie w Planerze".
 *
 * Materiał powstaje etapami. Każdy krok to osobny <section class="bonus-step">,
 * więc kolejne można dopisywać bez ruszania reszty. Roboczym źródłem tekstu jest
 * `Dodatek/main.md` — po dopracowaniu krok przenosimy tutaj.
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
      <!-- Kolejne kroki (dodanie Plannera, zamiana wiadomości w zadanie itd.)
           dopisujemy tutaj jako kolejne <section class="bonus-step">. -->

      <p class="bonus-wip">
        Kolejne kroki dodajemy na bieżąco. Masz już dostęp, więc wróć tu za jakiś
        czas po dalszą część instrukcji.
      </p>
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

.bonus-step ol {
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

.bonus-note {
  border-left: 3px solid var(--primary);
  padding: 10px 0 10px 14px;
  background: rgba(232, 160, 32, 0.06);
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  font-size: 0.92rem;
}

.bonus-wip {
  margin-top: 6px;
  padding-top: 20px;
  border-top: 1px solid var(--border-glass);
  font-size: 0.9rem;
  color: var(--text-muted);
}
</style>
