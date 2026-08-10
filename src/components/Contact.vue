<script setup lang="ts">
import { Loader, HelpCircle, Check } from '@lucide/vue';
import { useSubscribe } from '../composables/useSubscribe';

const {
  name,
  email,
  consent,
  nameError,
  emailError,
  consentError,
  isSubmitting,
  statusMessage,
  statusType,
  subscribe: handleSubscribeFinal
} = useSubscribe();

const faqItems = [
  {
    q: 'Nie znam się na komputerach, dam radę?',
    a: 'Zdecydowanie tak. Jeśli potrafisz wysyłać maile i uzupełniać tabelki w Excelu, bez problemu poradzisz sobie z tym materiałem. Ebook prowadzi za rękę, pokazując każde kliknięcie zrzut po zrzucie.'
  },
  {
    q: 'Czy to legalne / czy IT się nie wkurzy?',
    a: 'Power Automate to oficjalne narzędzie Microsoftu, wbudowane bezpośrednio w pakiet Microsoft 365, z którego korzysta Twoja firma. Używasz bezpiecznego, licencjonowanego oprogramowania dostarczonego przez pracodawcę.'
  },
  {
    q: 'Ile to kosztuje?',
    a: 'Instrukcja „Jak zmienić wiadomość z Teams w zadanie w Planerze” i kod na 30% rabatu na ebooka są całkowicie bezpłatne (0 zł). Otrzymujesz je w zamian za Twój adres e-mail, bez zapisu na newsletter.'
  },
  {
    q: 'Nie mam czasu na naukę kolejnego narzędzia...',
    a: 'Pierwszy przepływ ustawisz szybciej, niż zajmuje zrobienie jednego miesięcznego raportu ręcznie. I co najważniejsze, to będzie ostatni raz, kiedy robisz go ręcznie. Oszczędność czasu odczujesz natychmiast.'
  }
];
</script>

<template>
  <section class="contact" id="faq">
    <div class="container contact-grid">
      <!-- FAQ Section (Left Column) -->
      <div class="contact-info">
        <span class="section-tag">Najczęstsze pytania</span>
        <h2 class="section-title">FAQ: Odpowiedzi na obiekcje</h2>
        <p class="contact-lead" style="margin-bottom: 30px;">
          Masz jeszcze wątpliwości? Przeczytaj odpowiedzi na pytania, które najczęściej zadają osoby zaczynające pracę z automatyzacją biurową.
        </p>
        
        <div class="faq-list">
          <div v-for="(item, idx) in faqItems" :key="idx" class="faq-item">
            <div class="faq-question-box">
              <HelpCircle class="faq-icon-q" />
              <h4>{{ item.q }}</h4>
            </div>
            <p class="faq-answer">{{ item.a }}</p>
          </div>
        </div>
      </div>
      
      <!-- Final Signup Form (Right Column) - ID contact is placed here for scroll target -->
      <div class="contact-form-container" id="contact">
        <span class="section-tag" style="margin-bottom: 10px;">Zacznij dzisiaj</span>
        <h3 class="final-cta-title">Pierwszy przepływ możesz mieć gotowy jeszcze dziś.</h3>
        <p class="final-cta-desc">
          Zostaw swoje imię i adres e-mail. Resztę dostajesz w dwóch krokach.
        </p>
        <ul class="final-cta-list">
          <li><Check class="check-icon" /> Instrukcję „Jak zmienić wiadomość z Teams w zadanie w Planerze” od razu na maila</li>
          <li><Check class="check-icon" /> Kod na 30% rabatu na ebook, gdy ten pojawi się wiosną 2027</li>
        </ul>

        <form class="contact-form" @submit.prevent="handleSubscribeFinal">
          <div class="form-group">
            <label for="final-name">Imię</label>
            <input type="text" id="final-name" v-model="name" required placeholder="np. Krystyna" :disabled="isSubmitting" autocomplete="name" :aria-invalid="!!nameError" aria-describedby="final-name-error" :class="{ 'input-error': nameError }">
            <span class="field-error" id="final-name-error" role="alert" v-if="nameError">{{ nameError }}</span>
          </div>
          <div class="form-group">
            <label for="final-email">Adres e-mail służbowy</label>
            <input type="email" id="final-email" v-model="email" required placeholder="np. krystyna@firma.pl" :disabled="isSubmitting" autocomplete="email" :aria-invalid="!!emailError" aria-describedby="final-email-error" :class="{ 'input-error': emailError }">
            <span class="field-error" id="final-email-error" role="alert" v-if="emailError">{{ emailError }}</span>
          </div>

          <div class="form-checkbox-group">
            <input type="checkbox" id="final-consent" v-model="consent" :disabled="isSubmitting" :aria-invalid="!!consentError" aria-describedby="final-consent-error">
            <label for="final-consent">Zgadzam się na zapisanie do listy mailingowej i otrzymywanie informacji marketingowych. Z mailingu mogę wypisać się w dowolnym momencie.</label>
          </div>
          <span class="field-error" id="final-consent-error" role="alert" v-if="consentError">{{ consentError }}</span>

          <button type="submit" class="btn btn-primary btn-block" id="btn-submit" :disabled="isSubmitting" style="margin-top: 10px;">
            <template v-if="isSubmitting">
              <span>Wysyłanie...</span>
              <Loader class="animate-spin" />
            </template>
            <template v-else>
              <span>Chcę instrukcję i rabat →</span>
            </template>
          </button>

          <p class="form-microcopy-center" style="margin-top: 15px; font-size: 0.75rem; text-align: center; color: var(--text-muted);">
            Instrukcję i kod rabatowy wyślemy na podany adres e-mail. Zero spamu, tylko treści dotyczące ebooka.
          </p>
          
          <div v-if="statusMessage" :class="['form-status', statusType]" style="margin-top: 15px;" role="status" aria-live="polite">
            {{ statusMessage }}
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.faq-item {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid var(--border-glass);
  border-radius: var(--border-radius-sm);
  padding: 20px;
}

.faq-question-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.faq-icon-q {
  width: 20px;
  height: 20px;
  color: var(--primary);
  flex-shrink: 0;
}

.faq-question-box h4 {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.faq-answer {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: 32px;
}

.final-cta-title {
  font-size: 1.4rem;
  line-height: 1.3;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.final-cta-desc {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
}

.final-cta-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
  list-style: none;
}

.final-cta-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
