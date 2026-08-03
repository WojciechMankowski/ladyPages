import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    // @lucide/vue to pojedynczy barrel ~1,5 MB — wymuszamy jednorazową,
    // przewidywalną pre-optymalizację, żeby cache był stabilny i start szybki.
    include: ['@lucide/vue'],
  },
})
