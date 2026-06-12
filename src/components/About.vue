<script setup lang="ts">
import { ShieldCheck } from '@lucide/vue';
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

.certifications-list {
  margin-top: 20px;
}
</style>
