import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import ResumeCustomizer from '../components/ResumeCustomizer.vue'
import ResumeForm from '../components/ResumeForm.vue'
import TemplateList from '../components/TemplateList.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage
  },
  {
    path: '/resume',
    name: 'resume',
    component: ResumeForm
  },
  {
    path: '/customize',
    name: 'customizer',
    component: ResumeCustomizer
  },
  {
    path: '/templateList',
    name: 'templateList',
    component: TemplateList,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router 