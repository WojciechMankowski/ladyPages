<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, X, Sun, Moon } from '@lucide/vue';
import { useTheme } from '../composables/useTheme';

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const { isDark, toggleTheme } = useTheme();

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header :class="['main-header', { scrolled: isScrolled }]">
    <div class="container header-container">
      <a href="#" class="logo" @click="closeMenu">
        <span class="logo-accent">&lt;</span>WM<span class="logo-accent"> /&gt;</span>
        <span class="logo-text">Wojciech Mankowski</span>
      </a>
      
      <nav :class="['main-nav', { active: isMenuOpen }]" id="mainNav" aria-label="Główna nawigacja">
        <ul>
          <li><a href="#ebook" class="nav-link" @click="closeMenu">Co w ebooku?</a></li>
          <li><a href="#about" class="nav-link" @click="closeMenu">O mnie</a></li>
          <li><a href="#faq" class="nav-link" @click="closeMenu">FAQ</a></li>
        </ul>
      </nav>
      
      <div class="header-cta">
        <!-- Przełącznik motywu (Jasny / Ciemny) -->
        <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'">
          <Sun v-if="isDark" />
          <Moon v-else />
        </button>

        <a href="#contact" class="btn btn-secondary btn-nav">Zapisz się!</a>
        <button class="mobile-nav-toggle" id="navToggle" @click="toggleMenu" :aria-label="isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'" :aria-expanded="isMenuOpen" aria-controls="mainNav">
          <X v-if="isMenuOpen" />
          <Menu v-else />
        </button>
      </div>
    </div>
  </header>
</template>
