<script setup lang="ts">
import { AlertTriangle, Smile, ShieldAlert, Cpu, HeartHandshake, Key } from '@lucide/vue';
</script>

<template>
  <div>
    <!-- Section: Znasz to? (Problem & Promise) -->
    <section class="projects" id="problem">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Czy to brzmi znajomo?</span>
          <h2 class="section-title">Codziennie rano zaczynasz tak samo...</h2>
        </div>

        <div class="problem-promise-grid">
          <!-- Problem (Znasz to?) -->
          <div class="glass-card problem-card">
            <div class="card-icon-header red-glow">
              <AlertTriangle class="icon-red" />
              <h3>Codzienna rutyna w biurze</h3>
            </div>
            <ul class="problem-list">
              <li>Kopiujesz te same dane z jednego pliku do drugiego</li>
              <li>Wysyłasz powtarzalne maile do tych samych osób co tydzień</li>
              <li>Sklejasz ręcznie raport, który w zeszłym miesiącu wyglądał identycznie</li>
            </ul>
            <p class="problem-impact">
              To aż <strong>5 godzin tygodniowo</strong>. Ponad <strong>20 godzin miesięcznie</strong>. Pół tygodnia pracy, którego nikt nie zobaczy w Twoim CV, bo to „tylko” mechaniczne przeklikiwanie.
            </p>
            <p class="problem-thought">
              I za każdym razem ta sama myśl: <em>„Musi być na to lepszy sposób...”</em> a zaraz po niej: <em>„...ale to pewnie dla informatyków”</em>. <strong>Nie jest.</strong>
            </p>
          </div>

          <!-- Promise (Wyobraź sobie) -->
          <div class="glass-card promise-card">
            <div class="card-icon-header green-glow">
              <Smile class="icon-green" />
              <h3>Wyobraź sobie inny poniedziałek</h3>
            </div>
            <p class="promise-lead">
              Poniedziałek, godzina 8:00. Otwierasz skrzynkę pocztową.
            </p>
            <p class="promise-text">
              Raport, który przez ostatni rok robiłaś ręcznie, <strong>już tam jest</strong>. Zebrany, posortowany, wysłany do szefa automatycznie w niedzielę wieczorem. Sam.
            </p>
            <p class="promise-text">
              Ty nawet nie zdążyłaś jeszcze zaparzyć porannej kawy ani usiąść do biurka.
            </p>
            <div class="promise-footer">
              <p>To nie magia i nie programowanie. To tylko <strong>45 minut konfiguracji</strong>, którą zrobisz raz, a która pracuje za Ciebie każdego dnia.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Czego nie musisz się bać (Rozbijanie obaw) -->
    <section class="fears-section" id="fears">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Bez obaw</span>
          <h2 class="section-title">Czego NIE musisz się bać?</h2>
          <p class="section-desc">Klienci często mają obawy przed automatyzacją. Oto dlaczego w tym przypadku są one zupełnie niepotrzebne:</p>
        </div>

        <div class="fears-grid">
          <!-- Fear 1 -->
          <div class="fear-card">
            <div class="fear-icon-box">
              <Cpu />
            </div>
            <h3 class="fear-title">„To nie jest programowanie”</h3>
            <p class="fear-desc">
              Nie napiszesz ani jednej linijki kodu. W Power Automate klikasz, przeciągasz kafelki i wybierasz opcje z list, dokładnie tak, jak w każdym innym programie biurowym.
            </p>
          </div>

          <!-- Fear 2 -->
          <div class="fear-card">
            <div class="fear-icon-box">
              <HeartHandshake />
            </div>
            <h3 class="fear-title">„To nie zabierze Ci pracy, zabierze Ci nudę”</h3>
            <p class="fear-desc">
              Automatyzacja przejmuje mechaniczne przeklikiwanie. Ty zyskasz czas na to, czego żaden program nie zrobi: myślenie, podejmowanie decyzji i rozmowy z ludźmi.
            </p>
          </div>

          <!-- Fear 3 -->
          <div class="fear-card">
            <div class="fear-icon-box">
              <ShieldAlert />
            </div>
            <h3 class="fear-title">„Nie musisz prosić działu IT”</h3>
            <p class="fear-desc">
              Wszystko działa na narzędziach, które już masz licencjonowane w firmowym Microsoft 365. Nie musisz wysyłać zgłoszeń i czekać tygodniami w kolejce helpdesku.
            </p>
          </div>

          <!-- Fear 4 -->
          <div class="fear-card">
            <div class="fear-icon-box">
              <Key />
            </div>
            <h3 class="fear-title">„Nie musisz nic instalować ani niczego nie zepsujesz”</h3>
            <p class="fear-desc">
              Zaczynasz od jednego, małego przepływu. Wszystko konfigurujesz w przeglądarce. Jeśli coś nie zadziała, po prostu jednym kliknięciem wyłączasz przepływ.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.problem-promise-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.glass-card {
  background: var(--bg-glass-heavy);
  border: 1px solid var(--border-glass);
  border-radius: var(--border-radius-lg);
  padding: 40px;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
}

.card-icon-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 15px;
}

.card-icon-header h3 {
  font-size: 1.4rem;
}

.icon-red {
  color: #ef4444;
  width: 28px;
  height: 28px;
}

.icon-green {
  color: #10b981;
  width: 28px;
  height: 28px;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
  list-style: none;
}

.problem-list li {
  position: relative;
  padding-left: 28px;
  color: var(--text-primary);
}

.problem-list li::before {
  content: '✕';
  position: absolute;
  left: 0;
  color: #ef4444;
  font-weight: bold;
}

.problem-impact {
  font-size: 1.05rem;
  margin-bottom: 20px;
}

.problem-thought {
  font-size: 0.95rem;
  color: var(--text-muted);
  border-left: 3px solid #ef4444;
  padding-left: 15px;
  margin-top: auto;
}

.promise-lead {
  font-size: 1.2rem;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 20px;
}

.promise-text {
  margin-bottom: 20px;
  font-size: 1rem;
}

.promise-footer {
  margin-top: auto;
  padding: 20px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px dashed rgba(16, 185, 129, 0.2);
  border-radius: var(--border-radius-sm);
  color: var(--text-primary);
}

.promise-footer strong {
  color: #10b981;
}

/* Fears Section styles */
.fears-section {
  padding: var(--section-padding);
  background-color: var(--bg-primary);
}

.fears-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
}

.fear-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: var(--border-radius-md);
  padding: 35px;
  transition: all var(--transition-normal);
}

.fear-card:hover {
  transform: translateY(-5px);
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.05);
}

.fear-icon-box {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-sm);
  background: rgba(139, 92, 246, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 1.35rem;
}

.fear-title {
  font-size: 1.15rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.fear-desc {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .problem-promise-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
