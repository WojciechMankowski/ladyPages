<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowRight } from '@lucide/vue';

// Sticky CTA widoczny tylko na mobile, pojawia się po przewinięciu za sekcję Hero.
const visible = ref(false);

const handleScroll = () => {
  visible.value = window.scrollY > window.innerHeight * 0.8;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <a
    href="#contact"
    :class="['mobile-cta-bar', { visible }]"
    aria-label="Przejdź do formularza i odbierz darmowy ebook"
  >
    <span>Odbierz darmowy ebook</span>
    <ArrowRight style="width: 18px; height: 18px;" />
  </a>
</template>
