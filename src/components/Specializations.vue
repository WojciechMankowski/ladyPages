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
        <h2 class="section-title">Ebook „Power Automate: od zera do automatyzacji”</h2>
        <p class="section-desc">Sześć rozdziałów, które prowadzą Cię od pierwszego kliknięcia do gotowych automatyzacji, plus bonusy do użycia od ręki. Krok po kroku, w przystępnym języku.</p>
      </div>

      <div class="spec-grid">
        <!-- Wstęp -->
        <div class="spec-card">
          <div class="spec-icon-wrapper app-icon">
            <BookOpen />
          </div>
          <span class="spec-card-eyebrow">Wstęp</span>
          <h3 class="spec-card-title">Zaczynasz bez wstępu o programowaniu</h3>
          <p class="spec-card-desc">Poznasz, dla kogo jest ten ebook, czym jest Power Automate i co to są przepływy. Bez programistycznego wstępu.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Dla kogo jest ten ebook, a dla kogo nie</li>
            <li><Check class="check-icon" /> Definicja Power Automate i przepływu w jednym zdaniu</li>
            <li><Check class="check-icon" /> Mapa rozdziałów: gdzie szukać czego</li>
          </ul>
        </div>

        <!-- Rozdział 1 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper flow-icon">
            <Workflow />
          </div>
          <span class="spec-card-eyebrow">Rozdział 1</span>
          <h3 class="spec-card-title">Rozpoznasz, który typ przepływu pasuje do Twojego zadania</h3>
          <p class="spec-card-desc">Cztery podstawowe typy przepływów i jasna wskazówka, kiedy stosować który z nich w codziennej pracy.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Przepływ zautomatyzowany i błyskawiczny</li>
            <li><Check class="check-icon" /> Przepływ zaplanowany według harmonogramu</li>
            <li><Check class="check-icon" /> Kiedy sięgnąć po Power Automate Desktop do automatyzacji pulpitu</li>
          </ul>
        </div>

        <!-- Rozdział 2 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper bi-icon">
            <BookA />
          </div>
          <span class="spec-card-eyebrow">Rozdział 2</span>
          <h3 class="spec-card-title">Przestaniesz się gubić w słowniku Microsoftu</h3>
          <p class="spec-card-desc">Słowniczek kluczowych pojęć, które przewijają się przez cały ebook, żeby nic Cię później nie zaskoczyło.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Zdarzenie i wyzwalacz: po ludzku, na przykładach</li>
            <li><Check class="check-icon" /> Chmura i środowisko w praktyce Power Automate</li>
            <li><Check class="check-icon" /> Power Apps i pojęcie użytkownika</li>
          </ul>
        </div>

        <!-- Rozdział 3 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper pages-icon">
            <Compass />
          </div>
          <span class="spec-card-eyebrow">Rozdział 3</span>
          <h3 class="spec-card-title">Odnajdziesz się w interfejsie, zanim cokolwiek zbudujesz</h3>
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
          <span class="spec-card-eyebrow">Rozdział 4</span>
          <h3 class="spec-card-title">Zbudujesz pierwszy przepływ ze zrzutami z każdego kliknięcia</h3>
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
          <span class="spec-card-eyebrow">Rozdział 5</span>
          <h3 class="spec-card-title">Skopiujesz cztery gotowe automatyzacje do swojej pracy</h3>
          <p class="spec-card-desc">Cztery konkretne, biznesowe scenariusze rozpisane krok po kroku, z opisem problemu i konfiguracją akcji.</p>
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
          <span class="spec-card-eyebrow">Rozdział 6</span>
          <h3 class="spec-card-title">Będziesz wiedział, co robić po podstawach</h3>
          <p class="spec-card-desc">Co robić po opanowaniu podstaw, żeby rozwijać się dalej i myśleć automatyzacją na co dzień.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Wyrażenia i obsługa błędów</li>
            <li><Check class="check-icon" /> Szerszy ekosystem Power Platform</li>
            <li><Check class="check-icon" /> Jak podejść do egzaminu Microsoft PL-900, jeśli chcesz papier</li>
          </ul>
        </div>

        <!-- Bonusy -->
        <div class="spec-card">
          <div class="spec-icon-wrapper ecosystem-icon">
            <Gift />
          </div>
          <span class="spec-card-eyebrow">Bonus</span>
          <h3 class="spec-card-title">Sięgniesz po gotowce zamiast zaczynać od zera</h3>
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
