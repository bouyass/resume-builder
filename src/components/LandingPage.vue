<template>
  <div class="landing-container">
    <div class="nav-bar">
      <div class="logo">{{ t('landing.logo') }}</div>
      <div class="nav-right">
        <div class="language-selector">
          <div class="custom-select" @click.stop="toggleDropdown">
            <div class="selected-option">
              <img 
                :src="`https://flagsapi.com/${getCurrentFlag()}/flat/24.png`"
                :alt="`${getCurrentLanguage()} flag`"
                class="flag-icon"
              />
              {{ getCurrentLanguage() }}
              <span class="select-arrow"></span>
            </div>
            <div class="select-options" v-if="showDropdown">
              <div 
                v-for="lang in availableLocales" 
                :key="lang.code"
                class="select-option"
                @click="selectLanguage(lang.code)"
              >
                <img 
                  :src="`https://flagsapi.com/${lang.flag}/flat/24.png`"
                  :alt="`${lang.name} flag`"
                  class="flag-icon"
                />
                {{ lang.name }}
              </div>
            </div>
          </div>
        </div>
        <router-link to="/resume" class="nav-cta">
          {{ t('landing.create_resume') }}
        </router-link>
      </div>
    </div>
    <div class="main-content">
      <div class="hero-section">
        <div class="content">
          <h1 class="title">{{ t('landing.hero.title') }}</h1>
          <p class="subtitle">{{ t('landing.hero.subtitle') }}</p>
          <div class="cta-group">
            <router-link to="/resume" class="cta-button primary">
              {{ t('landing.hero.get_started') }}
              <span class="arrow">→</span>
            </router-link>
            <a href="#features" class="cta-button secondary">
              {{ t('landing.hero.learn_more') }}
            </a>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="floating-card card-1">
            <div class="card-content">
              <div class="resume-preview">
                <img 
                  src="https://d.novoresume.com/images/doc/minimalist-resume-template.png" 
                  alt="Modern Resume Template" 
                  class="resume-image"
                />
                <div class="glow-effect"></div>
              </div>
            </div>
          </div>
          <div class="floating-card card-2">
            <div class="card-content">
              <div class="resume-preview">
                <img 
                  src="https://d.novoresume.com/images/doc/functional-resume-template.png" 
                  alt="Professional Resume Example" 
                  class="resume-image"
                />
                <div class="glow-effect"></div>
              </div>
            </div>
          </div>
          <div class="floating-card card-3">
            <div class="card-content">
              <div class="resume-preview">
                <img 
                  src="https://d.novoresume.com/images/doc/modern-resume-template.png" 
                  alt="Creative Resume Template" 
                  class="resume-image"
                />
                <div class="glow-effect"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="features" id="features">
        <div class="feature-card">
          <div class="icon">🚀</div>
          <h3>{{ t('landing.features.ai.title') }}</h3>
          <p>{{ t('landing.features.ai.description') }}</p>
        </div>
        <div class="feature-card">
          <div class="icon">⚡</div>
          <h3>{{ t('landing.features.fast.title') }}</h3>
          <p>{{ t('landing.features.fast.description') }}</p>
        </div>
        <div class="feature-card">
          <div class="icon">🎯</div>
          <h3>{{ t('landing.features.ats.title') }}</h3>
          <p>{{ t('landing.features.ats.description') }}</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from './Footer.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const showDropdown = ref(false)

const availableLocales = [
  { code: 'en', name: 'English', dir: 'ltr', flag: 'GB' },
  { code: 'fr', name: 'Français', dir: 'ltr', flag: 'FR' },
  { code: 'es', name: 'Español', dir: 'ltr', flag: 'ES' },
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: 'SA' }
]

const getCurrentLanguage = () => {
  return availableLocales.find(lang => lang.code === locale.value)?.name || 'English'
}

const getCurrentFlag = () => {
  return availableLocales.find(lang => lang.code === locale.value)?.flag || 'GB'
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectLanguage = (code: string) => {
  locale.value = code
  document.documentElement.dir = availableLocales.find(l => l.code === code)?.dir || 'ltr'
  setTimeout(() => {
    showDropdown.value = false
  }, 100)
}
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow-y: auto;
}

/* Animated background elements */
.landing-container::before,
.landing-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, #60a5fa, #a78bfa);
  filter: blur(100px);
  opacity: 0.15;
  animation: floatBubble 20s infinite;
}

.landing-container::before {
  top: -100px;
  right: -100px;
  animation-delay: -5s;
}

.landing-container::after {
  bottom: -100px;
  left: -100px;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes floatBubble {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, 50px) scale(1.2); }
  50% { transform: translate(0, 100px) scale(1); }
  75% { transform: translate(-50px, 50px) scale(0.8); }
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-cta {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.nav-cta:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-selector {
  position: relative;
}

.custom-select {
  position: relative;
  width: 160px;
}

.selected-option {
  display: flex;
  align-items: center;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.8rem;
  height: 0.8rem;
  background: linear-gradient(45deg, #60a5fa, #a78bfa);
  clip-path: polygon(50% 75%, 0% 25%, 100% 25%);
  pointer-events: none;
}

.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: #1e293b;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.select-option {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-option:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #60a5fa;
}

.flag-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}

[dir="rtl"] .select-arrow {
  right: auto;
  left: 1rem;
}

[dir="rtl"] .flag-icon {
  margin-right: 0;
  margin-left: 8px;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  position: relative;
  max-width: 70rem;
  max-height: 33rem;
  margin: 6rem auto;
  box-sizing: border-box;
  flex: 1;
  gap: 0rem;
  backdrop-filter: blur(10px);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: auto;
}

.content {
  max-width: 600px;
  z-index: 1;
  flex-shrink: 0;
}

.title {
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #60a5fa, #a78bfa, #60a5fa);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.cta-group {
  display: flex;
  gap: 1rem;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.arrow {
  transition: transform 0.3s ease;
}

.cta-button.primary:hover .arrow {
  transform: translateX(5px);
}

.hero-visual {
  position: relative;
  width: 25%;
  height: 50vh;
  min-width: 300px;
  perspective: 1000px;
}

.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0.1rem;
  box-sizing: border-box;
}

.resume-preview {
  position: relative;
  width: 85%;
  height: 90%;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.resume-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.1rem;
  box-sizing: border-box;
  transition: transform 0.5s ease;
}

.glow-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 20%,
    rgba(96, 165, 250, 0.2),
    rgba(167, 139, 250, 0.2),
    transparent 80%
  );
  animation: glow 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform: rotate(45deg);
}

@keyframes glow {
  0% { transform: rotate(45deg) translateY(0%); }
  100% { transform: rotate(45deg) translateY(100%); }
}

.resume-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    125deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.2) 45%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.2) 55%,
    transparent 60%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.floating-card {
  position: absolute;
  margin-top: 3rem;
  width: 85%;
  height: 42vh;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.4s ease;
  z-index: 1;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  animation: float 6s ease-in-out infinite, pulse 3s ease-in-out infinite;
}

.floating-card:hover {
  transform: scale(1.15) translateY(-10px);
  z-index: 10;
  box-shadow: 0 20px 40px rgba(96, 165, 250, 0.3);
  border-color: rgba(96, 165, 250, 0.3);
  animation-play-state: paused;
}

.floating-card:hover .resume-image {
  transform: scale(1.2);
}

.floating-card:hover .resume-preview::after {
  transform: translateX(100%);
}

.card-1 {
  top: 0;
  right: -20px;
  animation-delay: 0s;
  transform: rotate(5deg);
  z-index: 2;
}

.card-2 {
  bottom: 30px;
  left: -20px;
  animation-delay: -2s;
  transform: rotate(-5deg);
  z-index: 1;
}

.card-3 {
  top: 25%;
  right: 0;
  transform: translateY(-50%) rotate(3deg);
  animation-delay: -4s;
  z-index: 1;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 1400px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.feature-card {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.feature-card p {
  color: #94a3b8;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.2); }
  70% { box-shadow: 0 0 0 20px rgba(96, 165, 250, 0); }
  100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
}

@media (max-width: 1490px) {
  .hero-section {
    flex-direction: column;
    padding: 1rem;
    text-align: center;
    flex: 0;
    gap: 2rem;
    margin-top: 5rem;
    margin-bottom: 5rem;
    height: auto;
    width: 94%;
  }

  .features {
    width: 94%;
  }

  .hero-visual {
    display: none;
  }

  .content {
    width: 100%;
    padding: 0 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .cta-group {
    justify-content: center;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
    .hero-section {
        margin-top: 5rem;
        width: 94%;
    }
  .content {
    padding: 0 1rem;
  }

  .title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .features {
    display: flex;
    flex-direction: column;
    margin: 1rem;
    padding: 1.5rem;
  }

  .feature-card {
    padding: 0.75rem;
  }

  .feature-card p {
    font-size: 0.9rem;
  }

  .landing-container {
    padding: 0;
    height: auto;
  }

  .floating-card {
    height: 250px;
    margin-top: 1rem;
  }

  .card-1 {
    top: -10px;
    right: -10px;
  }

  .card-2 {
    bottom: 30px;
    left: -10px;
  }

  .card-3 {
    display: none;
  }
}

@media (max-width: 480px) {

    .hero-section {
        margin-top: 5rem;
        width: 94%;
    }

  .hero-visual {
    height: 250px;
  }

  .floating-card {
    height: 200px;
  }

  .title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .cta-group {
    flex-direction: column;
    gap: 0.8rem;
  }

  .cta-button {
    width: 100%;
    text-align: center;
    padding: 0.8rem;
  }

  .features {
    gap: 1rem;
  }
}

/* Height adjustments for different screen sizes */
@media (min-height: 900px) {

    .hero-section {
        margin-top: 5rem;
        width: 94%;
    }

  .hero-visual {
    height: 40vh;
  }
  .floating-card {
    height: 35vh;
  }
}

@media (min-height: 1200px) {

    .hero-section {
        margin-top: 5rem;
        width: 94%;
    }

  .hero-visual {
    height: 35vh;
  }
  .floating-card {
    height: 30vh;
  }
}

@media (max-height: 800px) {
  .hero-visual {
    height: 40vh;
  }
  .floating-card {
    height: 38vh;
  }
}

@media (max-height: 600px) {
    .hero-section {
        margin-top: 5rem;
        width: 94%;
    }
  .hero-visual {
    height: 40vh;
  }
  .floating-card {
    height: 35vh;
  }
}
</style>
  