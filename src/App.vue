<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { detectUserLanguage } from './utils/locationDetector'

const { locale } = useI18n()

onMounted(async () => {
  try {
    const detectedLanguage = await detectUserLanguage()
    locale.value = detectedLanguage
    document.documentElement.dir = detectedLanguage === 'ar' ? 'rtl' : 'ltr'
  } catch (error) {
    console.warn('Failed to set initial language:', error)
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  min-width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
