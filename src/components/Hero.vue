<script setup lang="ts">
import { ArrowRight, Zap, Layout, Loader } from '@lucide/vue';
import heroVisual450Avif from '../assets/hero-visual-450.avif';
import heroVisual900Avif from '../assets/hero-visual-900.avif';
import heroVisual450Jpg from '../assets/hero-visual-450.jpg';
import heroVisual900Jpg from '../assets/hero-visual-900.jpg';
import { useSubscribe } from '../composables/useSubscribe';

const {
  name,
  email,
  nameError,
  emailError,
  isSubmitting,
  statusMessage,
  statusType,
  subscribe: handleSubscribe
} = useSubscribe();
</script>

<template>
  <section class="hero" id="hero">
    <div class="container hero-grid">
      <div class="hero-content">
      
        <h1 class="hero-title fade-in">
          Przestań ręcznie przeklejać dane <br>
          między <span class="text-gradient">Excelem a Outlookiem</span>.
        </h1>
        <p class="hero-subtitle fade-in">
          Przewodnik po Power Automate dla pracowników biura, którzy nie mają wykształcenia informatycznego i nie chcą go mieć. Premiera wiosną 2027.
        </p>
        
        <!-- Formularz Zapisu w Sekcji Hero -->
        <div class="hero-form-container fade-in">
          <p class="form-lead-text">
            Zostaw adres, a od razu wyślę Ci instrukcję „Jak zmienić wiadomość z Teams w zadanie w Planerze”. Przy premierze dostaniesz kod na 30% rabatu.
          </p>
          <form @submit.prevent="handleSubscribe" class="hero-inline-form">
            <div class="form-input-group">
              <div class="form-field-wrapper">
                <input type="text" id="hero-name" v-model="name" placeholder="Twoje imię" required :disabled="isSubmitting" aria-label="Imię" autocomplete="name" :aria-invalid="!!nameError" aria-describedby="hero-name-error" :class="{ 'input-error': nameError }">
                <span class="field-error" id="hero-name-error" role="alert" v-if="nameError">{{ nameError }}</span>
              </div>
              <div class="form-field-wrapper">
                <input type="email" id="hero-email" v-model="email" placeholder="Twój e-mail służbowy" required :disabled="isSubmitting" aria-label="Email służbowy" autocomplete="email" :aria-invalid="!!emailError" aria-describedby="hero-email-error" :class="{ 'input-error': emailError }">
                <span class="field-error" id="hero-email-error" role="alert" v-if="emailError">{{ emailError }}</span>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <template v-if="isSubmitting">
                <span>Wysyłanie...</span>
                <Loader class="animate-spin" style="width: 18px; height: 18px;" />
              </template>
              <template v-else>
                <span>Chcę instrukcję i rabat</span>
                <ArrowRight style="width: 18px; height: 18px;" />
              </template>
            </button>
          </form>
          <p class="form-microcopy">
            Zero spamu. Zero żargonu. Bez zapisu na newsletter, tylko instrukcja i kod rabatowy.
          </p>
          <div v-if="statusMessage" :class="['form-status', statusType]" style="margin-top: 15px;" role="status" aria-live="polite">
            {{ statusMessage }}
          </div>
        </div>
      </div>
      
      <div class="hero-visual-container fade-in">
        <div class="visual-wrapper">
          <picture>
            <source :srcset="`${heroVisual450Avif} 1x, ${heroVisual900Avif} 2x`" type="image/avif">
            <source :srcset="`${heroVisual450Jpg} 1x, ${heroVisual900Jpg} 2x`" type="image/jpeg">
            <img :src="heroVisual900Jpg" alt="Wizualizacja Power Automate w biurze" class="hero-image" width="450" height="450" fetchpriority="high">
          </picture>
          <div class="glow-card card-top">
            <div class="glow-card-icon zap">
              <Zap style="width: 20px; height: 20px;" />
            </div>
            <div class="glow-card-text">
              <span class="glow-card-title">Power Automate</span>
              <p>Automatyzacja procesów</p>
            </div>
          </div>
          <div class="glow-card card-bottom">
            <div class="glow-card-icon layout">
              <Layout style="width: 20px; height: 20px;" />
            </div>
            <div class="glow-card-text">
              <span class="glow-card-title">Zyskaj czas</span>
              <p>5h zaoszczędzone tygodniowo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-form-container {
  width: 100%;
  max-width: 580px;
  margin-top: 10px;
}

.form-lead-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
}

.hero-inline-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.form-input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.hero-inline-form input {
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-glass);
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: all var(--transition-fast);
}

.hero-inline-form input:focus {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 10px rgba(232, 160, 32, 0.15);
}

/* Widoczny pierścień fokusu dla nawigacji klawiaturą */
.hero-inline-form input:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.form-microcopy {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 8px;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .form-input-group {
    grid-template-columns: 1fr;
  }
}
</style>
