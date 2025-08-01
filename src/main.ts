import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import 'animate.css'
import Toast from "vue-toastification"
import type { PluginOptions } from "vue-toastification"
import "vue-toastification/dist/index.css"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const toastOptions: PluginOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) 
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Toast, toastOptions)
app.mount('#app')
