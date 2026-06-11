<script setup lang="ts">
import { ShieldCheck, MessageSquare } from '@lucide/vue';
import avatar from '../assets/avatar.png';
</script>

<template>
  <section class="about" id="about">
    <div class="container about-grid">
      <div class="about-visual">
        <div class="avatar-frame">
          <img :src="avatar" alt="Wojciech Mankowski" class="avatar-img">
          <div class="experience-badge">
            <span class="exp-years">5+</span>
            <span class="exp-text">Lat w IT</span>
          </div>
        </div>
      </div>
      <div class="about-content">
        <span class="section-tag">Kto za tym stoi</span>
        <h2 class="section-title">Wojciech Mankowski</h2>
        <p class="about-lead">Tłumaczę technologię na język biurowy. Pomagam ujarzmić narzędzia, których się boisz.</p>
        <p class="about-text">
          Nazywam się Wojciech Mankowski. Na co dzień zajmuję się automatyzacją procesów biznesowych i projektowaniem architektury low-code. Od lat obserwuję, jak pracownicy biurowi marnują cenne godziny na powtarzalne, nudne czynności tylko dlatego, że nikt nie pokazał im, jak prosto można je zautomatyzować.
        </p>
        <p class="about-text">
          Moja misja jest prosta: <strong>chcę pomóc Ci odzyskać Twój czas</strong>. Nie pokażę Ci niczego, czego sam bym nie przetestował w boju. I obiecuję: w moich materiałach nie znajdziesz ani jednego słowa trudnego żargonu IT, którego nie zrozumiałaby Twoja koleżanka z działu księgowości czy administracji.
        </p>
        
        <!-- Social Proof Quote / Testimonial -->
        <div class="testimonial-box">
          <div class="quote-icon-wrapper">
            <MessageSquare class="quote-icon" />
          </div>
          <blockquote class="quote-text">
            „Te same przepływy, które Wojciech opisuje w ebooku, oszczędzają mi ponad 8 godzin pracy w każdym tygodniu. Przestałam bać się Power Automate, bo wreszcie ktoś wyjaśnił to po ludzku, na życiowych przykładach z Excela!”
          </blockquote>
          <cite class="quote-author">- Krystyna, Specjalistka ds. Administracji i Kadr</cite>
        </div>

        <div class="certifications-list">
          <div class="cert-item">
            <ShieldCheck class="cert-icon" />
            <span>Certyfikowany Microsoft Power Platform Solution Architect</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonial-box {
  margin-top: 30px;
  background: rgba(139, 92, 246, 0.03);
  border: 1px dashed rgba(139, 92, 246, 0.2);
  border-radius: var(--border-radius-md);
  padding: 25px;
  position: relative;
  width: 100%;
}

.quote-icon-wrapper {
  color: var(--primary);
  opacity: 0.3;
  margin-bottom: 10px;
}

.quote-icon {
  width: 24px;
  height: 24px;
}

.quote-text {
  font-size: 0.95rem;
  font-style: italic;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.quote-author {
  font-size: 0.85rem;
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--text-muted);
  display: block;
}

.certifications-list {
  margin-top: 20px;
}
</style>
