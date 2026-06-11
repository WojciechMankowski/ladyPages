<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, X, Sun, Moon } from '@lucide/vue';

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const isDark = ref(true);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    isDark.value = false;
    document.documentElement.classList.add('light');
  } else {
    isDark.value = true;
    document.documentElement.classList.remove('light');
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }
};

// Listener dla zmian systemowych w preferencjach motywu
let mediaQuery: MediaQueryList;
const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches;
    if (e.matches) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  initTheme();
  
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleSystemThemeChange);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }
});
</script>

<template>
  <header :class="['main-header', { scrolled: isScrolled }]">
    <div class="container header-container">
      <a href="#" class="logo" @click="closeMenu">
        <span class="logo-accent">&lt;</span>WM<span class="logo-accent"> /&gt;</span>
        <span class="logo-text">Wojciech Mankowski</span>
      </a>
      
      <nav :class="['main-nav', { active: isMenuOpen }]" id="mainNav">
        <ul>
          <li><a href="#problem" class="nav-link" @click="closeMenu">Znasz to?</a></li>
          <li><a href="#ebook" class="nav-link" @click="closeMenu">Co w ebooku?</a></li>
          <li><a href="#fears" class="nav-link" @click="closeMenu">Bez obaw</a></li>
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

        <a href="#contact" class="btn btn-secondary btn-nav">Odbierz Ebook</a>
        <button class="mobile-nav-toggle" id="navToggle" @click="toggleMenu" :aria-label="isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'">
          <X v-if="isMenuOpen" />
          <Menu v-else />
        </button>
      </div>
    </div>
  </header>
</template>
