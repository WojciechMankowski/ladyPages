<script setup lang="ts">
import { Check, X, MailOpen, Calendar, HelpCircle, Gift } from '@lucide/vue';
</script>

<template>
  <div>
    <!-- Section: Dla kogo to jest / nie jest -->
    <section class="process" id="target-audience">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Dopasowanie</span>
          <h2 class="section-title">Czy to rozwiązanie jest dla Ciebie?</h2>
          <p class="section-desc">Sprawdź, czy odnajdziesz siebie w poniższych punktach, aby mieć pewność, że to dobrze zainwestowany czas.</p>
        </div>

        <div class="audience-grid">
          <!-- Dla kogo TAK -->
          <div class="audience-box target-yes">
            <div class="audience-header text-green">
              <Check class="icon-bullet" />
              <h3>To jest dla Ciebie, jeśli:</h3>
            </div>
            <ul class="audience-list">
              <li>Pracujesz w biurze i dużo rzeczy robisz ręcznie w Excelu i Outlooku.</li>
              <li>Masz serdecznie dość powtarzania w kółko tych samych mechanicznych czynności.</li>
              <li>Chcesz wychodzić z pracy o czasie, a nie zostawać po godzinach na klejeniu raportów.</li>
              <li><strong>Nie jesteś informatykiem</strong> i wcale nie masz ochoty nim zostać.</li>
            </ul>
          </div>

          <!-- Dla kogo NIE -->
          <div class="audience-box target-no">
            <div class="audience-header text-red">
              <X class="icon-bullet" />
              <h3>To NIE jest dla Ciebie, jeśli:</h3>
            </div>
            <ul class="audience-list">
              <li>Szukasz zaawansowanego, programistycznego kursu tworzenia systemów.</li>
              <li>Masz już wdrożone zaawansowane automatyzacje i szukasz konsultacji eksperckiej dla IT.</li>
              <li>Lubisz powtarzalne, żmudne przeklikiwanie i nie chcesz tego zmieniać.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Co dwa tygodnie w skrzynce -->
    <section class="newsletter-details" id="newsletter-details">
      <div class="container">
        <div class="newsletter-banner">
          <div class="banner-content">
            <span class="section-tag text-purple">Co dostajesz po zapisie</span>
            <h2 class="banner-title">Newsletter „Power Automate dla biura”</h2>
            <p class="banner-desc">
              Pobranie ebooka to dopiero początek. Zostając na liście, otrzymujesz regularne wsparcie w odzyskiwaniu czasu.
            </p>
            
            <div class="features-grid-mini">
              <div class="mini-feature">
                <Calendar class="feat-icon" />
                <div>
                  <h4>Co dwa tygodnie w skrzynce</h4>
                  <p>Tylko jeden, konkretny i w pełni opisany przepływ do wdrożenia. Nic więcej.</p>
                </div>
              </div>
              <div class="mini-feature">
                <MailOpen class="feat-icon" />
                <div>
                  <h4>Pisany po ludzku</h4>
                  <p>Tłumaczę technologię na język biurowy. Bez skomplikowanego żargonu i teorii.</p>
                </div>
              </div>
              <div class="mini-feature">
                <Gift class="feat-icon" />
                <div>
                  <h4>W 100% darmowy</h4>
                  <p>Żadnych ukrytych kosztów. Możesz się wypisać jednym kliknięciem w dowolnym momencie.</p>
                </div>
              </div>
              <div class="mini-feature">
                <HelpCircle class="feat-icon" />
                <div>
                  <h4>Zero zbędnej teorii</h4>
                  <p>Żadnego gadania o „transformacji cyfrowej”. Sam czysty konkret, który włączasz w 15 minut.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.audience-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.audience-box {
  background: var(--bg-glass-heavy);
  border: 1px solid var(--border-glass);
  border-radius: var(--border-radius-lg);
  padding: 40px;
  backdrop-filter: blur(15px);
}

.target-yes {
  border-left: 4px solid #10b981;
}

.target-no {
  border-left: 4px solid #ef4444;
}

.audience-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 15px;
}

.text-green {
  color: #10b981;
}

.text-red {
  color: #ef4444;
}

.icon-bullet {
  width: 24px;
  height: 24px;
}

.audience-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  list-style: none;
}

.audience-list li {
  position: relative;
  padding-left: 20px;
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.6;
}

.audience-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--text-muted);
  font-size: 1.2rem;
}

/* Newsletter banner styling */
.newsletter-details {
  padding: var(--section-padding);
  background-color: var(--bg-secondary);
}

.newsletter-banner {
  background: radial-gradient(circle at top right, rgba(139, 92, 246, 0.08), transparent), var(--bg-glass-heavy);
  border: 1px solid var(--border-glass-hover);
  border-radius: var(--border-radius-lg);
  padding: 50px;
  backdrop-filter: blur(15px);
}

.banner-title {
  font-size: 2rem;
  margin-bottom: 15px;
}

.banner-desc {
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 700px;
}

.features-grid-mini {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.mini-feature {
  display: flex;
  gap: 20px;
  align-items: start;
}

.feat-icon {
  width: 36px;
  height: 36px;
  color: var(--primary);
  flex-shrink: 0;
  background: rgba(139, 92, 246, 0.1);
  padding: 8px;
  border-radius: var(--border-radius-sm);
}

.mini-feature h4 {
  font-size: 1.05rem;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.mini-feature p {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 900px) {
  .audience-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .features-grid-mini {
    grid-template-columns: 1fr;
  }
  
  .newsletter-banner {
    padding: 30px;
  }
}
</style>
