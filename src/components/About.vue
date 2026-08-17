<script setup lang="ts">
import avatar380Avif from '../assets/avatar-380.avif'
import avatar760Avif from '../assets/avatar-760.avif'
import avatar380Jpg from '../assets/avatar-380.jpg'
import avatar760Jpg from '../assets/avatar-760.jpg'
</script>

<template>
	<section class="about" id="about">
		<div class="container about-grid">
			<div class="about-visual">
				<div class="avatar-frame">
					<picture>
						<source :srcset="`${avatar380Avif} 1x, ${avatar760Avif} 2x`" type="image/avif" />
						<source :srcset="`${avatar380Jpg} 1x, ${avatar760Jpg} 2x`" type="image/jpeg" />
						<img
							:src="avatar760Jpg"
							alt="Wojciech Mankowski"
							class="avatar-img"
							width="380"
							height="380"
							loading="lazy" />
					</picture>
					<div class="experience-badge">
						<span class="exp-years">2</span>
						<span class="exp-text">Lat w IT</span>
					</div>
				</div>
			</div>
			<div class="about-content">
				<span class="section-tag">Kto za tym stoi</span>
				<h2 class="section-title">Wojciech Mankowski</h2>
				<p class="about-text">
					Automatyzuję procesy w firmie logistycznej. Od trzech lat buduję rozwiązania w Power Automate i Power Apps dla
					osób nietechnicznych, w wielu różnych działach. W każdej firmie jest sporo czynności, które wykonuje się tak
					samo od lat, chociaż dałoby się je usprawnić.
				</p>
				<p class="about-text">
					Najpierw skończyłem socjologię, potem informatykę. Socjologia nauczyła mnie rozmawiać z ludźmi i wyciągać od
					nich to, co naprawdę robią przy biurku. Informatyka dała narzędzia do rozwiązania tego, co usłyszę. Dlatego
					zaczynam od rozmowy z człowiekiem, a rozwiązanie dopasowuję do jego pracy, nie odwrotnie. Wystąpienia na MS
					Tech Summit, Global Power Platform Bootcamp i innych konferencjach branżowych mam za sobą. Ebook piszę na
					podstawie tego, jak sam uczyłem się tworzyć automatyzacje w tym narzędziu.
				</p>
			</div>
		</div>
	</section>
</template>
