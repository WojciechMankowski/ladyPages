<script setup lang="ts">
import { ref } from 'vue';
import { Award, ArrowRight, Zap, Layout, Loader } from '@lucide/vue';
import heroVisual from '../assets/hero-visual.png';

const name = ref('');
const email = ref('');
const isSubmitting = ref(false);
const statusMessage = ref('');
const statusType = ref<'success' | 'error' | ''>('');

const handleSubscribe = () => {
  if (!name.value || !email.value) {
    statusMessage.value = 'Proszę wypełnić oba pola.';
    statusType.value = 'error';
    return;
  }
  
  isSubmitting.value = true;
  statusMessage.value = '';
  statusType.value = '';
  
  setTimeout(() => {
    isSubmitting.value = false;
    statusMessage.value = 'Gotowe! Sprawdź skrzynkę. Ebook już leci. Jakby nie dotarł w 5 minut, zajrzyj do folderu Oferty/Spam.';
    statusType.value = 'success';
    
    // Reset formularza
    name.value = '';
    email.value = '';
  }, 1500);
};
</script>

<template>
  <section class="hero" id="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="badge fade-in">
          <Award class="badge-icon" />
          <span>Darmowy Ebook + Newsletter „Power Automate dla biura”</span>
        </div>
        <h1 class="hero-title fade-in">
          Odzyskaj 5 godzin <br>
          tygodniowo w biurze. <br>
          <span class="text-gradient">Bez działu IT.</span>
        </h1>
        <p class="hero-subtitle fade-in">
          Power Automate to narzędzie, które <strong>już masz</strong> w pakiecie Microsoft 365, tylko nikt Ci nie pokazał, jak je włączyć. Zapisz się, a dostaniesz darmowy ebook „Automatyzacja w biurze bez IT”: 5 gotowych przepływów, które wdrożysz w jeden dzień, bez ani jednej linijki kodu.
        </p>
        
        <!-- Formularz Zapisu w Sekcji Hero -->
        <div class="hero-form-container fade-in">
          <form @submit.prevent="handleSubscribe" class="hero-inline-form">
            <div class="form-input-group">
              <input type="text" v-model="name" placeholder="Twoje imię" required :disabled="isSubmitting" aria-label="Imię">
              <input type="email" v-model="email" placeholder="Twój e-mail służbowy" required :disabled="isSubmitting" aria-label="Email służbowy">
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <template v-if="isSubmitting">
                <span>Wysyłanie...</span>
                <Loader class="animate-spin" style="width: 18px; height: 18px;" />
              </template>
              <template v-else>
                <span>Chcę odzyskać czas</span>
                <ArrowRight style="width: 18px; height: 18px;" />
              </template>
            </button>
          </form>
          <p class="form-microcopy">
            Zero spamu. Zero żargonu. Co dwa tygodnie jeden konkretny przepływ. Wypiszesz się jednym kliknięciem.
          </p>
          <div v-if="statusMessage" :class="['form-status', statusType]" style="margin-top: 15px;">
            {{ statusMessage }}
          </div>
        </div>
      </div>
      
      <div class="hero-visual-container fade-in">
        <div class="visual-wrapper">
          <img :src="heroVisual" alt="Wizualizacja Power Automate w biurze" class="hero-image">
          <div class="glow-card card-top">
            <div class="glow-card-icon zap">
              <Zap style="width: 20px; height: 20px;" />
            </div>
            <div class="glow-card-text">
              <h4>Power Automate</h4>
              <p>Automatyzacja procesów</p>
            </div>
          </div>
          <div class="glow-card card-bottom">
            <div class="glow-card-icon layout">
              <Layout style="width: 20px; height: 20px;" />
            </div>
            <div class="glow-card-text">
              <h4>Zyskaj czas</h4>
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
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.15);
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
