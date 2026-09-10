/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      // Multi-page: strona główna (index.html) + osobna strona dodatku
      // (dodatek.html montuje src/dodatek.ts).
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        dodatek: fileURLToPath(new URL('./dodatek.html', import.meta.url)),
      },
    },
  },
  optimizeDeps: {
    // @lucide/vue to pojedynczy barrel ~1,5 MB — wymuszamy jednorazową,
    // przewidywalną pre-optymalizację, żeby cache był stabilny i start szybki.
    include: ['@lucide/vue'],
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules/**', 'dist/**', 'e2e/**'],
  },
})
