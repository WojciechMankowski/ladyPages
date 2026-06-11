<script setup lang="ts">
import { 
  FolderDown, 
  FileSpreadsheet, 
  Clock, 
  MessageSquare, 
  FileText,
  Check
} from '@lucide/vue';
</script>

<template>
  <section class="specializations" id="ebook">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">Zawartość Ebooka</span>
        <h2 class="section-title">Ebook „Automatyzacja w biurze bez IT”</h2>
        <p class="section-desc">Pokażę Ci, jak krok po kroku wdrożyć 5 praktycznych przepływów, które przejmą Twoje najnudniejsze, codzienne obowiązki.</p>
      </div>
      
      <div class="spec-grid">
        <!-- Flow 1 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper app-icon">
            <FolderDown />
          </div>
          <h3 class="spec-card-title">1. Automatyczny zapis załączników</h3>
          <p class="spec-card-desc">Koniec z ręcznym pobieraniem każdej faktury czy raportu. System sam rozpozna załączniki w mailach i zapisze je w chmurze.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Filtrowanie po nadawcy i temacie</li>
            <li><Check class="check-icon" /> Zapis do SharePoint lub OneDrive</li>
            <li><strong>Zysk: ok. 3 h / miesiąc</strong></li>
          </ul>
        </div>

        <!-- Flow 2 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper flow-icon">
            <FileSpreadsheet />
          </div>
          <h3 class="spec-card-title">2. Raport Excel wysyłany samoczynnie</h3>
          <p class="spec-card-desc">Połącz tabele, zbierz dane i wyślij gotowe zestawienie do szefa w każdy piątek rano, całkowicie bez Twojego udziału.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Uruchamianie według harmonogramu</li>
            <li><Check class="check-icon" /> Dynamiczne pobieranie danych</li>
            <li><strong>Zysk: ok. 5 h / miesiąc</strong></li>
          </ul>
        </div>

        <!-- Flow 3 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper bi-icon">
            <Clock />
          </div>
          <h3 class="spec-card-title">3. Przypomnienia o terminach</h3>
          <p class="spec-card-desc">System automatycznie sprawdzi daty płatności lub realizacji zadań w Excelu i sam wyśle maile z przypomnieniem.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Monitorowanie plików w tle</li>
            <li><Check class="check-icon" /> Szablony wiadomości z danymi</li>
            <li><strong>Zysk: ok. 4 h / miesiąc</strong></li>
          </ul>
        </div>

        <!-- Flow 4 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper pages-icon">
            <MessageSquare />
          </div>
          <h3 class="spec-card-title">4. Alerty Teams dla ważnych maili</h3>
          <p class="spec-card-desc">Nie musisz ciągle odświeżać poczty. Otrzymasz powiadomienie na czacie Teams tylko wtedy, gdy napisze kluczowy klient.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Natychmiastowe powiadomienia</li>
            <li><Check class="check-icon" /> Warunki logiczne (np. pilny nadawca)</li>
            <li><strong>Zysk: ok. 2 h / miesiąc</strong></li>
          </ul>
        </div>

        <!-- Flow 5 -->
        <div class="spec-card">
          <div class="spec-icon-wrapper copilot-icon">
            <FileText />
          </div>
          <h3 class="spec-card-title">5. Generowanie pism z szablonów</h3>
          <p class="spec-card-desc">Wypełniaj umowy lub formularze pism danymi z tabeli Excel jednym kliknięciem, konwertuj do PDF i wysyłaj.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Tworzenie plików PDF z szablonów Word</li>
            <li><Check class="check-icon" /> Automatyczna wysyłka do adresata</li>
            <li><strong>Zysk: ok. 6 h / miesiąc</strong></li>
          </ul>
        </div>

        <!-- Ecosystem Wrapper / Summary -->
        <div class="spec-card">
          <div class="spec-icon-wrapper ecosystem-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <h3 class="spec-card-title">Co jeszcze w środku?</h3>
          <p class="spec-card-desc">Oprócz 5 przepływów otrzymujesz jasne, ilustrowane instrukcje krok po kroku, przygotowane w przystępnym języku.</p>
          <ul class="spec-features">
            <li><Check class="check-icon" /> Zrzuty ekranu z każdego kliknięcia</li>
            <li><Check class="check-icon" /> Opisy wdrożenia bez żargonu IT</li>
            <li><strong>Łączny zysk: ponad 20 h / miesiąc</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
