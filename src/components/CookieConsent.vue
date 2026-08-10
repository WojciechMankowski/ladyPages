<script setup lang="ts">
import { ref, onMounted } from 'vue';

const STORAGE_KEY = 'cookie-consent';

const visible = ref(false);

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  visible.value = saved !== 'accepted' && saved !== 'rejected';
});

const accept = () => {
  localStorage.setItem(STORAGE_KEY, 'accepted');
  visible.value = false;
};

const reject = () => {
  localStorage.setItem(STORAGE_KEY, 'rejected');
  visible.value = false;
};
</script>

<template>
  <div v-if="visible" class="cookie-consent" role="dialog" aria-live="polite" aria-label="Zgoda na pliki cookies">
    <p>
      Ta strona korzysta z plików cookies w celu zapewnienia prawidłowego działania oraz analizy ruchu.
      Możesz zaakceptować lub odrzucić ich wykorzystanie. Szczegóły znajdziesz w
      <a href="/polityka-prywatnosci.html">polityce prywatności</a>.
    </p>
    <div class="cookie-consent-actions">
      <button type="button" class="btn btn-outline btn-sm" @click="reject">Odrzuć</button>
      <button type="button" class="btn btn-primary btn-sm" @click="accept">Akceptuj</button>
    </div>
  </div>
</template>
