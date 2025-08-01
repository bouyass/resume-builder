<template>
  <div class="resume-customizer">
    <!-- Fixed Header -->
    <div class="customizer-header">
      <div class="header-left">
        <svg
          class="logo"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Modern document shape -->
          <path
            d="M12 4C9.79086 4 8 5.79086 8 8V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V16L28 4H12Z"
            fill="url(#logoGradient)"
          />
          <!-- Folded corner effect -->
          <path
            d="M28 4V16H40L28 4Z"
            fill="rgba(255, 255, 255, 0.3)"
          />
          <!-- Stylized 'R' for Resume -->
          <path
            d="M20 20H28C29.1046 20 30 20.8954 30 22V24C30 25.1046 29.1046 26 28 26H20V20ZM20 26H24L28 32H24L20 26Z"
            fill="white"
          />
          <!-- Abstract lines representing text -->
          <path
            d="M18 34H30M18 38H26"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
          <defs>
            <linearGradient
              id="logoGradient"
              x1="8"
              y1="4"
              x2="40"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <h1>{{ t('customizer.title') }}</h1>
      </div>
      <div class="header-actions">
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
        <button class="generate-button" @click="generatePDF">
          <svg 
            class="generate-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
          {{ t('customizer.buttons.generate') }}
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="customizer-content">
      <div class="options-grid">
        <!-- Theme Card -->
        <div class="option-card">
          <h2>{{ t('customizer.theme.title') }}</h2>
          <div class="theme-grid">
            <div 
              v-for="theme in themes" 
              :key="theme.id"
              class="theme-item"
              :class="{ active: selectedTheme === theme.id }"
              @click="selectTheme(theme.id)"
            >
              <img :src="theme.preview" :alt="theme.name">
              <span>{{ theme.name }}</span>
            </div>
          </div>
        </div>

        <!-- Color Card -->
        <div class="option-card">
          <h2>{{ t('customizer.colors.title') }}</h2>
          <p class="color-info">
            {{ t('customizer.colors.selection_info') }}
          </p>
          <div class="color-grid">
            <div 
              v-for="(scheme, index) in selectedColors" 
              :key="scheme.id"
              class="color-item"
              :class="{ active: true }"
              @click="removeColor(index)"
            >
              <div class="color-preview" :style="{ background: scheme.primary }"></div>
              <div class="color-badge">{{ index + 1 }}</div>
              <span>{{ scheme.name }}</span>
            </div>
           
            <div 
              v-for="scheme in availableColors" 
              :key="scheme.id"
              class="color-item"
              @click="addColor(scheme)"
            >
              <div class="color-preview" :style="{ background: scheme.primary }"></div>
              <span>{{ scheme.name }}</span>
            </div>
          </div>
        </div>

        <!-- Font Card -->
        <div class="option-card">
          <h2>{{ t('customizer.fonts.title') }}</h2>
          <!-- Font Family Selection -->
          <div class="font-grid">
            <button 
              v-for="font in fonts" 
              :key="font.id"
              class="font-item"
              :class="{ active: selectedFont === font.id }"
              :style="{ fontFamily: font.family }"
              @click="selectFont(font.id)"
            >
              <span class="font-preview">{{ t('customizer.fonts.preview_text') }}</span>
              <span class="font-name">{{ font.name }}</span>
              <span class="font-description">{{ font.description }}</span>
            </button>
          </div>

          <!-- Text Size Controls -->
          <div class="text-size-controls">
            <h3>{{ t('customizer.fonts.text_size') }}</h3>
            <div class="size-controls">
              <label class="size-control">
                <span class="size-label">{{ t('customizer.fonts.base_size') }}</span>
                <div class="size-preview" :style="{ fontSize: `${sizing.text.base}px` }">
                  {{ t('customizer.fonts.preview_text') }}
                </div>
                <input 
                  type="range" 
                  v-model="sizing.text.base"
                  min="12"
                  max="24"
                  step="1"
                >
                <span class="value">{{ sizing.text.base }}px</span>
              </label>
              
              <label class="size-control" v-for="(scale, key) in sizing.text.scale" :key="key">
                <span class="size-label">{{ t(`customizer.fonts.sizes.${key}`) }}</span>
                <div class="size-preview" :style="{ fontSize: `${scale}em` }">
                  {{ t('customizer.fonts.preview_text') }}
                </div>
                <input 
                  type="range" 
                  v-model="sizing.text.scale[key]"
                  :min="key === 'small' ? 0.5 : 1"
                  :max="key.startsWith('h') ? 4 : 2"
                  step="0.1"
                >
                <span class="value">{{ scale }}em</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Sizing Card -->
        <div class="option-card">
          <h2>{{ t('customizer.sizing.title') }}</h2>
          <div class="sizing-options">
            <!-- Line and Paragraph Spacing -->
            <div class="sizing-group">
              <h3>{{ t('customizer.sizing.spacing') }}</h3>
              <label>
                {{ t('customizer.sizing.line_height') }}
                <input 
                  type="range" 
                  v-model="sizing.spacing.line" 
                  min="1" 
                  max="2" 
                  step="0.1"
                >
                <span class="value">{{ sizing.spacing.line }}×</span>
              </label>
              <label>
                {{ t('customizer.sizing.paragraph') }}
                <input 
                  type="range" 
                  v-model="sizing.spacing.paragraph" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                >
                <span class="value">{{ sizing.spacing.paragraph }}×</span>
              </label>
            </div>

            <!-- Margins -->
            <div class="sizing-group">
              <h3>{{ t('customizer.sizing.margins') }}</h3>
              <div class="margin-sliders">
                <label>
                  <span>{{ t('customizer.sizing.margins_top') }}</span>
                  <input 
                    type="range" 
                    v-model="sizing.margins.top" 
                    min="0.5" 
                    max="3" 
                    step="0.1"
                  >
                  <span class="value">{{ sizing.margins.top }}cm</span>
                </label>
                <label>
                  <span>{{ t('customizer.sizing.margins_right') }}</span>
                  <input 
                    type="range" 
                    v-model="sizing.margins.right" 
                    min="0.5" 
                    max="3" 
                    step="0.1"
                  >
                  <span class="value">{{ sizing.margins.right }}cm</span>
                </label>
                <label>
                  <span>{{ t('customizer.sizing.margins_bottom') }}</span>
                  <input 
                    type="range" 
                    v-model="sizing.margins.bottom" 
                    min="0.5" 
                    max="3" 
                    step="0.1"
                  >
                  <span class="value">{{ sizing.margins.bottom }}cm</span>
                </label>
                <label>
                  <span>{{ t('customizer.sizing.margins_left') }}</span>
                  <input 
                    type="range" 
                    v-model="sizing.margins.left" 
                    min="0.5" 
                    max="3" 
                    step="0.1"
                  >
                  <span class="value">{{ sizing.margins.left }}cm</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Paper Options -->
        <div class="option-card">
          <h2>{{ t('customizer.paper.title') }}</h2>
          <div class="paper-options">
            <!-- Additional Options -->
            <div class="additional-options">
              <div class="options-grid">
                <label class="switch-label">
                  <span>{{ t('customizer.paper.show_header') }}</span>
                  <label class="switch">
                    <input type="checkbox" v-model="paper.showHeader">
                    <span class="slider"></span>
                  </label>
                </label>
                
                <label class="switch-label">
                  <span>{{ t('customizer.paper.show_page_numbers') }}</span>
                  <label class="switch">
                    <input type="checkbox" v-model="paper.showPageNumbers">
                    <span class="slider"></span>
                  </label>
                </label>
                
                <label class="switch-label">
                  <span>{{ t('customizer.paper.show_borders') }}</span>
                  <label class="switch">
                    <input type="checkbox" v-model="paper.showBorders">
                    <span class="slider"></span>
                  </label>
                </label>
                
                <label class="switch-label">
                  <span>{{ t('customizer.paper.show_dates') }}</span>
                  <label class="switch">
                    <input type="checkbox" v-model="paper.showDates">
                    <span class="slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Order -->
        <div class="option-card">
          <h2>{{ t('customizer.sections.title') }}</h2>
          <div class="sections-manager">
            <div class="section-controls">
              <button 
                v-for="(section, index) in sectionOrder" 
                :key="section.id"
                class="section-control"
                :class="{ 'active': section.visible }"
              >
                <div class="section-drag">
                  <button 
                    class="move-btn" 
                    :disabled="index === 0"
                    @click="moveSection(index, 'up')"
                  >
                    ↑
                  </button>
                  <button 
                    class="move-btn"
                    :disabled="index === sectionOrder.length - 1"
                    @click="moveSection(index, 'down')"
                  >
                    ↓
                  </button>
                </div>
                <span class="section-name">{{ section.name }}</span>
                <label class="switch">
                  <input 
                    type="checkbox" 
                    v-model="section.visible"
                  >
                  <span class="slider"></span>
                </label>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n, type Locale } from 'vue-i18n'
import { useRouter } from 'vue-router'


const i18n = useI18n()
const { t } = i18n
const router = useRouter()

//console.log(store.getResumeData())

// Theme options

const themes = [
  { 
    id: 'modern', 
    name: 'Modern', 
    preview: 'https://picsum.photos/id/20/600/400'
  },
  { 
    id: 'classic', 
    name: 'Classic', 
    preview: 'https://picsum.photos/id/21/600/400'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    preview: 'https://picsum.photos/id/22/600/400'
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    preview: 'https://picsum.photos/id/23/600/400'
  }
]

// Color schemes
const colorSchemes = [
  { id: 'blue', name: t('customizer.colors.ocean_blue'), primary: '#2563eb', accent: '#60a5fa' },
  { id: 'green', name: t('customizer.colors.forest_green'), primary: '#059669', accent: '#34d399' },
  { id: 'purple', name: t('customizer.colors.royal_purple'), primary: '#7c3aed', accent: '#a78bfa' },
  { id: 'gray', name: t('customizer.colors.prof_gray'), primary: '#4b5563', accent: '#9ca3af' },
  { id: 'red', name: t('customizer.colors.ruby_red'), primary: '#dc2626', accent: '#f87171' },
  { id: 'orange', name: t('customizer.colors.sunset'), primary: '#ea580c', accent: '#fb923c' },
  { id: 'teal', name: t('customizer.colors.ocean_teal'), primary: '#0d9488', accent: '#2dd4bf' },
  { id: 'indigo', name: t('customizer.colors.midnight'), primary: '#4338ca', accent: '#818cf8' },
  { id: 'pink', name: t('customizer.colors.rose'), primary: '#db2777', accent: '#f472b6' },
  { id: 'amber', name: t('customizer.colors.autumn'), primary: '#d97706', accent: '#fbbf24' },
  { id: 'emerald', name: t('customizer.colors.emerald'), primary: '#059669', accent: '#34d399' },
  { id: 'slate', name: t('customizer.colors.slate'), primary: '#334155', accent: '#64748b' },
  { id: 'violet', name: t('customizer.colors.violet'), primary: '#7c3aed', accent: '#a78bfa' },
  { id: 'sky', name: t('customizer.colors.sky'), primary: '#0284c7', accent: '#38bdf8' },
  { id: 'lime', name: t('customizer.colors.lime'), primary: '#65a30d', accent: '#a3e635' },
  { id: 'rose', name: t('customizer.colors.rose_gold'), primary: '#be185d', accent: '#fb7185' }
]

// Font options with Google Fonts links
const fontFamilies = {
  poppins: "'Poppins', sans-serif",
  roboto: "'Roboto', sans-serif",
  opensans: "'Open Sans', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  playfair: "'Playfair Display', serif",
  merriweather: "'Merriweather', serif",
  lato: "'Lato', sans-serif",
  raleway: "'Raleway', sans-serif"
}

const fonts = [
  { 
    id: 'poppins', 
    name: 'Poppins', 
    family: fontFamilies.poppins,
    description: t('customizer.fonts.modern_clean')
  },
  { id: 'roboto', name: 'Roboto', family: fontFamilies.roboto },
  { id: 'opensans', name: 'Open Sans', family: fontFamilies.opensans },
  { id: 'montserrat', name: 'Montserrat', family: fontFamilies.montserrat },
  { id: 'playfair', name: 'Playfair Display', family: fontFamilies.playfair },
  { id: 'merriweather', name: 'Merriweather', family: fontFamilies.merriweather },
  { id: 'lato', name: 'Lato', family: fontFamilies.lato },
  { id: 'raleway', name: 'Raleway', family: fontFamilies.raleway }
]

// Selected options
const selectedTheme = ref('modern')
const selectedFont = ref('poppins')

// Add new state
const sizing = reactive({
  text: {
    base: 16,
    scale: {
      h1: 2.5,
      h2: 2,
      h3: 1.75,
      h4: 1.5,
      body: 1,
      small: 0.875
    }
  },
  spacing: {
    line: 1.5,
    paragraph: 1.0
  },
  margins: {
    top: 2,
    right: 2,
    bottom: 2,
    left: 2
  }
})

const paper = reactive({
  showHeader: true,
  showPageNumbers: true,
  showBorders: true,
  showDates: true,
})

const sectionOrder = ref([
  { id: 'personal', name: t('resume.sections.personal.title'), visible: true },
  { id: 'experience', name: t('resume.sections.experience.title'), visible: true },
  { id: 'education', name: t('resume.sections.education.title'), visible: true },
  { id: 'skills', name: t('resume.sections.skills.title'), visible: true },
  { id: 'projects', name: t('resume.sections.projects.title'), visible: true },
  { id: 'awards', name: t('resume.sections.awards.title'), visible: true },
  { id: 'hobbies', name: t('resume.sections.hobbies.title'), visible: true }
])

// Selection handlers
const selectTheme = (themeId: string) => {
}

const selectFont = (fontId: string) => {
}

// Selected colors array instead of single selection
const selectedColors = ref([colorSchemes[0]]) // Start with first color

// Computed available colors
const availableColors = computed(() => {
  return colorSchemes.filter(c => !selectedColors.value.find(sc => sc.id === c.id))
})

// Type for color scheme
interface ColorScheme {
  id: string
  name: string
  primary: string
  accent: string
}

// Type for color selection
const addColor = (color: ColorScheme) => {
  if (selectedColors.value.length < 3) {
    selectedColors.value.push(color)
  }
}

const removeColor = (index: number) => {
  selectedColors.value.splice(index, 1)
}

const generatePDF = async () => {  
  console.log('Generating PDF...')
  try {
    await router.push('/viewer')
    console.log('Navigation successful')
  } catch (error) {
    console.error('Navigation failed:', error)
  }
}

const showDropdown = ref(false)

const availableLocales = [
  { code: 'en', name: 'English', flag: 'GB' },
  { code: 'fr', name: 'Français', flag: 'FR' },
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'ar', name: 'العربية', flag: 'SA' }
]

const getCurrentLanguage = () => {
  const locale = availableLocales.find(l => l.code === i18n.locale.value)
  return locale?.name || 'English'
}

const getCurrentFlag = () => {
  const locale = availableLocales.find(l => l.code === i18n.locale.value)
  return locale?.flag || 'GB'
}

const selectLanguage = (code: Locale) => {
  i18n.locale.value = code
  showDropdown.value = false
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Close dropdown when clicking outside
const moveSection = (index: number, direction: 'up' | 'down') => {
  if (direction === 'up' && index > 0) {
    const temp = sectionOrder.value[index]
    sectionOrder.value[index] = sectionOrder.value[index - 1]
    sectionOrder.value[index - 1] = temp
  } else if (direction === 'down' && index < sectionOrder.value.length - 1) {
    const temp = sectionOrder.value[index]
    sectionOrder.value[index] = sectionOrder.value[index + 1]
    sectionOrder.value[index + 1] = temp
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Roboto:wght@400;500&family=Open+Sans:wght@400;500&family=Montserrat:wght@400;500&display=swap');
</style>

<style scoped>
.resume-customizer {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.customizer-header {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 2rem;
  width: auto;
  margin-right: 0.5rem;
}

.customizer-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.customizer-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  height: calc(100vh - 5rem);
  overflow-x: hidden;
}

/* Scrollbar styling */
.customizer-content::-webkit-scrollbar {
  width: 8px;
}

.customizer-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.customizer-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.customizer-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.option-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
}

.option-card h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
}

/* Add more specific styles for new components */
.sizing-options label,
.paper-options label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input[type="range"] {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
  height: 0.25rem;
}

.section-order {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.theme-item {
  border-radius: 0.75rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-item.active {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
}

.theme-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  border: 1px solid transparent;
}

.color-item.active {
  border-color: #60a5fa;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
}

.font-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.font-item {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.font-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.font-item.active {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

.font-preview {
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.font-name {
  font-weight: 500;
}

.font-description {
  font-size: 0.875rem;
  color: #94a3b8;
}

.sizing-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.paper-options {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.paper-options h3 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.switch-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
}

.margin-sliders {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.margin-sliders label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.margin-sliders .value {
  font-size: 0.875rem;
  color: #94a3b8;
  text-align: right;
}

.generate-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  height: 42px;
}

.generate-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Toggle switch styling */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #60a5fa;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Language selector styles */
.language-selector {
  position: relative;
  margin-right: 1rem;
}

.custom-select {
  position: relative;
  cursor: pointer;
}

.selected-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 42px;
}

.select-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 20;
  min-width: 200px;
}

.select-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  transition: all 0.2s;
}

.select-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.flag-icon {
  width: 24px;
  height: 24px;
  border-radius: 2px;
}

.select-arrow {
  border-style: solid;
  border-width: 2px 2px 0 0;
  content: '';
  display: inline-block;
  height: 6px;
  width: 6px;
  position: relative;
  transform: rotate(135deg);
  vertical-align: middle;
  margin-left: 0.5rem;
}

[dir="rtl"] .select-arrow {
  transform: rotate(-45deg);
  margin-left: 0;
  margin-right: 0.5rem;
}

/* Add animation for the logo */
@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

.logo {
  animation: pulse 2s infinite;
}

.sections-manager {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.section-control:hover {
  background: rgba(255, 255, 255, 0.05);
}

.section-drag {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.move-btn {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 0.25rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.move-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.section-name {
  flex: 1;
}

.text-size-controls {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.text-size-controls h3 {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.size-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
}

.size-label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.size-preview {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  text-align: center;
}

.value {
  font-size: 0.875rem;
  color: #94a3b8;
  text-align: right;
}

.generate-icon {
  width: 20px;
  height: 20px;
}

.color-info {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  border-left: 3px solid #60a5fa;
}

.color-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: #60a5fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.generate-button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.generate-button .loading-spinner {
  animation: spin 1s linear infinite;
}
</style>
