<script setup lang="ts">
import { onMounted } from 'vue';
import { event } from 'vue-gtag';
import { ArrowLeft, Check, Loader, Lock, Sun, Moon } from '@lucide/vue';
import BonusContent from './BonusContent.vue';
import CookieConsent from '../components/CookieConsent.vue';
import { useBonusAccess } from '../composables/useBonusAccess';
import { useSubscribe } from '../composables/useSubscribe';
import { useTheme } from '../composables/useTheme';

const { hasAccess, sourceLabel } = useBonusAccess();
const { isDark, toggleTheme } = useTheme();

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
  subscribe,
} = useSubscribe();

onMounted(() => {
  try {
    event('bonus_view', {
      source: sourceLabel.value,
      access: hasAccess.value ? 'granted' : 'gated',
    });
  } catch {
    /* GA4 jeszcze niegotowe albo brak zgody na cookies — pomijamy */
  }
});
</script>

<template>
  <div class="bonus-page">
    <header class="site-header">
      <div class="container">
        <a href="/" class="logo"><span class="logo-accent">&lt;</span>WM<span class="logo-accent"> /&gt;</span></a>
        <div class="header-actions">
          <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'">
            <Sun v-if="isDark" />
            <Moon v-else />
          </button>
          <a href="/" class="back-link"><ArrowLeft class="back-icon" /><span>Powrót do strony głównej</span></a>
        </div>
      </div>
    </header>

    <main>
      <div class="container">
        <div class="bonus-heading">
          <span class="badge">Dodatek dla zapisanych</span>
          <h1>Jak zamienić wiadomość z Teams w zadanie w Planerze</h1>
          <p class="bonus-lead">
            Krótka instrukcja krok po kroku. Ustawisz to raz i każda ważna
            wiadomość z Teams trafi tam, gdzie jej miejsce, czyli do zadań
            w Plannerze.
          </p>
        </div>

        <div class="bonus-card">
          <!-- Pełny dostęp: wejście z prawidłowego linku (?src=...) -->
          <BonusContent v-if="hasAccess" mode="full" />

          <!-- Brak dostępu: zajawka + brama zapisu -->
          <template v-else>
            <BonusContent mode="teaser" />

            <div class="bonus-gate">
              <div class="bonus-gate-head">
                <Lock class="gate-icon" />
                <h2>Dalsza część instrukcji jest dla zapisanych</h2>
              </div>
              <p class="bonus-gate-desc">
                Zostaw imię i adres e-mail. Wyślemy Ci pełną instrukcję, a przy
                okazji kod na 30% rabatu na ebook, gdy ten pojawi się wiosną 2027.
              </p>
              <ul class="bonus-gate-list">
                <li><Check class="check-icon" /> Pełna instrukcja „Jak zamienić wiadomość z Teams w zadanie w Planerze”</li>
                <li><Check class="check-icon" /> Kod na 30% rabatu na ebook „Power Automate od zera”</li>
              </ul>

              <form class="bonus-form" @submit.prevent="subscribe">
                <div class="form-group">
                  <label for="bonus-name">Imię</label>
                  <input
                    type="text"
                    id="bonus-name"
                    v-model="name"
                    required
                    placeholder="np. Krystyna"
                    :disabled="isSubmitting"
                    autocomplete="name"
                    :aria-invalid="!!nameError"
                    aria-describedby="bonus-name-error"
                    :class="{ 'input-error': nameError }"
                  >
                  <span class="field-error" id="bonus-name-error" role="alert" v-if="nameError">{{ nameError }}</span>
                </div>

                <div class="form-group">
                  <label for="bonus-email">Adres e-mail</label>
                  <input
                    type="email"
                    id="bonus-email"
                    v-model="email"
                    required
                    placeholder="np. krystyna@firma.pl"
                    :disabled="isSubmitting"
                    autocomplete="email"
                    :aria-invalid="!!emailError"
                    aria-describedby="bonus-email-error"
                    :class="{ 'input-error': emailError }"
                  >
                  <span class="field-error" id="bonus-email-error" role="alert" v-if="emailError">{{ emailError }}</span>
                </div>

                <div class="form-checkbox-group">
                  <input
                    type="checkbox"
                    id="bonus-consent"
                    v-model="consent"
                    :disabled="isSubmitting"
                    :aria-invalid="!!consentError"
                    aria-describedby="bonus-consent-error"
                  >
                  <label for="bonus-consent">Zgadzam się na zapisanie do listy mailingowej i otrzymywanie informacji marketingowych. Z mailingu mogę wypisać się w dowolnym momencie.</label>
                </div>
                <span class="field-error" id="bonus-consent-error" role="alert" v-if="consentError">{{ consentError }}</span>

                <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting" style="margin-top: 10px;">
                  <template v-if="isSubmitting">
                    <span>Wysyłanie...</span>
                    <Loader class="animate-spin" />
                  </template>
                  <template v-else>
                    <span>Chcę pełną instrukcję →</span>
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
          </template>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>&copy; 2026 Wojciech Mankowski. Wszelkie prawa zastrzeżone. &middot; <a href="/">Strona główna</a> &middot; <a href="/polityka-prywatnosci.html">Polityka prywatności</a></p>
      </div>
    </footer>

    <CookieConsent />
  </div>
</template>

<style scoped>
.bonus-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  line-height: 1.65;
}

.container {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 15px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-glass-heavy);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-glass);
}

.site-header .container {
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 18px;
  padding-bottom: 18px;
}

.logo {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.logo-accent {
  color: var(--primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  border: 1px solid var(--border-glass);
  padding: 8px 16px;
  border-radius: 50px;
}

.back-link:hover {
  color: var(--text-primary);
  border-color: var(--border-glass-hover);
}

.back-icon {
  width: 16px;
  height: 16px;
}

main {
  flex: 1;
  padding: 60px 0 80px;
}

.bonus-heading {
  margin-bottom: 34px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(232, 160, 32, 0.1);
  border: 1px solid rgba(232, 160, 32, 0.2);
  border-radius: 50px;
  color: var(--primary-text);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 18px;
}

h1 {
  font-family: var(--font-heading);
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.25;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin-bottom: 12px;
}

.bonus-lead {
  color: var(--text-muted);
  font-size: 0.98rem;
  max-width: 640px;
}

.bonus-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: var(--border-radius-md);
  padding: clamp(24px, 5vw, 48px);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.bonus-gate {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--border-glass);
}

.bonus-gate-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.gate-icon {
  width: 22px;
  height: 22px;
  color: var(--primary);
  flex-shrink: 0;
}

.bonus-gate-head h2 {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--text-primary);
  font-weight: 700;
}

.bonus-gate-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.bonus-gate-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  list-style: none;
}

.bonus-gate-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: var(--primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.bonus-form .form-group {
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .site-header .container {
    padding-top: 14px;
    padding-bottom: 14px;
  }

  .back-link span {
    display: none;
  }
}
</style>
