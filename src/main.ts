import { createApp } from 'vue'
import { createGtag } from 'vue-gtag'
import './style.css'
import App from './App.vue'

const app = createApp(App)

const gaId = (import.meta.env.VITE_GA_ID ?? '').trim()
if (gaId) {
  app.use(
    createGtag({
      tagId: gaId,
      // Skrypt gtag.js jest wstrzykiwany ręcznie (useAnalytics) dopiero po
      // zaakceptowaniu plików cookies w banerze CookieConsent.
      initMode: 'manual',
      consentMode: 'denied',
      config: { anonymize_ip: true },
    }),
  )
}

app.mount('#app')
