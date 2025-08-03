<template>
  <div class="landing-container">
    <!-- Navigation Bar -->
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

    <!-- Main Content -->
    <div class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="content">
          <!-- Speed Badge -->
          <div class="speed-badge">
            <div class="speed-icon">⚡</div>
            <span> {{ t('landing.hero.readyInFiveMinutes') }} </span>
          </div>
          
          <h1 class="title">{{ t('landing.hero.title') }}</h1>
          <p class="subtitle">{{ t('landing.hero.subtitle') }}</p>
          
          <!-- Trust Indicators -->
          <div class="trust-indicators">
            <div class="trust-item">
              <div class="trust-number">3K+</div>
              <div class="trust-label"> {{ t('landing.hero.createdResume') }} </div>
            </div>
            <div class="trust-item">
              <div class="trust-number"> 50+ </div>
              <div class="trust-label"> {{ t('landing.hero.timeSaved') }} </div>
            </div>
            <div class="trust-item">
              <div class="trust-number">4.9/5</div>
              <div class="trust-label"> {{ t('landing.hero.userRating') }} </div>
            </div>
          </div>

          <div class="cta-group">
            <router-link to="/resume" class="cta-button primary">
              <span class="cta-text">{{ t('landing.hero.get_started') }}</span>
              <div class="cta-timer">
                <span class="timer-icon">⏱️</span>
                <span>5 min</span>
              </div>
              <span class="arrow">→</span>
            </router-link>
            <a href="#features" class="cta-button secondary">
              {{ t('landing.hero.learn_more') }}
              <span class="secondary-arrow">↓</span>
            </a>
          </div>
        </div>
        
        <!-- Enhanced Visual Section -->
        <div class="hero-visual">
          <!-- Floating Timer -->
          <div class="floating-timer">
            <div class="timer-content">
              <div class="timer-display">05:00</div>
              <div class="timer-label">Minutes to Success</div>
            </div>
          </div>

          <!-- Enhanced Resume Cards -->
          <div class="floating-card card-1">
            <div class="card-header">
              <div class="status-dot active"></div>
              <span class="card-title">Modern Template</span>
            </div>
            <div class="card-content">
              <div class="resume-preview">
                <img 
                  src="https://d.novoresume.com/images/doc/minimalist-resume-template.png" 
                  alt="Modern Resume Template" 
                  class="resume-image"
                />
                <div class="glow-effect"></div>
                <div class="creation-progress">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <span class="progress-text">Creating...</span>
                </div>
              </div>
            </div>
          </div>

          <div class="floating-card card-2">
            <div class="card-header">
              <div class="status-dot completed"></div>
              <span class="card-title">Professional</span>
            </div>
            <div class="card-content">
              <div class="resume-preview">
                <img 
                  src="https://d.novoresume.com/images/doc/functional-resume-template.png" 
                  alt="Professional Resume Example" 
                  class="resume-image"
                />
                <div class="glow-effect"></div>
                <div class="completion-badge">
                  <span class="check-icon">✓</span>
                </div>
              </div>
            </div>
          </div>

          <div class="floating-card card-3">
            <div class="card-header">
              <div class="status-dot pending"></div>
              <span class="card-title">Creative</span>
            </div>
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

          <!-- Floating Elements -->
          <div class="floating-element element-1">
            <div class="floating-icon">🎯</div>
            <span>ATS Optimized</span>
          </div>
          <div class="floating-element element-2">
            <div class="floating-icon">🚀</div>
            <span>AI Powered</span>
          </div>
          <div class="floating-element element-3">
            <div class="floating-icon">⚡</div>
            <span>Lightning Fast</span>
          </div>
        </div>
      </div>

      <!-- Speed Process Section -->
      <div class="speed-process">
        <h2 class="process-title"> {{ t('landing.hero.fromZeroToHired') }} </h2>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3> {{ t('landing.hero.fillContent') }} </h3>
              <p>3 {{ t('landing.hero.minutes') }}</p>
            </div>
          </div>
          <div class="step-connector">
            <div class="connector-line"></div>
            <div class="connector-arrow">→</div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3> {{ t('landing.hero.chooseTemplate') }} </h3>
              <p>4 {{ t('landing.hero.minutes') }}</p>
            </div>
          </div>
          <div class="step-connector">
            <div class="connector-line"></div>
            <div class="connector-arrow">→</div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3> {{ t('landing.hero.downloadResume') }} </h3>
              <p>4.5 {{ t('landing.hero.minutes') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Features -->
      <div class="features" id="features">
        <div class="feature-card main-feature">
          <div class="feature-icon">🚀</div>
          <h3>{{ t('landing.features.ai.title') }}</h3>
          <p>{{ t('landing.features.ai.description') }}</p>
          <div class="feature-highlight"> {{ t('landing.features.ai.title') }} </div>
        </div>
        <div class="feature-card main-feature">
          <div class="feature-icon">⚡</div>
          <h3>{{ t('landing.features.fast.title') }}</h3>
          <p>{{ t('landing.features.fast.description') }}</p>
          <div class="feature-highlight"> {{ t('landing.features.fast.title') }} </div>
        </div>
        <div class="feature-card main-feature">
          <div class="feature-icon">🎯</div>
          <h3>{{ t('landing.features.ats.title') }}</h3>
          <p>{{ t('landing.features.ats.description') }}</p>
          <div class="feature-highlight">{{ t('landing.features.ats.highlight') }}</div>
        </div>
      </div>
          <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import Footer from './Footer.vue'
import { ref, onMounted } from 'vue'
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

// Timer countdown animation
onMounted(() => {
  const timerDisplay = document.querySelector('.timer-display')
  if (timerDisplay) {
    let seconds = 300 // 5 minutes
    const countdown = setInterval(() => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
      seconds--
      if (seconds < 0) {
        seconds = 300 // Reset
      }
    }, 50) 
  }
})
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #020617, #0f172a, #1e293b, #0f172a);
  background-size: 400% 400%;
  animation: gradientBG 20s ease infinite;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow-x: hidden;
}

/* Enhanced background effects */
.landing-container::before,
.landing-container::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.15), transparent);
  filter: blur(120px);
  animation: floatBubble 25s infinite;
  z-index: 0;
}

.landing-container::before {
  top: -150px;
  right: -150px;
  animation-delay: -5s;
}

.landing-container::after {
  bottom: -150px;
  left: -150px;
  animation-delay: -15s;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}

@keyframes floatBubble {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(100px, 50px) scale(1.3) rotate(90deg); }
  50% { transform: translate(-50px, 100px) scale(0.8) rotate(180deg); }
  75% { transform: translate(-100px, -50px) scale(1.1) rotate(270deg); }
}

/* Enhanced Navigation */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(2, 6, 23, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.logo {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(45deg, #60a5fa, #a78bfa, #fbbf24);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.nav-cta {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 12px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.nav-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.selected-option:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(96, 165, 250, 0.5);
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
  transition: transform 0.3s ease;
}

.custom-select:hover .select-arrow {
  transform: translateY(-50%) rotate(180deg);
}

.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.select-option {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-option:hover {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

.flag-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 10px;
  border-radius: 4px;
}

.main-content {
  height: 80vh;
}

/* Enhanced Hero Section */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem;
  position: relative;
  max-width: 75rem;
  margin: 8rem auto 4rem;
  box-sizing: border-box;
  gap: 3rem;
  backdrop-filter: blur(20px);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.content {
  max-width: 650px;
  z-index: 2;
  flex-shrink: 0;
}

/* Speed Badge */
.speed-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.speed-icon {
  font-size: 1.2rem;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}

.title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #fbbf24, #60a5fa);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
  animation: shimmer 4s linear infinite;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.25rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 400;
}

/* Trust Indicators */
.trust-indicators {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.trust-item {
  text-align: center;
}

.trust-number {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
}

.trust-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Enhanced CTA Buttons */
.cta-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cta-button {
  padding: 1.25rem 2rem;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cta-button.primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  background-size: 200% auto;
  color: white;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  position: relative;
  overflow: hidden;
}

.cta-button.primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.cta-button.primary:hover::before {
  left: 100%;
}

.cta-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(59, 130, 246, 0.5);
  background-position: 100% 0;
}

.cta-timer {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}

.timer-icon {
  font-size: 0.9rem;
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-button.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.arrow, .secondary-arrow {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.cta-button.primary:hover .arrow {
  transform: translateX(5px);
}

.cta-button.secondary:hover .secondary-arrow {
  transform: translateY(3px);
}

/* Enhanced Hero Visual */
.hero-visual {
  position: relative;
  width: 35%;
  height: 60vh;
  min-width: 400px;
  perspective: 1200px;
  z-index: 1;
}

/* Floating Timer */
.floating-timer {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(16, 185, 129, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

.timer-content {
  text-align: center;
}

.timer-display {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  font-family: monospace;
}

.timer-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.25rem;
  font-weight: 600;
}

/* Enhanced Floating Cards */
.floating-card {
  position: absolute;
  width: 90%;
  height: 45vh;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: all 0.5s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
  animation: float 8s ease-in-out infinite;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.active {
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
}

.status-dot.completed {
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
}

.status-dot.pending {
  background: #f59e0b;
  box-shadow: 0 0 10px #f59e0b;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 60px);
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
}

.resume-preview {
  position: relative;
  width: 85%;
  height: 90%;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.resume-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.2rem;
  box-sizing: border-box;
  transition: transform 0.6s ease;
}

.creation-progress {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 2px;
  animation: progressFill 3s ease-in-out infinite;
}

@keyframes progressFill {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.progress-text {
  font-size: 0.7rem;
  color: white;
  font-weight: 600;
}

.completion-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.check-icon {
  color: white;
  font-weight: bold;
  font-size: 1rem;
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
    rgba(96, 165, 250, 0.3),
    rgba(167, 139, 250, 0.3),
    transparent 80%
  );
  animation: glow 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform: rotate(45deg);
}

@keyframes glow {
  0% { transform: rotate(45deg) translateY(-100%); }
  100% { transform: rotate(45deg) translateY(100%); }
}

.floating-card:hover {
  transform: scale(1.1) translateY(-15px);
  z-index: 20;
  box-shadow: 0 25px 50px rgba(96, 165, 250, 0.4);
  border-color: rgba(96, 165, 250, 0.4);
}

.floating-card:hover .resume-image {
  transform: scale(1.1);
}

.card-1 {
  top: 10%;
  right: -10px;
  transform: rotate(8deg);
  z-index: 3;
  animation-delay: 0s;
}

.card-2 {
  bottom: 20%;
  left: -10px;
  transform: rotate(-8deg);
  z-index: 2;
  animation-delay: -2s;
}

.card-3 {
  top: 35%;
  right: 5%;
  transform: rotate(4deg);
  z-index: 1;
  animation-delay: -4s;
}

/* Floating Elements */
.floating-element {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  animation: floatElement 6s ease-in-out infinite;
  z-index: 5;
}

.floating-icon {
  font-size: 1rem;
}

.element-1 {
  top: 15%;
  left: -5%;
  animation-delay: -1s;
}

.element-2 {
  bottom: 15%;
  right: -5%;
  animation-delay: -3s;
}

.element-3 {
  top: 50%;
  left: -8%;
  animation-delay: -5s;
}

@keyframes floatElement {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Speed Process Section */
.speed-process {
  max-width: 75rem;
  margin: 4rem auto;
  padding: 3rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.process-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  animation: pulse 3s ease-in-out infinite;
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #10b981;
  font-weight: 600;
  font-size: 1rem;
}

.step-connector {
  display: flex;
  align-items: center;
  margin: 0 1rem;
  flex: 0.5;
}

.connector-line {
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  flex-grow: 1;
  animation: flowLine 2s ease-in-out infinite;
}

.connector-arrow {
  font-size: 1.5rem;
  color: #60a5fa;
  margin-left: 0.5rem;
  animation: bounceArrow 2s ease-in-out infinite;
}

@keyframes flowLine {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes bounceArrow {
  0%, 100% { transform: translateX(0px); }
  50% { transform: translateX(5px); }
}

/* Enhanced Features */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  margin: 4rem auto;
  max-width: 75rem;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.feature-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  text-align: center;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.1), transparent);
  transition: left 0.6s;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 15px 40px rgba(96, 165, 250, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
  font-weight: 700;
}

.feature-card p {
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-highlight {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

/* Responsive Design */
@media (max-width: 1490px) {
  .hero-section {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
    gap: 3rem;
    margin: 6rem auto 4rem;
    width: 90%;
  }

  .hero-visual {
    display: none;
  }

  .content {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .trust-indicators {
    justify-content: center;
  }

  .speed-process,
  .features {
    width: 90%;
  }

  .process-steps {
    flex-direction: column;
    gap: 2rem;
  }

  .step-connector {
    transform: rotate(90deg);
    margin: 1rem 0;
  }

  .connector-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 1rem;
  }

  .nav-right {
    gap: 1rem;
  }

  .language-selector {
    display: none;
  }

  .hero-section {
    margin-top: 5rem;
    padding: 1.5rem;
    width: 95%;
  }

  .content {
    padding: 0;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .trust-indicators {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-group {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }

  .speed-process {
    padding: 2rem 1rem;
    width: 95%;
  }

  .process-title {
    font-size: 2rem;
  }

  .features {
    padding: 2rem 1rem;
    width: 95%;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .step-connector {
    display: none;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .speed-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .trust-number {
    font-size: 1.25rem;
  }

  .trust-label {
    font-size: 0.75rem;
  }

  .process-title {
    font-size: 1.75rem;
  }

  .feature-icon {
    font-size: 2.5rem;
  }

  .feature-card h3 {
    font-size: 1.25rem;
  }
}

/* Animation delays for staggered effects */
.feature-card:nth-child(1) {
  animation-delay: 0.1s;
}

.feature-card:nth-child(2) {
  animation-delay: 0.2s;
}

.feature-card:nth-child(3) {
  animation-delay: 0.3s;
}

/* Enhanced pulse animation */
@keyframes pulse {
  0% { 
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.4);
    transform: scale(1);
  }
  70% { 
    box-shadow: 0 0 0 15px rgba(96, 165, 250, 0);
    transform: scale(1.05);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
    transform: scale(1);
  }
}

/* RTL Support */
[dir="rtl"] .select-arrow {
  right: auto;
  left: 1rem;
}

[dir="rtl"] .flag-icon {
  margin-right: 0;
  margin-left: 10px;
}

[dir="rtl"] .cta-button.primary:hover .arrow {
  transform: translateX(-5px);
}

[dir="rtl"] .trust-indicators {
  direction: rtl;
}

[dir="rtl"] .process-steps {
  direction: rtl;
}

[dir="rtl"] .connector-arrow {
  transform: scaleX(-1);
}

/* Loading animation for better perceived performance */
.landing-container {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>