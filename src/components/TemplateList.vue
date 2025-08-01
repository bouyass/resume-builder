<template>
  <div class="resume-builder-layout">
    <!-- Left Sidebar - Template Selection -->
    <div v-if="isSidebarOpen" class="template-sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title"> {{  t('sidebar.templates')  }}</span>
        <button class="close-btn" @click="closeSidebar">×</button>
      </div>
      
      <div class="template-list-container">
        <div class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.name"
            class="template-card"
            :class="{ active: selectedTemplate === template.name }"
            @click="selectTemplate(template.name)"
          >
            <!-- Template Preview Thumbnail -->
            <div class="template-thumbnail">
              <div class="thumbnail-content" :class="`preview-${template.name}`">
                <!-- CV Template Preview -->
                <div v-if="template.name === 'cvTemplate'" class="preview-hbs-custom" style="width: 100%; height: 100%; overflow: hidden; position: relative;">
                  <div class="scaled-preview-hbs-custom">
                    <ResumeDisplayer :isPreview="true"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="open-sidebar-btn" v-if="!isSidebarOpen" @click="openSidebar">▶</button>

    <div class="resume-preview-area">
      <div class="preview-header-bar">
        <div class="preview-controls">
          <h1 class="title">Resume builder</h1>
        </div>
        <div class="action-buttons">
          <button class="action-btn go-back-btn" @click="() => router.push('/resume')">🔙 {{  t('headerBar.goBackToInputs')  }}</button>
          <button class="action-btn download-btn" @click="downloadResume">📥 {{  t('headerBar.getMyResume')  }}</button>
        </div>
      </div>
      
      <div class="resume-canvas">
          <ResumeDisplayer :refreshKey="refreshKey" :email="email"/>
      </div>
    </div>

    <PaymentModal 
      :show="showPaymentModal"
      @updateEmail="updateEmail"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { POSITION, useToast } from 'vue-toastification'
import ResumeDisplayer from './ResumeDisplayer.vue'
import PaymentModal from './PaymentModal.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
// Selected template state
const selectedTemplate = ref('classic')
const refreshKey = ref(0)
const showPaymentModal = ref(false)
const email = ref('')
const toast = useToast()
const isSidebarOpen = ref(true)

const { t, locale } = useI18n()

const templates = [
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  },
  {
    name: 'cvTemplate',
    displayName: 'CV Template',
    description: 'Modern two-column layout with a colored sidebar and detailed sections. Based on your custom Handlebars template.'
  }
]
function selectTemplate(templateName: string) {
  selectedTemplate.value = templateName
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function openSidebar() {
  isSidebarOpen.value = true
}


function handlePaymentSuccess(paymentId: Number) {
  console.log('payment ID:', paymentId)
  if(paymentId) {
    toast.success('Payement effectué avec succès', {
      timeout: 4000,
      position: POSITION.TOP_RIGHT,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      icon: "✅"
    })

      refreshKey.value++
  }
}

function handlePaymentError(errorMessage: string) {
    if(errorMessage) {
      toast.error(errorMessage, {
      timeout: 4000,
      position: POSITION.TOP_RIGHT,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      icon: "✅"
    })
    }

}

const downloadResume = (): void => {
  showPaymentModal.value = true
}

const updateEmail = (_email: string): void => {
  console.log('email updated !')
  console.log(_email)
  email.value = _email
}

function handleResize() {
  if (window.innerWidth < 1100) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
@import './TemplateList.style.scss';
</style>