<script setup lang="ts">
import { onMounted } from 'vue';
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import Stats from './components/Stats.vue';
import Specializations from './components/Specializations.vue';
import About from './components/About.vue';
import Projects from './components/Projects.vue';
import Process from './components/Process.vue';
import Contact from './components/Contact.vue';
import Footer from './components/Footer.vue';

onMounted(() => {
  // Dynamiczne dodawanie klas reveal do elementów
  const elementsToReveal = [
    '.section-header',
    '.spec-card',
    '.about-visual',
    '.about-content',
    '.glass-card',
    '.fear-card',
    '.audience-box',
    '.mini-feature',
    '.testimonial-box',
    '.faq-item',
    '.contact-form-container'
  ];

  elementsToReveal.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Animacja wejścia w sekcji Hero
  document.querySelectorAll('.hero .fade-in').forEach((el, index) => {
    const htmlEl = el as HTMLElement;
    setTimeout(() => {
      htmlEl.style.opacity = '1';
      htmlEl.style.transform = 'translateY(0)';
      htmlEl.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 150 * index);
  });

  // Styl startowy dla Hero fade-in
  document.querySelectorAll('.hero .fade-in').forEach(el => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = '0';
    htmlEl.style.transform = 'translateY(20px)';
  });
});
</script>

<template>
  <div>
    <!-- Ambient Glow Effects -->
    <div class="ambient-glow glow-1"></div>
    <div class="ambient-glow glow-2"></div>
    <div class="ambient-glow glow-3"></div>

    <Header />
    <main>
      <Hero />
      <Stats />
      <Specializations />
      <About />
      <Projects />
      <Process />
      <Contact />
    </main>
    <Footer />
  </div>
</template>
