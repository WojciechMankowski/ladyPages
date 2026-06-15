<script setup lang="ts">
import {
  BookOpen,
  Workflow,
  BookA,
  Compass,
  Wand2,
  Briefcase,
  Rocket,
  Gift,
  Check
} from '@lucide/vue';
</script>

<template>
  <section class="specializations" id="ebook">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Zawartość Ebooka</span>
        <h2 class="section-title">Ebook „Power Automate — od zera do automatyzacji”</h2>
        <p class="section-desc">Sześć rozdziałów, które prowadzą Cię od pierwszego kliknięcia do gotowych automatyzacji — plus bonusy do użycia od ręki. Krok po kroku, w przystępnym języku.</p>
      </div>

      <div class="spec-grid">
        <!-- Wstęp -->
        <div class="spec-card">
          <div class="spec-icon-wrapper app-icon">
            <BookOpen />
          </div>
          <h3 class="spec-card-title">Wstęp — od czego zacząć</h3>
          <p class="spec-card-desc">Poznasz, dla kogo jest ten ebook, czym jest Power Automate i co to są przepływy. Bez programistycznego wstępu.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Dla osób bez doświadczenia w kodowaniu</li>
            <li><Check class="check-icon" /> Podpowiedź, jak korzystać z materiału</li>
            <li><Check class="check-icon" /> Nie musisz czytać po kolei</li>
          </ul>
        </div>

        <!-- Rozdział 1 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper flow-icon">
            <Workflow />
          </div>
          <h3 class="spec-card-title">Rozdział 1 — Rodzaje przepływów</h3>
          <p class="spec-card-desc">Cztery podstawowe typy przepływów i jasna wskazówka, kiedy stosować który z nich w codziennej pracy.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Zautomatyzowany i błyskawiczny</li>
            <li><Check class="check-icon" /> Zaplanowany według harmonogramu</li>
            <li><Check class="check-icon" /> Wzmianka o Power Automate Desktop</li>
          </ul>
        </div>

        <!-- Rozdział 2 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper bi-icon">
            <BookA />
          </div>
          <h3 class="spec-card-title">Rozdział 2 — Najważniejsze słownictwo</h3>
          <p class="spec-card-desc">Słowniczek kluczowych pojęć, które przewijają się przez cały ebook — żeby nic Cię później nie zaskoczyło.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Zdarzenie, wyzwalacz, chmura</li>
            <li><Check class="check-icon" /> Power Apps i użytkownik</li>
            <li><Check class="check-icon" /> Pojęcia wytłumaczone po ludzku</li>
          </ul>
        </div>

        <!-- Rozdział 3 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper pages-icon">
            <Compass />
          </div>
          <h3 class="spec-card-title">Rozdział 3 — Poruszanie się po Power Automate</h3>
          <p class="spec-card-desc">Przewodnik po interfejsie aplikacji, żebyś sprawnie odnajdował się w narzędziu, zanim zaczniesz budować.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Ekran główny i „Moje przepływy”</li>
            <li><Check class="check-icon" /> Menu szybkich akcji</li>
            <li><Check class="check-icon" /> Nowoczesny edytor wizualny</li>
          </ul>
        </div>

        <!-- Rozdział 4 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper copilot-icon">
            <Wand2 />
          </div>
          <h3 class="spec-card-title">Rozdział 4 — Tworzenie pierwszego przepływu</h3>
          <p class="spec-card-desc">Trzy ścieżki budowy przepływu, z tutorialami krok po kroku i zrzutami ekranu z każdego kliknięcia.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Z gotowego szablonu</li>
            <li><Check class="check-icon" /> Ręcznie od podstaw</li>
            <li><Check class="check-icon" /> Z pomocą AI (Copilot)</li>
          </ul>
        </div>

        <!-- Rozdział 5 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper app-icon">
            <Briefcase />
          </div>
          <h3 class="spec-card-title">Rozdział 5 — Gotowe rozwiązania w praktyce</h3>
          <p class="spec-card-desc">Cztery konkretne, biznesowe scenariusze rozpisane krok po kroku — z opisem problemu i konfiguracją akcji.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Formularz klienta → dokument Word mailem</li>
            <li><Check class="check-icon" /> Faktury z maili prosto na OneDrive</li>
            <li><Check class="check-icon" /> Powiadomienia Teams i obieg urlopów</li>
          </ul>
        </div>

        <!-- Rozdział 6 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper flow-icon">
            <Rocket />
          </div>
          <h3 class="spec-card-title">Rozdział 6 — Wskazówki do dalszego rozwoju</h3>
          <p class="spec-card-desc">Co robić po opanowaniu podstaw, żeby rozwijać się dalej i myśleć automatyzacją na co dzień.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Wyrażenia i obsługa błędów</li>
            <li><Check class="check-icon" /> Szerszy ekosystem Power Platform</li>
            <li><Check class="check-icon" /> Ścieżka certyfikacji PL-900</li>
          </ul>
        </div>

        <!-- Bonusy -->
        <div class="spec-card">
          <div class="spec-icon-wrapper ecosystem-icon">
            <Gift />
          </div>
          <h3 class="spec-card-title">Bonusy — checklisty, szablony, linki</h3>
          <p class="spec-card-desc">Praktyczny dodatek z gotowymi materiałami, po które sięgniesz przy każdej nowej automatyzacji.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Checklisty do wdrażania i diagnozy</li>
            <li><Check class="check-icon" /> 5 gotowych promptów do AI</li>
            <li><Check class="check-icon" /> Linki: dokumentacja, kursy, narzędzia</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
