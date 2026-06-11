<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Stat {
  label: string;
  target: number;
  current: number;
  suffix: string;
}

const statsSection = ref<HTMLElement | null>(null);
const stats = ref<Stat[]>([
  { label: 'Godzin odzyskasz tygodniowo', target: 5, current: 0, suffix: ' h' },
  { label: 'Godzin zyskasz miesięcznie', target: 20, current: 0, suffix: ' h' },
  { label: 'Linii kodu do napisania', target: 0, current: 0, suffix: '' },
  { label: 'Złotych za darmowy Ebook', target: 0, current: 0, suffix: ' zł' }
]);

const animateStats = () => {
  stats.value.forEach((stat, index) => {
    if (stat.target === 0) {
      stats.value[index].current = 0;
      return;
    }
    const duration = 2000;
    const start = performance.now();
    
    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      stats.value[index].current = Math.floor(easeProgress * stat.target);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        stats.value[index].current = stat.target;
      }
    };
    
    requestAnimationFrame(update);
  });
};

onMounted(() => {
  if (statsSection.value) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(statsSection.value);
  }
});
</script>

<template>
  <section ref="statsSection" class="stats-bar">
    <div class="container stats-grid">
      <div v-for="(stat, idx) in stats" :key="idx" class="stat-item">
        <h3 class="stat-number">
          {{ stat.current }}{{ stat.current === stat.target ? stat.suffix : '' }}
        </h3>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>
